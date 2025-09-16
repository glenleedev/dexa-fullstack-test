import { Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import LoginPage from "./pages/LoginPage";
import AttendanceRecordsPage from "./pages/AttendanceRecordsPage";
import EmployeeRecordsPage from "./pages/EmployeeRecordsPage";
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
          path="/app/attendance-records"
          element={
            <ProtectedRoute>
              <AttendanceRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/employee-records"
          element={
            <ProtectedRoute>
              <EmployeeRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/app/attendance-records" : "/login"} replace />}
        />
      </Routes>
    </LocalizationProvider>
  );
}
