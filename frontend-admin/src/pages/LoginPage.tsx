import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CardContent, Typography, Box } from "@mui/material";
import CustomCard from "../components/CustomCard";
import LoginForm from "../components/LoginForm";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_APIURL}/auth/login`, data);
      if (res.data.access_token) {
        //only admin is allowed to login to admin app
         const payload: any = jwtDecode(res.data.access_token);
        if (payload.roleId !== 1) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Your account is not authorized",
          });
          return;
        }
        Cookies.set("jwt_admin", res.data.access_token);
        window.location.href = "/app/attendance-records";
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
            Admin Login
          </Typography>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </CardContent>
      </CustomCard>
    </Box>
  );
}
