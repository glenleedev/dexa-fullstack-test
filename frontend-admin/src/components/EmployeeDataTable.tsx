import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Box, CircularProgress, Button, TextField,
  Dialog, DialogTitle, DialogContent
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import EmployeeForm from "./EmployeeForm";
import Swal from "sweetalert2";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  phone: string;
  role: string;
  photo: string;
};

export default function EmployeeDatatable() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(limit),
        search: name,
      });

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_APIURL}/employee?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = (res.data.data || []).map((item: any) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        position: item.position,
        photo: item.photo,
        phone: item.phone,
        role: item.role,
      }));

      setRows(mapped);
      setTotal(res.data.meta?.total || 0);
      setPage((res.data.meta?.page || 1) - 1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    if (!token) return;
    const posRes = await axios.get(`${import.meta.env.VITE_BACKEND_APIURL}/employee/master/position`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const roleRes = await axios.get(`${import.meta.env.VITE_BACKEND_APIURL}/user/master/role`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPositions(posRes.data || []);
    setRoles(roleRes.data || []);
  };

  useEffect(() => {
    fetchData();
    fetchMeta();
  }, [page, limit]);

  return (
    <Box sx={{ mx: "auto", width: "100%", height: "80vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center", width: "100%" }}>
        <TextField
          label="Search Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
          size="small"
          sx={{ flex: 1, minWidth: 160 }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setPage(0);
            fetchData();
          }}
          sx={{ textTransform: "none", borderRadius: 2, height: 40, flexShrink: 0 }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 2, height: 40, flexShrink: 0, borderColor: "green", color: "green" }}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Create
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 1, width: "100%", overflow: "auto", flex: 1 }}>
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
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
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={() => {
                        setEditing(row);
                        setOpen(true);
                      }}
                    >
                      Update
                    </Button>
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Update Employee" : "Create Employee"}</DialogTitle>
        <DialogContent>
          <EmployeeForm
            isCreate={!editing}
            initialFirstName={editing?.firstName}
            initialLastName={editing?.lastName}
            initialEmail={editing?.email || ""}
            initialPosition={editing?.position || ""}
            initialRole={editing?.role || ""}
            initialPhone={editing?.phone || ""}
            initialPhoto={
              editing?.photo
                ? `${import.meta.env.VITE_BACKEND_APIURL}/${editing?.photo}`
                : ''
            }
            positions={positions}
            roles={roles}
            onCancel={() => setOpen(false)}
            onSubmit={async (data: any) => {
              try {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                  if (value !== undefined && value !== null) {
                    formData.append(key, value as any);
                  }
                });

                if (!editing) {
                  await axios.post(
                    `${import.meta.env.VITE_BACKEND_APIURL}/employee`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                } else {
                  const { password, ...rest } = data;
                  const formDataUpdate = new FormData();
                  Object.entries(rest).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                      formDataUpdate.append(key, value as any);
                    }
                  });

                  await axios.patch(
                    `${import.meta.env.VITE_BACKEND_APIURL}/employee/${editing.id}`,
                    formDataUpdate,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                }

                setOpen(false);

                await Swal.fire({
                  icon: "success",
                  title: `Employee ${editing ? "Successfully Updated" : "Successfully Created"}`,
                  confirmButtonText: "OK",
                });

                fetchData();
              } catch (err) {
                console.error(err);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: err instanceof Error ? err.message : "Unknown error",
                  confirmButtonText: "OK",
                });
              }

            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
