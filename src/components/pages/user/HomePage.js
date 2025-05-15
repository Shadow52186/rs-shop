import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { EmojiEvents, Category, Inventory, People } from "@mui/icons-material";
import Footer from "../../../layout/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ParticlesBackground from "../../../components/effects/ParticlesBackground";
import { Link } from "react-router-dom";

const FadeInSection = ({ children }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resStats, resCategories, resProducts] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/stats`, config),
          axios.get(`${process.env.REACT_APP_API}/categories`, config),
          axios.get(`${process.env.REACT_APP_API}/product`, config),
        ]);

        setStats(resStats.data);
        setCategories(resCategories.data);
        setProducts(resProducts.data);
      } catch (err) {
        console.error(
          "❌ Error loading homepage data:",
          err.response?.data || err
        );
      }
    };

    fetchHomeData();
  }, []);

  const statsItems = [
    {
      label: "สมาชิก",
      value: `${stats.users ?? 0} คน`,
      icon: <People sx={{ color: "#c600ff" }} />,
    },
    {
      label: "หมวดหมู่",
      value: `${stats.categories ?? 0} หมวด`,
      icon: <Category sx={{ color: "#ff66cc" }} />,
    },
    {
      label: "พร้อมจำหน่าย",
      value: `${stats.products ?? 0} ชิ้น`,
      icon: <Inventory sx={{ color: "#66e0ff" }} />,
    },
    {
      label: "จำหน่ายไปแล้ว",
      value: `${stats.sold ?? 0} ครั้ง`,
      icon: <EmojiEvents sx={{ color: "#ffc107" }} />,
    },
  ];

  return (
    <>
      <Box
        sx={{
          py: 8,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8e0ff, #e0f7ff, #f9ccff)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
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

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box maxWidth="1400px" mx="auto" px={2}>
            <FadeInSection>
              <Box mb={6}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "3px solid #d500f9",
                    boxShadow: 6,
                    maxHeight: 400,
                  }}
                >
                  <img
                    src="/assets/RS-SHOP.png"
                    alt="banner"
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Card>
              </Box>
            </FadeInSection>

            <FadeInSection>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(90deg, #f3e5f5, #f8bbd0)",
                  borderRadius: 3,
                  py: 2,
                  mb: 6,
                  boxShadow: 3,
                  border: "2px solid #f06292",
                }}
              >
                <motion.div
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                  }}
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#ad1457",
                  }}
                >
                  🎉 ยินดีต้อนรับเข้าสู่เว็บไซต์ของเรา! พบกับสินค้าใหม่ๆ และหมวดหมู่ยอดนิยมทุกวัน!
                </motion.div>
              </Box>
            </FadeInSection>

            <FadeInSection>
              <Grid container spacing={4} justifyContent="center" mb={8}>
                {statsItems.map((item, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Card
                      sx={{
                        p: 3,
                        textAlign: "center",
                        borderRadius: 4,
                        boxShadow: 4,
                        bgcolor: "#fce4ec",
                      }}
                    >
                      <Box mb={1}>{item.icon}</Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </FadeInSection>

            <FadeInSection>
              <Divider textAlign="left">
                <Chip
                  label="💡 หมวดหมู่แนะนำ"
                  color="secondary"
                  variant="outlined"
                />
              </Divider>
            </FadeInSection>

            <FadeInSection>
              <Grid container spacing={4} justifyContent="center" mt={4} mb={8}>
                {categories.map((cat, i) => (
                  <Grid item xs={12} sm={6} md={6} key={cat._id || i}>
                    <Link
                      to={`/category/${cat._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          height: 350,
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "2px solid #d500f9",
                          boxShadow: 3,
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <img
                          src={`${process.env.REACT_APP_API.replace(
                            "/api",
                            ""
                          )}${cat.image}`}
                          alt={cat.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </FadeInSection>

            <FadeInSection>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
              >
                <Typography variant="h5" fontWeight="bold" color="#aa00ff">
                  🛒 สินค้าแนะนำ
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#d500f9",
                    color: "#d500f9",
                    fontWeight: "bold",
                  }}
                >
                  ดูทั้งหมด
                </Button>
              </Box>
            </FadeInSection>

            <FadeInSection>
              <Grid container spacing={4} justifyContent="center">
                {products.slice(0, 4).map((product, i) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id || i}>
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          border: "2px solid #e040fb",
                          boxShadow: 6,
                          bgcolor: "#f3e5f5",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.03)" },
                        }}
                      >
                        <img
                          src={`${process.env.REACT_APP_API.replace(
                            "/api",
                            ""
                          )}${product.image?.replace(/\\/g, "/")}`}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: 10,
                            marginBottom: 12,
                          }}
                        />
                        <Typography
                          fontWeight="bold"
                          align="center"
                          color="#aa00ff"
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ flexGrow: 1, mt: 1 }}
                        >
                          {product.detail?.slice(0, 50)}...
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          align="center"
                          sx={{ mt: 1, fontWeight: "bold" }}
                        >
                          {product.price} point
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 1, bgcolor: "#d05ce3", color: "white" }}
                        >
                          ดูสินค้า
                        </Button>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </FadeInSection>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default HomePage;
