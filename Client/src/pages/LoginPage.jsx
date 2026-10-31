import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, googleLogin, authLoading } = useAuth();
  const googleButtonRef = useRef(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current)
        return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: Math.min(googleButtonRef.current.offsetWidth || 350, 400),
        text: "signin_with",
      });
    };

    if (window.google?.accounts?.id) {
      init();
      return () => {
        cancelled = true;
      };
    }

    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", init);

    return () => {
      cancelled = true;
      script.removeEventListener("load", init);
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success("Signed in with Google");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrors({ general: err.message });
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
            {errors.general}
          </div>
        )}

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="myemail@gmail.com"
          error={errors.email}
          autoFocus
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          }
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          }
        />

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={() => toast.info("Password reset coming soon")}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-orange-500"
          >
            Forgot password?
          </button>
        </div>

        <AuthButton type="submit" loading={authLoading}>
          Sign In
        </AuthButton>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-[11px] text-gray-400 uppercase tracking-wide">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Google Button Container */}
        <div ref={googleButtonRef} className="w-full flex justify-center" />

        {/* Signup link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-gray-900 dark:text-gray-100 hover:text-orange-500 underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
