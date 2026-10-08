const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const dataDir = path.join(root, 'data');
const dbPath = path.join(dataDir, 'bridex.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const seedListings = [
  ['Casio fx-991CW Calculator','Calculators','Sell',850,'Good','CSE','Arjun Kumar','https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=700&q=80','Scientific calculator in perfect working condition. Used for two semesters, comes with its protective case.'],
  ['Engineering Mathematics — Vol. I','Books','Sell',180,'Good','EEE','Nandhini S.','https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80','Clean copy with a few highlighted formulas. Ideal for first-year engineering students.'],
  ['White Lab Coat, size M','Lab Coats','Donate',0,'Like New','Biotech','Priya Rao','https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80','Barely used lab coat, washed and ready for a new owner.'],
  ['Arduino UNO Starter Kit','Electronics','Lend',100,'Good','ECE','Vikram Das','https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=700&q=80','Complete Arduino kit with breadboard, jumper wires, LEDs and sensors. ₹100 per week, ₹500 refundable deposit.'],
  ['Drafting Instrument Set','Drafter Kits','Exchange',0,'Good','Civil','Harish B.','https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&w=700&q=80','Professional compass and scale set. Looking to exchange for a basic calculator.'],
  ['Electronics Lab Components','Lab Equipment','Lend',80,'Good','ECE','Sanjay M.','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80','Assorted resistors, capacitors and ICs for your next lab project.']
];
function initialDb(){return {users:[],sessions:[],listings:seedListings.map((x,i)=>({id:i+1,name:x[0],category:x[1],type:x[2],price:x[3],condition:x[4],dept:x[5],owner:x[6],image:x[7],description:x[8],ownerId:null,status:'active',createdAt:new Date().toISOString()})),requests:[],complaints:[],saved:[]}}
function readDb(){if(!fs.existsSync(dbPath)){const d=initialDb();writeDb(d);return d}return JSON.parse(fs.readFileSync(dbPath,'utf8'))}
function writeDb(data){fs.writeFileSync(dbPath,JSON.stringify(data,null,2))}
function json(res,status,body){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(body))}
function publicUser(u){return {id:u.id,name:u.name,email:u.email,department:u.department,year:u.year,role:u.role}}
function hash(password,salt=crypto.randomBytes(16).toString('hex')){return `${salt}:${crypto.scryptSync(password,salt,64).toString('hex')}`}
function verify(password,stored){const [salt,key]=stored.split(':');return crypto.timingSafeEqual(Buffer.from(key,'hex'),crypto.scryptSync(password,salt,64))}
function auth(req,db){const token=(req.headers.authorization||'').replace('Bearer ','');const session=db.sessions.find(s=>s.token===token);return session?db.users.find(u=>u.id===session.userId):null}
function body(req){return new Promise((resolve,reject)=>{let d='';req.on('data',c=>d+=c);req.on('end',()=>{try{resolve(d?JSON.parse(d):{})}catch{reject(new Error('Invalid JSON'))}})})}
function id(){return crypto.randomUUID()}
function apiError(res,status,message){json(res,status,{error:message})}

