import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import CustomCard from "../components/CustomCard";
import AttendanceDatatable from "../components/AttendanceDataTable";
import { Box, Typography } from "@mui/material";

export default function AttendanceSummaryPage() {
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
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Attendance Summary
        </Typography>

        <CustomCard>
          <AttendanceDatatable />
        </CustomCard>
      </PageContainer>
    </Box>
  );
}
