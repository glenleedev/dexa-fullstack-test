import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Box, CircularProgress, Button, Chip, TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import type { Moment } from "moment";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

type Attendance = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: string;
  statusId: number;
  attendanceDttm: string;
};

type Props = {
  defaultFrom?: Moment;
  defaultTo?: Moment;
};

export default function EmployeeDatatable({ defaultFrom, defaultTo }: Props) {
  const { token } = useAuth();
  const [rows, setRows] = useState<Attendance[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState<Moment>((defaultFrom || moment().startOf("month")).startOf("day"));
  const [to, setTo] = useState<Moment>((defaultTo || moment()).endOf("day"));
  const [name, setName] = useState("");

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(limit),
        from: from?.format("YYYY-MM-DD HH:mm") || "",
        to: to?.format("YYYY-MM-DD HH:mm") || "",
        search: name,
      });

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_APIURL}/attendance/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = (res.data.data || []).map((item: any) => ({
        id: uuidv4(),
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        position: item.position,
        attendanceDttm: `${item.attendDt} ${item.attendTm}`,
        statusId: item.statusId,
        status: item.status?.toLowerCase(),
      }));

      setRows(mapped);
      setTotal(res.data.meta?.total || 0);
      setPage((res.data.meta?.page || 1) - 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <Box sx={{ mx: "auto", width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center", width: "100%" }}>
        <TextField
          label="Search Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
          size="small"
          sx={{ flex: 1, minWidth: 160 }}
        />
        <DatePicker
          label="From"
          value={from}
          onChange={(v) => setFrom(moment(v).startOf("day"))}
          format="DD-MM-YYYY"
          slotProps={{ textField: { size: "small", sx: { flex: 1, minWidth: 160 } } }}
        />
        <DatePicker
          label="To"
          value={to}
          onChange={(v) => setTo(moment(v).endOf("day"))}
          format="DD-MM-YYYY"
          slotProps={{ textField: { size: "small", sx: { flex: 1, minWidth: 160 } } }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setPage(0);
            fetchData();
          }}
          sx={{ textTransform: "none", borderRadius: 2, height: 40, flexShrink: 0 }}
        >
          Apply
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 1, width: "100%", overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{moment(row.attendanceDttm, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY")}</TableCell>
                  <TableCell>{moment(row.attendanceDttm, "DD-MM-YYYY HH:mm:ss").format("HH:mm:ss")}</TableCell>
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
                <TableCell colSpan={6} align="center">
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
