# 💰 Personal Finance Tracker

A web-based personal finance tracker where users can record income and expenses, categorize transactions, and monitor their spending through an intuitive dashboard.

Built as part of the Jaypee Brothers Medical Publishers SDE Intern Assessment.

---

## 🌐 Live Demo
[Click here to view the live app](YOUR_VERCEL_URL_HERE)

---

## 📁 GitHub Repository
[Click here to view the repository](YOUR_GITHUB_REPO_URL_HERE)

---

## ✅ Features Implemented

### Authentication
- User registration with email and password
- User login and logout
- Session persistence across page refreshes
- Protected routes — unauthenticated users are redirected to login

### Transaction Management
- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation prompt
- Each transaction includes: type, amount, category, description, and date

### Categories
- Predefined income categories: Salary, Freelance, Investment, Gift, Other
- Predefined expense categories: Food & Dining, Transport, Shopping, Health, Entertainment, Rent, Utilities, Education, Other
- Category badges displayed on each transaction

### Expense Summary Dashboard
- Total Balance card (Income − Expenses)
- Total Income card
- Total Expenses card
- Pie/Bar chart: Spending breakdown by category
- Line/Bar chart: Income vs Expenses over last 30 days
- Recent 5 transactions preview

### Search and Filters
- Search transactions by description keyword
- Filter by transaction type (All / Income / Expense)
- Filter by category
- Filter by date range (from date to date)
- All filters work simultaneously
- Clear all filters button

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Charts | Recharts |
| Deployment | Vercel |

---

## 🚀 Project Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to the **SQL Editor** in your Supabase dashboard
3. Run the following SQL to create the transactions table:

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  category text not null,
  description text,
  date date not null,
  created_at timestamptz default now()
);

alter table transactions enable row level security;

create policy "Users can only access their own transactions"
on transactions for all
using (auth.uid() = user_id);
```

4. Go to **Project Settings → API** and copy your `Project URL` and `anon public` key

### 4. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit `.env.local` to GitHub. It is already listed in `.gitignore`.

### 5. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel

1. Push your code to a public GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel project settings
4. Click Deploy — Vercel will give you a live URL

---

## 📂 Project Structure

```
/app
  /login          → Login page
  /signup         → Signup page
  /dashboard      → Summary cards + charts + recent transactions
  /transactions   → Full transaction list with filters
  /components     → Reusable UI components
  /lib            → Supabase client setup
/public           → Static assets
.env.local        → Environment variables (not committed)
```

---

## 🔒 Security
- Row Level Security (RLS) enabled on Supabase — users can only access their own data
- No API keys or credentials are hardcoded or committed to the repository
- Environment variables used for all sensitive configuration

---

## 📸 Screenshots
_(Add screenshots of your dashboard, transactions page, and login page here)_

---

## 👤 Author
Your Name  
[GitHub](https://github.com/YOUR_USERNAME)
