import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useTheme } from "../../../app/theme.context";
import { ThemeToggle } from "../../../app/components/ThemeToggle";
import { UniversalLoader } from "../../../app/components/UniversalLoader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const { isDark } = useTheme();

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <UniversalLoader text="Perplexity" />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-200 overflow-hidden ${
        isDark ? "bg-[#000000] text-white" : "bg-white text-[#000000]"
      }`}
    >
      {/* Floating Theme Toggle in Top Right */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src="/perplexity-icon.png"
            alt="Perplexity Logo"
            className={`w-12 h-12 mx-auto mb-4 object-contain transition-all duration-200 ${
              isDark ? "filter invert opacity-95" : "filter-none opacity-90"
            }`}
          />
          <h1
            className={`text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-[#000000]"
            }`}
          >
            Welcome to Perplexity
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#a9a9a9]" : "text-[#404040]"
            }`}
          >
            Sign in to access conversational search and AI research
          </p>
        </div>

        {/* Login Glass Card */}
        <div
          className={`rounded-2xl p-8 shadow-xl transition-colors duration-200 border ${
            isDark
              ? "border-[#404040] bg-[#1d1d1b]"
              : "border-[#d6d6d6] bg-white shadow-sm"
          }`}
        >
          {errorMessage && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm animate-fade-in ${
                isDark
                  ? "border-[#404040] bg-[#000000] text-[#d6d6d6]"
                  : "border-[#d6d6d6] bg-[#d6d6d6]/20 text-[#000000]"
              }`}
            >
              <svg
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isDark ? "text-[#a9a9a9]" : "text-[#757575]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-[#000000]"
                  }`}
                >
                  Authentication notice
                </p>
                <p
                  className={`mt-0.5 text-xs ${
                    isDark ? "text-[#a9a9a9]" : "text-[#404040]"
                  }`}
                >
                  {errorMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className={`transition ${
                  isDark
                    ? "text-[#a9a9a9] hover:text-white"
                    : "text-[#757575] hover:text-black"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition duration-200 ${
                    isDark
                      ? "border-[#404040] bg-[#000000] text-white placeholder-[#757575] focus:border-white"
                      : "border-[#d6d6d6] bg-white text-[#000000] placeholder-[#808081] focus:border-black"
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"
                  }`}
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition duration-200 ${
                    isDark
                      ? "border-[#404040] bg-[#000000] text-white placeholder-[#757575] focus:border-white"
                      : "border-[#d6d6d6] bg-white text-[#000000] placeholder-[#808081] focus:border-black"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition ${
                    isDark
                      ? "text-[#a9a9a9] hover:text-white"
                      : "text-[#757575] hover:text-black"
                  }`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                isDark
                  ? "bg-white text-black hover:bg-[#d6d6d6]"
                  : "bg-black text-white hover:bg-[#404040]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div
                    className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                      isDark ? "border-black" : "border-white"
                    }`}
                  ></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div
            className={`mt-8 border-t pt-6 text-center ${
              isDark ? "border-[#404040]" : "border-[#d6d6d6]"
            }`}
          >
            <p
              className={`text-sm ${
                isDark ? "text-[#a9a9a9]" : "text-[#404040]"
              }`}
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className={`font-semibold underline-offset-4 hover:underline transition ${
                  isDark
                    ? "text-white hover:text-[#d6d6d6]"
                    : "text-[#000000] hover:text-[#404040]"
                }`}
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className={`mt-8 text-center text-xs font-mono ${
            isDark ? "text-[#757575]" : "text-[#757575]"
          }`}
        >
          Perplexity AI &copy; {new Date().getFullYear()} &bull; Professional Edition
        </p>
      </div>
    </section>
  );
};

export default Login;
