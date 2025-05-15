import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
} from "@mui/material";
import ParticlesBackground from "../../../components/effects/ParticlesBackground";
import { motion } from "framer-motion"; // ✅ เพิ่ม fade-in

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(`${process.env.REACT_APP_API}/categories/${id}`);
        const productRes = await axios.get(`${process.env.REACT_APP_API}/product?categoryId=${id}`);
        setCategoryName(categoryRes.data.name);
        setProducts(productRes.data);
      } catch (err) {
        console.error("❌ Failed to load category page", err);
      }
    };

    fetchData();
  }, [id]);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

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
      {/* พื้นหลัง effect */}
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
        <Box px={3} py={4} maxWidth="1400px" mx="auto">
          <Typography variant="h4" fontWeight="bold" mb={4}>
            หมวดหมู่: {categoryName}
          </Typography>

          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: "2px solid #ce93d8",
                      boxShadow: 6,
                      bgcolor: "#f3e5f5",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_API.replace("/api", "")}${product.image}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    />
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.detail?.slice(0, 50)}...
                    </Typography>
                    <Typography color="primary" fontWeight="bold">
                      {product.price} point
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{ mt: 1, backgroundColor: "#ba68c8" }}
                      onClick={() => handleViewProduct(product._id)}
                    >
                      ดูสินค้า
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryPage;
