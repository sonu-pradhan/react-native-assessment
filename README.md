# HB+ Member Portal — Cross-Platform Domain-Restricted Authentication

A cross-platform authentication application built with **React Native (Expo + React Native for Web)** and **Supabase Auth**. The application implements **Google OAuth 2.0** login across Web, Android, and iOS from a single codebase and enforces strict organization domain access control (`@hbplus.fit`) at both the backend and frontend layers.

## Live Deployment & Repository
- **Live Web Application (Netlify):** https://radiant-ganache.netlify.app
- **GitHub Repository:** https://github.com/sonu-pradhan/react-native-assessment

---

## Key Features
- **Cross-Platform Single Codebase:** Runs identically on Web browsers and Android/iOS emulators using Expo Router and React Native for Web.
- **Google OAuth 2.0 Sign-In:** Seamless browser-based OAuth flow on Web and in-app `WebBrowser` deep-link session flow on Mobile.
- **Dual-Layer Domain Validation (`@hbplus.fit`):**
  - Enforced server-side via a **Supabase Postgres `Before User Created` Auth Hook** (prevents unauthorized user creation or JWT issuance even via direct API calls).
  - Enforced client-side inside `AuthContext` with immediate session termination and clear error messaging (`"Access restricted. Please login using your official domain email."`).
- **Protected Routes:** `RouteGuard` in `_layout.tsx` prevents unauthenticated direct URL navigation to `/dashboard` and automatically routes active sessions.
- **Session Persistence & Logout:** Persists sessions securely (`localStorage` on Web, `AsyncStorage` on Mobile) with full token cleanup on logout.

---

## Tech Stack
- **Frontend:** React Native, Expo SDK, Expo Router, TypeScript
- **Authentication & Backend Security:** Supabase Auth, Google OAuth 2.0, PostgreSQL Auth Hooks
- **Storage & Session Management:** `@react-native-async-storage/async-storage`, `expo-auth-session`, `expo-web-browser`
- **Deployment:** Netlify (Single-Page Application bundle via `expo export --platform web`)

---

## Project Structure

```text
ReactNative-Assessment/
├── .env.example                      # Environment variable template
├── app.json                          # Expo configuration & custom URL scheme
├── netlify.toml                      # Netlify build & SPA redirect configuration
├── supabase/
│   └── domain_restriction_hook.sql   # Server-side Postgres Auth Hook for domain enforcement
└── src/
    ├── app/
    │   ├── _layout.tsx               # AuthProvider wrapper & RouteGuard protection
    │   ├── index.tsx                 # Root entry redirect to /login
    │   ├── login.tsx                 # Google OAuth login screen & error feedback UI
    │   └── dashboard.tsx             # Protected HB+ Member Dashboard & logout
    ├── constants/
    │   └── theme.ts                  # Centralized color palette & spacing tokens
    ├── context/
    │   └── AuthContext.tsx           # Auth state, platform OAuth handlers, & domain validation
    └── lib/
        └── supabase.ts               # Cross-platform Supabase client configuration
```

---

## Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm**
- **Expo Go** or an **Android Studio / Xcode emulator** (for mobile testing)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/sonu-pradhan/react-native-assessment.git
cd react-native-assessment
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
EXPO_PUBLIC_ALLOWED_DOMAIN=@hbplus.fit
```

### 4. Supabase & Google OAuth Configuration
1. **Google Cloud Console:**
   - Create an OAuth 2.0 Web Client ID and add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.
2. **Supabase Auth Provider:**
   - Enable **Google** under **Authentication → Providers** and enter the Google Client ID and Client Secret.
3. **Supabase URL Configuration:**
   - Set **Site URL** to `https://radiant-ganache.netlify.app` (or `http://localhost:8081` for local dev).
   - Add redirect URLs: `https://radiant-ganache.netlify.app/login`, `http://localhost:8081/**`, and `reactnativeassessment://**`.
4. **Server-Side Domain Hook:**
   - Run `supabase/domain_restriction_hook.sql` in the **Supabase SQL Editor** and attach `public.restrict_domain_hook` under **Authentication → Hooks → Before User Created**.

### 5. Run Locally
```bash
npx expo start --clear
```
- Press **`w`** to launch in the Web browser (`http://localhost:8081`).
- Press **`a`** to launch on an Android Emulator.
- Press **`i`** to launch on an iOS Simulator.

---

## Authentication Flow

1. **Unauthenticated Entry:** Users visiting the app or attempting to navigate directly to `/dashboard` are intercepted by `RouteGuard` (`src/app/_layout.tsx`) and redirected to `/login`.
2. **OAuth Initiation:** Clicking **Continue with Google** invokes `signInWithGoogle()` in `AuthContext.tsx`, setting a loading indicator and launching Google OAuth with `hd: 'hbplus.fit'` and `prompt: 'select_account'`.
3. **Platform Callback:**
   - **Web:** Redirects back to `/login` with session parameters in the URL.
   - **Mobile:** Captures the callback via `WebBrowser.openAuthSessionAsync` using the `reactnativeassessment://` scheme and initializes the session via `supabase.auth.setSession()`.
4. **Validation & Dashboard Access:**
   - If the email ends with `@hbplus.fit`, the user profile is loaded and `RouteGuard` transitions to `/dashboard`.
   - If the email belongs to any other domain (e.g., `@gmail.com`), access is denied and the error banner is displayed on `/login`.
5. **Logout:** Clicking **Log out** calls `supabase.auth.signOut()`, clears persisted tokens, resets context state, and returns the user to `/login`.

---

## How Domain Restriction Works

To prevent client-side tampering or direct API bypasses, domain validation is enforced across **two independent layers**:

### 1. Backend Enforcement (Supabase Postgres Auth Hook)
- Before Supabase Auth writes a user record to `auth.users` or mints a JWT token, PostgreSQL executes `public.restrict_domain_hook(event jsonb)`.
- The function extracts `lower(event->'user'->>'email')` and verifies `user_email like '%@hbplus.fit'`.
- Any non-matching domain immediately returns an HTTP `403` error payload (`"Access restricted. Please login using your official domain email."`), blocking token generation at the server boundary.

### 2. Frontend Enforcement (`AuthContext.tsx` & `RouteGuard`)
- On redirect or auth state change, `AuthContext` inspects both URL `error_description` parameters and `session.user.email`.
- Any session whose email does not end with `EXPO_PUBLIC_ALLOWED_DOMAIN` (`@hbplus.fit`) immediately triggers `supabase.auth.signOut()`, clears local state, and surfaces the restriction alert on the login card.
- `RouteGuard` continuously verifies `session !== null` before rendering `/dashboard`, ensuring zero unauthorized access via direct URL entry.
