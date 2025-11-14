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
      message:
        "Yemekhane 12:00–14:00 arası açık. Rezervasyon yapmayı unutmayın.",
    };
  }

  const karniyarikMeal = menuMeals.find(
    (m) =>
      m.name?.toLowerCase().includes("karnıyarık") ||
      m.name?.toLowerCase().includes("karniyarik")
  );

  if (karniyarikMeal) {
    return {
      title: "Bugünün Özel Menüsü!",
      message:
        "Karnıyarık ile özel pilavımızı kaçırmayın. Yemekhane 12:00–14:00 arası açık.",
    };
  }

  const firstMeal = menuMeals[0];
  return {
    title: "Bugünün Özel Menüsü!",
    message: `${
      firstMeal?.name || "Özel menümüzü"
    } kaçırmayın. Yemekhane 12:00–14:00 arası açık.`,
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
export const filterMealsByCategory = (
  categoryName,
  allMeals = [],
  menuMeals = [],
  categories = []
) => {
  if (!categoryName) {
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  const category = categories.find((c) => c.name === categoryName);

  if (!category) {
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  if (categoryName === "Aylık Menü") {
    return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
  }

  const categoryId = category.id;
  const filteredByCategory = allMeals.filter(
    (m) => m.categoryId === categoryId
  );

  if (categoryName === "Japon Restoran") {
    return allMeals.filter((m) => m.restaurantName === "Japon Restoran");
  }

  return filteredByCategory;
};
