import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * MealModal - Modal component for adding/editing meals
 * 
 * @param {boolean} open - Whether the modal is open
 * @param {function} onClose - Close handler
 * @param {function} onSave - Save handler (receives meal data)
 * @param {Object} meal - Existing meal data for editing (null for new meal)
 * @param {Array} categories - List of categories
 * @param {Array} restaurants - List of restaurants
 * @param {boolean} isLoading - Loading state
 */
const MealModal = ({
  open,
  onClose,
  onSave,
  meal,
  categories = [],
  restaurants = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    restaurantId: '',
    price: '',
    kcal: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when meal changes
  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name || '',
        categoryId: meal.categoryId || '',
        restaurantId: meal.restaurantId || '',
        price: meal.price !== null && meal.price !== undefined ? meal.price.toString() : '',
        kcal: meal.kcal !== null && meal.kcal !== undefined ? meal.kcal.toString() : '',
        imageUrl: meal.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        categoryId: '',
        restaurantId: '',
        price: '',
        kcal: '',
        imageUrl: '',
      });
    }
    setErrors({});
  }, [meal, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Menü adı gereklidir';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçilmelidir';
    }
    if (!formData.restaurantId) {
      newErrors.restaurantId = 'Restoran seçilmelidir';
    }
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    if (formData.kcal && (isNaN(parseInt(formData.kcal)) || parseInt(formData.kcal) < 0)) {
      newErrors.kcal = 'Geçerli bir kalori değeri giriniz';
    }
    if (formData.imageUrl && !formData.imageUrl.match(/^https?:\/\/.+/)) {
      newErrors.imageUrl = 'Geçerli bir URL giriniz';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const mealData = {
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      restaurantId: formData.restaurantId,
      price: formData.price ? parseFloat(formData.price) : null,
      kcal: formData.kcal ? parseInt(formData.kcal) : null,
      imageUrl: formData.imageUrl.trim() || null,
    };

    onSave(mealData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            {meal ? 'Menü Düzenle' : 'Yeni Menü Ekle'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {meal
              ? 'Mevcut menü bilgilerini düzenleyin'
              : 'Yeni bir yemek menüsü oluşturun'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#666',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {/* Menu Name */}
          <TextField
            label="Menü Adı"
            placeholder="Örn: Izgara Tavuk & Pilav"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          {/* Category */}
          <TextField
            select
            label="Kategori"
            value={formData.categoryId}
            onChange={handleChange('categoryId')}
            error={!!errors.categoryId}
            helperText={errors.categoryId}
            fullWidth
            required
          >
            <MenuItem value="">
              <em>Seçin</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Restaurant */}
          <TextField
            select
            label="Restoran"
            value={formData.restaurantId}
            onChange={handleChange('restaurantId')}
            error={!!errors.restaurantId}
            helperText={errors.restaurantId}
            fullWidth
            required
          >
            <MenuItem value="">
              <em>Seçin</em>
            </MenuItem>
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Price */}
          <TextField
            label="Fiyat (₺)"
            type="number"
            value={formData.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            inputProps={{
              min: 0,
              step: 0.01,
            }}
          />

          {/* Calories */}
          <TextField
            label="Kalori"
            type="number"
            value={formData.kcal}
            onChange={handleChange('kcal')}
            error={!!errors.kcal}
            helperText={errors.kcal}
            fullWidth
            inputProps={{
              min: 0,
            }}
          />

          {/* Image URL */}
          <TextField
            label="Görsel URL"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={handleChange('imageUrl')}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#666',
            textTransform: 'none',
            borderRadius: '12px',
            px: 3,
          }}
          disabled={isLoading}
        >
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: '#0A1C59',
            color: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            px: 3,
            '&:hover': {
              bgcolor: '#0d2a7a',
            },
            '&:disabled': {
              bgcolor: '#ccc',
            },
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealModal;



