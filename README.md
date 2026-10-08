# Bridex

A full-stack campus circular marketplace for buying, selling, lending, borrowing, exchanging, and donating academic resources.

## Run locally

```powershell
npm start
```

Open `http://localhost:4174`.

The application requires only Node.js 18+ and uses no third-party dependencies.

## Included workflow

- College-email registration and login (`@psgtech.ac.in`)
- Password hashing with Node `scrypt` and bearer-token sessions
- Marketplace listing search and filters
- Create listings persisted by the backend
- Saved items and student dashboards
- Buy, borrow, exchange, and donation requests
- Complaint submission and an admin dashboard
- JSON persistence in `data/bridex.json`, automatically created on first run

## HTTP API

| Endpoint | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create a verified student account |
| `POST /api/auth/login` | Start a user session |
| `GET /api/listings` | Browse and filter listings |
| `POST /api/listings` | Create a listing |
| `POST /api/listings/:id/save` | Save or unsave an item |
| `POST /api/listings/:id/requests` | Request to buy, borrow, claim, or exchange |
| `GET /api/me/dashboard` | Read the signed-in user's activity |
| `POST /api/complaints` | File a complaint |
| `GET /api/admin/overview` | View live admin metrics |

For production, swap the JSON data layer in `server.js` for PostgreSQL/object storage and place the app behind HTTPS. The API surface is organized so that migration remains straightforward.
