using Microsoft.EntityFrameworkCore;
using ReservationApp.Application.Helpers;
using ReservationApp.Domain.Entities;
using ReservationApp.Domain.Enums;

namespace ReservationApp.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ReservationDbContext context)
    {
        if (!await context.Users.AnyAsync(u => u.Email == "admin@example.com"))
        {
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            var adminUser = new User("Admin User", "admin@example.com", adminPasswordHash, UserRole.Admin);
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync(u => u.Email == "user@example.com"))
        {
            var userPasswordHash = BCrypt.Net.BCrypt.HashPassword("user123");
            var regularUser = new User("Ahmet Yılmaz", "user@example.com", userPasswordHash, UserRole.User, "Yazılım Geliştirici");
            await context.Users.AddAsync(regularUser);
            await context.SaveChangesAsync();
        }

        if (!await context.MealTimeSlots.AnyAsync())
        {
            var mealTimeSlots = new List<MealTimeSlot>
            {
                new MealTimeSlot("Breakfast", new TimeOnly(7, 0), new TimeOnly(10, 0)),
                new MealTimeSlot("Lunch", new TimeOnly(12, 0), new TimeOnly(14, 0)),
                new MealTimeSlot("Dinner", new TimeOnly(18, 0), new TimeOnly(21, 0))
            };

            await context.MealTimeSlots.AddRangeAsync(mealTimeSlots);
            await context.SaveChangesAsync();
        }

        var settingsToSeed = new List<SystemSetting>();

        if (!await context.SystemSettings.AnyAsync(s => s.Category == "General" && s.Key == "CompanyName"))
        {
            settingsToSeed.Add(new SystemSetting("General", "CompanyName", "Toyota ISS", SettingType.String, "Company name"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "General" && s.Key == "Timezone"))
        {
            settingsToSeed.Add(new SystemSetting("General", "Timezone", "Europe/Istanbul", SettingType.String, "System timezone"));
        }

        var maxWeeklyReservationsSetting = await context.SystemSettings.FirstOrDefaultAsync(s => s.Category == "Reservation" && s.Key == "MaxWeeklyReservations");
        if (maxWeeklyReservationsSetting == null)
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "MaxWeeklyReservations", "5", SettingType.Int, "Maximum number of reservations a user can make per week"));
        }
        else if (int.TryParse(maxWeeklyReservationsSetting.Value, out var currentValue) && currentValue < 5)
        {
            maxWeeklyReservationsSetting.UpdateValue("5");
            await context.SaveChangesAsync();
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AllowPastReservations"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AllowPastReservations", "false", SettingType.Bool, "Whether users can make reservations for past dates"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "CancellationNoticeHours"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "CancellationNoticeHours", "24", SettingType.Int, "Hours before reservation that cancellation is allowed"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "MaxAdvanceReservationDays"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "MaxAdvanceReservationDays", "30", SettingType.Int, "Maximum number of days in advance a reservation can be made"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AutoApproval"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AutoApproval", "false", SettingType.Bool, "Whether reservations are automatically approved"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Reservation" && s.Key == "AllowSameDayReservations"))
        {
            settingsToSeed.Add(new SystemSetting("Reservation", "AllowSameDayReservations", "false", SettingType.Bool, "Whether users can make multiple reservations for the same day"));
        }

        // Notification settings
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "EmailEnabled"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "EmailEnabled", "true", SettingType.Bool, "Whether email notifications are enabled"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "DailyReminderEnabled"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "DailyReminderEnabled", "true", SettingType.Bool, "Whether daily menu reminder emails are enabled"));
        }
        if (!await context.SystemSettings.AnyAsync(s => s.Category == "Notifications" && s.Key == "ReminderTime"))
        {
            settingsToSeed.Add(new SystemSetting("Notifications", "ReminderTime", "09:00", SettingType.String, "Time of day to send daily menu reminder emails (HH:mm format)"));
        }

        if (settingsToSeed.Any())
        {
            await context.SystemSettings.AddRangeAsync(settingsToSeed);
            await context.SaveChangesAsync();
        }

        Restaurant? mainRestaurant = null;
        Restaurant? japaneseRestaurant = null;
        
        if (!await context.Restaurants.AnyAsync())
        {
            mainRestaurant = new Restaurant("Yemekhane", "Ana yemekhane restoranı");
            japaneseRestaurant = new Restaurant("Japon Restoran", "Özel Japon mutfağı restoranı");
            
            await context.Restaurants.AddRangeAsync(new[] { mainRestaurant, japaneseRestaurant });
            await context.SaveChangesAsync();
        }
        else
        {
            mainRestaurant = await context.Restaurants.FirstOrDefaultAsync(r => r.Name == "Yemekhane");
            japaneseRestaurant = await context.Restaurants.FirstOrDefaultAsync(r => r.Name == "Japon Restoran");
            
            if (mainRestaurant == null)
            {
                mainRestaurant = new Restaurant("Yemekhane", "Ana yemekhane restoranı");
                await context.Restaurants.AddAsync(mainRestaurant);
                await context.SaveChangesAsync();
            }
            
            if (japaneseRestaurant == null)
            {
                japaneseRestaurant = new Restaurant("Japon Restoran", "Özel Japon mutfağı restoranı");
                await context.Restaurants.AddAsync(japaneseRestaurant);
                await context.SaveChangesAsync();
            }
        }

        MenuCategory? anaYemekCategory = null;
        MenuCategory? corbaCategory = null;
        MenuCategory? alakartCategory = null;
        MenuCategory? vejetaryenCategory = null;
        MenuCategory? aperatifCategory = null;
        
        if (!await context.MenuCategories.AnyAsync())
        {
            anaYemekCategory = new MenuCategory("Ana Yemek");
            corbaCategory = new MenuCategory("Çorba");
            alakartCategory = new MenuCategory("Alakart");
            vejetaryenCategory = new MenuCategory("Vejetaryen & Özel");
            aperatifCategory = new MenuCategory("Mesai Aperatif");
            
            await context.MenuCategories.AddRangeAsync(new[] 
            { 
                anaYemekCategory, 
                corbaCategory, 
                alakartCategory, 
                vejetaryenCategory, 
                aperatifCategory 
            });
            await context.SaveChangesAsync();
        }
        else
        {
            anaYemekCategory = await context.MenuCategories.FirstOrDefaultAsync(c => c.Name == "Ana Yemek");
            corbaCategory = await context.MenuCategories.FirstOrDefaultAsync(c => c.Name == "Çorba");
            alakartCategory = await context.MenuCategories.FirstOrDefaultAsync(c => c.Name == "Alakart");
            vejetaryenCategory = await context.MenuCategories.FirstOrDefaultAsync(c => c.Name == "Vejetaryen & Özel");
            aperatifCategory = await context.MenuCategories.FirstOrDefaultAsync(c => c.Name == "Mesai Aperatif");
            
            if (anaYemekCategory == null)
            {
                anaYemekCategory = new MenuCategory("Ana Yemek");
                await context.MenuCategories.AddAsync(anaYemekCategory);
            }
            if (corbaCategory == null)
            {
                corbaCategory = new MenuCategory("Çorba");
                await context.MenuCategories.AddAsync(corbaCategory);
            }
            if (alakartCategory == null)
            {
                alakartCategory = new MenuCategory("Alakart");
                await context.MenuCategories.AddAsync(alakartCategory);
            }
            if (vejetaryenCategory == null)
            {
                vejetaryenCategory = new MenuCategory("Vejetaryen & Özel");
                await context.MenuCategories.AddAsync(vejetaryenCategory);
            }
            if (aperatifCategory == null)
            {
                aperatifCategory = new MenuCategory("Mesai Aperatif");
                await context.MenuCategories.AddAsync(aperatifCategory);
            }
            await context.SaveChangesAsync();
        }

        if (!await context.Meals.AnyAsync())
        {
            var meals = new List<Meal>
            {
                new Meal("Izgara Köfte & Bulgur", anaYemekCategory!.Id, mainRestaurant!.Id, 
                    "Izgara köfte, bulgur pilavı ve salata", 650, 45m, 
                    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400"),
                new Meal("Tavuk Şinitzel & Patates", anaYemekCategory.Id, mainRestaurant.Id, 
                    "Tavuk şinitzel, patates kızartması ve salata", 580, 42m, 
                    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400"),
                new Meal("Karnıyarık & Pilav", anaYemekCategory.Id, mainRestaurant.Id, 
                    "Karnıyarık, özel pilav ve salata", 720, 48m, 
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400"),
                new Meal("Izgara Tavuk & Bulgur", anaYemekCategory.Id, mainRestaurant.Id, 
                    "Izgara tavuk, bulgur pilavı ve salata", 550, 40m, 
                    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400"),
                
                new Meal("Mantar Çorbası", corbaCategory!.Id, mainRestaurant.Id, 
                    "Kremalı mantar çorbası", 180, 25m, 
                    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"),
                new Meal("Mercimek Çorbası", corbaCategory.Id, mainRestaurant.Id, 
                    "Geleneksel mercimek çorbası", 150, 20m, 
                    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"),
                new Meal("Domates Çorbası", corbaCategory.Id, mainRestaurant.Id, 
                    "Kremalı domates çorbası", 160, 22m, 
                    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"),
                
                new Meal("Bonfile Biftek", alakartCategory!.Id, mainRestaurant.Id, 
                    "Izgara bonfile biftek, patates ve salata", 720, 85m, 
                    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"),
                new Meal("Izgara Levrek", alakartCategory.Id, mainRestaurant.Id, 
                    "Izgara levrek, sebze ve pilav", 450, 65m, 
                    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"),
                
                new Meal("Mantarlı Risotto", vejetaryenCategory!.Id, mainRestaurant.Id, 
                    "Mantarlı risotto ve salata", 420, 55m, 
                    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400"),
                new Meal("Sebzeli Makarna", vejetaryenCategory.Id, mainRestaurant.Id, 
                    "Taze sebzeli makarna", 380, 50m, 
                    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"),
                
                new Meal("Sandviç Tabağı", aperatifCategory!.Id, mainRestaurant.Id, 
                    "Çeşitli sandviçler", 320, 35m, 
                    "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400"),
                new Meal("Salata Tabağı", aperatifCategory.Id, mainRestaurant.Id, 
                    "Karışık salata tabağı", 250, 30m, 
                    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"),
                
                new Meal("Sushi Seti", anaYemekCategory.Id, japaneseRestaurant!.Id, 
                    "Karışık sushi seti", 450, 120m, 
                    "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"),
                new Meal("Ramen", anaYemekCategory.Id, japaneseRestaurant.Id, 
                    "Geleneksel ramen çorbası", 520, 75m, 
                    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"),
            };
            
            await context.Meals.AddRangeAsync(meals);
            await context.SaveChangesAsync();
        }
        else
        {
            var priceMap = new Dictionary<string, decimal>
            {
                { "Izgara Köfte & Bulgur", 45m },
                { "Tavuk Şinitzel & Patates", 42m },
                { "Karnıyarık & Pilav", 48m },
                { "Izgara Tavuk & Bulgur", 40m },
                { "Mantar Çorbası", 25m },
                { "Mercimek Çorbası", 20m },
                { "Domates Çorbası", 22m },
                { "Bonfile Biftek", 85m },
                { "Izgara Levrek", 65m },
                { "Mantarlı Risotto", 55m },
                { "Sebzeli Makarna", 50m },
                { "Sandviç Tabağı", 35m },
                { "Salata Tabağı", 30m },
                { "Sushi Seti", 120m },
                { "Ramen", 75m },
            };

            var imageMap = new Dictionary<string, string>
            {
                { "Izgara Tavuk & Bulgur", "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400" },
                { "Izgara Levrek", "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400" },
            };

            var allMeals = await context.Meals.ToListAsync();
            
            var mealsToUpdate = allMeals
                .Where(m => (m.Price == null && priceMap.ContainsKey(m.Name)) || imageMap.ContainsKey(m.Name))
                .ToList();

            foreach (var meal in mealsToUpdate)
            {
                var entry = context.Entry(meal);

                if (meal.Price == null && priceMap.TryGetValue(meal.Name, out var price))
                {
                    entry.Property("Price").CurrentValue = price;
                    entry.Property("Price").IsModified = true;
                }

                if (imageMap.TryGetValue(meal.Name, out var imageUrl))
                {
                    entry.Property("ImageUrl").CurrentValue = imageUrl;
                    entry.Property("ImageUrl").IsModified = true;
                }
            }

            if (mealsToUpdate.Any())
            {
                await context.SaveChangesAsync();
            }
        }

        var today = DateTimeConversionHelper.ConvertFromUtc(DateTime.UtcNow).Date;
        var todayUtc = DateTimeConversionHelper.ConvertToUtc(new DateTime(today.Year, today.Month, today.Day, 0, 0, 0, DateTimeKind.Unspecified));
        for (int i = 0; i < 30; i++)
        {
            var menuDate = todayUtc.AddDays(i);
            
            if (!await context.Menus.AnyAsync(m => m.Date >= menuDate && m.Date < menuDate.AddDays(1) && m.RestaurantId == mainRestaurant!.Id && m.MenuType == MenuType.Standard))
            {
                var standardMenu = new Menu(mainRestaurant!.Id, menuDate, MenuType.Standard);
                
                var menuMeals = await context.Meals
                    .Include(m => m.Category)
                    .Include(m => m.Restaurant)
                    .Where(m => m.RestaurantId == mainRestaurant.Id && 
                        (m.CategoryId == anaYemekCategory!.Id || 
                         m.CategoryId == corbaCategory!.Id || 
                         m.CategoryId == alakartCategory!.Id))
                    .Take(4)
                    .ToListAsync();
                
                foreach (var meal in menuMeals)
                {
                    standardMenu.Meals.Add(meal);
                }
                
                await context.Menus.AddAsync(standardMenu);
                await context.SaveChangesAsync();
            }
            
            if (!await context.Menus.AnyAsync(m => m.Date >= menuDate && m.Date < menuDate.AddDays(1) && m.RestaurantId == mainRestaurant!.Id && m.MenuType == MenuType.Special))
            {
                var specialMenuYemekhane = new Menu(mainRestaurant!.Id, menuDate, MenuType.Special);
                
                var specialMenuMeals = await context.Meals
                    .Include(m => m.Category)
                    .Include(m => m.Restaurant)
                    .Where(m => m.RestaurantId == mainRestaurant.Id)
                    .Take(5)
                    .ToListAsync();
                
                foreach (var meal in specialMenuMeals)
                {
                    specialMenuYemekhane.Meals.Add(meal);
                }
                
                await context.Menus.AddAsync(specialMenuYemekhane);
                await context.SaveChangesAsync();
            }
            
            if (!await context.Menus.AnyAsync(m => m.Date >= menuDate && m.Date < menuDate.AddDays(1) && m.RestaurantId == japaneseRestaurant!.Id && m.MenuType == MenuType.Standard))
            {
                var standardMenuJapanese = new Menu(japaneseRestaurant!.Id, menuDate, MenuType.Standard);
                
                var japaneseStandardMeals = await context.Meals
                    .Include(m => m.Category)
                    .Include(m => m.Restaurant)
                    .Where(m => m.RestaurantId == japaneseRestaurant.Id)
                    .Take(3)
                    .ToListAsync();
                
                foreach (var meal in japaneseStandardMeals)
                {
                    standardMenuJapanese.Meals.Add(meal);
                }
                
                await context.Menus.AddAsync(standardMenuJapanese);
                await context.SaveChangesAsync();
            }
            
            if (!await context.Menus.AnyAsync(m => m.Date >= menuDate && m.Date < menuDate.AddDays(1) && m.RestaurantId == japaneseRestaurant!.Id && m.MenuType == MenuType.Special))
            {
                var specialMenu = new Menu(japaneseRestaurant!.Id, menuDate, MenuType.Special);
                
                var japaneseMenuMeals = await context.Meals
                    .Include(m => m.Category)
                    .Include(m => m.Restaurant)
                    .Where(m => m.RestaurantId == japaneseRestaurant.Id)
                    .ToListAsync();
                
                foreach (var meal in japaneseMenuMeals)
                {
                    specialMenu.Meals.Add(meal);
                }
                
                await context.Menus.AddAsync(specialMenu);
                await context.SaveChangesAsync();
            }
        }
    }
}

