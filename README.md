<div align="center">

<img src="Client/public/Logo2.png" alt="Vellum" height="90" />

# Vellum

**A calm Kanban workspace for teams that want to plan together and ship faster.**

Share boards, assign tasks, review the work, talk about it, and watch every change land live.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)](https://socket.io)

[**Live demo**](https://YOUR-APP.vercel.app) · [**Report a bug**](https://github.com/YOUR_USERNAME/vellum/issues) · [**Request a feature**](https://github.com/YOUR_USERNAME/vellum/issues)

</div>

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Roles and permissions](#roles-and-permissions)
- [Search and keyboard shortcuts](#search-and-keyboard-shortcuts)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Security](#security)
- [Scripts](#scripts)
- [Known limitations and roadmap](#known-limitations-and-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

---

## About

Vellum is a full-stack project-management app built around Kanban boards. It started as a simple personal board and grew into a collaborative workspace: you can invite teammates, share boards with different levels of access, assign tasks, submit work for review, comment on tasks, and see everything update live for everyone.

**What makes it different from a basic Kanban clone**

- **Real collaboration.** Teams, invitations, shared boards, and editor / view-only roles that are enforced on the server, not just hidden in the UI.
- **A review workflow.** Tasks can be submitted, approved or sent back, and everyone involved is notified.
- **Live by default.** A WebSocket layer pushes changes to teammates instantly, without refreshing.
- **Built for speed.** A command palette, smart search operators, and two-key keyboard shortcuts.
- **Your data stays yours.** Full JSON backup, CSV export, import, and account deletion are built in.

---

## Features

### Boards and tasks
- Drag-and-drop **lists and cards** (powered by dnd-kit)
- **Priorities, due dates and descriptions** on every task
- **Labels**: 7 built-in colours plus **custom labels you create per board**, shared with everyone on the board
- List icons that follow the list's name (To Do, In Progress, Done) and a board search / filter bar
- Quick-create menu for new tasks and boards

### Teams and sharing
- **Find people by name or email**, preview their profile, and send an invitation with an optional note
- Accept or decline invitations right from the notification bell; mutual invitations auto-accept
- **Share a board** with teammates as an **editor** or **view-only** member, change roles any time, or leave a board
- Removing a teammate also removes any shared access between you

### Assign and review workflow
- Assign tasks to board members (viewers cannot be assigned work)
- Assignees **submit for review** with an optional note; the assigner **approves, requests changes, or reopens**
- Tasks you assigned to yourself are marked done directly (no review step)
- Completed tasks disappear from urgent lists and deadline alerts, and count as done in all stats
- Everyone involved is notified at every step

### Comments and activity
- **Comments on every task**, with a per-task timeline that also logs moves, assignments, priority and due-date changes, and review actions
- A **board-wide activity feed**
- Authors (and board owners) can delete comments; the comment count on cards stays accurate

### Live sync (WebSockets)
- Card moves, edits, comments, new boards, sharing and role changes appear **on teammates' screens within a moment**
- Notifications arrive instantly
- Updates pause while you drag or edit, then catch up, so your typing is never overwritten
- Automatic fallback to polling and a full re-sync after a dropped connection

### Notifications and alerts
- A bell with an unread badge for invitations, shares, assignments, comments and review events
- **Deadline alerts** computed live from your boards: overdue, due today and due tomorrow (high-priority tasks warn 3 days ahead)

### Search and navigation
- A dashboard search that finds **boards, tasks and people**, with operators (`@me`, `#label`, `due:today`, `is:overdue`, ...)
- A **command palette** (`Ctrl/⌘ + K`) and **keyboard shortcuts** with a built-in cheat sheet

### Insights
- **Analytics** with board and time-range filters: completion rate, overdue and in-review counts, tasks created vs completed per week, status breakdown, per-board progress, workload by person, priorities and top labels
- A **calendar** view and a **dashboard** with live stats and urgent tasks

### Profiles and settings
- Avatar and banner uploads with in-browser **cropping**
- Rich profiles: job title, department, location, skills, languages, social links, and a "profile strength" meter (phone number is private)
- Light / dark theme and five accent colours
- **Data tools:** JSON backup, CSV export, import as new boards, bulk-delete completed tasks, reset preferences, and **delete account**
- A status page with API and live-sync health, plus a "copy diagnostics" button for bug reports

### Public pages
- Landing page, **Terms of Service** and **Privacy Policy**

---

## Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4, dnd-kit, date-fns, react-icons, react-easy-crop |
| **Backend** | Node.js, Express 5, Socket.IO, Zod (validation), bcryptjs, JSON Web Tokens, Helmet, express-rate-limit |
| **Database** | PostgreSQL (Neon) with Prisma 7 and the `pg` driver adapter |
| **Auth** | Email + password, and Google sign-in (Google Identity Services) |
| **Media** | Cloudinary (signed, server-side uploads) |
| **Hosting** | Vercel (frontend), Render (API), Neon (database), Cloudinary (images) |
| **Tooling** | oxlint, nodemon, Prisma Migrate |

---

## Architecture

```mermaid
flowchart LR
  B["Browser<br/>React SPA"] -->|"static files"| V["Vercel"]
  B -->|"REST /api (JWT)"| S["Render<br/>Express + Socket.IO"]
  B <-.->|"WebSocket"| S
  S -->|"Prisma + pg adapter"| N[("Neon<br/>PostgreSQL")]
  S -->|"signed uploads"| C["Cloudinary<br/>avatars and banners"]
```

### How live sync works

Vellum does not send full data over WebSockets. The server sends a small **"something changed"** signal, and each client re-fetches the affected board through the normal, permission-checked REST API. This keeps a single source of truth for access control.

```mermaid
sequenceDiagram
  participant A as Alice (browser)
  participant S as API + Socket.IO
  participant DB as PostgreSQL
  participant B as Bob (browser)
  A->>S: PATCH /api/cards/:id  (header X-Socket-Id)
  S->>DB: write
  S-->>A: 200 OK (Alice already updated locally)
  S-->>B: board:changed { boardId, cardId }
  B->>S: GET /api/boards/:id
  S-->>B: fresh board data
```

- Each user joins a private room (`user:<id>`) and one room per board they can access (`board:<id>`).
- A single middleware runs after every successful write, emits `board:changed` to the board room (skipping the tab that made the change), and emits `notifications:new` to anyone who just received a notification.
- Sharing changes move people in and out of rooms and trigger `boards:changed`.
- The client pauses incoming updates while you drag or edit, flushes them afterwards, and polls as a fallback when the socket is down.

### Data model

```mermaid
erDiagram
  USER ||--o{ BOARD : owns
  USER ||--o{ BOARD_MEMBER : "belongs to"
  BOARD ||--o{ BOARD_MEMBER : has
  BOARD ||--o{ LIST : contains
  LIST ||--o{ CARD : contains
  BOARD ||--o{ BOARD_LABEL : defines
  CARD ||--o{ CARD_ACTIVITY : logs
  USER ||--o{ INVITATION : "sends or receives"
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ CARD : "is assigned"
```

---

## Project structure

```text
vellum/
├── Client/                      # React + Vite single-page app
│   ├── public/                  # Logos and icons
│   ├── scripts/
│   │   └── check-imports.mjs    # Catches file-name letter-case mismatches (Linux/Vercel)
│   ├── src/
│   │   ├── components/          # Analytics, Auth, Board, Card, Dashboard, Landing,
│   │   │                        # Profile, Settings, Team, UI, ...
│   │   ├── context/             # Auth, Board, Notification, Settings, Toast
│   │   ├── hooks/               # Scroll reveal, board people, ...
│   │   ├── pages/               # Landing, Login, Dashboard, Board, Team, Analytics,
│   │   │                        # Calendar, Profile, Settings, Terms, Privacy, ...
│   │   └── utils/               # api client, socket, search engine, analytics, shortcuts, ...
│   ├── index.html
│   ├── vercel.json              # SPA rewrite + headers for Vercel
│   └── vite.config.js
│
├── Server/                      # Express API + Socket.IO
│   ├── prisma/
│   │   ├── schema.prisma        # Data model
│   │   └── migrations/          # Migration history (commit this folder)
│   ├── src/
│   │   ├── controllers/         # auth, board, list, card, team, notification, activity, ...
│   │   ├── middleware/          # auth (JWT), ownership (roles), broadcast (live sync)
│   │   ├── routes/              # One router per resource
│   │   ├── utils/               # jwt, validation, cloudinary, activity log, ...
│   │   ├── prisma.js            # Prisma client + pg pool
│   │   ├── realtime.js          # Socket.IO setup and room helpers
│   │   └── index.js             # App entry point
│   └── prisma.config.ts         # Prisma CLI configuration
│
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js 20.19 or newer** (22 recommended) and npm
- A **PostgreSQL** database: a local install, or a free [Neon](https://neon.com) project
- A **Google OAuth client ID** (only if you want Google sign-in)
- A **Cloudinary** account (only if you want avatar / banner uploads)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vellum.git
cd vellum
```

### 2. Set up the server

```bash
cd Server
npm install

# Create your environment file, then fill in the values
cp .env.example .env          # Windows (cmd): copy .env.example .env
```

Edit `Server/.env`; every variable is explained in [Environment variables](#environment-variables). Then create the database tables and start the API:

```bash
npx prisma migrate dev        # applies all migrations to your database
npm run dev                   # http://localhost:4000
```

### 3. Set up the client

Open a second terminal:

```bash
cd Client
npm install
cp .env.example .env          # Windows (cmd): copy .env.example .env
npm run dev                   # http://localhost:5173
```

Open <http://localhost:5173>, create an account, and you're in.

> [!TIP]
> To try the collaboration features by yourself, sign up two accounts (one in a normal window, one in a private window), invite one from the other, share a board, and watch changes sync live.

### Using Neon for the database

1. Create a project at [neon.com](https://neon.com) and open **Connect**.
2. Copy **both** connection strings:
   - **Pooled** (host contains `-pooler`) goes in `DATABASE_URL`, used by the running server.
   - **Direct** (turn "Connection pooling" off) goes in `DIRECT_URL`, used by Prisma migrations.
3. Run `npx prisma migrate deploy` once to create the tables.

### Setting up Google sign-in (optional)

1. In [Google Cloud Console](https://console.cloud.google.com) create an **OAuth client ID** of type *Web application*.
2. Add `http://localhost:5173` (and later your production address) to **Authorized JavaScript origins**.
3. Put the client ID in `GOOGLE_CLIENT_ID` (server) and `VITE_GOOGLE_CLIENT_ID` (client).

### Setting up image uploads (optional)

1. Create a free [Cloudinary](https://cloudinary.com) account.
2. In the dashboard, copy the **API environment variable** (`cloudinary://API_KEY:API_SECRET@CLOUD_NAME`) into `CLOUDINARY_URL`.

---

## Environment variables

### Server (`Server/.env`)

| Variable | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used at runtime (the **pooled** string on Neon) |
| `DIRECT_URL` | No | Direct (non-pooled) connection string used by Prisma migrations. Recommended on Neon; falls back to `DATABASE_URL` |
| `JWT_SECRET` | Yes | Long random secret used to sign login tokens (32+ characters in production) |
| `JWT_EXPIRES_IN` | No | Token lifetime, for example `7d` |
| `CLIENT_URL` | Yes | Allowed website origin(s) for CORS and Socket.IO. Comma-separate several. No trailing slash |
| `GOOGLE_CLIENT_ID` | For Google sign-in | Same client ID as on the client |
| `CLOUDINARY_URL` | For uploads | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |
| `PORT` | No | Defaults to `4000` (Render sets this automatically) |
| `NODE_ENV` | No | `development` or `production` |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Client (`Client/.env`)

| Variable | Required | Description |
|---|:---:|---|
| `VITE_API_URL` | Yes | Base URL of the API, **including** `/api`. Default: `http://localhost:4000/api` |
| `VITE_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID |

> [!NOTE]
> `VITE_` variables are baked into the build. After changing one, restart the dev server (or redeploy on Vercel).

> [!WARNING]
> Never commit `.env` files. Both `Client/.env` and `Server/.env` must be listed in `.gitignore`.

---

## Roles and permissions

Access is enforced **on the server** for every request.

| Action | Owner | Editor | Viewer |
|---|:---:|:---:|:---:|
| View the board, tasks, comments and activity | ✅ | ✅ | ✅ |
| Create, edit, move and delete tasks and lists | ✅ | ✅ | ❌ |
| Create and delete labels | ✅ | ✅ | ❌ |
| Comment on tasks | ✅ | ✅ | ❌ |
| Be assigned a task | ✅ | ✅ | ❌ |
| Rename the board | ✅ | ❌ | ❌ |
| Delete the board | ✅ | ❌ | ❌ |
| Add people, change roles, remove people | ✅ | ❌ | ❌ |
| Leave the board | n/a | ✅ | ✅ |

**Who can review a task:** whoever assigned it (unless they assigned it to themselves), or the board owner at any time.

---

## Search and keyboard shortcuts

### Search operators

Use these in the dashboard search box. They can be combined with each other and with plain words.

| Operator | Meaning |
|---|---|
| `@me` | Assigned to me |
| `@name` | Assigned to someone whose name contains *name* |
| `#label` | Has a label containing *label* |
| `due:today` `due:tomorrow` `due:week` `due:overdue` `due:none` | Filter by due date |
| `is:open` `is:review` `is:done` `is:overdue` | Filter by status |
| `priority:high` (or `p:high`) | Filter by priority |

Example: `@me is:overdue #bug`

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ + K` | Open the command palette |
| `?` | Show the shortcuts cheat sheet |
| `Shift + D` | Toggle dark mode |
| `G` then `D` / `P` / `C` / `A` / `T` / `S` | Go to Dashboard / Projects / Calendar / Analytics / Team / Settings |
| `N` | New task |
| `B` | New board |
| `/` | Focus the search box |
| `Ctrl/⌘ + Enter` | Post a comment |
| `Esc` | Close a dialog or menu |

Shortcuts can be turned off in **Settings → Shortcuts**.

---

## API overview

All routes except sign-up, login and Google sign-in require an `Authorization: Bearer <token>` header. Replace `:id` with the relevant id.

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `POST` | `/api/auth/google` | Sign in with a Google credential |
| `GET` | `/api/auth/me` | Current user |

</details>

<details>
<summary><strong>Users and profile</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/search?q=` | Find people by name or exact email |
| `GET` | `/api/users/:id/profile` | Public profile |
| `PATCH` | `/api/users/me` | Update your profile |
| `POST` | `/api/users/me/avatar` | Upload an avatar (multipart) |
| `POST` | `/api/users/me/banner` | Upload a banner (multipart) |
| `DELETE` | `/api/users/me` | Delete your account (requires your email as confirmation) |

</details>

<details>
<summary><strong>Boards, lists, labels and members</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/boards` | Boards you own or were added to |
| `POST` | `/api/boards` | Create a board (with default lists) |
| `GET` | `/api/boards/:id` | Full board with lists, cards, members and labels |
| `PATCH` `DELETE` | `/api/boards/:id` | Rename or delete (owner) |
| `POST` | `/api/boards/:id/lists` | Add a list |
| `PATCH` | `/api/boards/:id/lists/reorder` | Reorder lists |
| `GET` `POST` | `/api/boards/:id/members` | List or add members (add: owner) |
| `PATCH` `DELETE` | `/api/boards/:id/members/:userId` | Change role or remove (owner; anyone can remove themselves) |
| `POST` | `/api/boards/:id/labels` | Create a custom label |
| `DELETE` | `/api/boards/:id/labels/:labelId` | Delete a label (removed from all cards) |
| `GET` | `/api/boards/:id/activity` | Board activity feed |
| `PATCH` `DELETE` | `/api/lists/:id` | Rename or delete a list |
| `POST` | `/api/lists/:id/cards` | Create a card |

</details>

<details>
<summary><strong>Cards, workflow and comments</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `PATCH` `DELETE` | `/api/cards/:id` | Update or delete a card |
| `PATCH` | `/api/cards/:id/move` | Move a card (`toListId`, `toIndex`) |
| `POST` | `/api/cards/:id/status` | Workflow action: `submit`, `approve`, `request_changes`, `reopen` |
| `GET` | `/api/cards/:id/activity` | Task timeline (comments and events) |
| `POST` | `/api/cards/:id/comments` | Add a comment |
| `DELETE` | `/api/cards/:id/comments/:commentId` | Delete a comment |

</details>

<details>
<summary><strong>Team and notifications</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/team` | Teammates, sent and received invitations |
| `POST` | `/api/team/invitations` | Send an invitation |
| `POST` | `/api/team/invitations/:id/accept` | Accept |
| `POST` | `/api/team/invitations/:id/decline` | Decline |
| `DELETE` | `/api/team/invitations/:id` | Cancel a sent invitation |
| `DELETE` | `/api/team/members/:userId` | Remove a teammate |
| `GET` | `/api/notifications` | Your notifications |
| `POST` | `/api/notifications/:id/read` | Mark one as read |
| `POST` | `/api/notifications/read-all` | Mark all as read |

</details>

<details>
<summary><strong>Real-time events (Socket.IO)</strong></summary>

The socket authenticates with the same JWT (`auth: { token }`).

| Event | Sent to | Meaning |
|---|---|---|
| `board:changed` | Everyone in the board's room (except the acting tab) | Re-fetch this board |
| `boards:changed` | A single user | Your list of boards or team changed |
| `notifications:new` | A single user | You have a new notification |

</details>

---

## Deployment

The recommended free setup is **Neon + Cloudinary + Render + Vercel**.

```text
Neon (database)  ←  Render (API + WebSockets)  ←  Vercel (website)        Cloudinary (images)
```

### Before you deploy

- [ ] Use **new** secrets in production (a fresh `JWT_SECRET`, a fresh database password), never reuse your local ones
- [ ] `.env` files are git-ignored, and `Server/prisma/migrations` **is** committed
- [ ] `prisma` and `@prisma/client` are in `dependencies` (not `devDependencies`) in `Server/package.json`
- [ ] `npm run check:imports` and `npm run build` both pass in `Client`
- [ ] You are on a **stable** Prisma 7 release (don't deploy release candidates)

### 1. Database: Neon

Create a project, copy the **pooled** and **direct** connection strings, then create the tables once:

```bash
# PowerShell
$env:DIRECT_URL = "postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy

# macOS / Linux
DIRECT_URL="postgresql://..." npx prisma migrate deploy
```

### 2. API: Render

Create a **Web Service** from this repository:

| Setting | Value |
|---|---|
| Root Directory | `Server` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/` |
| Region | Same area as your Neon database |

Environment variables:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `DATABASE_URL` | Neon **pooled** string |
| `DIRECT_URL` | Neon **direct** string |
| `JWT_SECRET` | A long random value |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your Vercel address (for example `https://vellum.vercel.app`) |
| `GOOGLE_CLIENT_ID` | Your Google client ID |
| `CLOUDINARY_URL` | Your Cloudinary string |

`npm run build` runs `prisma generate && prisma migrate deploy`, so new migrations apply automatically on every deploy.

### 3. Website: Vercel

Import the repository as a **Project**:

| Setting | Value |
|---|---|
| Root Directory | `Client` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 22.x |

Environment variables:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google client ID |

`Client/vercel.json` rewrites every path to `index.html`, so refreshing on `/team` or `/board/...` works.

After the first deploy, put the Vercel address into Render's `CLIENT_URL`, redeploy the API, and add the Vercel address to your Google OAuth client's **Authorized JavaScript origins**.

### Troubleshooting

<details>
<summary><strong>Common problems and fixes</strong></summary>

| Symptom | Likely cause |
|---|---|
| Vercel build fails with *Could not resolve ./something* | A file-name **letter-case mismatch** (works on Windows, fails on Linux). Run `npm run check:imports` in `Client`. When renaming only the case, use `git mv` |
| Blank page after deploy | `VITE_API_URL` is missing or wrong. Set it and **redeploy** (it's baked in at build time) |
| CORS error in the browser console | `CLIENT_URL` on Render doesn't exactly match your site's address (use `https`, no trailing slash) |
| 404 when refreshing a page | `Client/vercel.json` is missing, or Vercel's Root Directory isn't `Client` |
| Render build: `prisma: not found` | `prisma` is still in `devDependencies` |
| Migration fails during the build | Run `npx prisma migrate deploy` locally against Neon first and read the error |
| `Missing environment variables` in Render logs | Add the variables listed in the server table above |
| Avatar / banner upload fails | `CLOUDINARY_URL` is missing or incorrect |
| First request after idle is slow, live sync drops | Free tiers sleep when idle. The app falls back to polling and reconnects when the server wakes |
| Prisma error about `defineConfig` after an upgrade | You installed a Prisma 8 release candidate. Reinstall the stable 7.x packages with exact versions |

</details>

---

## Security

- **Passwords** are stored only as salted `bcrypt` hashes.
- **Sessions** use signed JWTs. The server verifies the token on every request and **re-checks the user's role on the board for every action**, so view-only members cannot change data even by calling the API directly.
- **Input** is validated with Zod; profile fields, comments and tags are trimmed and length-limited; links are checked so `javascript:` URLs can never be rendered as clickable.
- **Rate limiting** protects sign-in, sign-up and Google sign-in; **Helmet** sets secure headers; **CORS** only allows your configured origins.
- **Uploads** are accepted only from signed-in users, limited to JPG, PNG, WebP and GIF up to 8 MB, resized, and sent to Cloudinary with **server-side signed** requests. The Cloudinary secret never reaches the browser.
- **Privacy by design:** other people never see your phone number or full email address (search shows a masked hint).
- **Secrets** live only in environment variables.

> [!NOTE]
> The login token is kept in the browser's `localStorage`, a common single-page-app trade-off. Keep dependencies updated and avoid rendering untrusted HTML.

---

## Scripts

### Server

| Command | Description |
|---|---|
| `npm run dev` | Start the API with auto-reload (nodemon) |
| `npm start` | Start the API |
| `npm run build` | `prisma generate && prisma migrate deploy` (used on Render) |
| `npm run prisma:migrate` | Create and apply a new migration in development |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:studio` | Open Prisma Studio to browse the database |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint with oxlint |
| `npm run check:imports` | Verify every import matches its file name exactly (run before deploying) |

---

## Known limitations and roadmap

**Known limitations**

- No **password reset** or **email verification** yet (the "Forgot password" link is a placeholder)
- Notifications are in-app only (no email or push)
- The comment feature supports adding and deleting, but not editing
- Importing a backup restores boards, lists, tasks and labels, but not assignees, comments or review status
- There is no automated test suite yet

**Roadmap**

- [ ] Password reset and email verification
- [ ] Email and push notifications
- [ ] Comment editing and `@mentions`
- [ ] Board templates and archiving
- [ ] Presence indicators ("who is viewing this board")
- [ ] Automated tests and CI
- [ ] Improved layout for small screens
- [ ] Internationalisation

Have an idea? [Open an issue](https://github.com/YOUR_USERNAME/vellum/issues).

---

## Contributing

Contributions are welcome.

1. **Fork** the repository and create a branch: `git checkout -b feature/your-feature`
2. Make your changes. Run `npm run lint` and `npm run check:imports` in `Client`, and test the flow you touched
3. **Commit** with a clear message: `git commit -m "Add: short description"`
4. **Push** and open a **pull request** describing what changed and why

Please keep pull requests focused, and don't include `.env` files or secrets.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## Author

**[YOUR NAME]**

- GitHub: [@Dawit Moges](https://github.com/kenji-villa)
- LinkedIn: [Dawit Moges](https://www.linkedin.com/in/dawit-moges-4ba260259)
- Email: [dawit94moges@gmail.com](mailto:dawit94moges@gmail.com.com)

---

## Acknowledgements

Vellum stands on the shoulders of excellent open-source projects and services:
[React](https://react.dev), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), [dnd-kit](https://dndkit.com), [Express](https://expressjs.com), [Prisma](https://www.prisma.io), [Socket.IO](https://socket.io), [date-fns](https://date-fns.org), [react-icons](https://react-icons.github.io/react-icons), [react-easy-crop](https://github.com/ValentinH/react-easy-crop), [Neon](https://neon.com), [Cloudinary](https://cloudinary.com), [Render](https://render.com) and [Vercel](https://vercel.com).

<div align="center">

If you find Vellum useful, consider giving the repository a ⭐

</div>
