import { TextField, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * SearchField - Reusable search input field
 * 
 * @param {string} value - Search value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text (default: 'Search...')
 * @param {boolean} fullWidth - Whether field should take full width (default: true)
 * @param {function} onClear - Optional clear handler (shows clear button if provided)
 */
const SearchField = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  onClear,
}) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: theme.palette.custom.text.quaternary }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: theme.custom.borderRadius.button,
          bgcolor: 'white',
        },
      }}
    />
  );
};

export default SearchField;

