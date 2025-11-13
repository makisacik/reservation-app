import { Avatar } from '@mui/material';

const UserAvatar = ({ name, size = 40 }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: '#0A1C59',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 600,
      }}
    >
      {getInitials(name)}
    </Avatar>
  );
};

export default UserAvatar;

