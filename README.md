# 🏠 Neighborly

**Neighborly** is a hyperlocal, no-money skill-swap web app where people trade services like *“I’ll fix your sink if you help with algebra.”* No accounts. No fees. No ads. Just quiet, neighborhood-level reciprocity.

Built to be **free forever** using Vercel and Supabase.

---

## 🚀 How to Deploy (3 Steps)

1.  **Fork & Supabase Setup**
    - Fork this repository.
    - Create a free project at [supabase.com](https://supabase.com).
    - Go to the **SQL Editor** in Supabase and paste the contents of `src/lib/supabase/schema.sql`. Run it to create the `posts` table and RLS policies.

2.  **Environment Variables**
    - In your Supabase project settings (API), copy your `Project URL` and `anon public` key.
    - (Local) Rename `.env.local.example` to `.env.local` and paste your keys.
    - (Vercel) Add these same keys as Environment Variables in your Vercel project settings:
        - `NEXT_PUBLIC_SUPABASE_URL`
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3.  **Deploy to Vercel**
    - Connect your forked GitHub repo to [Vercel](https://vercel.com).
    - Hit **Deploy**.
    - Your neighborhood board is now live!

---

## 💸 Why it costs $0 forever

Neighborly is optimized for the generous free tiers of modern infrastructure:

-   **Hosting**: [Vercel's Hobby Tier](https://vercel.com/pricing) allows for unlimited personal projects with generous bandwidth and serverless execution.
-   **Database**: [Supabase's Free Tier](https://supabase.com/pricing) provides 500MB of storage and 50,000 monthly requests—more than enough for dozens of active neighborhoods.
-   **No Hidden Costs**: No external APIs, no paid font licenses, no monthly subscription requirements.

---

## 🌱 Trust by Design

-   **No Authentication**: Identity is ephemeral. Use a nickname and neighborhood.
-   **Public Feed**: All trades are visible to the community.
-   **Trust Signals**: 
    -   🏅 **Active Neighbor**: Users who have posted 2+ times.
    -   ✅ **Has Swapped**: Users who have replied to others.
-   **Calm UI**: Designed with warm tones (cream, sage) to feel like a handwritten community board.

---

## 🛠 Tech Stack

-   **Frontend**: Next.js 14 (App Router)
-   **Database**: Supabase (PostgreSQL + RLS)
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Avatars**: Gravatar (deterministic based on nickname)

---

## 📜 Future Ideas

-   [ ] Neighborhood verification via SMS (optional)
-   [ ] Simple notification via browser push (no account needed)
-   [ ] Categories for easier browsing (Home, Education, Tech, etc.)
-   [ ] "Closed" status for completed swaps

---

> **“This is not a startup. It’s a public good.”**  
> Neighborly doesn’t need users. It needs neighbors.

Built with ❤️ for a more reciprocal world.