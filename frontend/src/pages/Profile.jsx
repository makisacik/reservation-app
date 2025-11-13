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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usersApi } from '../api/usersApi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: authUser, setAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // User data
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
      
      // Validate name
      if (!formData.name.trim()) {
        setError('Ad alanı zorunludur.');
        return;
      }
      
      const updatedUser = await usersApi.updateCurrentUserProfile({
        name: formData.name.trim(),
        department: formData.department.trim() || null,
      });
      
      // Update auth context with new user data
      const token = localStorage.getItem('token');
      if (token) {
        setAuthState(token, updatedUser);
      }
      
      // Update original data and form data
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
    // Reset to original values
    setFormData({
      ...originalData,
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format created date
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

  // Get role display name
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

  // Use formData for editable fields (it's loaded from API and updated after save)
  // Fallback to authUser if formData is not yet loaded
  // Use authUser for non-editable fields (role, createdAt)
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
                  {getInitials(displayUser.name)}
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
                {displayUser.name || 'Kullanıcı'}
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
                {displayUser.department || 'Departman Belirtilmemiş'}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={getRoleDisplayName(displayUser.role)}
                  sx={{
                    bgcolor: '#1665d8',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                {displayUser.department && (
                  <Chip
                    label={displayUser.department}
                    sx={{
                      bgcolor: '#E0E0E0',
                      color: '#666',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                )}
              </Box>

              {/* Membership Date */}
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
                  <CalendarTodayIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.875rem',
                    }}
                  >
                    {formatCreatedDate(displayUser.createdAt)}
                  </Typography>
                </Box>
              )}

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
                  label="Ad Soyad"
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

              {/* Email Field */}
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
                      bgcolor: '#F5F5F5',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
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
                  disabled={saving}
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
                  disabled={saving}
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
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
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

      {/* Error Snackbar */}
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
