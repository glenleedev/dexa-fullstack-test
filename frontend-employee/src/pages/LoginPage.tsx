import LoginForm from "../components/LoginForm";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            sx={{ mb: 3, color: "#3f3d56" }}
          >
            Employee Login
          </Typography>
          <LoginForm />

        </CardContent>
      </Card>
    </Box>
  );
}
