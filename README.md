# Bridex

A full-stack campus circular marketplace for buying, selling, lending, borrowing, and exchanging academic resources.

For a complete page-by-page project report, screenshot checklist, architecture explanation, and prototype limitations, see [PROTOTYPE_DESIGN_AND_IMPLEMENTATION.md](PROTOTYPE_DESIGN_AND_IMPLEMENTATION.md).

## Run locally

```powershell
npm start
```

Open `http://localhost:4174`.

The application requires only Node.js 18+ and uses no third-party dependencies.

## Included workflow

- College-email, Student ID, and private student-ID-card proof collection during registration (`@psgtech.ac.in`)
- Password hashing with Node `scrypt` and bearer-token sessions
- Marketplace listing search and filters
- Create listings with 2–6 required resource photos, persisted by the backend
- Saved items and student dashboards
- Buy, borrow, and exchange requests
- Complaint submission and a student dashboard
- JSON persistence in `data/bridex.json`, automatically created on first run

## HTTP API

| Endpoint | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create a verified student account |
| `POST /api/auth/login` | Start a user session |
| `GET /api/listings` | Browse and filter listings |
| `POST /api/listings` | Create a listing |
| `POST /api/listings/:id/save` | Save or unsave an item |
| `POST /api/listings/:id/requests` | Request to buy, borrow, or exchange |
| `GET /api/me/dashboard` | Read the signed-in user's activity |
| `POST /api/complaints` | File a complaint |

For production, swap the JSON data layer in `server.js` for PostgreSQL/object storage and place the app behind HTTPS. The API surface is organized so that migration remains straightforward.

> A real ID-card authenticity decision and current enrollment/completion status require an authorized college records integration plus an OCR/AI verification provider. The current app records proof securely in its private data store and marks the account as `pending`; it does not falsely claim that a card or academic record has been verified.
