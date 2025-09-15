import LoginForm from "../components/LoginForm";
import {
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import CustomCard from "../components/CustomCard";

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
          <LoginForm />

        </CardContent>
      </CustomCard>
    </Box>
  );
}
