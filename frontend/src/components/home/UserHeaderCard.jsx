import { Card, Box } from '@mui/material';
import UserInfo from './UserInfo';
import AlertBanner from '../common/AlertBanner';

const RADIUS = "20px";

/**
 * UserHeaderCard - Header card component with user info and alert banner
 * 
 * @param {Object} user - User object
 * @param {Object} alertMessage - Alert message object with title and message
 */
const UserHeaderCard = ({ user, alertMessage }) => {
  return (
    <Card
      sx={{
        bgcolor: "#1665d8",
        color: "white",
        borderRadius: RADIUS,
        p: 3,
        mb: 3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
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

