import { Box } from '@mui/material';

/**
 * CategoryTabs - Reusable component for category/option tabs
 * 
 * @param {string[]} categories - Array of category names
 * @param {string} selectedCategory - Currently selected category
 * @param {function} onCategoryChange - Callback when category is selected
 */
const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => {
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
              borderRadius: "25px",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "0.25s",
              border: isActive ? "none" : "1px solid #E1E4EC",
              bgcolor: isActive ? "#0A1C59" : "#F8F9FD",
              color: isActive ? "#fff" : "#6F6F6F",
              "&:hover": {
                bgcolor: isActive ? "#0A1C59" : "#ECEEF5",
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

