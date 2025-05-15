import React, { useEffect, useState } from "react";
import {
  Paper, Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, TextField, Select, MenuItem, Stack, useMediaQuery
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API}/users`, {
        headers: { Authorization: "Bearer " + token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setEditing(user._id);
    setForm({ ...user, password: "" }); // password ว่างไว้, point, role, username มาครบ
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${process.env.REACT_APP_API}/user/${editing}`, form, {
        headers: { Authorization: "Bearer " + token }
      });
      await Swal.fire("สำเร็จ", "อัปเดตผู้ใช้เรียบร้อย", "success");
      setEditing(null);
      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถอัปเดตผู้ใช้ได้", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ลบผู้ใช้?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d000f7",
      cancelButtonColor: "#999",
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API}/user/${id}`, {
          headers: { Authorization: "Bearer " + token }
        });
        Swal.fire("ลบแล้ว!", "ผู้ใช้ถูกลบแล้ว", "success");
        loadUsers();
      }
    });
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          จัดการผู้ใช้
        </Typography>

        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell><b>ชื่อผู้ใช้</b></TableCell>
              <TableCell><b>รหัสผ่าน</b></TableCell>
              <TableCell><b>สิทธิ์</b></TableCell>
              <TableCell><b>Point</b></TableCell>
              <TableCell align="center"><b>การกระทำ</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  {editing === u._id ? (
                    <TextField
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      size="small"
                    />
                  ) : u.username}
                </TableCell>

                <TableCell>
                  {editing === u._id ? (
                    <TextField
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      size="small"
                      type="password"
                    />
                  ) : (
                    "••••••••"
                  )}
                </TableCell>

                <TableCell>
                  {editing === u._id ? (
                    <Select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value="admin">admin</MenuItem>
                      <MenuItem value="user">user</MenuItem>
                    </Select>
                  ) : u.role}
                </TableCell>

                <TableCell>
                  {editing === u._id ? (
                    <TextField
                      name="point"
                      value={form.point}
                      onChange={handleChange}
                      size="small"
                      type="number"
                    />
                  ) : (
                    u.point
                  )}
                </TableCell>

                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    {editing === u._id ? (
                      <>
                        <Button
                          onClick={handleUpdate}
                          variant="contained"
                          color="success"
                          startIcon={<SaveIcon />}
                          size="small"
                        >
                          บันทึก
                        </Button>
                        <Button
                          onClick={() => setEditing(null)}
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          size="small"
                        >
                          ยกเลิก
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(u)}
                          variant="outlined"
                          startIcon={<EditIcon />}
                          size="small"
                        >
                          แก้ไข
                        </Button>
                        <Button
                          onClick={() => handleDelete(u._id)}
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          size="small"
                        >
                          ลบ
                        </Button>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default ManageUser;
