import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import { useTheme } from "../../../app/theme.context";
import { ThemeToggle } from "../../../app/components/ThemeToggle";
import { UniversalLoader } from "../../../app/components/UniversalLoader";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const { handleRegister } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  if (authLoading) {
    return <UniversalLoader text="Perplexity" />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const submitForm = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await handleRegister({ username, email, password });
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.err ||
        err?.response?.data?.message ||
        "Registration failed. Please check your details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    navigate("/login");
  };

  return (
    <>
      {/* Verification Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-md rounded-2xl p-8 shadow-2xl text-center border transition-colors duration-200 ${
              isDark
                ? "border-[#404040] bg-[#1d1d1b] text-white"
                : "border-[#d6d6d6] bg-white text-[#000000]"
            }`}
          >
            <div
              className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                isDark
                  ? "border-[#404040] bg-[#000000] text-white"
                  : "border-[#d6d6d6] bg-[#d6d6d6]/30 text-black"
              }`}
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              className={`mb-2 text-2xl font-bold ${
                isDark ? "text-white" : "text-[#000000]"
              }`}
            >
              Verify your email
            </h2>
            <p
              className={`mb-6 text-sm leading-relaxed ${
                isDark ? "text-[#a9a9a9]" : "text-[#404040]"
              }`}
            >
              A verification link has been dispatched to{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-[#000000]"
                }`}
              >
                {email}
              </span>
              . Please verify your account to unlock full access.
            </p>
            <button
              type="button"
              onClick={handleCloseSuccess}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition active:scale-[0.98] shadow-md ${
                isDark
                  ? "bg-white text-black hover:bg-[#d6d6d6]"
                  : "bg-black text-white hover:bg-[#404040]"
              }`}
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

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
              Create an account
            </h1>
            <p
              className={`mt-2 text-sm ${
                isDark ? "text-[#a9a9a9]" : "text-[#404040]"
              }`}
            >
              Join Perplexity to explore intelligent answers and internet search
            </p>
          </div>

          {/* Registration Glass Card */}
          <div
            className={`rounded-2xl p-8 shadow-xl transition-colors duration-200 border ${
              isDark
                ? "border-[#404040] bg-[#1d1d1b]"
                : "border-[#d6d6d6] bg-white shadow-sm"
            }`}
          >
            {error && (
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
                    Registration notice
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${
                      isDark ? "text-[#a9a9a9]" : "text-[#404040]"
                    }`}
                  >
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className={`transition ${
                    isDark
                      ? "text-[#a9a9a9] hover:text-white"
                      : "text-[#757575] hover:text-black"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"
                  }`}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="johndoe"
                  required
                  autoComplete="username"
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

              <div>
                <label
                  htmlFor="email"
                  className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"
                  }`}
                >
                  Email Address
                </label>
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

              <div>
                <label
                  htmlFor="password"
                  className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    required
                    autoComplete="new-password"
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
                disabled={loading}
                className={`group relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                  isDark
                    ? "bg-white text-black hover:bg-[#d6d6d6]"
                    : "bg-black text-white hover:bg-[#404040]"
                }`}
              >
                {loading ? (
                  <>
                    <div
                      className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                        isDark ? "border-black" : "border-white"
                      }`}
                    ></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-semibold underline-offset-4 hover:underline transition ${
                    isDark
                      ? "text-white hover:text-[#d6d6d6]"
                      : "text-[#000000] hover:text-[#404040]"
                  }`}
                >
                  Sign in
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
    </>
  );
};

export default Register;
