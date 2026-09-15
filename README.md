# NC Politics

North Carolina political news aggregation and opinion platform by **Nexus Strategies**.

## Overview

NC Politics aggregates political news from established North Carolina news sources, organizes it by topic and region, and provides a platform for opinion submissions. It features a public-facing news site with full-text search and an admin dashboard for content management.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma 5
- **Auth**: NextAuth.js v5 (credentials provider)
- **Styling**: Tailwind CSS v4
- **RSS Parsing**: rss-parser
- **Validation**: Zod + React Hook Form
- **Deployment**: Vercel

## Architecture

```
src/
  app/                  # Next.js App Router pages and API routes
    admin/              # Admin dashboard (auth-protected)
    api/                # API routes (auth, CRUD, cron, tracking)
    article/[slug]/     # Article detail pages
    [category]/         # Category listing pages
    opinion/            # Opinion section
    region/[slug]/      # Regional news pages
    market/[slug]/      # City/market pages
  components/
    layout/             # Header, Footer
    news/               # ArticleCard, BreakingBanner, SectionHeader
    ui/                 # CategoryBadge
  lib/
    auth.ts             # NextAuth configuration
    classifier.ts       # Keyword-based article classifier
    ingest.ts           # RSS ingestion engine
    prisma.ts           # Prisma client singleton
    utils.ts            # Utility functions
prisma/
  schema.prisma         # Database schema
  seed.ts               # Seed data (categories, regions, sources, demo articles)
```

## Local Development Setup

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Neon recommended)

### 1. Clone and install

```bash
git clone <repo-url>
cd nexus-nc-politics
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

- `DATABASE_URL` / `DIRECT_URL`: Your Neon PostgreSQL connection strings
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Admin login credentials
- `CRON_SECRET`: Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY`: Optional, for AI classification
- `GMAIL_USER` / `GMAIL_APP_PASSWORD`: Optional, for email notifications

### 3. Set up database

```bash
npx prisma db push       # Create tables
npx prisma db seed        # Seed categories, regions, sources, demo data
```

### 4. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin dashboard.

## Database Setup (Neon)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (pooled) to `DATABASE_URL`
3. Copy the direct connection string to `DIRECT_URL`
4. Run `npx prisma db push` to create tables
5. Run `npx prisma db seed` to seed initial data

## Adding News Sources

### Via Admin Dashboard

1. Log in at `/auth/login`
2. Go to Sources > Add Source
3. Enter name, website URL, and RSS feed URL
4. Toggle active to enable ingestion

### Via Database Seed

Add sources to `prisma/seed.ts` and re-run `npx prisma db seed`.

## RSS Ingestion

### Automatic (Vercel Cron)

The cron job at `/api/cron/ingest` runs every 2 hours and fetches all active sources. It requires the `CRON_SECRET` header for authentication.

### Manual (Admin Dashboard)

1. Go to Admin > Ingestion
2. Click "Ingest All Sources" or ingest individual sources from the Sources page

### Manual (CLI)

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/ingest
```

## Admin Dashboard

Access at `/admin` after logging in. Features:

- **Dashboard**: Stats overview (articles, sources, pending opinions, views)
- **Articles**: Search, edit flags (breaking, featured, hidden), manage articles
- **Opinions**: Review queue with status workflow (Submitted > Under Review > Approved > Published)
- **Sources**: Add/edit/delete news sources, trigger manual ingestion
- **Ingestion**: Feed health monitoring, ingestion logs

## Opinion Submission Workflow

1. Public users submit opinions at `/submit-opinion`
2. Submissions appear in Admin > Opinions with status "Submitted"
3. Editors review, add notes, and update status:
   - Under Review > Changes Requested > Approved > Published
   - Or: Rejected
4. Published opinions appear at `/opinion` and `/opinion/[slug]`

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy

The `vercel.json` configures the cron job automatically.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | Yes | PostgreSQL direct connection string |
| `AUTH_SECRET` | Yes | NextAuth secret (32+ chars) |
| `AUTH_URL` | Yes | App URL (http://localhost:3000 for dev) |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `CRON_SECRET` | Yes | Secret for cron job authentication |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |
| `NEXT_PUBLIC_PUBLICATION_NAME` | No | Site name (default: NC Politics) |
| `NEXT_PUBLIC_PUBLICATION_TAGLINE` | No | Site tagline |
| `OPENAI_API_KEY` | No | For AI-powered classification |
| `GMAIL_USER` | No | For email notifications |
| `GMAIL_APP_PASSWORD` | No | Gmail app password |

## Troubleshooting

- **Build errors**: Run `npx prisma generate` before `npm run build`
- **Database connection**: Verify `DATABASE_URL` and `DIRECT_URL` are correct
- **Auth issues**: Ensure `AUTH_SECRET` is at least 32 characters
- **RSS failures**: Check source RSS URLs in Admin > Ingestion for error messages
- **Missing seed data**: Run `npx prisma db seed` after database setup
