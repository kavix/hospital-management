# Hospital Management System

A role-based hospital operations platform built with Next.js, MongoDB, and NextAuth.  
The system helps administrators, receptionists, doctors, and patients coordinate appointments, user management, and token-based patient flow in one interface.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation and Local Setup](#installation-and-local-setup)
- [Available Scripts](#available-scripts)
- [Role Capabilities](#role-capabilities)
- [API Summary](#api-summary)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Known Setup Notes](#known-setup-notes)
- [Deployment Notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application supports day-to-day hospital workflows:

- **Admins** manage doctors and receptionists, and monitor system-level analytics.
- **Receptionists** register patients, create and manage appointments, and assign queue tokens.
- **Doctors** review and update appointment statuses.
- **Patients** register, book appointments, track token details, and manage their profile.

The application includes secure credential authentication, role-based route protection, and appointment token generation per doctor and day.

## Core Features

- Secure login and registration using **NextAuth (Credentials Provider)**.
- **Role-aware navigation** and protected routes via middleware.
- CRUD management for users (doctors, receptionists, patients).
- Appointment booking with automatic **token number generation**.
- Appointment lifecycle statuses: `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`.
- Appointment approval email notifications (via Nodemailer).
- Dashboard statistics for users and appointment metrics.
- Doctor and patient-specific views for appointment tracking.
- Extra endpoints for embedded/device integrations (ESP32 token/appointment retrieval).

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (React 19)
- **Authentication:** NextAuth
- **Database:** MongoDB with Mongoose
- **Email:** Nodemailer (Gmail transport)
- **Charts:** Recharts
- **Styling:** Tailwind CSS 4
- **Linting:** ESLint 9 + eslint-config-next

## Architecture at a Glance

- `app/` contains UI routes and API route handlers.
- `models/` defines Mongoose schemas (`User`, `Appointment`).
- `lib/` contains shared integrations (`mongodb`, `email`).
- `middleware.js` enforces role-based authorization for protected route groups.
- `components/` contains reusable UI components and forms.

## Project Structure

```text
hospital-management/
├── app/
│   ├── (auth)/                 # Login and registration pages
│   ├── admin/                  # Admin pages
│   ├── receptionist/           # Receptionist pages
│   ├── doctor/                 # Doctor pages
│   ├── patient/                # Patient pages
│   └── api/                    # API route handlers
├── components/                 # Shared UI components and forms
├── lib/                        # DB and email utilities
├── models/                     # Mongoose models
├── scripts/                    # Data/admin helper scripts
└── middleware.js               # Route protection by role
```

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- MongoDB instance (local or cloud)
- Gmail account/app password (if email notifications are enabled)

## Environment Variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secure_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Variable Notes

- `MONGODB_URI` is required by `lib/mongodb.js`.
- `NEXTAUTH_SECRET` is required for NextAuth session security.
- `NEXTAUTH_URL` is recommended for consistent auth callback behavior.
- `EMAIL_USER` and `EMAIL_PASS` are required to send approval emails.

## Installation and Local Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Add your `.env.local` file using the variables above.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Role Capabilities

### Admin
- Access analytics dashboard and charts.
- Create, update, and remove doctors.
- Create, update, and remove receptionists.

### Receptionist
- View all appointments.
- Create appointments on behalf of patients.
- Approve/reject appointment requests.
- Manage patient records.

### Doctor
- View assigned appointments.
- Update appointment statuses (for example, mark completed).

### Patient
- Register and sign in.
- Book and review appointments.
- View assigned token information.
- Maintain personal profile details.

## API Summary

Key endpoints under `app/api`:

- `POST /api/auth/register` - Register a user (defaults to patient role).
- `GET|POST /api/users` - List users (optional role filter) or create users.
- `GET|PUT|DELETE /api/users/:id` - User details and management.
- `GET /api/doctors` - Retrieve doctors.
- `GET /api/stats` - Dashboard statistics and chart datasets.
- `GET|POST /api/appointments` - Query or create appointments.
- `PUT|DELETE /api/appointments/:id` - Update or delete appointments.
- `GET /api/appointments/tokens` - Token list for doctor/date.
- `GET /api/appointments/tokens/today` - Today’s token list for doctor.
- `GET /api/esp32/appointments` - Simplified appointments feed for embedded clients.

## Testing and Quality Checks

Run project linting and production build:

```bash
npm run lint
npm run build
```

If your environment blocks external Google Fonts requests, `npm run build` can fail when fetching the Inter font during build.

## Known Setup Notes

- The repository includes helper scripts in `scripts/` for local user bootstrapping.
- Review and replace any hard-coded credentials in these scripts before use in any shared or production environment.
- Email delivery failures are logged and do not block appointment status updates.

## Deployment Notes

- Set all required environment variables in your deployment platform.
- Ensure MongoDB network access is configured for the deployment environment.
- For production, use strong `NEXTAUTH_SECRET` values and secure email credentials.

## Contributing

1. Create a feature branch.
2. Make focused, minimal changes.
3. Run lint/build checks locally.
4. Open a pull request with a clear summary and test evidence.

## License

No explicit license file is currently included in this repository.  
Add a `LICENSE` file if you plan to distribute this project publicly.
