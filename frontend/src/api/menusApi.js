import axiosClient from "./axiosClient";

export const menusApi = {
  // Get menus with optional filters
  getMenus: async (date = null, restaurantId = null, menuType = null) => {
    const params = {};

    // Format date properly for backend
    // ASP.NET Core expects dates in ISO 8601 format or YYYY-MM-DD
    if (date) {
      // If date is already in YYYY-MM-DD format, use it directly
      // Otherwise, parse and format it
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        params.date = date;
      } else {
        const dateObj =
          typeof date === "string"
            ? new Date(date + "T00:00:00")
            : new Date(date);
        if (isNaN(dateObj.getTime())) {
          throw new Error(`Invalid date format: ${date}`);
        }
        params.date = dateObj.toISOString().split("T")[0];
      }
    }

    // Ensure restaurantId is a valid Guid string
    if (restaurantId) {
      // If it's already a string, use it; if it's a Guid object, convert to string
      const guidStr =
        typeof restaurantId === "string"
          ? restaurantId
          : restaurantId.toString();
      // Validate Guid format (basic check)
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          guidStr
        )
      ) {
        throw new Error(`Invalid Guid format: ${guidStr}`);
      }
      params.restaurantId = guidStr;
    }

    // Note: Backend doesn't support menuType filter yet, so we filter client-side
    const response = await axiosClient.get("/menus", { params });
    let menus = response.data;

    console.log("API Response:", {
      params,
      menusCount: menus?.length || 0,
      menus,
    });

    // Log the first menu's structure to debug
    if (menus && menus.length > 0) {
      console.log("First menu structure:", {
        menu: menus[0],
        menuType: menus[0].menuType,
        MenuType: menus[0].MenuType,
        allKeys: Object.keys(menus[0]),
        selectedMenuType: menuType,
      });
    }

    // Filter by menuType if provided (client-side filtering)
    // Handle both integer (1, 2) and string ("Standard", "Special") enum values
    // Backend uses camelCase, so property is 'menuType' not 'MenuType'
    if (menuType !== null) {
      menus = menus.filter((menu) => {
        // Handle both camelCase and PascalCase property names
        const menuTypeValue = menu.menuType ?? menu.MenuType;

        // If menuType is missing, log it and include the menu (don't filter it out)
        if (menuTypeValue === undefined || menuTypeValue === null) {
          console.warn("MenuType Filter - Missing menuType property:", {
            menuId: menu.id,
            menuKeys: Object.keys(menu),
            menu: menu,
          });
          // If menuType is missing, don't filter it out - include it
          return true;
        }

        // Convert both to numbers for comparison
        let menuTypeNum;
        if (typeof menuTypeValue === "number") {
          menuTypeNum = menuTypeValue;
        } else if (menuTypeValue === "Standard") {
          menuTypeNum = 1;
        } else if (menuTypeValue === "Special") {
          menuTypeNum = 2;
        } else {
          menuTypeNum = parseInt(menuTypeValue, 10);
          if (isNaN(menuTypeNum)) {
            console.warn(
              "MenuType Filter - Could not parse menuTypeValue:",
              menuTypeValue
            );
            return true; // Include if we can't parse
          }
        }

        const selectedMenuTypeNum =
          typeof menuType === "number" ? menuType : parseInt(menuType, 10);

        const matches = menuTypeNum === selectedMenuTypeNum;

        console.log("MenuType Filter - Comparison:", {
          menuId: menu.id,
          menuTypeValue,
          menuTypeNum,
          selectedMenuType: menuType,
          selectedMenuTypeNum,
          matches,
        });

        return matches;
      });

      console.log("After filtering:", {
        originalCount: response.data?.length || 0,
        filteredCount: menus.length,
        selectedMenuType: menuType,
      });
    }

    return menus;
  },

  // Get today's menu
  getTodayMenu: async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await axiosClient.get("/menus", {
      params: { date: today },
    });
    return response.data;
  },
};
