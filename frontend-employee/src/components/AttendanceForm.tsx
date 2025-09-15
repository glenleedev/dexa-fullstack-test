import { useEffect, useState } from "react";
import { Box, Typography, Card, Grid, Button } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import moment from "moment";

type Props = {
  checkIn?: string;
  checkOut?: string;
  loading?: boolean;
  onSubmit: () => void;
};

export default function AttendanceForm({ checkIn, checkOut, loading, onSubmit }: Props) {
  const hasCheckIn = Boolean(checkIn);
  const hasCheckOut = Boolean(checkOut);

  const [time, setTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
      <Typography variant="h6" fontWeight="bold">
        {moment().format("dddd, DD MMMM YYYY")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: -2.5 }}>
        {time}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Card
          sx={{
            minWidth: 220,
            p: 2,
            textAlign: "center",
            bgcolor: hasCheckIn ? "#E8F5E9" : "#F5F5F5",
            borderRadius: 4,
            boxShadow: 1,
            border: hasCheckIn ? "1px solid #81C784" : "1px dashed #ccc",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            mb={1}
            color={hasCheckIn ? "#2E7D32" : "text.primary"}
          >
            Check In
          </Typography>
          {hasCheckIn ? (
            <TaskAltIcon sx={{ color: "#2E7D32", fontSize: 28 }} />
          ) : (
            <Typography color="text.secondary">Not yet</Typography>
          )}
        </Card>

        <Card
          sx={{
            minWidth: 220,
            p: 2,
            textAlign: "center",
            bgcolor: hasCheckOut ? "#E8F5E9" : "#F5F5F5",
            borderRadius: 4,
            boxShadow: 1,
            border: hasCheckOut ? "1px solid #81C784" : "1px dashed #ccc",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            mb={1}
            color={hasCheckOut ? "#2E7D32" : "text.primary"}
          >
            Check Out
          </Typography>
          {hasCheckOut ? (
            <TaskAltIcon sx={{ color: "#2E7D32", fontSize: 28 }} />
          ) : (
            <Typography color="text.secondary">Not yet</Typography>
          )}
        </Card>
      </Grid>

      <Button
        variant="contained"
        disabled={loading}
        onClick={onSubmit}
        sx={{
          width: "100%",
          maxWidth: { md: 520 },
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "#7E57C2",
          "&:hover": { backgroundColor: "#673AB7" },
        }}
      >
        {hasCheckIn ? "Check Out" : "Check In"}
      </Button>
    </Box>
  );
}
