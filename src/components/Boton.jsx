import { Button } from '@mui/material';
import { primaryBtn } from '../utils/styles';
/**
 * ActionButton — botón reutilizable
 * Props:
 * - label: texto del botón
 * - icon: ícono izquierdo
 * - onClick: función al hacer clic
 * - color: 'primary' | 'error' | 'success' (opcional)
 * - variant: 'contained' | 'outlined' (opcional, default contained)
 */

const Boton = ({ label, icon, onClick, color, variant = 'contained' }) => {
  return (
    <Button
      variant={variant}
      startIcon={icon}
      onClick={onClick}
      color={color}
      sx={primaryBtn}
    >
      {label}
    </Button>
  );
};

export default Boton;