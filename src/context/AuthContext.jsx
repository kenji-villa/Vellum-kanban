import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const SESSION_KEY = "vellum_session_v1";
const USERS_KEY = "vellum_users_v1"; // local "user database" (not secure, dev only)

// -----------------------------------------------------------
// ⚠️ MOCK BACKEND — replace these with real API calls later
// -----------------------------------------------------------
const mockSignup = async ({ name, email, password }) => {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 500));

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }

  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    // ⚠️ Never store plaintext passwords in real apps!
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const session = { id: user.id, name: user.name, email: user.email };
  return session;
};

const mockLogin = async ({ email, password }) => {
  await new Promise((r) => setTimeout(r, 500));

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return { id: user.id, name: user.name, email: user.email };
};
// -----------------------------------------------------------

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const session = await mockLogin(credentials);
      setUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const session = await mockSignup(payload);
      setUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
