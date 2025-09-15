import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import CustomCard from "../components/CustomCard";
import ProfileForm from "../components/ProfileForm";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  photo: string;
};

export default function ProfilePage() {
  const { token } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_APIURL}/employee/self`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error("Failed to fetch employee:", err));
  }, [token]);

  const handleSave = async (data: { phone?: string; password?: string; photo?: File | null }) => {
    if (!token) return;
    try {
      setIsSaving(true);
      const formData = new FormData();
      if (data.phone) formData.append("phone", data.phone);
      if (data.password) formData.append("password", data.password);
      if (data.photo) formData.append("photo", data.photo);

      await axios.patch(`${import.meta.env.VITE_BACKEND_APIURL}/employee/self`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      const updated = await axios.get(`${import.meta.env.VITE_BACKEND_APIURL}/employee/self`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(updated.data);

      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully"
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

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

      <PageContainer>
        <CustomCard>
          {employee && (
            <ProfileForm
              initialName={`${employee.firstName} ${employee.lastName}`}
              initialEmail={`${employee.email}`}
              initialPosition={`${employee.position}`}
              initialPhone={employee.phone}
              initialPhoto={
                employee.photo
                  ? `${import.meta.env.VITE_BACKEND_APIURL}/${employee.photo}`
                  : ''
              }
              onSubmit={handleSave}
              isSaving={isSaving}
            />
          )}
        </CustomCard>
      </PageContainer>
    </Box>
  );
}
