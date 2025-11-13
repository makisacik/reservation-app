import { Card, Box, useTheme } from '@mui/material';
import UserInfo from './UserInfo';
import AlertBanner from '../common/AlertBanner';

/**
 * UserHeaderCard - Header card component with user info and alert banner
 * 
 * @param {Object} user - User object
 * @param {Object} alertMessage - Alert message object with title and message
 */
const UserHeaderCard = ({ user, alertMessage }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        bgcolor: theme.palette.primary.light,
        color: "white",
        borderRadius: theme.custom.borderRadius.card,
        p: 3,
        mb: 3,
        boxShadow: theme.custom.shadows.cardElevated,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <UserInfo user={user} />
        {alertMessage && (
          <AlertBanner
            title={alertMessage.title}
            message={alertMessage.message}
          />
        )}
      </Box>
    </Card>
  );
};

export default UserHeaderCard;

