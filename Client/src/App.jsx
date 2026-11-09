import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Settings from "./pages/Settings";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TeamPage from "./pages/TeamPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsRedirect from "./pages/ProjectsRedirect";
import { NotificationProvider } from "./context/NotificationContext";
import RealtimeSync from "./components/RealtimeSync";
import GlobalShortcuts from "./components/GlobalShortcuts";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <BoardProvider>
            <NotificationProvider>
              <RealtimeSync />
              <Router>
                <GlobalShortcuts />
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Protected */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute>
                        <ProjectsRedirect />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/board/:boardId"
                    element={
                      <ProtectedRoute>
                        <BoardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <CalendarPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <ProtectedRoute>
                        <TeamPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </NotificationProvider>
          </BoardProvider>
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
