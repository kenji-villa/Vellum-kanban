import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import AuthButton from "../components/Auth/AuthButton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { signup, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords don't match";
    if (!agree) errs.agree = "You must accept the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const session = await signup({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      toast.success(`Welcome to Vellum, ${session.name}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrors({ general: err.message });
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your work in seconds. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
            {errors.general}
          </div>
        )}

        <AuthInput
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          error={errors.name}
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          }
        />

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="myemail@gmail.com"
          error={errors.email}
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
          placeholder="At least 6 characters"
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

        <AuthInput
          label="Confirm password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          placeholder="Repeat your password"
          error={errors.confirm}
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded mt-0.5"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-orange-500 hover:underline font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-orange-500 hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-500 mt-1">{errors.agree}</p>
          )}
        </div>

        <AuthButton type="submit" variant="orange" loading={loading}>
          Create Account
        </AuthButton>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-900 dark:text-gray-100 hover:text-orange-500 underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
