# Supabase Setup — School ERP

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Project Name**: `school-erp`
   - **Database Password**: Save this somewhere safe!
   - **Region**: Choose nearest to you
4. Wait ~2 minutes for the project to initialize

---

## Step 2: Get Your API Keys

1. Go to **Project Settings → API** in your Supabase dashboard
2. Copy these three values:

| Value | Used As |
|-------|---------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role secret** key | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser — it's only used in server-side API routes.

---

## Step 3: Run the Schema SQL

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Paste the entire contents of [`schema.sql`](./schema.sql)
4. Click **Run** (or press `Ctrl+Enter`)

This creates all database tables, Row Level Security policies, and helper functions.

---

## Step 4: Run the Seed SQL

1. Click **New Query** again in the SQL Editor
2. Paste the entire contents of [`seed.sql`](./seed.sql)
3. Click **Run**

This creates the following **11 user accounts** in Supabase Auth + populates all tables with realistic sample data:

| Role    | Email                        | Default Password |
|---------|------------------------------|-----------------|
| Admin   | admin@school.edu.pk          | `Admin@123`     |
| Teacher | tariq.m@school.edu.pk        | `Teacher@123`   |
| Teacher | salman.f@school.edu.pk       | `Teacher@123`   |
| Teacher | ayesha.s@school.edu.pk       | `Teacher@123`   |
| Teacher | kamran.b@school.edu.pk       | `Teacher@123`   |
| Teacher | sana.m@school.edu.pk         | `Teacher@123`   |
| Student | ahmed.raza@school.edu.pk     | `Student@123`   |
| Student | sara.fatima@school.edu.pk    | `Student@123`   |
| Student | bilal.hassan@school.edu.pk   | `Student@123`   |
| Student | zara.malik@school.edu.pk     | `Student@123`   |
| Student | hamza.sheikh@school.edu.pk   | `Student@123`   |

---

## Step 5: Change Passwords (Optional)

To change any account's password:
1. Go to **Authentication → Users** in Supabase dashboard
2. Click the ⋮ menu next to any user
3. Select **Send Password Recovery** or **Reset Password**

---

## Step 6: Set Up Environment Variables

Create a `.env.local` file in **each portal folder** with the values from Step 2:

### `admin-portal/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### `student-portal/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### `teacher-portal/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## Step 7: Install Dependencies

Run `npm install` in each portal to pick up `@supabase/supabase-js`:

```bash
# In each portal directory
cd "admin-portal"  && npm install
cd "../student-portal" && npm install
cd "../teacher-portal" && npm install
```

---

## Step 8: Run the Portals

Open three separate terminals:

```bash
# Terminal 1 — Admin Portal (port 3000)
cd "School ERP/admin-portal"
npm run dev

# Terminal 2 — Student Portal (port 3001)
cd "School ERP/student-portal"
npm run dev -- --port 3001

# Terminal 3 — Teacher Portal (port 3002)
cd "School ERP/teacher-portal"
npm run dev -- --port 3002
```

---

## Login Flows

| Portal | URL | Who logs in |
|--------|-----|-------------|
| Admin Portal | `http://localhost:3000/login` | `admin@school.edu.pk` |
| Student Portal | `http://localhost:3001/login` | Any student, teacher, or admin email |
| Teacher Portal | `http://localhost:3002/login` | Any teacher email |

The student portal has a unified login — it redirects based on your account role (admin → `/admin`, teacher → `/teacher`, student → `/`).

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Invalid login credentials" | Confirm seed SQL ran successfully; check email/password |
| "relation does not exist" | Run `schema.sql` before `seed.sql` |
| "new row violates RLS" | Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local` |
| Data not loading after login | Clear browser localStorage and try again |
