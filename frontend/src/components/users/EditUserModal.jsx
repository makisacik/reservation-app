import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/usersApi';

const EditUserModal = ({ open, onClose, user, onSuccess }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'User',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        role: user.role || 'User',
        status: user.status === 'Active' || user.status === 1 ? 'Active' : 'Passive',
      });
      setErrors({});
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => usersApi.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['user-statistics']);
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu';
      setErrors({ submit: errorMessage });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'İsim gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim() || null,
      role: formData.role,
      status: formData.status,
    });
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          fontWeight: theme.custom.typography.fontWeight.semibold,
          color: theme.palette.primary.main,
        }}
      >
        Kullanıcı Düzenle
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 0.5 }}
          color="inherit"
          disabled={updateMutation.isPending}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="İsim"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              label="E-posta"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <TextField
              label="Departman"
              value={formData.department}
              onChange={handleChange('department')}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                label="Rol"
              >
                <MenuItem value="User">Kullanıcı</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange('status')}
                label="Durum"
              >
                <MenuItem value="Active">Aktif</MenuItem>
                <MenuItem value="Passive">Pasif</MenuItem>
              </Select>
            </FormControl>
            {errors.submit && (
              <Typography color="error" variant="body2">
                {errors.submit}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} disabled={updateMutation.isPending}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateMutation.isPending}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.darker },
            }}
          >
            {updateMutation.isPending ? <CircularProgress size={20} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;

