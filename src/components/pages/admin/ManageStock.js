import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageStock = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [stockList, setStockList] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetch = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}/product`);
      const currentProduct = res.data.find((p) => p._id === id);
      setProduct(currentProduct);

      const stock = await axios.get(`${process.env.REACT_APP_API}/stock/${id}`);
      // ✅ ซ่อนสต็อกที่ถูกขายแล้ว
      const visibleStock = stock.data.filter((s) => !s.isSold);
      setStockList(visibleStock);
    };

    fetch();
  }, [id]);

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.post(
      `${process.env.REACT_APP_API}/stock`,
      { productId: id, ...form },
      config
    );
    setForm({ username: "", password: "" });

    const res = await axios.get(`${process.env.REACT_APP_API}/stock/${id}`);
    const visibleStock = res.data.filter((s) => !s.isSold);
    setStockList(visibleStock);
  };

  const handleDelete = async (stockId) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ✅ ซ่อนจากหน้า admin เท่านั้น (ไม่ลบจริง)
    const updatedList = stockList.filter((s) => s._id !== stockId);
    setStockList(updatedList);
  };

  return (
    <Box maxWidth="900px" mx="auto" mt={5}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        จัดการสต็อกสินค้า: {product.name}
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button variant="contained" onClick={handleAdd}>
          เพิ่ม
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell align="right">ลบ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockList.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.username}</TableCell>
                <TableCell>{s.password}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(s._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ManageStock;
