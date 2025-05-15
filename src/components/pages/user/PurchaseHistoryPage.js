import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

const PurchaseHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API}/purchase/history`, config);
        setHistory(res.data);
      } catch (err) {
        console.error("❌ ไม่สามารถโหลดประวัติได้", err);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <Box maxWidth="1000px" mx="auto" p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📜 ประวัติการซื้อสินค้า
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {history.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography fontWeight="bold">📦 สินค้า: {item.product?.name}</Typography>
                <Typography>🧑‍💻 Username: {item.stock?.username}</Typography>
                <Typography>🔐 Password: {item.stock?.password}</Typography>
                <Typography color="text.secondary">
                  🕒 วันที่ซื้อ: {new Date(item.createdAt).toLocaleString("th-TH")}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PurchaseHistoryPage;
