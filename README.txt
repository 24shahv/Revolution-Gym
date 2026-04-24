================================================================
  REVOLUTION GYM — Complete Website Package
  Nagpur's Fitness Revolution · Get Fit, Get Furious
================================================================

FILES INCLUDED (14 HTML + 2 JS + 1 CSS = 17 files)
────────────────────────────────────────────────────

MAIN WEBSITE:
  index.html        → Homepage (hero, programs, stats, testimonials)
  about.html        → Brand story, timeline, facility details
  programs.html     → All programs + weekly class schedule
  trainers.html     → Coach profiles with stats
  membership.html   → Pricing plans, comparison table, FAQ
  contact.html      → Contact form + location map
  blog.html         → Fitness articles and newsletter
  style.css         → Shared CSS design system (all pages)
  main.js           → Shared JS (cursor, animations, nav, etc.)

AUTH / MEMBER SYSTEM:
  join.html         → Sign-up page with plan selection
  login.html        → Sign-in page (routes to dashboard or admin)
  dashboard.html    → Member portal (subscription, billing, profile)
  admin.html        → Admin panel (manage all members)
  firebase.js       → Auth config + shared helpers

================================================================
USER ROLES EXPLAINED
================================================================

SUPER ADMIN (vineetshah701@gmail.com)
  ✓ Access to full admin panel
  ✓ Can view all member details
  ✓ Can edit any member's subscription (plan, status, renewal)
  ✓ Can add new members manually
  ✓ Can promote members to Admin
  ✓ Can remove Admin privileges from anyone
  ✗ Cannot be removed or demoted by anyone

ADMIN
  ✓ Access to admin panel
  ✓ Can view all members
  ✓ Can edit subscriptions
  ✓ Can add members
  ✗ Cannot add/remove other admins
  ✗ Cannot remove Super Admin

MEMBER
  ✓ Access to personal dashboard
  ✓ Can view own subscription details
  ✓ Can see billing history and renewal dates
  ✓ Can edit own profile
  ✗ No access to admin panel

================================================================
PAGE FLOW
================================================================

  index.html ──────────────────────────────────── Main site
  about.html / programs.html / etc. ──────────── Info pages
       │
       ▼
  join.html ──── New user registers ───────────── Creates account
  login.html ──── Existing user signs in
       │
       ├── If MEMBER ──────────────────────────── dashboard.html
       │     Shows: Plan, renewal date, billing,
       │            days left, features, profile
       │
       └── If ADMIN/SUPERADMIN ─────────────────── admin.html
             Shows: All members, subscriptions,
                    admin management, add member



