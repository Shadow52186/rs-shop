import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Grid,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Addproduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}/categories`);
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}/product`);
    setProducts(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !detail || !price || !categoryId) {
      return Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกให้ครบทุกช่อง", "warning");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("detail", detail);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_API}/product/${editId}`, formData);
        Swal.fire("สำเร็จ", "แก้ไขสินค้าเรียบร้อยแล้ว", "success");
      } else {
        await axios.post(`${process.env.REACT_APP_API}/product/upload`, formData);
        Swal.fire("สำเร็จ", "เพิ่มสินค้าเรียบร้อยแล้ว", "success");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      Swal.fire("ล้มเหลว", "ไม่สามารถบันทึกสินค้าได้", "error");
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setDetail(product.detail);
    setPrice(product.price);
    setImageFile(null);
    setPreview(`${process.env.REACT_APP_API.replace("/api", "")}${product.image}`);
    setEditId(product._id);
    const foundCategory = categories.find((cat) => cat._id === product.categoryId);
    setCategoryId(foundCategory ? product.categoryId : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "สินค้าจะถูกลบถาวร!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API}/product/${id}`);
        Swal.fire("ลบแล้ว", "สินค้าถูกลบเรียบร้อย", "success");
        fetchProducts();
      } catch (err) {
        console.error(err);
        Swal.fire("ล้มเหลว", "ไม่สามารถลบสินค้าได้", "error");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setDetail("");
    setPrice("");
    setImageFile(null);
    setPreview(null);
    setCategoryId("");
    setEditId(null);
  };

  return (
    <Box p={4}>
      <Card sx={{ p: 4, maxWidth: 600, mx: "auto", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {editId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={2}>
            <TextField label="ชื่อสินค้า" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="รายละเอียดสินค้า" value={detail} onChange={(e) => setDetail(e.target.value)} multiline rows={3} required />
            <TextField label="ราคา" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <TextField select label="เลือกหมวดหมู่" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </TextField>

            <Button variant="outlined" component="label">
              เลือกรูปภาพ
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>

            {preview && (
              <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 8 }} />
            )}

            <Button variant="contained" type="submit" color="primary">
              {editId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </Button>
          </Stack>
        </form>
      </Card>

      <Typography variant="h5" fontWeight="bold" mb={2}>รายการสินค้า</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
              <img
                src={`${process.env.REACT_APP_API.replace("/api", "")}${product.image}`}
                alt={product.name}
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
              />
              <Typography fontWeight="bold">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ราคา {product.price} point
              </Typography>
              <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                <Button variant="outlined" size="small" onClick={() => handleEdit(product)}>
                  แก้ไข
                </Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(product._id)}>
                  ลบ
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => navigate(`/admin/stock/${product._id}`)}
                >
                  จัดการสต็อก
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Addproduct;
