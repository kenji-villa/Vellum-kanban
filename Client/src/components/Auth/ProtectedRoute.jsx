import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While we're checking the stored token, show nothing (or a splash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] dark:bg-[#0f172a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e2757] flex items-center justify-center animate-pulse">
            <span className="text-white font-bold">V</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
