import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import CustomCard from "../components/CustomCard";
import AttendanceForm from "../components/AttendanceForm";
import { Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

export default function AttendancePage() {
  const { token } = useAuth();
  const [checkIn, setCheckIn] = useState<string>();
  const [checkOut, setCheckOut] = useState<string>();
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    if (!token) return;
    const from = moment().startOf("day").format("YYYY-MM-DD HH:mm");
    const to = moment().endOf("day").format("YYYY-MM-DD HH:mm");
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_APIURL}/attendance/self?page=1&limit=5&from=${from}&to=${to}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCheckIn(res.data.summary.in || undefined);
    setCheckOut(res.data.summary.out || undefined);
  };

  useEffect(() => {
    fetchAttendance();
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_APIURL}/attendance/self`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchAttendance();

      Swal.fire({
        icon: "success",
        title: res.data.status === 1 ? "Check In Successful" : "Check Out Successful",
         html: `
        <div style="font-size: 0.85rem; line-height: 1.4; text-align: center;">
          <strong>Date Time:</strong> ${moment(res.data.attendanceDttm).format("dddd, DD MMMM YYYY HH:mm:ss")}</p>
        </div>
      `,
      });
    } finally {
      setLoading(false);
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
          <AttendanceForm
            checkIn={checkIn}
            checkOut={checkOut}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </CustomCard>
      </PageContainer>
    </Box>
  );
}
