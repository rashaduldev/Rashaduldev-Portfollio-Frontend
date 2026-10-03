# Backend Project Showcases

## Portfolio Platform API — Content, identity and analytics in one secure service

**Tagline:** A production-ready REST platform powering portfolio publishing, administration, engagement, media, messaging and privacy-conscious analytics.

### Problem and solution

A dynamic portfolio needs more than static project cards: content must be published safely, media managed consistently, visitor engagement persisted and administration protected. This API centralizes those workflows behind typed services, secure authentication and documented contracts.

### Features and architecture

- JWT access and rotating refresh-token authentication with RBAC.
- Projects, articles, profiles, comments, likes, messages and newsletters.
- Cloudinary image/PDF upload and deletion workflows.
- Dashboard reporting and consent-based first-party analytics.
- Strict TypeScript service/controller/router separation with Mongoose models.
- Helmet, explicit CORS, scoped rate limits, Joi validation and Mongo key sanitization.

### Stack

- **Runtime:** Node.js, Express, TypeScript
- **Data:** MongoDB, Mongoose
- **Platform:** Cloudinary, Nodemailer, Vercel
- **Quality:** Swagger/OpenAPI, ESLint, strict TypeScript

### API documentation

[Explore the live Swagger API](https://rashaduldev-backend.vercel.app/api-docs)

- Insert Swagger overview and module navigation screenshot.
- Insert login/refresh-token operation screenshot.
- Insert admin analytics response schema screenshot.

### Engineering highlights

1. Cross-origin sessions use credentialed CORS, secure HttpOnly refresh cookies and short-lived access tokens.
2. Analytics uses hashed visitor/session identities and a unique session-path index to prevent duplicate views.
3. Public inputs are protected with validation, sanitization and route-specific abuse limits.

---

## Hospitalia Healthcare API — Reliable care coordination across every role

**Tagline:** A multi-role healthcare backend coordinating provider discovery, availability, appointments, hospitals and secure operational workflows.

### Problem and solution

Healthcare scheduling joins sensitive identity, multiple professional roles and highly concurrent time slots. Hospitalia provides explicit ownership rules, server-authoritative pricing and collision-safe appointment reservations for patients, doctors, secretaries, hospitals and administrators.

### Features and architecture

- Patient, doctor, secretary, hospital and administrator account workflows.
- Doctor profiles, locations, availability and unavailable dates.
- Patient self-booking and staff-assisted appointment management.
- Hospital associations, speciality catalogues, search and chat threads.
- JWT token-version revocation, Helmet CSP, credentialed CORS and rate limiting.
- Smoke and stateful integration suites against the OpenAPI contract.

### Stack

- **Runtime:** Node.js 20, Express 4, TypeScript
- **Data:** MongoDB, Mongoose
- **Security:** JWT, bcryptjs, Helmet
- **Quality:** Swagger/OpenAPI, smoke tests, integration tests

### API documentation

[Explore the live Hospitalia Swagger API](https://hospitalia-web-backend.vercel.app/api-docs)

- Insert healthcare domain overview screenshot.
- Insert appointment availability and booking screenshot.
- Insert protected response/error schema screenshot.

### Engineering highlights

1. A deterministic slot-reservation key turns concurrent booking races into controlled `409` responses.
2. Role and ownership checks scope appointment data to the correct care actor.
3. Fees are derived from trusted location records instead of client-supplied amounts.

---

## A to Z Authentication API — Focused identity for an e-commerce storefront

**Tagline:** A compact TypeScript authentication and user service built for secure cross-origin commerce sessions.

### Problem and solution

The storefront needs durable accounts and an authenticated browser session while frontend and backend run on separate origins. The API provides registration, uniqueness checks, bcrypt protection, JWT cookies and a guarded current-user endpoint.

### Features and architecture

- Username/email conflict detection and user registration.
- bcrypt password hashing and JWT login.
- Secure HttpOnly, SameSite-aware production cookies.
- Credentialed CORS for the configured storefront.
- User CRUD and protected current-user identity.
- Express routes, controller functions and Mongoose persistence.

### Stack

- **Runtime:** Node.js, Express 5, TypeScript
- **Data:** MongoDB, Mongoose
- **Security:** JWT, bcrypt, Cookie Parser

### API documentation

[Open the live API health endpoint](https://a-to-z-backend.vercel.app/)

Swagger is not implemented in the current repository. Recommended additions:

- Add and capture the auth/user Swagger overview.
- Capture the login response and `Set-Cookie` behavior.
- Capture current-user success and `401` response schemas.

### Engineering highlights

1. Production cookies use `Secure` and `SameSite=None` for the separate storefront origin.
2. Registration reports explicit conflicts before password hashing and persistence.
3. Authentication middleware centralizes missing, invalid and expired token handling.

---

## UIvibe Commerce Operations API — A contract-driven commerce back office

**Tagline:** A broad Laravel operations API unifying orders, catalogue, inventory, customers, suppliers, reporting and support behind one tested contract.

### Problem and solution

Commerce operations become fragile when every resource implements pagination, validation, authorization and documentation separately. UIvibe uses shared resource definitions and a reusable CRUD/query engine while preserving specialized logic for orders, reports, support and stock.

### Features and architecture

- 182 registered operations across commerce resources.
- Products, categories, brands, orders, customers, suppliers and purchasing.
- Invoices, income, expenses, dashboard reports and settings.
- Transactional stock adjustments with row locks and negative-stock protection.
- HttpOnly access/refresh JWT cookies with RBAC and auth-version revocation.
- Generated OpenAPI schemas and comprehensive PHPUnit feature coverage.

### Stack

- **Runtime:** PHP 8.2, Laravel 12
- **Data:** MySQL, Eloquent ORM, shared database cache
- **Security:** Firebase JWT, role middleware, origin verification, rate limits
- **Quality:** Generated OpenAPI, PHPUnit, Laravel Pint

### API documentation

The repository implements Swagger at `/api/docs` and OpenAPI JSON at `/api/openapi.json`. The currently discoverable public deployment does not expose that page, so a dead production URL is intentionally not advertised.

- Insert Swagger resource-group dashboard screenshot.
- Insert cookie-authenticated login “Try it out” screenshot.
- Insert order, inventory and reporting schema screenshot.

### Engineering highlights

1. Shared resource definitions keep CRUD validation and OpenAPI fields synchronized.
2. Transactional row locks apply only the approved stock delta and roll back invalid changes.
3. Database-backed throttling remains consistent across serverless instances.
