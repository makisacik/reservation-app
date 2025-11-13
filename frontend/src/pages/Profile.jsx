import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Profile = () => {
  // Example data matching the image
  const [formData, setFormData] = useState({
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'ahmet.yilmaz@sirket.com',
    phone: '+90 555 123 4567',
    department: 'IT Departmanı',
  });

  const [foodPreferences, setFoodPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseIntolerant: false,
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleFoodPreferenceToggle = (preference) => {
    setFoodPreferences({
      ...foodPreferences,
      [preference]: !foodPreferences[preference],
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', formData, foodPreferences);
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      name: 'Ahmet',
      surname: 'Yılmaz',
      email: 'ahmet.yilmaz@sirket.com',
      phone: '+90 555 123 4567',
      department: 'IT Departmanı',
    });
    setFoodPreferences({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lactoseIntolerant: false,
    });
  };

  // Get initials for avatar
  const getInitials = (name, surname) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: '#F6F7FB',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid container spacing={3}>
        {/* Profile Card - Top Left */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              bgcolor: 'white',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#0A1C59',
                  mb: 0.5,
                }}
              >
                Profilim
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#9E9E9E',
                  mb: 3,
                  fontSize: '0.875rem',
                }}
              >
                Hesap bilgilerinizi görüntüleyin ve düzenleyin
              </Typography>

              {/* Avatar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #C94B4B 100%)',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {getInitials(formData.name, formData.surname)}
                </Avatar>
              </Box>

              {/* Name */}
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#0A1C59',
                  mb: 0.5,
                }}
              >
                {formData.name} {formData.surname}
              </Typography>

              {/* Title */}
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  mb: 2,
                }}
              >
                Yazılım Geliştirici
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label="Personel"
                  sx={{
                    bgcolor: '#1665d8',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                <Chip
                  label="IT Departmanı"
                  sx={{
                    bgcolor: '#E0E0E0',
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
              </Box>

              {/* Membership Date */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.875rem',
                  }}
                >
                  Üyelik: Ocak 2023
                </Typography>
              </Box>

              {/* Company Location */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.875rem',
                  }}
                >
                  Şirket Merkez
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information Form - Top Right */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              bgcolor: 'white',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#0A1C59',
                  mb: 3,
                }}
              >
                Kişisel Bilgiler
              </Typography>

              {/* Name Field */}
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="Ad"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: '#9E9E9E',
                        }}
                        disabled
                      >
                        <PersonIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0A1C59',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0A1C59',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0A1C59',
                    },
                  }}
                />
              </Box>

              {/* Surname Field */}
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="Soyad"
                  value={formData.surname}
                  onChange={handleInputChange('surname')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0A1C59',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0A1C59',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0A1C59',
                    },
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="E-posta"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: '#9E9E9E',
                        }}
                        disabled
                      >
                        <EmailIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0A1C59',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0A1C59',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0A1C59',
                    },
                  }}
                />
              </Box>

              {/* Phone Field */}
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="Telefon"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: '#9E9E9E',
                        }}
                        disabled
                      >
                        <PhoneIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0A1C59',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0A1C59',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0A1C59',
                    },
                  }}
                />
              </Box>

              {/* Department Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Departman"
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: '#9E9E9E',
                        }}
                        disabled
                      >
                        <BusinessIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0A1C59',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0A1C59',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0A1C59',
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    color: '#666',
                    borderColor: '#E0E0E0',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#9E9E9E',
                      bgcolor: '#F5F5F5',
                    },
                  }}
                >
                  İptal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    bgcolor: '#0A1C59',
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#0d2569',
                    },
                  }}
                >
                  Kaydet
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Food Preferences - Bottom */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              bgcolor: 'white',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#0A1C59',
                  mb: 3,
                }}
              >
                Yemek Tercihleri
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant={foodPreferences.vegetarian ? 'contained' : 'outlined'}
                  onClick={() => handleFoodPreferenceToggle('vegetarian')}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    bgcolor: foodPreferences.vegetarian ? '#0A1C59' : 'transparent',
                    color: foodPreferences.vegetarian ? 'white' : '#666',
                    borderColor: '#E0E0E0',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: foodPreferences.vegetarian ? '#0d2569' : '#F5F5F5',
                      borderColor: foodPreferences.vegetarian ? '#0d2569' : '#9E9E9E',
                    },
                  }}
                >
                  Vejetaryen
                </Button>

                <Button
                  variant={foodPreferences.vegan ? 'contained' : 'outlined'}
                  onClick={() => handleFoodPreferenceToggle('vegan')}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    bgcolor: foodPreferences.vegan ? '#0A1C59' : 'transparent',
                    color: foodPreferences.vegan ? 'white' : '#666',
                    borderColor: '#E0E0E0',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: foodPreferences.vegan ? '#0d2569' : '#F5F5F5',
                      borderColor: foodPreferences.vegan ? '#0d2569' : '#9E9E9E',
                    },
                  }}
                >
                  Vegan
                </Button>

                <Button
                  variant={foodPreferences.glutenFree ? 'contained' : 'outlined'}
                  onClick={() => handleFoodPreferenceToggle('glutenFree')}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    bgcolor: foodPreferences.glutenFree ? '#0A1C59' : 'transparent',
                    color: foodPreferences.glutenFree ? 'white' : '#666',
                    borderColor: '#E0E0E0',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: foodPreferences.glutenFree ? '#0d2569' : '#F5F5F5',
                      borderColor: foodPreferences.glutenFree ? '#0d2569' : '#9E9E9E',
                    },
                  }}
                >
                  Gluten Free
                </Button>

                <Button
                  variant={foodPreferences.lactoseIntolerant ? 'contained' : 'outlined'}
                  onClick={() => handleFoodPreferenceToggle('lactoseIntolerant')}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    bgcolor: foodPreferences.lactoseIntolerant ? '#0A1C59' : 'transparent',
                    color: foodPreferences.lactoseIntolerant ? 'white' : '#666',
                    borderColor: '#E0E0E0',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: foodPreferences.lactoseIntolerant ? '#0d2569' : '#F5F5F5',
                      borderColor: foodPreferences.lactoseIntolerant ? '#0d2569' : '#9E9E9E',
                    },
                  }}
                >
                  Laktoz İntoleransı
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
