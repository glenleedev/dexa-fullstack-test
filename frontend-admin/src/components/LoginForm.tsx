import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type Props = {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
};

export default function LoginForm({ onSubmit, loading }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "#7E57C2",
          "&:hover": { backgroundColor: "#673AB7" },
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
}
