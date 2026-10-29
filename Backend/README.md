# Event Management Platform — Backend

A REST API built with Node.js, Express.js, and MongoDB for an event management and registration platform.

## Features

- Attendee registration and login with JWT authentication
- Role-based access for attendees and organizers
- Event creation, publishing, updating, and cancellation
- Event search, filtering, and pagination
- Event registration with capacity validation
- Registration cancellation and attendee dashboards
- Organizer dashboard and attendee list
- Event reviews and ratings

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs

## Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster or compatible MongoDB deployment
- Postman (recommended for API testing)

## Setup

1. Open a terminal in the `Backend` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory using `.env.example` as a template.
4. Set the following environment variables:

   - `PORT` — server port; defaults to `5000`.
   - `MONGODB_URI` — MongoDB connection string.
   - `JWT_SECRET` — a long, private random secret used to sign JWTs.

5. Start the development server:

   ```bash
   npm run dev
   ```

   For normal startup:

   ```bash
   npm start
   ```

## Health Check

```http
GET /api/health
```

A successful response confirms that the API server is running and the database connection was established during startup.

## API Routes

All endpoints use the `/api` prefix.

### Authentication — `/api/auth`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register an attendee |
| POST | `/login` | Log in |

### Events — `/api/events`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Browse published events; supports search, category, venue, and pagination filters |
| GET | `/:eventId` | Get published event details |
| POST | `/` | Create an event (organizer) |
| PATCH | `/:eventId` | Update an event (organizer) |
| PATCH | `/:eventId/publish` | Publish a draft (organizer) |
| PATCH | `/:eventId/cancel` | Cancel an event (organizer) |
| GET | `/organizer/dashboard` | Get organizer dashboard (organizer) |

### Registrations — `/api/registrations`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/:eventId` | Register for an event (attendee) |
| GET | `/my` | Get the logged-in attendee's registrations |
| GET | `/my/dashboard` | Get attendee dashboard |
| PATCH | `/:registrationId/cancel` | Cancel a registration (attendee) |
| GET | `/event/:eventId/attendees` | List event attendees (organizer) |

### Reviews — `/api/reviews`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/:eventId` | Get reviews for an event |
| POST | `/:eventId` | Submit an event review (attendee) |

## Authentication

For protected endpoints, send the JWT in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Attendee and organizer endpoints require the appropriate role. Public registration creates attendee accounts; organizer accounts must be provisioned through the project's authorized process.

## Deployment Notes

- Set `MONGODB_URI` and `JWT_SECRET` in the deployment platform's environment-variable settings.
- Never commit `.env`, real database credentials, or JWT secrets.
- Configure MongoDB Atlas Network Access to allow connections from the deployed backend.
- Use the deployed API's `/api/health` endpoint to verify service availability.

## License

Not specified.
