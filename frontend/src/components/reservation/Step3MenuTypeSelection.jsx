import { Box, Card, Typography, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Step3MenuTypeSelection = ({ selectedMenuType, onMenuTypeSelect }) => {
  const theme = useTheme();
  
  // MenuType enum: Standard = 1, Special = 2
  const MENU_TYPES = [
    {
      id: 1,
      name: 'Standart Menü',
      displayName: 'Menü Seçimi',
      color: theme.palette.info.light, // Blue
    },
    {
      id: 2,
      name: 'Özel Menü',
      displayName: 'Özel Menü Seçimi',
      color: theme.palette.secondary.main, // Purple
    },
  ];
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: theme.custom.typography.fontWeight.semibold,
          color: theme.palette.primary.main,
          mb: 1,
        }}
      >
        Menü Tipi Seçimi
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.custom.text.secondary,
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
                borderRadius: theme.custom.borderRadius.card,
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? `3px solid ${theme.palette.primary.main}` : 'none',
                boxShadow: isSelected
                  ? theme.custom.shadows.buttonHover
                  : theme.custom.shadows.card,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.custom.shadows.cardHover,
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
                    borderRadius: theme.custom.borderRadius.button,
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

