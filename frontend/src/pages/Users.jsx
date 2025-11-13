import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import UserAvatar from '../components/users/UserAvatar';
import StatusBadge from '../components/users/StatusBadge';
import UserDetailModal from '../components/users/UserDetailModal';
import EditUserModal from '../components/users/EditUserModal';
import CreateUserModal from '../components/users/CreateUserModal';

const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      page: page + 1,
      pageSize,
    };
    
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    return params;
  }, [page, pageSize, searchQuery]);

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: () => usersApi.getFilteredUsers(queryParams),
  });

  // Fetch statistics
  const { data: statistics, isLoading: statisticsLoading } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: () => usersApi.getUserStatistics(),
  });

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDetailModal = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const users = usersData?.data || [];
  const totalCount = usersData?.totalCount || 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1C59', mb: 0.5 }}>
            Kullanıcı Yönetimi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistem kullanıcılarını yönetin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreateModal}
          sx={{
            bgcolor: '#0A1C59',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: '#0d2a7a',
            },
          }}
        >
          Yeni Kullanıcı
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Kullanıcı ara..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0); // Reset to first page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: 'white',
            },
          }}
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Toplam Kullanıcı
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1C59' }}>
              {statisticsLoading ? <CircularProgress size={24} /> : statistics?.totalUsers || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Aktif
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981' }}>
              {statisticsLoading ? <CircularProgress size={24} /> : statistics?.activeUsers || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Pasif
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1C59' }}>
              {statisticsLoading ? <CircularProgress size={24} /> : statistics?.passiveUsers || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bu Ay Yeni
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1C59' }}>
              {statisticsLoading ? <CircularProgress size={24} /> : statistics?.newThisMonth || 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* User List */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1C59', mb: 2 }}>
          Kullanıcı Listesi
        </Typography>
      </Box>

      {usersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Card
          sx={{
            p: 4,
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            bgcolor: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Kullanıcı bulunamadı
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            bgcolor: 'white',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F6F7FB' }}>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>E-posta</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Departman</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Toplam Rezervasyon</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <UserAvatar name={user.name} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#999' }} />
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.department ? (
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                          bgcolor: '#F0F0F0',
                          color: '#666',
                        }}
                      >
                        {user.department}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.totalReservations || 0}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleOpenEditModal(user)}
                        sx={{ color: '#0A1C59', textDecoration: 'none', cursor: 'pointer' }}
                      >
                        Düzenle
                      </Link>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleOpenDetailModal(user)}
                        sx={{ color: '#0A1C59', textDecoration: 'none', cursor: 'pointer' }}
                      >
                        Detay
                      </Link>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Sayfa başına:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `~${to}`}`}
          />
        </TableContainer>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={() => {
          handleSuccess('Kullanıcı başarıyla oluşturuldu');
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
        onSuccess={() => {
          handleSuccess('Kullanıcı başarıyla güncellendi');
        }}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        user={selectedUser}
      />
    </Box>
  );
};

export default Users;
