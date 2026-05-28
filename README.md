
#  FinTrack — Personal Finance Tracker

FinTrack is a high-performance, responsive single-page web application designed for personal expense management and budget tracking. Built using the **Next.js 16 App Router**, **Tailwind CSS**, and **Supabase (PostgreSQL)**, it delivers zero-latency operations through an Optimistic UI state pipeline, custom vector analytics rendering, and a state-of-the-art dark theme aesthetic.

---

## 🔗 Key Links

* **GitHub Repository:** [https://github.com/PrakharJain345/Personal-Finance-Tracker](https://github.com/PrakharJain345/Personal-Finance-Tracker)
* **Live Deployment:** [https://personal-finance-tracker-brown-chi.vercel.app](https://personal-finance-tracker-brown-chi.vercel.app)

---

##  Key Architectural Features

### 1. High-Performance Optimistic UI
FinTrack implements an advanced, local state management system inside a unified data hook (`useTransactions.ts`). All transaction additions, modifications, and deletions occur **instantly** in the UI, updating summary cards, charts, and table rows before the server-side database confirms the query. This removes latency and ensures a fluid user experience.

### 2. Next.js 16 Route Guard & Session Security
Utilizes a centralized route proxy (`proxy.ts`) cooperating with server-side SDK middleware to handle live session tokens. Unauthenticated users attempting to access dashboard panels are immediately intercepted and directed to credentials panels, securing all proprietary layout trees.

### 3. Multi-Tenant Row Level Security (RLS)
The database structure is built on Supabase PostgreSQL with **Row Level Security (RLS)** fully active. A strict RLS security policy restricts queries so that authenticated users are only authorized to read, create, modify, or delete entries matching their own unique `user_id`, guaranteeing full data isolation.

### 4. Bespoke Visual Design & Aurora Backgrounds
Features a modern dark-mode design system with responsive visual indicators:
* **Blended Aurora Mesh:** A layered dark backdrop (`bg-gradient-to-b from-[#0B0F19] via-[#0A0D14] to-[#0D0914]`) combined with floating, slow-pulsing radial glow spheres for deep visual immersion.
* **Vector Graphic Category Badges:** Emojis are replaced by highly polished Lucide SVG React components that scale flawlessly and dynamically match category colors.
* **Sleek Input Controls:** Elegant password masks (`••••••••••••`) and clean minimal email inputs (`example@fintrack.com`) with high-contrast text rendering.
* **Asymmetry-Free Layout Centering:** Uses absolute viewport calculations to center all menu navigation links exactly in the midpoint of the screen, regardless of logo and profile widths.

---

## ✅ Core App Features Implemented

### 1. User Authentication & Security
* **Session Persistence:** Exposes secure token storage for persistent login states across page refreshes.
* **Route Guards:** Centralized path interception redirects unauthenticated users away from restricted workspace screens.
* **Multi-Tenant RLS:** Strict database filters prevent cross-user account records leakage.

### 2. Transaction CRUD Operations
* **Add Transaction:** Allows creating income or expense records with amount, category, date, and description parameters.
* **Edit Transaction:** Highly responsive forms pre-fill details for secure edits.
* **Double-Confirmation Deletion:** Features local checkmark confirmations to protect against accidental transaction deletions.

### 3. Expense Summary Dashboard
* **Dynamic Net Balance Widget:** Instantly computes Total Income minus Total Expenses.
* **Analytical Recharts Integration:** Exposes an interactive coordinate cashflow bar chart and a category spending pie breakdown.
* **Recent Feeds Preview:** Summarizes your top 5 recent financial transactions.

### 4. Database Searching & Multivariable Filtering
* **Keyword Database Search:** Instantly filters listings matching description or category keywords.
* **Multivariable Filters:** Allows filtering by type (Income vs Expense) and category dropdowns simultaneously.
* **Date Range Pickers:** Restricts lists exactly between "From" and "To" boundaries.
* **One-Click Clear Button:** Instantly resets all parameters and returns full lists.

---

##  Premium Assessment Enhancements
Beyond the mandatory specifications, we have implemented the following high-end developer upgrades:
1. **Optimistic UI Data Hook:** Immediate, latency-free updates in visual charts and tables during CRUD edits before server roundtrips resolve.
2. **Dashboard Quick Management:** Allows full editing and deleting of transactions directly inside the Dashboard recent transactions widget, bypassing the need to change views.
3. **Pulsing Aurora Ambient Mesh:** Soft-glowing radial spheres that animate slowly in the background to provide a three-dimensional visual atmosphere.
4. **Custom Vector SVG Category Badges:** Clean Lucide React stroke graphics mapped dynamically to transaction categories, eliminating browser-dependent emoji designs.
5. **Real-Time Profile Avatar Extraction:** Dynamically extracts the active database email and splits it into a localized capitalized name with custom-gradient avatar initials.
6. **High-Contrast Minimal Inputs:** Exposes simple, neat inputs styled with masked bullet placeholders (`••••••••••••`) and a precise `example@fintrack.com` format.

---

##  Complete Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core Architecture** | Next.js 16.2.6 (App Router) | High-speed production framework with SSR and Route Proxy capabilities |
| **Styling & Theme** | Tailwind CSS v4 | Custom `@theme` variables for layout tokens, dark utility configurations |
| **Animation Pipeline** | Framer Motion | Smooth keyframe timelines, staggered transitions, interactive sliders |
| **Database & Engine** | Supabase (PostgreSQL) | Structured database tables with strict relationship columns |
| **Authentication** | Supabase Auth SDK | Enterprise credential authentication, secure sessions |
| **Analytics & Data** | Recharts | Responsive cashflow coordinate bars, detailed spending slices |
| **Development Tooling** | TypeScript | Strong typing, structural interface compiling |

---

## 📋 Comprehensive Database Schema

To initialize the database, execute the following SQL script in your Supabase **SQL Editor** to create the `transactions` table, establish reference keys, and activate security models:

```sql
-- Create the transactions tracking table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null,
  description text,
  date date not null,
  created_at timestamptz default now() not null
);

-- Enable strict Row Level Security (RLS)
alter table transactions enable row level security;

-- Authorize authenticated database tenants to perform CRUD operations solely on matching rows
create policy "Users can only access their own transactions"
on transactions for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

## 📂 Project Directory Structure

```
finance-tracker/
├── app/
│   ├── dashboard/           # Summary cards, Recharts, recent feeds
│   │   └── page.tsx
│   ├── transactions/        # Fully searchable list, stacked date range filters
│   │   └── page.tsx
│   ├── login/               # Premium enlarged auth card, custom auroras
│   │   └── page.tsx
│   ├── signup/              # Signup interface page
│   │   └── page.tsx
│   ├── globals.css          # Tailwind variables, floating auroras, keyframes
│   ├── layout.tsx           # Exposes Google Fonts, Toasters, layout wrappers
│   └── page.tsx             # Central route redirect helper
├── components/
│   ├── ui/                  # Badge, Button, Card, Input, Modal (design system)
│   ├── layout/              # Sidebar, Topbar (dynamic profile and red logout)
│   ├── dashboard/           # BalanceCard, SummaryCards, Recharts wrappers
│   └── transactions/        # FilterBar, TransactionRow UI elements
├── hooks/
│   └── useTransactions.ts   # Optimistic CRUD database actions hook
├── lib/
│   └── utils.ts             # Lucide SVG Category configurations
├── utils/supabase/
│   ├── client.ts            # Client-side Supabase client
│   ├── server.ts            # Server-side SSR Supabase client
│   └── middleware.ts        # Next.js session middleware helper
├── proxy.ts                 # Next.js 16 centralized route guard
├── .env.local.example       # Example database connection variables
└── package.json             # Core scripts and dependencies mapping
```

---

##  Step-by-Step Setup Instructions

### 1. Clone the Source Code
```bash
git clone https://github.com/PrakharJain345/Personal-Finance-Tracker.git
cd Personal-Finance-Tracker/finance-tracker
```

### 2. Configure Environment Variables
Copy the connection placeholder variables into a local credentials file:
```bash
cp .env.local.example .env.local
```
Open `.env.local` and add your unique Supabase Project credentials (retrieved from **Settings → API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Install NPM Packages
Download and compile the structural dependencies:
```bash
npm install
```

### 4. Run Development Server
Boot up the fast local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start tracking.

---

##  Security Compliance
* **RLS Enforced:** Database permissions ensure no user can intercept another's transactions.
* **Excluded Credentials:** Sensitive keys, `.env.local`, and build dumps are explicitly excluded from GitHub via structured root `.gitignore` files.
* **Client-Side Sanitation:** All inputs are parsed, currency formats sanitized, and transaction boundaries securely compiled.

---

## 👤 Author

**Prakhar Jain**
* **GitHub:** [@PrakharJain345](https://github.com/PrakharJain345)
* **Project Repository:** [Personal Finance Tracker](https://github.com/PrakharJain345/Personal-Finance-Tracker)
