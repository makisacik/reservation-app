import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usersApi } from '../../api/usersApi';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const theme = useTheme();
  const { user: authUser, setAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await usersApi.getCurrentUser();
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        department: userData.department || '',
      });
      
      setOriginalData({
        name: userData.name || '',
        email: userData.email || '',
        department: userData.department || '',
      });
    } catch (err) {
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Ad alanı zorunludur.');
        return;
      }
      
      const updatedUser = await usersApi.updateCurrentUserProfile({
        name: formData.name.trim(),
        department: formData.department.trim() || null,
      });
      
      const token = localStorage.getItem('token');
      if (token) {
        setAuthState(token, updatedUser);
      }
      
      setOriginalData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        department: updatedUser.department || '',
      });
      
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        department: updatedUser.department || '',
      });
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Profil kaydedilirken bir hata oluştu.');
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...originalData,
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatCreatedDate = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    try {
      const date = new Date(dateString);
      const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      return `Üyelik: ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return 'Bilinmiyor';
    }
  };

  const getRoleDisplayName = (role) => {
    if (role === 'Admin' || role === 1) return 'Admin';
    return 'Personel';
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const displayUser = {
    name: formData.name || authUser?.name || '',
    email: formData.email || authUser?.email || '',
    department: formData.department || authUser?.department || '',
    role: authUser?.role || 'User',
    createdAt: authUser?.createdAt || null,
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: theme.palette.custom.background.page,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.cardElevated,
              bgcolor: 'white',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.semibold,
                  color: theme.palette.primary.main,
                  mb: 0.5,
                }}
              >
                Profilim
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.custom.text.tertiary,
                  mb: 3,
                  fontSize: '0.875rem',
                }}
              >
                Hesap bilgilerinizi görüntüleyin ve düzenleyin
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'transparent',
                    background: theme.palette.custom.gradients.primary,
                    fontSize: '2.5rem',
                    fontWeight: theme.custom.typography.fontWeight.semibold,
                    color: 'white',
                  }}
                >
                  {getInitials(displayUser.name)}
                </Avatar>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontWeight: theme.custom.typography.fontWeight.semibold,
                  color: theme.palette.primary.main,
                  mb: 0.5,
                }}
              >
                {displayUser.name || 'Kullanıcı'}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: theme.palette.custom.text.secondary,
                  mb: 2,
                }}
              >
                {displayUser.department || 'Departman Belirtilmemiş'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={getRoleDisplayName(displayUser.role)}
                  sx={{
                    bgcolor: theme.palette.primary.light,
                    color: 'white',
                    fontWeight: theme.custom.typography.fontWeight.medium,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                {displayUser.department && (
                  <Chip
                    label={displayUser.department}
                    sx={{
                      bgcolor: theme.palette.custom.border.default,
                      color: theme.palette.custom.text.secondary,
                      fontWeight: theme.custom.typography.fontWeight.medium,
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                )}
              </Box>

              {displayUser.createdAt && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 18, color: theme.palette.custom.text.tertiary }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.custom.text.secondary,
                      fontSize: '0.875rem',
                    }}
                  >
                    {formatCreatedDate(displayUser.createdAt)}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 18, color: theme.palette.custom.text.tertiary }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.custom.text.secondary,
                    fontSize: '0.875rem',
                  }}
                >
                  Şirket Merkez
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.cardElevated,
              bgcolor: 'white',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.semibold,
                  color: theme.palette.primary.main,
                  mb: 3,
                }}
              >
                Kişisel Bilgiler
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: theme.palette.custom.text.tertiary,
                        }}
                        disabled
                      >
                        <PersonIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.custom.borderRadius.input,
                      '& fieldset': {
                        borderColor: theme.palette.custom.border.default,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="E-posta"
                  value={formData.email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        edge="start"
                        sx={{
                          mr: 1,
                          color: theme.palette.custom.text.tertiary,
                        }}
                        disabled
                      >
                        <EmailIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.custom.borderRadius.input,
                      bgcolor: theme.palette.custom.background.light,
                      '& fieldset': {
                        borderColor: theme.palette.custom.border.default,
                      },
                    },
                  }}
                />
              </Box>

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
                          color: theme.palette.custom.text.tertiary,
                        }}
                        disabled
                      >
                        <BusinessIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.custom.borderRadius.input,
                      '& fieldset': {
                        borderColor: theme.palette.custom.border.default,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                  sx={{
                    borderRadius: theme.custom.borderRadius.button,
                    textTransform: 'none',
                    color: theme.palette.custom.text.secondary,
                    borderColor: theme.palette.custom.border.default,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: theme.palette.custom.border.dark,
                      bgcolor: theme.palette.custom.background.light,
                    },
                  }}
                >
                  İptal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    borderRadius: theme.custom.borderRadius.button,
                    textTransform: 'none',
                    bgcolor: theme.palette.primary.main,
                    px: 3,
                    py: 1,
                    fontWeight: theme.custom.typography.fontWeight.medium,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profil başarıyla güncellendi
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
