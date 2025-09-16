import { Box } from "@mui/material";

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: 2, md: 4 },
        pt: { xs: 11, md: 4 },
        pb: 6,
        boxSizing: "border-box",
        width: { xs: "100%", md: "calc(100% - 240px)" },
        ml: { md: "240px" }
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200 }}>{children}</Box>
    </Box>
  );
}
