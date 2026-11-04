# PROTOTYPE DESIGN AND IMPLEMENTATION — Bridex

## 1. Project overview

**Bridex** is a campus circular marketplace. It helps college students buy, sell, lend, borrow, and exchange useful academic resources such as textbooks, calculators, lab equipment, lab coats, drafter kits, and electronics.

The prototype addresses three common student problems:

1. Useful academic resources are expensive to buy new.
2. Many resources become unused after one semester.
3. Students need a safer, college-focused alternative to general online marketplaces.

The product is designed for a single college community first. Students create accounts using a college email, submit an ID-card image for review, publish resource listings with photographs, make requests, coordinate a campus handover, and record the transaction lifecycle.

> **Important prototype note:** An ID-card image can be collected in this prototype, but the application does not claim to perform real AI verification or official enrollment/completion checks. Those require authorization and integration with college records and a verification provider.

## 2. Technology and implementation

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | HTML, CSS, JavaScript | Responsive interface, dynamic pages, forms, animations, and client-side validation |
| Backend | Node.js built-in `http` module | REST-style API, authentication, validation, and business logic |
| Data storage | JSON file (`data/bridex.json`) | Prototype persistence for users, listings, requests, messages, notifications, reviews, reports, and events |
| Security used | Node `crypto.scrypt`, bearer-token sessions | Password hashing and authenticated API access |

The application intentionally uses no third-party packages, which makes it simple to run locally with Node.js 18 or newer.

## 3. Page-by-page documentation

For the report, insert your own screenshot under every page heading. Use consistent captions such as **Figure 1: Bridex Home Page**.

### 3.1 Home page

**Screenshot to add:** Full landing page, including the hero section and navigation bar.

**Purpose:** Introduces Bridex as a campus reuse network and guides a visitor to either explore listings or create a resource listing.

**Main interface elements:**

- Bridex logo and navigation: Home, Explore, How it works, Login/Join Bridex.
- Hero section: “Find more. Spend less.”
- Primary call-to-action: **Explore marketplace**.
- Secondary call-to-action: **List an item**.
- Trust strip explaining college-email sign-up, campus pickup points, photo-based listings, and student-budget focus.
- Marketplace preview, which displays real listings only. When there are no listings, it honestly displays an empty-state message.

**User action:** A visitor can open the marketplace, learn how Bridex works, or start registration.

### 3.2 Registration page

**Screenshot to add:** Registration form with the ID-card upload control visible.

**Purpose:** Collects the information needed to create a student account and prepare it for verification review.

**Fields:**

- Full name
- Student ID
- College ID-card image
- Department and current year
- Expected graduation year
- College email address
- Password

**Validation and behaviour:**

- The email must use the configured college domain (`@psgtech.ac.in`).
- Student ID must follow a basic format check.
- ID-card file must be an image under 2 MB.
- The image is stored privately in the prototype data file and is not shown in public listings.
- The registered account is marked **pending** rather than falsely marked verified.

### 3.3 Login page

**Screenshot to add:** Login page.

**Purpose:** Lets an existing student access their personal dashboard.

**Fields:** College email and password.

**Implementation:** Passwords are hashed on the server using Node.js `scrypt`. A successful login creates a bearer-token session used by the frontend for authenticated actions.

### 3.4 Explore marketplace page

**Screenshot to add:** Explore page with one or more actual listings and the filter panel.

**Purpose:** Allows students to discover available academic resources.

**Main interface elements:**

- Live search field
- Category filter: Books, Calculators, Lab Equipment, Lab Coats, Drafter Kits, and Electronics
- Transaction filter: Sell, Lend, or Exchange
- Resource cards with image, condition, department, price/rental price, and listing type
- Save button and **View details** button
- **List a resource** button

**Implementation detail:** Searching keeps keyboard focus in the search field so users can type full words without clicking again.

### 3.5 Resource details page

**Screenshot to add:** Resource detail view with gallery and request buttons.

**Purpose:** Shows all information needed before a student requests a resource.

**Main interface elements:**

- Image gallery with two to six uploaded photos
- Resource name, type, price, description, condition, department, and pickup point
- Lending terms when the item is offered for lending: weekly price, refundable deposit, and maximum borrowing duration
- Listing record explaining that the images and stated condition were supplied by the listing student
- Buttons to request, save, or report the listing

**Safety feature:** The page reminds users to meet at the selected campus pickup point and compare the item with the uploaded photos before handover.

### 3.6 Create resource listing modal

**Screenshot to add:** Listing form with photo previews.

**Purpose:** Enables a signed-in student to add a real resource to the marketplace.

**Information captured:**

- Resource name and category
- Transaction type: Sell, Lend, or Exchange
- Price or weekly rent
- Condition
- Safe pickup point
- Description
- Two to six resource photos

**Conditional lending fields:** When **Lend** is selected, the student must also provide a refundable security deposit and maximum borrowing period.

**Validation:** Each uploaded resource photo must be an image under 2 MB. The backend rejects listings with fewer than two or more than six photos.

### 3.7 Student dashboard

**Screenshot to add:** Dashboard showing the summary cards and transaction sections.

**Purpose:** A single private workspace for each student; there is no separate admin page in this design.

**Dashboard sections:**

