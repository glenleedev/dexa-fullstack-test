import { useState, useEffect } from "react";
import { Box, TextField, Button, Avatar, Typography, Stack } from "@mui/material";

type Props = {
  initialPhone: string;
  initialPhoto: string;
  initialEmail: string;
  initialPosition: string;
  initialName: string;
  onSubmit: (data: { phone?: string; password?: string; photo?: File | null }) => void;
  isSaving?: boolean;
};

export default function ProfileForm({ initialName, initialEmail, initialPosition, initialPhone, initialPhoto, onSubmit, isSaving }: Props) {
  const [phone, setPhone] = useState(initialPhone || "");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [phoneError, setPhoneError] = useState<string>();
  const [photoError, setPhotoError] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPhone(initialPhone || "");
  }, [initialPhone]);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(undefined);
    setPhotoError(undefined);

    let valid = true;

    if (!/^\+?\d{8,15}$/.test(phone)) {
      setPhoneError("Enter a valid phone number");
      valid = false;
    }

    if (photo) {
      if (!["image/png", "image/jpeg"].includes(photo.type)) {
        setPhotoError("File must be PNG or JPG");
        valid = false;
      }
      if (photo.size > 5 * 1024 * 1024) {
        setPhotoError("File size must be less than 5 MB");
        valid = false;
      }
    }

    if (!valid) return;

    onSubmit({
      phone: phone || undefined,
      password: password || undefined,
      photo,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Avatar src={previewUrl || initialPhoto} sx={{ width: 100, height: 100 }} />
        <Button variant="outlined" component="label">
          Change Photo
          <input
            type="file"
            accept="image/png,image/jpeg"
            hidden
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </Button>
        {photoError && <Typography color="error" variant="caption">{photoError}</Typography>}
      </Box>

      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {initialName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {initialEmail}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {initialPosition}
        </Typography>
      </Stack>
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => {
          const v = e.target.value;
          setPhone(v);
          if (/^\+?\d{8,15}$/.test(v)) setPhoneError(undefined);
          else setPhoneError("Enter a valid phone number");
        }}
        fullWidth
        error={Boolean(phoneError)}
        helperText={phoneError}
        placeholder="Optional"
      />

      <TextField
        label="New Password (Leave blank if not changing)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        placeholder="Leave blank if not changing"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSaving}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "#7E57C2",
          "&:hover": { backgroundColor: "#673AB7" },
        }}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
}
