/**
 * Utility functions for HomePage
 */

/**
 * Generate alert message based on today's menu
 * @param {Array} menuMeals - Array of meals in today's menu
 * @returns {Object} Alert message object with title and message
 */
export const generateAlertMessage = (menuMeals = []) => {
  if (menuMeals.length === 0) {
    return {
      title: "Bugünün Özel Menüsü!",
      message: "Yemekhane 12:00–14:00 arası açık. Rezervasyon yapmayı unutmayın."
    };
  }
  
  // Check if there's a meal with "Karnıyarık" in the name
  const karniyarikMeal = menuMeals.find((m) => 
    m.name?.toLowerCase().includes("karnıyarık") || 
    m.name?.toLowerCase().includes("karniyarik")
  );
  
  if (karniyarikMeal) {
    return {
      title: "Bugünün Özel Menüsü!",
      message: "Karnıyarık ile özel pilavımızı kaçırmayın. Yemekhane 12:00–14:00 arası açık."
    };
  }
  
  // Otherwise, show first meal from today's menu
  const firstMeal = menuMeals[0];
  return {
    title: "Bugünün Özel Menüsü!",
    message: `${firstMeal?.name || "Özel menümüzü"} kaçırmayın. Yemekhane 12:00–14:00 arası açık.`
  };
};

/**
 * Filter meals based on selected category
 * @param {string} categoryName - Selected category name
 * @param {Array} allMeals - All available meals
 * @param {Array} menuMeals - Meals in today's menu
 * @param {Array} categories - Available categories from backend
 * @returns {Array} Filtered meals
 */
export const filterMealsByCategory = (categoryName, allMeals = [], menuMeals = [], categories = []) => {
  if (!categoryName) {
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  // Find category by name
  const category = categories.find(c => c.name === categoryName);
  
  if (!category) {
    // If category not found, return today's menu meals or first 4 meals
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  // Special handling for "Aylık Menü" - show today's menu meals
  if (categoryName === "Aylık Menü") {
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  // Filter by category ID
  const categoryId = category.id;
  const filteredByCategory = allMeals.filter((m) => m.categoryId === categoryId);

  // If filtering by restaurant name (e.g., "Japon Restoran"), filter by restaurant name
  if (categoryName === "Japon Restoran") {
    return allMeals.filter((m) => m.restaurantName === "Japon Restoran");
  }

  return filteredByCategory;
};

