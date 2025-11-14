import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  IconButton,
  TablePagination,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservationsApi';
import StatusBadge from '../../components/reservations/StatusBadge';
import CreateReservationModal from '../../components/reservations/CreateReservationModal';
import ReservationDetailModal from '../../components/reservations/ReservationDetailModal';
import ConfirmApprovalDialog from '../../components/reservations/ConfirmApprovalDialog';

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const formatDateTurkish = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateTimeTurkish = (dateStr, timeSlotName) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  
  let timeRange = '';
  if (timeSlotName) {
    const timeMatch = timeSlotName.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);
    if (timeMatch) {
      timeRange = ` (${timeMatch[1]})`;
    }
  }
  
  return `${day} ${month} ${year}${timeRange}`;
};

const AdminReservations = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [reservationToApprove, setReservationToApprove] = useState(null);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [dateFrom, setDateFrom] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(lastDayOfMonth.toISOString().split('T')[0]);

  const queryParams = useMemo(() => {
    const params = {
      page: page + 1,
      pageSize,
      dateFrom: dateFrom ? new Date(dateFrom).toISOString() : firstDayOfMonth.toISOString(),
      dateTo: dateTo ? new Date(dateTo + 'T23:59:59').toISOString() : lastDayOfMonth.toISOString(),
    };
    
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    
    return params;
  }, [page, pageSize, searchQuery, statusFilter, dateFrom, dateTo, firstDayOfMonth, lastDayOfMonth]);

  const { data: reservationsData, isLoading: reservationsLoading } = useQuery({
    queryKey: ['admin-reservations', queryParams],
    queryFn: () => reservationsApi.getReservations(queryParams),
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['reservation-summary'],
    queryFn: () => reservationsApi.getReservationSummary(),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => reservationsApi.approveReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reservations']);
      queryClient.invalidateQueries(['reservation-summary']);
      setSnackbar({ open: true, message: 'Rezervasyon başarıyla onaylandı', severity: 'success' });
      setApprovalDialogOpen(false);
      setReservationToApprove(null);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Rezervasyon onaylanırken bir hata oluştu',
        severity: 'error',
      });
    },
  });

  const handleApproveClick = (reservation) => {
    setReservationToApprove(reservation);
    setApprovalDialogOpen(true);
  };

  const handleConfirmApproval = () => {
    if (reservationToApprove) {
      approveMutation.mutate(reservationToApprove.id);
    }
  };

  const handleCloseApprovalDialog = () => {
    if (!approveMutation.isPending) {
      setApprovalDialogOpen(false);
      setReservationToApprove(null);
    }
  };

  const handleExport = () => {
    setSnackbar({ open: true, message: 'Dışa aktarma özelliği yakında eklenecek', severity: 'info' });
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenDetailModal = (reservationId) => {
    setSelectedReservationId(reservationId);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedReservationId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const reservations = reservationsData?.data || [];
  const totalCount = reservationsData?.totalCount || 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.custom.background.page, minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main, mb: 0.5 }}>
            Rezervasyon Yönetimi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tüm rezervasyonları görüntüleyin ve yönetin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            borderRadius: theme.custom.borderRadius.button,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Yeni Rezervasyon
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="İsim, rezervasyon no veya menü ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.custom.text.quaternary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            },
          }}
        />
        <TextField
          type="date"
          label="Tarih Seç"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            },
          }}
        />
        <TextField
          type="date"
          label="Bitiş"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            },
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Durum"
            sx={{
              borderRadius: theme.custom.borderRadius.button,
              bgcolor: 'white',
            }}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="Pending">Beklemede</MenuItem>
            <MenuItem value="Active">Onaylandı</MenuItem>
            <MenuItem value="Cancelled">İptal</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          sx={{
            borderRadius: theme.custom.borderRadius.button,
            textTransform: 'none',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              bgcolor: 'rgba(10, 28, 89, 0.04)',
            },
          }}
        >
          Dışa Aktar
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.card,
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bugün
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main }}>
              {summaryLoading ? <CircularProgress size={24} /> : summary?.todayCount || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.card,
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bu Hafta
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main }}>
              {summaryLoading ? <CircularProgress size={24} /> : summary?.thisWeekCount || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.card,
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bu Ay
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.success.light }}>
              {summaryLoading ? <CircularProgress size={24} /> : summary?.thisMonthCount || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              borderRadius: theme.custom.borderRadius.card,
              boxShadow: theme.custom.shadows.card,
              bgcolor: 'white',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Beklemede
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.warning.main }}>
              {summaryLoading ? <CircularProgress size={24} /> : summary?.pendingCount || 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main, mb: 2 }}>
          Rezervasyon Listesi
        </Typography>
      </Box>

      {reservationsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : reservations.length === 0 ? (
        <Card
          sx={{
            p: 4,
            borderRadius: theme.custom.borderRadius.large,
            boxShadow: theme.custom.shadows.card,
            bgcolor: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Rezervasyon bulunamadı
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: theme.custom.borderRadius.large,
            boxShadow: theme.custom.shadows.card,
            bgcolor: 'white',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.custom.background.page }}>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Rezervasyon No</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Öğün</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Menü</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Restoran</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} hover>
                  <TableCell>{reservation.reservationNumber}</TableCell>
                  <TableCell>{reservation.userName}</TableCell>
                  <TableCell>
                    {formatDateTimeTurkish(reservation.date, reservation.mealTimeSlotName)}
                  </TableCell>
                  <TableCell>{reservation.mealTimeSlotName}</TableCell>
                  <TableCell>{reservation.menuName || '-'}</TableCell>
                  <TableCell>{reservation.restaurantName}</TableCell>
                  <TableCell>
                    <StatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleOpenDetailModal(reservation.id)}
                        sx={{ color: theme.palette.primary.main, textDecoration: 'none', cursor: 'pointer' }}
                      >
                        Detay
                      </Link>
                      {reservation.status === 'Pending' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleApproveClick(reservation)}
                          disabled={approveMutation.isPending}
                          sx={{
                            bgcolor: theme.palette.info.main,
                            color: 'white',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            px: 2,
                            '&:hover': {
                              bgcolor: theme.palette.info.dark || theme.palette.info.main,
                            },
                          }}
                        >
                          Onayla
                        </Button>
                      )}
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

      <CreateReservationModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'Rezervasyon başarıyla oluşturuldu', severity: 'success' });
        }}
      />

      <ReservationDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        reservationId={selectedReservationId}
      />

      <ConfirmApprovalDialog
        open={approvalDialogOpen}
        onClose={handleCloseApprovalDialog}
        onConfirm={handleConfirmApproval}
        reservationNumber={reservationToApprove?.reservationNumber}
        isLoading={approveMutation.isPending}
      />
    </Box>
  );
};

export default AdminReservations;

