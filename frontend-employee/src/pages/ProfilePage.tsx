import Sidebar from "../components/Sidebar";
import { Box, Typography } from "@mui/material";

export default function ProfilePage() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        colors={{
          textColor: "#3f3d56",
          hoverColor: "#F3E8FF",
          activeBg: "#EDE7F6",
          activeColor: "#7E57C2",
        }}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: "240px" },
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Content test
        </Typography>
      </Box>
    </Box>
  );
}
