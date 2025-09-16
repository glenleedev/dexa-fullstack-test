import { Card } from "@mui/material";

export default function CustomCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Card sx={{ p: 5, borderRadius: 4, boxShadow: "0px 8px 24px rgba(0,0,0,0.05)", ...sx }}>
      {children}
    </Card>
  );
}
