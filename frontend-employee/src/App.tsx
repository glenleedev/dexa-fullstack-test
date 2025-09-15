import { Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AttendancePage from "./pages/AttendancePage";
import AttendanceSummaryPage from "./pages/AttendanceSummaryPage";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function ProtectedRoute({ children }: { children: any }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token } = useAuth();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/app/attendance" replace /> : <LoginPage />}
        />
        <Route
          path="/app/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/attendance-summary"
          element={
            <ProtectedRoute>
              <AttendanceSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/app/attendance" : "/login"} replace />}
        />
      </Routes>
    </LocalizationProvider>
  );
}
