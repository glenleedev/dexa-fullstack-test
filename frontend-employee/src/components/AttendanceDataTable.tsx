import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Box, CircularProgress, Typography, Button, Chip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import type { Moment } from "moment";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

type Attendance = {
  id: number;
  status: string;
  statusId: number;
  attendanceDttm: string;
};

type Props = {
  defaultFrom?: Moment;
  defaultTo?: Moment;
};

export default function AttendanceDatatable({ defaultFrom, defaultTo }: Props) {
  const { token } = useAuth();
  const [rows, setRows] = useState<Attendance[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState<Moment | null>(defaultFrom || moment().startOf("month"));
  const [to, setTo] = useState<Moment | null>(defaultTo || moment());

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(limit),
        from: from?.format("YYYY-MM-DD HH:mm") || "",
        to: to?.format("YYYY-MM-DD HH:mm") || "",
      });

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_APIURL}/attendance/self?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = (res.data.data || []).map((item: any, index: number) => ({
        id: index,
        attendanceDttm: `${item.attendDt} ${item.attendTm}`,
        statusId: item.statusId,
        status: item.status?.toLowerCase(),
      }));

      setRows(mapped);
      setTotal(mapped.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <DatePicker
          label="From"
          value={from}
          onChange={(v) => setFrom(v ? moment(v) : null)}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 160 },
            },
          }}
        />
        <DatePicker
          label="To"
          value={to}
          onChange={(v) => setTo(v ? moment(v) : null)}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 160 },
            },
          }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setPage(0);
            fetchData();
          }}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            height: 40,
          }}
        >
          Apply
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{moment(row.attendanceDttm, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    {moment(row.attendanceDttm, "DD-MM-YYYY HH:mm:ss").format("HH:mm:ss")}
                  </TableCell>
                    <TableCell>
                    <Chip
                      label={row.status}
                      variant="outlined"
                      color={row.statusId === 1 ? "success" : "secondary"}
                      sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 50, 100]}
        />
      </TableContainer>
    </Box>
  );
}
