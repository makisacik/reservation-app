import { useState } from 'react';
import { Box, Typography, Snackbar, Alert, useTheme } from '@mui/material';
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
  const theme = useTheme();
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

  const createReservationMutation = useMutation({
    mutationFn: (reservationData) => reservationsApi.createReservation(reservationData),
  });

  const validateStep = (step) => {
    switch (step) {
      case 1:
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
        return true;
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

      console.log('Step 2 - Fetching menus for dates...');
      const menuPromises = selectedDates.map((dateObj) =>
        menusApi.getMenus(dateObj.date, selectedRestaurant.id, selectedMenuType)
      );
      const menusByDate = await Promise.all(menuPromises);
      console.log('Step 2 - Menus fetched:', menusByDate);

      console.log('Step 3 - Creating reservation objects...');
      const reservations = selectedDates.map((dateObj, index) => {
        const menusForDate = menusByDate[index];
        const menuForDate = menusForDate.length > 0 ? menusForDate[0] : selectedMenu;

        if (!menuForDate || !menuForDate.id) {
          throw new Error(`Menu not found for date ${dateObj.date}`);
        }

        const dateStr = dateObj.date;
        const dateTimeStr = `${dateStr}T00:00:00Z`;

        const reservation = {
          restaurantId: selectedRestaurant.id,
          menuId: menuForDate.id,
          mealTimeSlotId: parseInt(dateObj.mealTimeSlotId, 10),
          date: dateTimeStr,
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

      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationMenus'] });
      queryClient.invalidateQueries({ queryKey: ['home', 'stats'] });

      const dayCount = reservations.length;
      setSuccessMessage(
        `Rezervasyonunuz başarıyla oluşturuldu! ${dayCount} gün için rezervasyon yapıldı.`
      );

      setTimeout(() => {
        navigate('/reservations/my');
      }, 2000);
    } catch (error) {
      console.error('Reservation creation error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Rezervasyon oluşturulurken bir hata oluştu.';
      
      if (error.response?.data) {
        if (error.response.data.errors) {
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
        bgcolor: theme.palette.custom.background.page,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: theme.custom.typography.fontWeight.semibold,
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          Rezervasyon Yap
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.custom.text.secondary,
            mb: 4,
          }}
        >
          Toyota çalışanları için haftalık yemek rezervasyonu
        </Typography>

        <ReservationStepper currentStep={currentStep} />

        <Box sx={{ mb: 4 }}>{renderStep()}</Box>

        {currentStep < 5 && (
          <NavigationButtons
            currentStep={currentStep}
            onBack={handleBack}
            onNext={handleNext}
            canGoNext={canGoNext}
          />
        )}

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
              bgcolor: theme.palette.warning.light || '#FFF8E1',
              color: theme.palette.primary.main,
              borderRadius: theme.custom.borderRadius.button,
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

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
              borderRadius: theme.custom.borderRadius.button,
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

