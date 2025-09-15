import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="/app/attendance" element={<AttendancePage />} />
    </Routes>
  );
}
