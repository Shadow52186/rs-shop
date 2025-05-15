import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Stack } from "@mui/material";
import axios from "axios";

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <Typography align="center">กำลังโหลด...</Typography>;

  return (
    <Box maxWidth="600px" mx="auto" p={4}>
      <Card sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          👤 ข้อมูลผู้ใช้
        </Typography>
        <Stack spacing={2}>
          <Typography>
            <strong>ชื่อผู้ใช้:</strong> {profile.username}
          </Typography>
          <Typography>
            <strong>บทบาท:</strong> {profile.role}
          </Typography>
          <Typography>
            <strong>Point คงเหลือ:</strong> {profile.point ?? 0} point
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default UserProfilePage;
