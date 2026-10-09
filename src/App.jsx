import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Settings from "./pages/Settings";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <BoardProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 font-sans">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/board/:boardId" element={<BoardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </Router>
        </BoardProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;