- Verification notice showing that college-record verification is pending where applicable
- Summary cards for listings, active handovers, incoming requests, and notifications
- Notifications about new requests, messages, lifecycle updates, and feedback
- Incoming requests with **Accept** and **Reject** actions
- My transactions with current status and available actions
- My listings with a status selector
- Campus event promotions

### 3.8 Request and transaction lifecycle

**Screenshot to add:** Dashboard transaction card in an accepted or handed-over state.

**Purpose:** Moves an exchange beyond a simple listing into a trackable campus transaction.

**Request statuses:**

| Status | Meaning |
| --- | --- |
| Pending | A student has sent a buy, borrow, or exchange request. |
| Accepted | Listing owner approved the request. |
| Rejected | Listing owner declined the request. |
| Handed over | The participants confirm that the resource was handed over. |
| Returned | Used for a borrowed resource that has been returned. |
| Completed | Optional final state for a completed transaction. |

**Listing statuses:** Active, Reserved, Sold, Lent out, Returned, and Closed.

### 3.9 Messaging modal

**Screenshot to add:** In-app chat opened from an accepted transaction.

**Purpose:** Lets the two people in a request coordinate a pickup time and location without exposing messages publicly.

**Rules:** Only the listing owner and requester involved in the same request can send or view its messages. Messages are limited to 800 characters. The interface reminds users not to share passwords or sensitive identity documents.

### 3.10 Review modal

**Screenshot to add:** Feedback form after a returned or completed transaction.

**Purpose:** Enables accountability after an exchange is finished.

**Fields:** Rating from 1 to 5 and a short written comment.

**Rule:** A student can leave only one review per completed/returned transaction.

### 3.11 Report problem modal

**Screenshot to add:** Report form.

**Purpose:** Provides a basic moderation channel for condition mismatch, wrong item, listing issue, user issue, or another problem.

**Prototype behaviour:** A report is recorded with an **Open** status for future moderation review.

### 3.12 College-event promotion modal

**Screenshot to add:** Event promotion form and the resulting card on the dashboard.

**Purpose:** Demonstrates a practical revenue direction for Bridex: colleges, clubs, and student organizers can promote events to the campus community.

**Fields:** Event title, date, promotion tier (Campus or Featured), and description.

**Prototype limitation:** The event is published locally, but no real payment gateway, invoice, or advertising approval workflow is connected yet.

### 3.13 How Bridex works page

**Screenshot to add:** How it works page.

**Purpose:** Explains the product process in four simple stages.

1. Verified people — restricted college community and submitted proof.
2. Clear handovers — a request and chosen campus pickup location.
3. Fair returns — lending transaction tracking, returns, and issue reporting.
4. Less waste — extending the life of useful academic resources.

## 4. Main user flow

```text
Visitor → Register with college email and ID-card proof → Login
       → Explore or search real listings → Open details → Request resource
       → Owner accepts/rejects → Both users message → Handover confirmed
       → Return/completion recorded → Review submitted
```

For a listing owner:

```text
Login → List resource → Upload 2–6 photos → Publish
      → Receive notification → Accept/reject request
      → Update item and transaction status → Receive feedback
```

## 5. Data managed by the prototype

| Data group | Examples |
| --- | --- |
| Users | Name, college email, department, student ID, password hash, verification state |
| Listings | Images, category, condition, price, pickup point, lending terms, lifecycle status |
| Requests | Requester, owner, action, pickup point, request status |
| Messages | Request-linked private messages between participants |
| Notifications | New request, message, status update, review alerts |
| Reviews | Rating, comment, completed transaction reference |
| Complaints | Report type, description, reporter, open status |
| Events | Event details, organizer, promotion tier, publication state |

## 6. API implementation summary

| Endpoint group | Main responsibility |
| --- | --- |
| `/api/auth/*` | Registration, login, logout, current user |
| `/api/listings` | Browse, create, read, save, and update listing status |
| `/api/listings/:id/requests` | Create a buy, borrow, or exchange request |
| `/api/requests/:id` | Update the transaction lifecycle |
| `/api/messages` | Read and send request-linked messages |
| `/api/reviews` | Submit feedback after a completed transaction |
| `/api/complaints` | Report a problem |
| `/api/events` | Publish a campus-event promotion |
| `/api/me/dashboard` | Load the student’s private dashboard information |

## 7. Current limitations and future implementation

This is a working local prototype, not a production deployment. The following should be implemented before a public launch:

- PostgreSQL or another managed database instead of a JSON file
- Cloud object storage and encryption for ID cards and listing images
- HTTPS, cookie/session security, rate limiting, and audit logging
- Authorized college-record integration for real enrollment/completion validation
- OCR/AI provider with human review for ID-card validation
- Payment gateway for featured event promotions and optional deposits
- Real-time notifications or email/push notifications
- A protected staff moderation workflow for reports and verification review

## 8. Suggested screenshots checklist

1. Home page
2. Registration page with ID-card upload
3. Login page
4. Explore page with search and filters
5. Create listing form with image preview
6. Resource details gallery
7. Dashboard overview
8. Incoming request with Accept/Reject buttons
9. Messaging modal
10. Listing lifecycle status selector
11. Review form
12. Event-promotion form and event card
13. Report-problem form
14. How Bridex works page

