import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedImage from '../common/CachedImage';

/**
 * AdminMealCard - Component for displaying meal cards in admin menu management
 * 
 * @param {Object} meal - Meal object with id, name, imageUrl, categoryName, restaurantName, price, kcal
 * @param {function} onEdit - Edit button click handler
 * @param {function} onDelete - Delete button click handler
 */
const AdminMealCard = ({ meal, onEdit, onDelete }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        borderRadius: theme.custom.borderRadius.large,
        overflow: 'hidden',
        boxShadow: theme.custom.shadows.card,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: theme.custom.shadows.cardHover,
        },
      }}
    >
      {/* Image with category tag */}
      <Box
        sx={{
          height: 200,
          position: 'relative',
          overflow: 'hidden',
          background: meal.imageUrl
            ? 'transparent'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {meal.imageUrl ? (
          <CachedImage
            src={meal.imageUrl}
            alt={meal.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            showLoadingPlaceholder={true}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
        )}
        <Chip
          label={meal.categoryName || 'Kategori'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            fontWeight: theme.custom.typography.fontWeight.semibold,
            fontSize: '0.75rem',
            borderRadius: theme.custom.borderRadius.input,
            height: '24px',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Meal name and price row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.custom.typography.fontWeight.semibold,
                fontSize: '1rem',
                color: theme.palette.custom.text.primary,
                mb: 0.5,
              }}
            >
              {meal.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.custom.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {meal.restaurantName || 'Restoran'}
            </Typography>
          </Box>
          {meal.price !== null && meal.price !== undefined && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.custom.typography.fontWeight.semibold,
                color: theme.palette.custom.text.primary,
                ml: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {meal.price.toFixed(2)}₺
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => onEdit(meal)}
            sx={{
              flex: 1,
              borderRadius: theme.custom.borderRadius.button,
              textTransform: 'none',
              borderColor: theme.palette.custom.border.default,
              color: theme.palette.custom.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: 'rgba(10, 28, 89, 0.04)',
              },
            }}
          >
            Düzenle
          </Button>
          <IconButton
            onClick={() => onDelete(meal)}
            sx={{
              bgcolor: theme.palette.error.main,
              color: 'white',
              borderRadius: theme.custom.borderRadius.button,
              width: '48px',
              height: '48px',
              '&:hover': {
                bgcolor: theme.palette.error.dark || theme.palette.error.main,
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminMealCard;

