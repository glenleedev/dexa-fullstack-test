import { useState } from "react";
import {
  TextField,
  Button,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (valid) console.log("Login:", { email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
    >
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        error={Boolean(emailError)}
        helperText={emailError}
        variant="outlined"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        error={Boolean(passwordError)}
        helperText={passwordError}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "#7E57C2",
          "&:hover": { backgroundColor: "#673AB7" },
        }}
      >
        Sign In
      </Button>
    </form>
  );
}
