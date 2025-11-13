import { useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservationsApi';
import { menusApi } from '../../api/menusApi';
import ReservationStepper from '../../components/reservation/ReservationStepper';
import NavigationButtons from '../../components/reservation/NavigationButtons';
import Step1DateSelection from '../../components/reservation/Step1DateSelection';
import Step2RestaurantSelection from '../../components/reservation/Step2RestaurantSelection';
import Step3MenuTypeSelection from '../../components/reservation/Step3MenuTypeSelection';
import Step4MenuSelection from '../../components/reservation/Step4MenuSelection';
import Step5Confirmation from '../../components/reservation/Step5Confirmation';

const MakeReservation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [appetizer, setAppetizer] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Create reservation mutation
  const createReservationMutation = useMutation({
    mutationFn: (reservationData) => reservationsApi.createReservation(reservationData),
  });

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        // All dates must have meal time slots selected
        return (
          selectedDates.length > 0 &&
          selectedDates.length <= 2 &&
          selectedDates.every((d) => d.mealTimeSlotId !== null)
        );
      case 2:
        return selectedRestaurant !== null;
      case 3:
        return selectedMenuType !== null;
      case 4:
        return selectedMenu !== null;
      case 5:
        return true; // Confirmation step is always valid
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('=== RESERVATION CREATION START ===');
      console.log('Step 1 - Initial State:', {
        selectedDates,
        selectedRestaurant: selectedRestaurant?.id,
        selectedMenuType,
        selectedMenu: selectedMenu?.id,
        appetizer,
      });

      // Fetch menus for each date to get the correct menuId
      console.log('Step 2 - Fetching menus for dates...');
      const menuPromises = selectedDates.map((dateObj) =>
        menusApi.getMenus(dateObj.date, selectedRestaurant.id, selectedMenuType)
      );
      const menusByDate = await Promise.all(menuPromises);
      console.log('Step 2 - Menus fetched:', menusByDate);

      // Create a reservation for each selected date
      console.log('Step 3 - Creating reservation objects...');
      const reservations = selectedDates.map((dateObj, index) => {
        // Find menu for this date that matches the selected menu's meals
        const menusForDate = menusByDate[index];
        // Use the first menu for this date (assuming menus with same restaurant/type have same structure)
        // If no menu found, use the selected menu (backend will validate)
        const menuForDate = menusForDate.length > 0 ? menusForDate[0] : selectedMenu;

        if (!menuForDate || !menuForDate.id) {
          throw new Error(`Menu not found for date ${dateObj.date}`);
        }

        // Convert date string (YYYY-MM-DD) to ISO 8601 datetime string
        // For date-only values, we send as UTC midnight to preserve the calendar date
        // The backend will extract Year/Month/Day from this UTC date, so sending as UTC
        // ensures the date doesn't shift when converted
        const dateStr = dateObj.date; // Already in YYYY-MM-DD format
        const dateTimeStr = `${dateStr}T00:00:00Z`; // Add time component and UTC indicator

        const reservation = {
          restaurantId: selectedRestaurant.id,
          menuId: menuForDate.id,
          mealTimeSlotId: parseInt(dateObj.mealTimeSlotId, 10), // Ensure it's a number
          date: dateTimeStr, // Send as ISO 8601 datetime string
          appetizer: appetizer,
        };

        console.log(`Step 3 - Reservation ${index + 1}:`, {
          originalDateObj: dateObj,
          dateString: dateStr,
          dateTimeString: dateTimeStr,
          reservation,
        });

        return reservation;
      });

      console.log('Step 4 - All reservations prepared:', reservations);

      // Create all reservations
      console.log('Step 5 - Sending API requests...');
      const promises = reservations.map((reservation, index) => {
        console.log(`Step 5.${index + 1} - Sending reservation ${index + 1}:`, {
          url: '/api/reservations',
          method: 'POST',
          data: reservation,
          dateType: typeof reservation.date,
          dateValue: reservation.date,
        });
        return createReservationMutation.mutateAsync(reservation);
      });

      await Promise.all(promises);
      console.log('=== RESERVATION CREATION SUCCESS ===');

      // Invalidate and refetch reservations query to update the list
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationMenus'] });
      // Invalidate home page stats to refresh statistics
      queryClient.invalidateQueries({ queryKey: ['home', 'stats'] });

      // Show success message
      const dayCount = reservations.length;
      setSuccessMessage(
        `Rezervasyonunuz başarıyla oluşturuldu! ${dayCount} gün için rezervasyon yapıldı.`
      );

      // Reset form and redirect after 2 seconds
      setTimeout(() => {
        navigate('/reservations/my');
      }, 2000);
    } catch (error) {
      console.error('Reservation creation error:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract error message from FluentValidation errors or general message
      let errorMessage = 'Rezervasyon oluşturulurken bir hata oluştu.';
      
      if (error.response?.data) {
        if (error.response.data.errors) {
          // FluentValidation errors
          const validationErrors = Object.values(error.response.data.errors).flat();
          errorMessage = validationErrors.join(', ') || errorMessage;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrorMessage(errorMessage);
    }
  };

  const canGoNext = validateStep(currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1DateSelection
            selectedDates={selectedDates}
            onDatesChange={setSelectedDates}
          />
        );
      case 2:
        return (
          <Step2RestaurantSelection
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelect={setSelectedRestaurant}
          />
        );
      case 3:
        return (
          <Step3MenuTypeSelection
            selectedMenuType={selectedMenuType}
            onMenuTypeSelect={setSelectedMenuType}
          />
        );
      case 4:
        return (
          <Step4MenuSelection
            selectedDates={selectedDates}
            selectedRestaurant={selectedRestaurant}
            selectedMenuType={selectedMenuType}
            selectedMenu={selectedMenu}
            selectedMeal={selectedMeal}
            appetizer={appetizer}
            onMenuSelect={(menu, meal) => {
              setSelectedMenu(menu);
              setSelectedMeal(meal);
            }}
            onAppetizerChange={setAppetizer}
          />
        );
      case 5:
        return (
          <Step5Confirmation
            selectedDates={selectedDates}
            selectedRestaurant={selectedRestaurant}
            selectedMenuType={selectedMenuType}
            selectedMenu={selectedMenu}
            selectedMeal={selectedMeal}
            appetizer={appetizer}
            onSubmit={handleSubmit}
            isSubmitting={createReservationMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        bgcolor: '#F6F7FB',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: '#0A1C59',
            mb: 1,
          }}
        >
          Rezervasyon Yap
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            mb: 4,
          }}
        >
          Toyota çalışanları için haftalık yemek rezervasyonu
        </Typography>

        {/* Progress Stepper */}
        <ReservationStepper currentStep={currentStep} />

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>{renderStep()}</Box>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <NavigationButtons
            currentStep={currentStep}
            onBack={handleBack}
            onNext={handleNext}
            canGoNext={canGoNext}
          />
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSuccessMessage('')}
            severity="success"
            sx={{
              bgcolor: '#FFF8E1',
              color: '#0A1C59',
              borderRadius: '12px',
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setErrorMessage('')}
            severity="error"
            sx={{
              borderRadius: '12px',
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default MakeReservation;

