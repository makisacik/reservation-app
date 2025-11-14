import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const Table = ({
  columns,
  rows,
  loading = false,
  page = 0,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(event.target.value, 10));
    }
  };

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  if (!rows || rows.length === 0) {
    return <EmptyState message="No data available" />;
  }

  return (
    <TableContainer component={Paper}>
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{ fontWeight: theme.custom.typography.fontWeight.semibold }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id || index} hover>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.render
                    ? column.render(row[column.id], row)
                    : row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
      {totalCount > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </TableContainer>
  );
};

export default Table;

