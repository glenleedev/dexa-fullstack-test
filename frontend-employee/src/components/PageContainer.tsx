import { Box } from "@mui/material";

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ml: { md: "240px" },
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 4,
        pt: { xs: 11, md: 4 },
      }}
    >
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
}
