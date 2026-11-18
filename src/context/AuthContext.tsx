import { Session } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const ALLOWED_DOMAIN = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || "@hbplus.fit";
const DOMAIN_ERROR =
  "Access restricted. Please login using your official domain email.";

export interface AppUser {
  name: string;
  email: string;
  organization: string;
  status: string;
}

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processSession = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    const email = (currentSession.user.email || "").toLowerCase();

    if (!email.endsWith(ALLOWED_DOMAIN.toLowerCase())) {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setError(DOMAIN_ERROR);
      setLoading(false);
      return;
    }

    const rawName =
      currentSession.user.user_metadata?.full_name ||
      email.split("@")[0].replace(/[._]/g, " ");

    const formattedName = rawName
      .split(" ")
      .filter(Boolean)
      .map((part: string) => part[0].toUpperCase() + part.slice(1))
      .join(" ");

    setError(null);
    setSession(currentSession);
    setUser({
      name: formattedName,
      email,
      organization: "HB+",
      status: "Active",
    });
    setLoading(false);
  };

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const params = new URLSearchParams(
        window.location.hash.substring(1) || window.location.search
      );
      const errDesc = params.get("error_description");
      if (errDesc) {
        setError(
          errDesc.includes("Access restricted")
            ? DOMAIN_ERROR
            : decodeURIComponent(errDesc)
        );
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => processSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setTimeout(() => processSession(newSession), 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === "web") {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/login`,
            queryParams: {
              hd: ALLOWED_DOMAIN.replace("@", ""),
              prompt: "select_account",
            },
          },
        });
        if (oauthError) throw oauthError;
      } else {
        const redirectTo = AuthSession.makeRedirectUri({
          scheme: "reactnativeassessment",
          path: "login",
        });

        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            skipBrowserRedirect: true,
            queryParams: {
              hd: ALLOWED_DOMAIN.replace("@", ""),
              prompt: "select_account",
            },
          },
        });
        if (oauthError) throw oauthError;

        if (data?.url) {
          const res = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo
          );
          if (res.type === "success" && res.url) {
            const parsed = new URL(res.url.replace("#", "?"));
            const access_token = parsed.searchParams.get("access_token");
            const refresh_token = parsed.searchParams.get("refresh_token");
            const errDesc = parsed.searchParams.get("error_description");

            if (errDesc) {
              setError(
                errDesc.includes("Access restricted") ? DOMAIN_ERROR : errDesc
              );
            } else if (access_token && refresh_token) {
              await supabase.auth.setSession({ access_token, refresh_token });
            }
          }
        }
      }
    } catch (e: any) {
      setError(e.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, error, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);