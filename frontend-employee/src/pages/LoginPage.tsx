import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CardContent, Typography, Box } from "@mui/material";
import CustomCard from "../components/CustomCard";
import LoginForm from "../components/LoginForm";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_APIURL}/auth/login`, data);
      if (res.data.access_token) {
        Cookies.set("jwt", res.data.access_token);
        window.location.href = "/app/attendance";
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Login Failed", text: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CustomCard sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            sx={{ mb: 3, color: "#3f3d56" }}
          >
            Employee Login
          </Typography>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </CardContent>
      </CustomCard>
    </Box>
  );
}
