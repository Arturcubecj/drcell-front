import { Box, Paper, Typography } from '@mui/material';
import { colors, cardStyle } from '../utils/styles';

const MetricCard = ({ label, value, sub, subColor, icon }) => (
  <Paper sx={{ ...cardStyle, p: 2.5, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
      <Typography sx={{ fontSize: 11, color: colors.textFaint }}>{label}</Typography>
      <Box sx={{ color: colors.textDisabled, '& .MuiSvgIcon-root': { fontSize: 16 } }}>{icon}</Box>
    </Box>
    <Typography sx={{ fontSize: 26, fontWeight: 500, color: colors.textMain }}>{value}</Typography>
    <Typography sx={{ fontSize: 11, color: subColor ?? colors.success, mt: 0.5 }}>{sub}</Typography>
  </Paper>
);

export default MetricCard;