import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
