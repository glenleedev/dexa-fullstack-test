import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type Props = {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
};

export default function LoginForm({ onSubmit, loading }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) return;
    onSubmit({ email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => {
          const v = e.target.value;
          setEmail(v);
          if (!v.trim()) setEmailError("Email is required");
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setEmailError("Enter a valid email");
          else setEmailError(undefined);
        }}
        fullWidth
        error={Boolean(emailError)}
        helperText={emailError}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          const v = e.target.value;
          setPassword(v);
          if (v.trim()) setPasswordError(undefined);
          else setPasswordError("Password is required");
        }}
        fullWidth
        error={Boolean(passwordError)}
        helperText={passwordError}
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
