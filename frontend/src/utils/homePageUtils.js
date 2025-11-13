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
 * Calculate statistics from meals data
 * @param {Array} allMeals - All available meals
 * @param {Array} menuMeals - Meals in today's menu
 * @returns {Object} Stats object
 */
export const calculateStats = (allMeals = [], menuMeals = []) => {
  const totalMeals = allMeals.length;
  const aperatifCount = allMeals.filter((m) => m.categoryName === "Mesai Aperatif").length;
  
  const mostPopularMeal = menuMeals.length > 0 
    ? menuMeals[0]?.name?.split(" ")[0] || "Izgara"
    : allMeals[0]?.name?.split(" ")[0] || "Izgara";
  
  const preferenceRate = totalMeals > 0 
    ? Math.round((menuMeals.length / totalMeals) * 100) 
    : 0;

  return {
    totalMeals,
    mostPopular: mostPopularMeal,
    preferenceRate,
    aperatifCount,
  };
};

/**
 * Filter meals based on selected category
 * @param {string} category - Selected category
 * @param {Array} allMeals - All available meals
 * @param {Array} menuMeals - Meals in today's menu
 * @returns {Array} Filtered meals
 */
export const filterMealsByCategory = (category, allMeals = [], menuMeals = []) => {
  switch (category) {
    case "Aylık Menü":
      return menuMeals.length > 0 ? menuMeals : allMeals.slice(0, 4);
    case "Vejetaryen & Özel":
      return allMeals.filter((m) => m.categoryName === "Vejetaryen & Özel");
    case "Mesai Aperatif":
      return allMeals.filter((m) => m.categoryName === "Mesai Aperatif");
    case "Japon Restoran":
      return allMeals.filter((m) => m.restaurantName === "Japon Restoran");
    default:
      return menuMeals;
  }
};

