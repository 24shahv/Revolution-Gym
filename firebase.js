// ================================================================
// REVOLUTION GYM — firebase.js  (LIVE MODE)
// ================================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBNqu6tv2pqmcKd7KymMZIAefu5pzV1pW8",
  authDomain:        "revolution-gym-ebd77.firebaseapp.com",
  projectId:         "revolution-gym-ebd77",
  storageBucket:     "revolution-gym-ebd77.firebasestorage.app",
  messagingSenderId: "98636174201",
  appId:             "1:98636174201:web:12726e85a70bb5f206d5a8"
};

const SUPER_ADMIN_EMAIL = "vineetshah701@gmail.com";

const PLANS = {
  ignite:     { name:"Ignite",     price:1499, features:["Full gym floor access (5AM-11PM)","Group classes (2/week)","Locker room & shower","Fitness assessment","App access"] },
  fury:       { name:"Fury",       price:2499, features:["Everything in Ignite","Unlimited group classes","1 PT session/month","Nutrition consult (quarterly)","24/7 gym access","Priority booking","Dedicated locker"] },
  revolution: { name:"Revolution", price:4499, features:["Everything in Fury","4 PT sessions/month","Custom meal plan","Monthly body scan","Recovery suite","VIP priority","2 guest passes/month","Direct WhatsApp coach"] }
};

// ── INIT ──────────────────────────────────────────────────────────
let _fb = null;
async function initFirebase() {
  if (_fb) return _fb;
  // Wait for SDK
  await new Promise(resolve => {
    if (typeof firebase !== 'undefined') { resolve(); return; }
    const t = setInterval(() => { if (typeof firebase !== 'undefined') { clearInterval(t); resolve(); } }, 50);
  });
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  _fb = { auth: firebase.auth(), db: firebase.firestore() };
  return _fb;
}

// ── SIGN UP ───────────────────────────────────────────────────────
async function signUp(email, password, name, phone, plan) {
  const { auth, db } = await initFirebase();
  const cred   = await auth.createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName: name });
  const now    = new Date();
  const renews = new Date(now); renews.setMonth(renews.getMonth() + 1);
  await db.collection('members').doc(cred.user.uid).set({
    uid: cred.user.uid, name,
    email: email.toLowerCase(), phone, plan,
    status: 'active',
    role: email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? 'superadmin' : 'member',
    joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
    renewsAt: firebase.firestore.Timestamp.fromDate(renews),
    billingHistory: [], notes: ''
  });
  return cred.user;
}

// ── SIGN IN ───────────────────────────────────────────────────────
async function signIn(email, password) {
  const { auth } = await initFirebase();
  const cred = await auth.signInWithEmailAndPassword(email, password);
  return cred.user;
}

// ── SIGN OUT ──────────────────────────────────────────────────────
async function doSignOut() {
  const { auth } = await initFirebase();
  await auth.signOut();
  localStorage.removeItem('rg_cache');
}

// ── GET MEMBER ────────────────────────────────────────────────────
async function getMember(uid) {
  const { db } = await initFirebase();
  const snap = await db.collection('members').doc(uid).get();
  if (!snap.exists) return null;
  const data = { id: snap.id, ...snap.data() };
  // Safely convert Firestore Timestamps to ISO strings
  try { if (data.joinedAt?.toDate) data.joinedAt = data.joinedAt.toDate().toISOString(); } catch(e) { data.joinedAt = new Date().toISOString(); }
  try { if (data.renewsAt?.toDate) data.renewsAt = data.renewsAt.toDate().toISOString(); } catch(e) {}
  try { localStorage.setItem('rg_cache', JSON.stringify(data)); } catch(e){}
  return data;
}

async function getMemberCached(uid) {
  try {
    const c = JSON.parse(localStorage.getItem('rg_cache') || 'null');
    if (c && c.uid === uid) { getMember(uid).catch(()=>{}); return c; }
  } catch(e) {}
  return getMember(uid);
}

// ── GET ALL MEMBERS ───────────────────────────────────────────────
async function getAllMembers() {
  const { db } = await initFirebase();
  // No orderBy here — avoids needing a Firestore composite index
  // We sort client-side instead
  const snap = await db.collection('members').get();
  const docs = snap.docs.map(d => {
    const data = { id: d.id, ...d.data() };
    if (data.joinedAt?.toDate) data.joinedAt = data.joinedAt.toDate().toISOString();
    if (data.renewsAt?.toDate) data.renewsAt = data.renewsAt.toDate().toISOString();
    return data;
  });
  // Sort newest first client-side
  docs.sort((a,b) => new Date(b.joinedAt||0) - new Date(a.joinedAt||0));
  return docs;
}

// ── UPDATE MEMBER ─────────────────────────────────────────────────
async function updateMember(uid, data) {
  const { db } = await initFirebase();
  const update = { ...data };
  // Convert ISO strings back to Firestore Timestamps where needed
  if (update.renewsAt && typeof update.renewsAt === 'string') {
    update.renewsAt = firebase.firestore.Timestamp.fromDate(new Date(update.renewsAt));
  }
  if (update.joinedAt && typeof update.joinedAt === 'string') {
    update.joinedAt = firebase.firestore.Timestamp.fromDate(new Date(update.joinedAt));
  }
  await db.collection('members').doc(uid).update(update);
  localStorage.removeItem('rg_cache');
}

async function deleteMemberDoc(uid) {
  const { db } = await initFirebase();
  await db.collection('members').doc(uid).delete();
}

// ── ROLE CHECKS ───────────────────────────────────────────────────
async function isAdminUser(uid) {
  const m = await getMember(uid);
  return m && (m.role === 'admin' || m.role === 'superadmin');
}

// ── GET CURRENT FIREBASE USER ─────────────────────────────────────
async function getCurrentUser() {
  const { auth } = await initFirebase();
  return new Promise(resolve => {
    const u = auth.onAuthStateChanged(user => { u(); resolve(user); });
  });
}

// ── AUTH GUARD ────────────────────────────────────────────────────
async function requireAuth(redirectTo = 'login.html') {
  const user = await getCurrentUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

// ── FORMAT HELPERS ────────────────────────────────────────────────
function fmtDate(ts) {
  if (!ts) return '—';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function daysUntil(ts) {
  if (!ts) return null;
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return Math.ceil((d - new Date()) / 86400000);
}
