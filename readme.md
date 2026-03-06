<div align="center">

# Digivents

**A modern, full-stack digital agency portfolio — built with React and Strapi.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Strapi](https://img.shields.io/badge/Strapi-5-4945FF?logo=strapi&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-≥20-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Content Types](#api-content-types)
- [Pages & Routes](#pages--routes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Digivents is a full-stack portfolio and agency website featuring a **React** single-page application on the frontend and a **Strapi v5** headless CMS on the backend. The site showcases projects, services, blog articles, graphics, client testimonials, and more — all managed through an intuitive admin panel.

Key highlights:

- **Headless CMS** — Content is fully manageable via the Strapi admin dashboard.
- **Animated UI** — Smooth page transitions and micro-interactions powered by Framer Motion.
- **Responsive Design** — Mobile-first styling with Tailwind CSS and a dark-themed palette.
- **Image Management** — Supports both local uploads and ImageKit CDN integration.

---

## Tech Stack

| Layer        | Technology                                                     |
| ------------ | -------------------------------------------------------------- |
| **Frontend** | React 19, React Router 7, Framer Motion, Tailwind CSS 3       |
| **Backend**  | Strapi 5, Node.js ≥ 20                                        |
| **Database** | SQLite (default) — easily swappable to PostgreSQL / MySQL      |
| **Styling**  | Tailwind CSS, PostCSS, Autoprefixer                            |
| **Media**    | Strapi Uploads, ImageKit (optional CDN provider)               |
| **Icons**    | React Icons                                                    |

---


```
digivents/
├── backend/                  # Strapi v5 headless CMS
│   ├── config/               # Server, database, plugin & middleware config
│   ├── database/migrations/  # Database migration files
│   ├── public/uploads/       # Uploaded media assets
│   ├── scripts/              # Seed scripts
│   ├── src/
│   │   ├── api/              # Content-type APIs (controllers, routes, services)
│   │   ├── components/       # Shared Strapi components (SEO, media, etc.)
│   │   └── extensions/       # Strapi extension overrides
│   └── types/generated/      # Auto-generated TypeScript definitions
│
├── frontend/                 # React SPA
│   ├── public/               # Static HTML entry point
│   ├── src/
│   │   ├── assets/           # Static assets (images, fonts, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── data/             # API service layer & data-fetching utilities
│   │   ├── pages/            # Route-level page components
│   │   ├── animations.js     # Framer Motion animation utilities
│   │   ├── App.js            # Root application component & routing
│   │   └── index.css         # Global styles & Tailwind directives
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
│
└── readme.md                 # ← You are here
```

---

## Prerequisites

- **Node.js** ≥ 20.x (LTS recommended)
- **npm** ≥ 6.x (or **yarn**)
- **Git**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/digivents.git
cd digivents
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the backend (Strapi)

```bash
cd backend
npm run develop
```

The Strapi admin panel will be available at **http://localhost:1337/admin**.  
On first launch you will be prompted to create an administrator account.

### 4. Start the frontend (React)

```bash
cd frontend
npm start
```

The application will open at **http://localhost:3000**.

---


## Available Scripts

### Backend

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `npm run develop`    | Start Strapi in development mode (auto-reload)      |
| `npm run start`      | Start Strapi in production mode                     |
| `npm run build`      | Build the Strapi admin panel                        |
| `npm run seed:example` | Seed the database with example data               |

### Frontend

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm start`      | Start the dev server (port 3000)             |
| `npm run build`  | Create an optimized production build         |
| `npm test`       | Run the test suite                           |

---

## Deployment

### Frontend

```bash
cd frontend
npm run build
```

The production-ready build will be output to `frontend/build/`. Serve it with any static hosting provider (Vercel, Netlify, AWS S3 + CloudFront, etc.).

### Backend

```bash
cd backend
npm run build
npm run start
```

For production, consider:
- Switching from SQLite to **PostgreSQL** or **MySQL**.
- Configuring a reverse proxy (Nginx / Caddy) in front of Strapi.
- Setting all environment variables via your hosting provider's secret management.
- Using **ImageKit** or another CDN for media storage.

---

## Contributing

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "feat: add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a **Pull Request**.

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is **private** and not licensed for public distribution.

---

<div align="center">
  <sub>Built with ❤️ by the Digivents team</sub>
</div>