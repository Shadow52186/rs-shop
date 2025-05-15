import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import ParticlesBackground from "../../../components/effects/ParticlesBackground";
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stockCount, setStockCount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  const fetchStock = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}/stock/${id}`);
    const available = res.data.filter((s) => !s.isSold);
    setStockCount(available.length);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}/product`);
      const item = res.data.find((p) => p._id === id);
      setProduct(item);
    };

    fetchProduct();
    fetchStock();
  }, [id]);

  const handleBuy = async () => {
    if (isBuying) return;
    setIsBuying(true);

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("กรุณาเข้าสู่ระบบ", "", "warning");
      setIsBuying(false);
      return;
    }

    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการซื้อสินค้านี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยันการซื้อ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) {
      setIsBuying(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${process.env.REACT_APP_API}/purchase/${id}`, {}, config);

      Swal.fire("🎉 ซื้อสำเร็จ!", "ระบบทำการจัดส่งไอดีให้คุณเรียบร้อยแล้ว", "success").then(() => {
        navigate("/user/history");
      });

      fetchStock();
    } catch (err) {
      const message = err.response?.data || "เกิดข้อผิดพลาด";
      Swal.fire("ไม่สามารถซื้อได้", message, "error");

      if (message.includes("token")) {
        navigate("/login");
      }
    } finally {
      setIsBuying(false);
    }
  };

  if (!product)
    return <Typography textAlign="center">กำลังโหลด...</Typography>;

  return (
    <Box
      sx={{
        py: 8,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(270deg, #ffe6f0, #f3e5f5, #e1bee7)",
        backgroundSize: "600% 600%",
        animation: "gradientShift 15s ease infinite",
        minHeight: "100vh",
      }}
    >
      {/* เอฟเฟกต์พื้นหลัง */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <ParticlesBackground />
      </Box>

      {/* เนื้อหา */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box maxWidth="1000px" mx="auto" p={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ p: 3, borderRadius: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <img
                    src={`${process.env.REACT_APP_API.replace("/api", "")}${product.image}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      objectFit: "cover",
                      maxHeight: 400,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>

                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {product.detail}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    <Typography>
                      <strong>💰 ราคา:</strong> {product.price} point
                    </Typography>
                    <Typography>
                      <strong>📦 จำนวนคงเหลือ:</strong> {stockCount} ชิ้น
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 4, bgcolor: "#ba68c8", color: "white" }}
                    onClick={handleBuy}
                    disabled={isBuying}
                  >
                    🛒 {isBuying ? "กำลังซื้อ..." : "ซื้อสินค้า"}
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
