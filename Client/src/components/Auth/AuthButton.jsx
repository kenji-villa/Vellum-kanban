import React from "react";

const AuthButton = ({
  children,
  type = "button",
  loading,
  variant = "primary",
  onClick,
  disabled,
  className = "",
}) => {
  const styles = {
    primary:
      "bg-[#1e2757] hover:bg-[#151c45] text-white shadow-lg shadow-[#1e2757]/20",
    orange:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    ghost:
      "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default AuthButton;
