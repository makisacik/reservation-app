import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { settingsApi } from '../api/settingsApi';

const Settings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    CompanyName: '',
    Timezone: 'Europe/Istanbul',
  });

  // Reservation settings
  const [reservationSettings, setReservationSettings] = useState({
    MaxAdvanceReservationDays: '30',
    MinCancellationHours: '24',
    AutoApproval: false,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    EmailEnabled: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [general, reservation, notification] = await Promise.all([
        settingsApi.getGeneralSettings(),
        settingsApi.getReservationSettings(),
        settingsApi.getNotificationSettings(),
      ]);

      setGeneralSettings({
        CompanyName: general.CompanyName || '',
        Timezone: general.Timezone || 'Europe/Istanbul',
      });

      setReservationSettings({
        MaxAdvanceReservationDays: reservation.MaxAdvanceReservationDays || '30',
        MinCancellationHours: reservation.CancellationNoticeHours || '24',
        AutoApproval: reservation.AutoApproval === 'true' || reservation.AutoApproval === true,
      });

      setNotificationSettings({
        EmailEnabled: notification.EmailEnabled === 'true' || notification.EmailEnabled === true,
      });
    } catch (err) {
      setError('Ayarlar yüklenirken bir hata oluştu.');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      setError(null);
      await settingsApi.updateGeneralSettings({
        CompanyName: generalSettings.CompanyName,
        Timezone: generalSettings.Timezone,
      });
      setSuccess(true);
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu.');
      console.error('Error saving general settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReservation = async () => {
    try {
      setSaving(true);
      setError(null);
      await settingsApi.updateReservationSettings({
        MaxAdvanceReservationDays: reservationSettings.MaxAdvanceReservationDays,
        CancellationNoticeHours: reservationSettings.MinCancellationHours,
        AutoApproval: reservationSettings.AutoApproval.toString(),
      });
      setSuccess(true);
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu.');
      console.error('Error saving reservation settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotification = async () => {
    try {
      setSaving(true);
      setError(null);
      await settingsApi.updateNotificationSettings({
        EmailEnabled: notificationSettings.EmailEnabled.toString(),
      });
      setSuccess(true);
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu.');
      console.error('Error saving notification settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: theme.palette.custom.background.page,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: theme.custom.typography.fontWeight.semibold,
          color: theme.palette.primary.main,
          mb: 0.5,
        }}
      >
        Ayarlar
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.custom.text.tertiary,
          mb: 3,
          fontSize: '0.875rem',
        }}
      >
        Sistem ayarlarını yapılandırın
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: theme.palette.custom.border.default, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: theme.custom.typography.fontWeight.medium,
              color: theme.palette.custom.text.secondary,
              minHeight: 48,
              px: 3,
              borderRadius: theme.custom.borderRadius.tab,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: theme.custom.typography.fontWeight.semibold,
                bgcolor: theme.palette.custom.background.beige,
              },
              '&:hover:not(.Mui-selected)': {
                bgcolor: 'rgba(10, 28, 89, 0.04)',
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab label="Genel" />
          <Tab label="Rezervasyonlar" />
          <Tab label="Bildirimler" />
        </Tabs>
      </Box>

      {/* General Tab */}
      {activeTab === 0 && (
        <Card
          sx={{
            borderRadius: theme.custom.borderRadius.card,
            boxShadow: theme.custom.shadows.cardElevated,
            bgcolor: 'white',
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
              Genel Ayarlar
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.custom.text.tertiary,
                mb: 3,
                fontSize: '0.875rem',
              }}
            >
              Sistemin genel ayarlarını düzenleyin
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.medium,
                  color: theme.palette.custom.text.primary,
                  mb: 1,
                }}
              >
                Şirket Adı
              </Typography>
              <TextField
                fullWidth
                placeholder="Şirket Adı"
                value={generalSettings.CompanyName}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    CompanyName: e.target.value,
                  })
                }
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

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.medium,
                  color: theme.palette.custom.text.primary,
                  mb: 1,
                }}
              >
                Saat Dilimi
              </Typography>
              <TextField
                fullWidth
                value={generalSettings.Timezone}
                InputProps={{
                  readOnly: true,
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

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveGeneral}
              disabled={saving}
              sx={{
                borderRadius: theme.custom.borderRadius.button,
                textTransform: 'none',
                bgcolor: theme.palette.primary.main,
                px: 3,
                py: 1.5,
                fontWeight: theme.custom.typography.fontWeight.medium,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reservations Tab */}
      {activeTab === 1 && (
        <Card
          sx={{
            borderRadius: theme.custom.borderRadius.card,
            boxShadow: theme.custom.shadows.cardElevated,
            bgcolor: 'white',
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
              Rezervasyon Ayarları
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.custom.text.tertiary,
                mb: 3,
                fontSize: '0.875rem',
              }}
            >
              Rezervasyon kurallarını yapılandırın
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.medium,
                  color: theme.palette.custom.text.primary,
                  mb: 1,
                }}
              >
                Maksimum İleri Tarihli Rezervasyon (Gün)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={reservationSettings.MaxAdvanceReservationDays}
                onChange={(e) =>
                  setReservationSettings({
                    ...reservationSettings,
                    MaxAdvanceReservationDays: e.target.value,
                  })
                }
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

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.custom.typography.fontWeight.medium,
                  color: theme.palette.custom.text.primary,
                  mb: 1,
                }}
              >
                İptal İçin Minimum Süre (Saat)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={reservationSettings.MinCancellationHours}
                onChange={(e) =>
                  setReservationSettings({
                    ...reservationSettings,
                    MinCancellationHours: e.target.value,
                  })
                }
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

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: theme.custom.typography.fontWeight.medium,
                      color: theme.palette.custom.text.primary,
                      mb: 0.5,
                    }}
                  >
                    Otomatik Onay
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.custom.text.tertiary,
                      fontSize: '0.875rem',
                    }}
                  >
                    Rezervasyonları otomatik olarak onayla
                  </Typography>
                </Box>
                <Switch
                  checked={reservationSettings.AutoApproval}
                  onChange={(e) =>
                    setReservationSettings({
                      ...reservationSettings,
                      AutoApproval: e.target.checked,
                    })
                  }
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveReservation}
              disabled={saving}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                bgcolor: theme.palette.primary.main,
                px: 3,
                py: 1.5,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 2 && (
        <Card
          sx={{
            borderRadius: theme.custom.borderRadius.card,
            boxShadow: theme.custom.shadows.cardElevated,
            bgcolor: 'white',
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
              Bildirim Ayarları
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.custom.text.tertiary,
                mb: 3,
                fontSize: '0.875rem',
              }}
            >
              Bildirim tercihlerini yönetin
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: theme.custom.typography.fontWeight.medium,
                      color: theme.palette.custom.text.primary,
                      mb: 0.5,
                    }}
                  >
                    E-posta Bildirimleri
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.custom.text.tertiary,
                      fontSize: '0.875rem',
                    }}
                  >
                    Rezervasyon onayları için e-posta gönder
                  </Typography>
                </Box>
                <Switch
                  checked={notificationSettings.EmailEnabled}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      EmailEnabled: e.target.checked,
                    })
                  }
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveNotification}
              disabled={saving}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                bgcolor: theme.palette.primary.main,
                px: 3,
                py: 1.5,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Ayarlar başarıyla kaydedildi
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

export default Settings;