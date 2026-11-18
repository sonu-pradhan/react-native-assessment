Setup Instructions
1. Prerequisites
Node.js (v18+)

npm or yarn

Expo Go app or Android/iOS emulator (optional for mobile testing)

2. Clone & Install Dependencies
Bash
git clone <YOUR_GITHUB_REPO_URL>
cd ReactNative-Assessment
npm install
3. Configure Environment Variables
Copy .env.example to .env in the project root and populate your Supabase credentials:

Bash
cp .env.example .env
Code snippet
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
EXPO_PUBLIC_ALLOWED_DOMAIN=@hbplus.fit
4. Supabase & Google OAuth Setup
In Google Cloud Console, create an OAuth 2.0 Web Client ID with the authorized redirect URI:https://<your-project-ref>.supabase.co/auth/v1/callback

In Supabase → Authentication → Providers → Google, enable Google Sign-In and paste your Client ID and Client Secret.

In Supabase → Authentication → URL Configuration, add your site URL and redirect URLs (http://localhost:8081/**, https://<your-netlify-site>.netlify.app/**, and reactnativeassessment://**).

In Supabase → SQL Editor, execute supabase/domain_restriction_hook.sql and register restrict_domain_hook under Authentication → Hooks → Before User Created.

5. Run Locally
Bash
# Start development server
npx expo start

# Press 'w' for Web, 'a' for Android Emulator, or 'i' for iOS Simulator
Authentication Flow
Login Initiation: On /login, the user clicks Continue with Google, triggering signInWithGoogle() in AuthContext.

Platform-Aware OAuth:

Web: Redirects to Google OAuth via supabase.auth.signInWithOAuth with hd: 'hbplus.fit' and prompt: 'select_account'.

Mobile (Android/iOS): Opens an in-app auth browser session via expo-web-browser and exchanges the callback URL tokens into a persisted Supabase session.

Verification & Session Handling: Once Google returns the user's identity, both the server-side Auth Hook and client-side AuthContext validate the email domain.

Route Protection: RouteGuard in src/app/_layout.tsx monitors authentication state and blocks unauthenticated users from accessing /dashboard directly via URL.

Logout: Clicking Log out calls supabase.auth.signOut(), clears local session tokens, and redirects to /login.

How Domain Restriction Works (Dual-Layer Enforcement)
Domain restriction is enforced at both the backend and frontend layers so it cannot be bypassed via direct API calls (e.g., Postman) or browser navigation:

Server-Side Enforcement (Postgres Before User Created Auth Hook):

Before Supabase creates a user record or issues a JWT access token, public.restrict_domain_hook inspects event->'user'->>'email'.

If the email does not end with @hbplus.fit, Postgres rejects the request with HTTP 403 and the message "Access restricted. Please login using your official domain email."—preventing unauthorized accounts from ever obtaining a valid token.

Client-Side Guard (AuthContext.tsx & _layout.tsx):

Parses any OAuth error returned in the redirect URL and displays the restriction notice on the Login screen.

Verifies email.endsWith('@hbplus.fit') on every session state change, immediately signing out non-compliant sessions and preventing unauthorized access to /dashboard.