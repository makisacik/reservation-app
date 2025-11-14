import { Box, Avatar, Typography } from '@mui/material';

/**
 * UserInfo - Component for displaying user avatar and information
 * 
 * @param {Object} user - User object with name and department
 */
const UserInfo = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        sx={{
          width: 60,
          height: 60,
          fontSize: "1.5rem",
          fontWeight: "bold",
          bgcolor: "rgba(255,255,255,0.25)",
          mr: 2,
        }}
      >
        {getInitials(user?.name)}
      </Avatar>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {user?.name || "Kullanıcı"}
        </Typography>
        <Typography sx={{ opacity: 0.9 }}>
          {user?.department || "Yazılım Geliştirici"}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserInfo;



