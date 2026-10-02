import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import Settings from "./pages/Settings";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <BoardProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </BoardProvider>
  );
}

export default App;
