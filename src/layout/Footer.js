import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";

// ✅ ฟอนต์ Prompt ต้องโหลดใน index.html หรือ CSS Global ด้วย

const Footer = () => {
  return (
    <Box
      py={5}
      px={2}
      textAlign="center"
      mt={10}
      sx={{
        background: "none",
        color: "#000",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#000" }}
      >
        เว็บไซต์ขายไอดีเกมของแท้ ปลอดภัย ได้รับไอดีทันที
      </Typography>

      <Typography variant="body2" sx={{ color: "#000", mb: 3 }}>
        ติดต่อเราผ่านช่องทางด้านล่าง หากมีปัญหาหรือข้อสงสัย
      </Typography>

      <Stack direction="row" spacing={3} justifyContent="center" mb={3}>
        <IconButton
          component="a"
          href="https://www.facebook.com/eurotinnapat.saelee"
          target="_blank"
          sx={{ color: "#000" }}
        >
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </IconButton>
        <IconButton
          component="a"
          href="https://instagram.com/yourprofile"
          target="_blank"
          sx={{ color: "#000" }}
        >
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </IconButton>
        <IconButton
          component="a"
          href="https://discord.gg/yourinvite"
          target="_blank"
          sx={{ color: "#000" }}
        >
          <FontAwesomeIcon icon={faDiscord} size="lg" />
        </IconButton>
      </Stack>

      <Typography variant="body2" sx={{ color: "#000" }}>
        © {new Date().getFullYear()} made by <strong>rotisaimai</strong>
      </Typography>
    </Box>
  );
};

export default Footer;
