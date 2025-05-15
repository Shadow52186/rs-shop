import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "../../../components/effects/ParticlesBackground";
import { motion } from "framer-motion";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/product`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Load products error:", err));
  }, []);

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
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

      <Box sx={{ position: "relative", zIndex: 1 }} px={4}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          สินค้าทั้งหมด
        </Typography>
        <Grid container spacing={4}>
          {products.map((product, i) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "2px solid #ce93d8",
                    bgcolor: "#f3e5f5",
                    boxShadow: 6,
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API.replace("/api", "")}${product.image}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Typography mt={2} fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.detail?.slice(0, 50)}...
                  </Typography>
                  <Typography fontWeight="bold" color="primary">
                    {product.price} point
                  </Typography>
                  <Button
                    fullWidth
                    sx={{ mt: 1, backgroundColor: "#ba68c8", color: "white" }}
                    variant="contained"
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
  );
};

export default AllProductsPage;
