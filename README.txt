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
HOW TO USE — 3 OPTIONS
================================================================

────────────────────────────────────────────────────
OPTION A: QUICK LOCAL PREVIEW (Zero setup, instant)
────────────────────────────────────────────────────
1. Unzip this folder anywhere on your computer
2. Double-click index.html to open in Chrome/Edge/Firefox
3. Click "Join Now" to register, "Login" to sign in
4. All data saved in your browser (localStorage)
   — works completely offline, no internet needed for the demo

Demo Login Credentials:
  Super Admin → vineetshah701@gmail.com / admin123
  Demo Member → rahul.mankar0@demo.com  / demo123

NOTE: In this mode, data is stored in the browser only.
      Clearing browser data will reset all members.
      For permanent data across devices, use Option B or C.

────────────────────────────────────────────────────
OPTION B: DEPLOY TO FIREBASE HOSTING (FREE, Recommended)
────────────────────────────────────────────────────
This makes the site live on the internet with real data 
that persists across all devices and users.

STEP 1 — Create Firebase Project
  a. Go to https://console.firebase.google.com
  b. Click "Add project" → name it "revolution-gym"
  c. Disable Google Analytics (optional) → Create project

STEP 2 — Enable Authentication
  a. In Firebase console → Authentication → Get Started
  b. Sign-in method → Email/Password → Enable → Save

STEP 3 — Create Firestore Database
  a. Firestore Database → Create database
  b. Choose "Start in production mode" → Next
  c. Select your region (asia-south1 for India) → Enable
  d. Go to Rules tab → paste this:
     
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /members/{uid} {
           allow read, write: if request.auth != null;
         }
       }
     }
  
  e. Click Publish

STEP 4 — Get Your Firebase Config
  a. Project Settings (gear icon) → General tab
  b. Scroll to "Your apps" → Web → Add app (</> icon)
  c. Register app name "Revolution Gym Web" → Register
  d. Copy the firebaseConfig object shown

STEP 5 — Update firebase.js
  Open firebase.js and replace the FIREBASE_CONFIG section:
  
  const FIREBASE_CONFIG = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
  };

STEP 6 — Install Firebase CLI & Deploy
  a. Install Node.js from https://nodejs.org (if not installed)
  b. Open Terminal / Command Prompt in this folder
  c. Run these commands one by one:
  
     npm install -g firebase-tools
     firebase login
     firebase init hosting
       → Select your project
       → Public directory: . (just a dot)
       → Single page app: No
       → Overwrite index.html: No
     firebase deploy

  d. Firebase gives you a URL like:
     https://revolution-gym.web.app
     Your site is now LIVE!

STEP 7 — Set Super Admin
  After deploying, register with vineetshah701@gmail.com
  The system automatically grants Super Admin role.

────────────────────────────────────────────────────
OPTION C: ANY WEB HOST (cPanel, Hostinger, GoDaddy etc.)
────────────────────────────────────────────────────
If you already have web hosting:

1. Complete Steps 1–5 from Option B (Firebase project + config)
2. Upload ALL files from this folder to your hosting's
   public_html folder via cPanel File Manager or FTP
3. Your site will be live at your domain

Note: Firebase Auth still handles login — you only need
Firebase for authentication, not for hosting.

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

================================================================
CUSTOMISATION QUICK GUIDE
================================================================

Change gym name/location:
  → Edit text in index.html, style.css (.footer-brand etc.)

Change plan prices:
  → Edit PLANS object in firebase.js (line ~20)
  → Also update the displayed prices in membership.html

Change Super Admin email:
  → Edit SUPER_ADMIN_EMAIL in firebase.js (line ~15)

Change colors:
  → Edit CSS variables in style.css (:root section)
  → Main color: --fire: #FF1F00

Add/remove nav links:
  → Edit .nav-links in each HTML file

================================================================
SUPPORT
================================================================
Questions? Contact: revolution@revgym.in
Website: Designed with Revolution Gym identity system

================================================================
