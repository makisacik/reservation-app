import { Box, Card, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// MenuType enum: Standard = 1, Special = 2
const MENU_TYPES = [
  {
    id: 1,
    name: 'Standart Menü',
    displayName: 'Menü Seçimi',
    color: '#3498DB', // Blue
  },
  {
    id: 2,
    name: 'Özel Menü',
    displayName: 'Özel Menü Seçimi',
    color: '#9B59B6', // Purple
  },
];

const Step3MenuTypeSelection = ({ selectedMenuType, onMenuTypeSelect }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#0A1C59',
          mb: 1,
        }}
      >
        Menü Tipi Seçimi
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 4,
        }}
      >
        Standart menü veya özel menü seçebilirsiniz
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {MENU_TYPES.map((menuType) => {
          const isSelected = selectedMenuType === menuType.id;

          return (
            <Card
              key={menuType.id}
              onClick={() => onMenuTypeSelect(menuType.id)}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '3px solid #0A1C59' : 'none',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(10, 28, 89, 0.2)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              {/* Icon Section */}
              <Box
                sx={{
                  bgcolor: menuType.color,
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon
                  sx={{
                    fontSize: '100px',
                    color: 'white',
                  }}
                />
              </Box>

              {/* Menu Type Name */}
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'white',
                    bgcolor: menuType.color,
                    borderRadius: '12px',
                    py: 2,
                    px: 3,
                    display: 'inline-block',
                  }}
                >
                  {menuType.displayName}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default Step3MenuTypeSelection;

