import { Chip } from '@mui/material';
import { statusStyles } from '../utils/styles';

const StatusChip = ({ label }) => (
  <Chip
    label={label}
    size="small"
    sx={{
      ...statusStyles[label],
      fontSize: 11,
      fontWeight: 500,
      height: 22,
      borderRadius: '20px',
      display: 'inline-flex',
      alignContent: 'center',
      '& .MuiChip-label': { px: 1.5 },
      
    }}
  />
);

export default StatusChip;