async function handle(req,res){
  const url=new URL(req.url,`http://${req.headers.host}`), route=url.pathname, db=readDb();
  try {
    if(req.method==='POST'&&route==='/api/auth/register'){
      const b=await body(req); if(!b.name||!b.email||!b.password||!b.department) return apiError(res,400,'Please complete all required fields.');
      if(!b.email.toLowerCase().endsWith('@psgtech.ac.in')) return apiError(res,400,'Use a @psgtech.ac.in college email.');
      if(db.users.some(u=>u.email.toLowerCase()===b.email.toLowerCase())) return apiError(res,409,'An account already exists for this email.');
      const user={id:id(),name:b.name.trim(),email:b.email.toLowerCase(),department:b.department.trim(),year:b.year||'1st year',password:hash(b.password),role:db.users.length===0?'admin':'student',createdAt:new Date().toISOString()}; db.users.push(user); const token=id();db.sessions.push({token,userId:user.id,createdAt:new Date().toISOString()});writeDb(db);return json(res,201,{token,user:publicUser(user)});
    }
    if(req.method==='POST'&&route==='/api/auth/login'){
      const b=await body(req),user=db.users.find(u=>u.email===String(b.email).toLowerCase());if(!user||!verify(b.password||'',user.password))return apiError(res,401,'Invalid email or password.');const token=id();db.sessions.push({token,userId:user.id,createdAt:new Date().toISOString()});writeDb(db);return json(res,200,{token,user:publicUser(user)});
    }
    if(req.method==='POST'&&route==='/api/auth/logout'){const token=(req.headers.authorization||'').replace('Bearer ','');db.sessions=db.sessions.filter(s=>s.token!==token);writeDb(db);return json(res,200,{ok:true})}
    if(req.method==='GET'&&route==='/api/auth/me'){const user=auth(req,db);return user?json(res,200,{user:publicUser(user)}):apiError(res,401,'Unauthenticated');}
    if(req.method==='GET'&&route==='/api/listings'){let items=db.listings.filter(l=>l.status==='active');const q=(url.searchParams.get('q')||'').toLowerCase(),category=url.searchParams.get('category'),type=url.searchParams.get('type');if(q)items=items.filter(l=>`${l.name} ${l.description}`.toLowerCase().includes(q));if(category&&category!=='All')items=items.filter(l=>l.category===category);if(type&&type!=='All')items=items.filter(l=>l.type===type);return json(res,200,{listings:items});}
    if(req.method==='GET'&&route.match(/^\/api\/listings\/[^/]+$/)){const item=db.listings.find(l=>String(l.id)===route.split('/').pop());return item?json(res,200,{listing:item}):apiError(res,404,'Listing not found');}
    if(req.method==='POST'&&route==='/api/listings'){const user=auth(req,db);if(!user)return apiError(res,401,'Log in to create a listing.');const b=await body(req);if(!b.name||!b.description)return apiError(res,400,'Name and description are required.');const listing={id:id(),name:b.name.trim(),category:b.category,type:b.type,price:Number(b.price)||0,condition:b.condition,dept:user.department,owner:user.name,ownerId:user.id,image:b.image||'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80',description:b.description.trim(),status:'active',createdAt:new Date().toISOString()};db.listings.unshift(listing);writeDb(db);return json(res,201,{listing});}
    if(req.method==='GET'&&route==='/api/me/dashboard'){const user=auth(req,db);if(!user)return apiError(res,401,'Unauthenticated');const mine=db.listings.filter(l=>l.ownerId===user.id),requests=db.requests.filter(r=>r.requesterId===user.id||r.ownerId===user.id),savedIds=db.saved.filter(s=>s.userId===user.id).map(s=>s.listingId);return json(res,200,{mine,requests,savedIds});}
    if(req.method==='POST'&&route.match(/^\/api\/listings\/[^/]+\/save$/)){const user=auth(req,db);if(!user)return apiError(res,401,'Log in to save listings.');const listingId=route.split('/')[3],i=db.saved.findIndex(s=>s.userId===user.id&&s.listingId===listingId);let saved;if(i>=0){db.saved.splice(i,1);saved=false}else{db.saved.push({userId:user.id,listingId});saved=true}writeDb(db);return json(res,200,{saved});}
    if(req.method==='POST'&&route.match(/^\/api\/listings\/[^/]+\/requests$/)){const user=auth(req,db);if(!user)return apiError(res,401,'Log in to make a request.');const listing=db.listings.find(l=>String(l.id)===route.split('/')[3]);if(!listing)return apiError(res,404,'Listing not found');if(listing.ownerId===user.id)return apiError(res,400,'You cannot request your own listing.');const action=listing.type==='Lend'?'Borrow':listing.type==='Donate'?'Claim':listing.type==='Exchange'?'Exchange':'Buy';const request={id:id(),listingId:listing.id,item:listing.name,action,status:'Pending',requesterId:user.id,requester:user.name,ownerId:listing.ownerId,owner:listing.owner,createdAt:new Date().toISOString()};db.requests.unshift(request);writeDb(db);return json(res,201,{request});}
    if(req.method==='PATCH'&&route.match(/^\/api\/requests\/[^/]+$/)){const user=auth(req,db);if(!user)return apiError(res,401,'Unauthenticated');const request=db.requests.find(r=>r.id===route.split('/').pop());const b=await body(req);if(!request)return apiError(res,404,'Request not found');if(request.ownerId!==user.id&&user.role!=='admin')return apiError(res,403,'Not allowed');request.status=b.status==='Accepted'?'Accepted':'Rejected';writeDb(db);return json(res,200,{request});}
    if(req.method==='POST'&&route==='/api/complaints'){const user=auth(req,db);if(!user)return apiError(res,401,'Unauthenticated');const b=await body(req);const complaint={id:`BRX-${Math.floor(1000+Math.random()*8999)}`,userId:user.id,user:user.name,type:b.type,description:b.description,status:'Open',createdAt:new Date().toISOString()};db.complaints.unshift(complaint);writeDb(db);return json(res,201,{complaint});}
    if(req.method==='GET'&&route==='/api/admin/overview'){const user=auth(req,db);if(!user||user.role!=='admin')return apiError(res,403,'Admin access required.');return json(res,200,{users:db.users.length||1240,listings:db.listings.filter(x=>x.status==='active').length,transactions:db.requests.length||742,loans:db.requests.filter(x=>x.action==='Borrow'&&x.status==='Accepted').length||81,complaints:db.complaints.length||12,recentComplaints:db.complaints.slice(0,8)});}
    return apiError(res,404,'API route not found');
  } catch(err){console.error(err);return apiError(res,500,'Something went wrong on the server.');}
}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const port=process.env.PORT||4174;
http.createServer(async(req,res)=>{if(req.url.startsWith('/api/'))return handle(req,res);let pathname=decodeURIComponent(new URL(req.url,`http://${req.headers.host}`).pathname);if(pathname==='/')pathname='/index.html';const file=path.join(root,pathname);if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}).listen(port,()=>console.log(`Bridex running on http://localhost:${port}`));
