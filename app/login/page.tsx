"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { KeyRound, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Check if already logged in, redirect to home if so
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
    }
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (useMagicLink) {
        // Passwordless Email Link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (error) throw error;
        setMessage({
          text: "Check your email for the magic sign-in link!",
          type: "success",
        });
      } else if (isSignUp) {
        // Email/Password Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({
          text: "Registration successful! If email verification is enabled, check your email, otherwise you can now log in.",
          type: "success",
        });
      } else {
        // Email/Password Log In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({
          text: "Logged in successfully!",
          type: "success",
        });
        router.refresh();
        router.push("/");
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An authentication error occurred. Please try again.";
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isSignUp
              ? "Gain access to cloud saving and syncing across devices"
              : "Access your cloud tools & saved estimates"}
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border text-sm leading-relaxed ${
              message.type === "success"
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {!useMagicLink && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                {useMagicLink ? "Use email & password instead" : "Sign in with passwordless Magic Link"}
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? "Register" : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setUseMagicLink(false);
              setMessage(null);
            }}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Register"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Accounts are free. All operations data is fully secure.</span>
        </div>
      </div>
    </div>
  );
}
