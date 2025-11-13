import { Box, useTheme } from '@mui/material';

/**
 * CategoryTabs - Reusable component for category/option tabs
 * 
 * @param {string[]} categories - Array of category names
 * @param {string} selectedCategory - Currently selected category
 * @param {function} onCategoryChange - Callback when category is selected
 */
const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <Box
            key={category}
            onClick={() => onCategoryChange(category)}
            sx={{
              cursor: "pointer",
              px: 3,
              py: 1.4,
              borderRadius: theme.custom.borderRadius.pill,
              fontWeight: theme.custom.typography.fontWeight.semibold,
              fontSize: "0.95rem",
              transition: "0.25s",
              border: isActive ? "none" : `1px solid ${theme.palette.custom.border.light}`,
              bgcolor: isActive ? theme.palette.primary.main : theme.palette.custom.background.inactiveTab,
              color: isActive ? "#fff" : theme.palette.custom.text.secondary,
              "&:hover": {
                bgcolor: isActive ? theme.palette.primary.main : theme.palette.custom.background.lighter,
              },
            }}
          >
            {category}
          </Box>
        );
      })}
    </Box>
  );
};

export default CategoryTabs;

