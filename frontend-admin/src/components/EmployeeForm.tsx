import { useState, useEffect } from "react";
import { Box, TextField, Button, Avatar, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

type Props = {
  isCreate?: boolean;
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string;
  initialPosition?: string;
  initialRole?: string;
  initialPhone?: string;
  initialPhoto?: string;
  positions: { id: number; name: string }[];
  roles: { id: number; name: string }[];
  onSubmit: (data: { firstName: string; lastName?: string; email: string; phone: string; password?: string; photo?: File | null; positionId: number; roleId: number }) => void;
  onCancel?: () => void;
  isSaving?: boolean;
};

export default function EmployeeForm({ isCreate = false, initialFirstName = "", initialLastName = "", initialEmail = "", initialPosition = "", initialRole = "", initialPhone = "", initialPhoto = "", positions, roles, onSubmit, onCancel, isSaving }: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState(initialPosition);
  const [role, setRole] = useState(initialRole);
  const [photo, setPhoto] = useState<File | null>(null);
  const [firstNameError, setFirstNameError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [positionError, setPositionError] = useState<string>();
  const [roleError, setRoleError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();
  const [photoError, setPhotoError] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setPosition(initialPosition);
    setRole(initialRole);
  }, [initialFirstName, initialLastName, initialEmail, initialPhone, initialPosition, initialRole]);

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
    setFirstNameError(undefined);
    setEmailError(undefined);
    setPositionError(undefined);
    setRoleError(undefined);
    setPhoneError(undefined);
    setPhotoError(undefined);

    let valid = true;

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!position) {
      setPositionError("Position is required");
      valid = false;
    }
    if (!role) {
      setRoleError("Role is required");
      valid = false;
    }

    if (phone && !/^\+?\d{8,15}$/.test(phone)) {
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

    const positionId = positions.find(p => p.name === position)?.id || 0;
    const roleId = roles.find(r => r.name === role)?.id || 0;

    const payload: any = {
      firstName,
      lastName,
      email,
      phone,
      password: isCreate ? password : undefined,
      positionId,
      roleId
    };

    if (photo) payload.photo = photo;

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => {
          const v = e.target.value;
          setFirstName(v);
          if (v.trim()) setFirstNameError(undefined);
          else setFirstNameError("First name is required");
        }}
        fullWidth
        error={Boolean(firstNameError)}
        helperText={firstNameError}
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => {
          const v = e.target.value;
          setEmail(v);
          if (!v.trim()) setEmailError("Email is required");
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
            setEmailError("Enter a valid email");
          else setEmailError(undefined);
        }}
        fullWidth
        error={Boolean(emailError)}
        helperText={emailError}
      />

      <FormControl fullWidth error={Boolean(positionError)}>
        <InputLabel>Position</InputLabel>
        <Select
          value={position}
          onChange={(e) => {
            const v = e.target.value;
            setPosition(v);
            if (v) setPositionError(undefined);
            else setPositionError("Position is required");
          }}
          label="Position"
        >
          {positions.map((p) => (
            <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
          ))}
        </Select>
        {positionError && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{positionError}</Typography>}
      </FormControl>

      <FormControl fullWidth error={Boolean(roleError)}>
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={(e) => {
            const v = e.target.value;
            setRole(v);
            if (v) setRoleError(undefined);
            else setRoleError("Role is required");
          }}
          label="Role"
        >
          {roles.map((r) => (
            <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
          ))}
        </Select>
        {roleError && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{roleError}</Typography>}
      </FormControl>

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
      />

      {isCreate && (
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
        <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 2 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
