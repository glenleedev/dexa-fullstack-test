import { createContext, useContext, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type JwtPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: JwtPayload | null;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({ user: null, token: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = Cookies.get("jwt") || null;
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
