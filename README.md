# PAISAROAM — Big Adventures. Small Budgets.

**India's premier budget travel discovery, smart AI trip planner, group expense splitter, and interactive travel budget calculator.**

---

## 🌟 Overview & Features

1. **Homepage & Brand Identity**:
   - Modern, distinctive Indian travel tech aesthetic.
   - Brand Palette: Deep Forest Green (`#174C3C`), Fresh Green (`#4F8063`), Warm Cream (`#FFF8ED`), Sunset Orange (`#F28C45`), Dark Charcoal (`#202B27`).
   - Dynamic Hero Section with editable headlines, subtitle, and top promotional announcement banner.
   - Quick-Finder Budget Widget, popular Indian destinations, and weekend getaways under ₹3,000.

2. **Explore Destinations**:
   - Real-time catalog of Indian destinations (Jaipur, Udaipur, Goa, Manali, Rishikesh, Hampi, Varanasi, Jaisalmer, Lonavala, Gokarna).
   - Multi-parameter filtering: Budget bracket (<₹3k, ₹3k-₹5k, ₹5k+), Region, Duration, Vibe, and Group Type.
   - Interactive Detail View with itemized cost benchmarks (Sleeper train return, hostel dorm, meals, sight pass) and top budget highlights.

3. **Smart AI Trip Planner (Powered by Gemini)**:
   - Form capturing starting city, destination, duration, travellers, total budget in ₹ INR, travel style, interests, and transport preference.
   - Calls server-side `gemini-3.8-flash` to structure day-by-day itineraries (Morning, Afternoon, Evening) with meal benchmarks and verified Indian money-saving hacks.
   - Intelligent Budget Feasibility verification (alerts if the user's budget is unrealistically low and suggests cheaper nearby alternatives).
   - Fallback engine ensuring complete usability even when offline or awaiting API keys.
   - Save to Firestore and Print/Save PDF capabilities.

4. **Smart Budget Calculator**:
   - Live interactive sliders and numeric inputs across 8 categories: Transport, Accommodation, Food, Local Transport, Activities, Shopping, Other, and Emergency Contingency.
   - Visual allocation distribution bar and instant calculations for Total Cost, Cost Per Person, Daily Rate, and Target Budget Surplus/Deficit.
   - Presets for Student Backpackers, Balanced Groups, and Families.

5. **Group Expense Splitter**:
   - Add group friends by name.
   - Log itemized trip expenses (train tickets, hostel rooms, dhaba dinners) with who paid and who split.
   - Graph-based **Optimal Debt Minimization Algorithm** calculating the fewest possible peer-to-peer UPI payments.
   - One-tap "Share WhatsApp Summary" formatted for WhatsApp friends' group chats.

6. **Trip Comparison**:
   - Side-by-side comparison of 2 or 3 destinations evaluating cost per day, ideal duration, lodging rates, and top sights.

7. **Travel Guides & Blog**:
   - Category-filtered articles ("Trips under ₹2,000", "Indian Railways Frugal Hacks", "College Friends Rishikesh Breakdown").
   - Full article modal with formatted text and cost breakdowns.

8. **Mobile-First Admin Control Dashboard (`/#admin`)**:
   - Private management portal built for phone screens.
   - Add, edit, publish/unpublish, and delete destinations.
   - Update estimated transport, stay, food, and activity prices.
   - Change homepage hero copy, subtitle, banner alerts, and WhatsApp contact link without editing code.
   - Review incoming user trip queries and feedback submissions.
   - One-tap "Sync Sample Data to Cloud Firestore" button.
   - Protected by Firebase Authentication whitelist (`sangeethk467@gmail.com`) and Firestore ABAC rules.

---

## 📁 Project Folder Structure

```
paisaroam/
├── api/
│   └── gemini-service.ts            # Server-side Gemini API client & budget fallback
├── src/
│   ├── components/
│   │   ├── Navbar.tsx               # Responsive header, announcement banner & mobile bottom bar
│   │   ├── Footer.tsx               # Footer with cost disclaimers and admin contacts
│   │   └── DestinationDetailModal.tsx # Itemized cost modal & planning shortcut
│   ├── context/
│   │   └── AppContext.tsx           # Global state, Firestore listeners & auth context
│   ├── data/
│   │   └── seedData.ts              # Authentic Indian budget destinations, packages & guides
│   ├── lib/
│   │   └── firebase.ts              # Firebase app, auth, Firestore connection & error handling
│   ├── pages/
│   │   ├── HomePage.tsx             # Landing page with hero & quick trip finder
│   │   ├── ExplorePage.tsx          # Multi-filter destination catalog
│   │   ├── TripPlannerPage.tsx      # Smart AI day-by-day itinerary planner
│   │   ├── BudgetCalculatorPage.tsx # Interactive mathematical budget calculator
│   │   ├── ExpenseSplitterPage.tsx  # Group expense splitter with debt minimization
│   │   ├── TripComparePage.tsx      # Side-by-side destination comparison
│   │   ├── TravelGuidesPage.tsx     # Budget articles and hacker guides
│   │   ├── AboutContactPage.tsx     # Mission story, feedback form, privacy policy & terms
│   │   └── AdminDashboardPage.tsx   # Mobile-first admin control dashboard
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces and entity types
│   ├── App.tsx                      # App root router
│   ├── index.css                    # Tailwind CSS v4 & theme variables
│   └── main.tsx                     # React 19 entry point
├── firebase-applet-config.json      # Provisioned Firebase project credentials
├── firebase-blueprint.json          # Firestore schema intermediate representation
├── firestore.rules                  # Security rules with ABAC for admin access
├── manifest.webmanifest             # PWA manifest for Android home-screen installation
├── robots.txt & sitemap.xml         # SEO indexing controls
├── server.ts                        # Full-stack Express production server
├── vite.config.ts                   # Vite bundler configuration & API proxy middleware
└── package.json                     # Project dependencies & scripts
```

---

## 🛠️ Installation & Local Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build & Test Production Server
```bash
npm run build
npm start
```

---

## 🔐 Firebase & Administrator Setup

1. **Firebase Project**:
   - The app is connected to Firebase Firestore and Firebase Authentication (`firebase-applet-config.json`).
   - Firestore security rules are deployed in `firestore.rules`.

2. **Admin Email & Owner Configuration**:
   - Website Owner & Founder: **Sangeeth**
   - Administrator Phone / WhatsApp: **`+91 7569283697`**
   - Administrator email: **`sangeethk467@gmail.com`**
   - In the Firebase Console (**Build > Authentication > Sign-in method**), ensure the **Google** provider is enabled.
   - When logging into `https://paisaroam.com/#admin`, sign in with `sangeethk467@gmail.com` to unlock full administrative permissions.

---

## 🤖 Gemini API Setup

- Gemini API calls are handled through server-side endpoints (`/api/gemini/plan-trip`) using `@google/genai` and `gemini-3.8-flash`.
- In Google AI Studio, ensure your `GEMINI_API_KEY` is selected in the **Settings > Secrets** panel.
- If no key is set or network is unavailable, the planner automatically falls back to the smart Indian budget calculation engine without breaking.

---

## 📱 How to Manage PAISAROAM from Your Android Phone

1. Deploy your website and open **`https://paisaroam.com/#admin`** in Chrome on your Android smartphone.
2. Sign in with your Google account (**`sangeethk467@gmail.com`**).
3. Tap Chrome's three dots menu (top-right **⋮**) and select **"Add to Home screen"** or **"Install app"**.
4. A native PAISAROAM app icon will appear on your phone's home screen.
5. Tap it anytime to:
   - Add new destinations and update railway, hotel, or food prices on the fly.
   - Edit the homepage hero headline and activate festival banners (e.g. Holi/Diwali).
   - Review trip queries and messages from visitors.
   - Publish or unpublish travel guides and packages.

---

## 🚀 Firebase Hosting & Custom Domain (`paisaroam.com`)

### Step 1: Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting,firestore:rules
```

### Step 2: Connect Custom Domain `paisaroam.com`
1. Go to **Firebase Console > Hosting > Custom domains**.
2. Click **Add custom domain** and enter `paisaroam.com` (and `www.paisaroam.com`).
3. Add the TXT and A records provided by Firebase to your domain registrar DNS settings (GoDaddy, Namecheap, Cloudflare, or Google Domains).
4. Firebase will automatically issue a free SSL certificate within a few hours.
