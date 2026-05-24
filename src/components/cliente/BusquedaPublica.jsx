import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Paper, Grid, Divider
} from '@mui/material';
import PhoneAndroidIcon  from '@mui/icons-material/PhoneAndroid';
import SearchIcon        from '@mui/icons-material/Search';
import RadarIcon         from '@mui/icons-material/TrackChanges';
import ReceiptIcon       from '@mui/icons-material/Receipt';
import VisibilityIcon    from '@mui/icons-material/Visibility';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import ActionButton from '../Boton';
import StatusChip   from '../StatusChip';
import { colors, cardStyle, inputStyle } from '../../utils/styles';

// ── Datos de ejemplo (luego vendrán del backend) ───────────────
const reparaciones = [
  { codigo: '#REP-1048', equipo: 'iPhone 14 Pro',  falla: 'Pantalla rota',    tecnico: 'Luis Torres',  estado: 'En reparación',   entrega: '2 días' },
  { codigo: '#REP-1047', equipo: 'Samsung S23',    falla: 'Batería agotada',  tecnico: 'Pedro Granda', estado: 'Lista',           entrega: 'Hoy' },
  { codigo: '#REP-1046', equipo: 'Xiaomi 12T',     falla: 'No carga',         tecnico: 'Luis Torres',  estado: 'Diagnóstico',     entrega: '3 días' },
  { codigo: '#REP-1045', equipo: 'Motorola G82',   falla: 'No enciende',      tecnico: 'Sin asignar',  estado: 'Pendiente',       entrega: 'Por definir' },
];

// ── Pasos del progreso según estado ───────────────────────────
const pasos = ['Recibido', 'Diagnóstico', 'Reparación', 'Control calidad', 'Listo para retiro'];

const pasoActivo = {
  'Pendiente':       0,
  'Diagnóstico':     1,
  'En reparación':   2,
  'Control calidad': 3,
  'Lista':           4,
};

// ── Componente principal ───────────────────────────────────────
const BusquedaPublica = () => {
  const navigate  = useNavigate();
  const [codigo, setCodigo]       = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError]         = useState('');

  const buscar = () => {
    setError('');
    setResultado(null);
    const found = reparaciones.find(r => r.codigo.toLowerCase() === codigo.toLowerCase());
    if (!found) {
      setError('No encontramos un equipo con ese código. Verifica e intenta de nuevo.');
      return;
    }
    setResultado(found);
    setCodigo(''); // Limpiar input después de la búsqueda
  };

  const pasoActualIdx = resultado ? (pasoActivo[resultado.estado] ?? 0) : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Topbar ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3.5, py: 2, bgcolor: colors.surface,
        borderBottom: `0.5px solid ${colors.border}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 34, height: 34, bgcolor: colors.primary, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PhoneAndroidIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.textMain }}>DrCell</Typography>
            <Typography sx={{ fontSize: 11, color: colors.textFaint }}>Reparación de celulares</Typography>
          </Box>
        </Box>
        <ActionButton
          label="Iniciar sesión"
          variant="outlined"
          onClick={() => navigate('/login')}
        />
      </Box>

      {/* ── Hero ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, py: 5 }}>

        {/* Badge */}
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.8,
          bgcolor: '#0e1f3a', color: colors.info,
          border: `0.5px solid #1e3a5f`, borderRadius: '20px',
          px: 1.5, py: 0.5, fontSize: 11, fontWeight: 500, mb: 2.5,
        }}>
          <RadarIcon sx={{ fontSize: 13 }} /> Seguimiento en tiempo real
        </Box>

        {/* Título */}
        <Typography sx={{ fontSize: 32, fontWeight: 500, color: colors.textMain, textAlign: 'center', lineHeight: 1.25, mb: 1.5 }}>
          ¿Cómo está tu <Box component="span" sx={{ color: colors.primary }}>celular</Box>?
        </Typography>
        <Typography sx={{ fontSize: 14, color: colors.textFaint, textAlign: 'center', maxWidth: 420, lineHeight: 1.6, mb: 4 }}>
          Ingresa el código que te entregamos al dejar tu equipo y conoce el estado de tu reparación al instante.
        </Typography>

        {/* Buscador */}
        <Paper sx={{ ...cardStyle, p: 3, width: '100%', maxWidth: 500, mb: 3 }}>
          <Typography sx={{ fontSize: 12, color: colors.textFaint, mb: 1.5 }}>
            Código de seguimiento
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              placeholder="#REP-0000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
              sx={{
                ...inputStyle,
                '& input': { fontFamily: 'monospace', letterSpacing: '0.04em' }
              }}
            />
            <ActionButton label="Rastrear" icon={<SearchIcon />} onClick={buscar} />
          </Box>
          <Typography sx={{ fontSize: 11, color: colors.textDisabled, mt: 1.5 }}>
            💡 El código está en el comprobante que te entregamos.
          </Typography>
        </Paper>

        {/* Error */}
        {error && (
          <Paper sx={{ ...cardStyle, p: 2, width: '100%', maxWidth: 500, mb: 3, borderColor: `${colors.danger}44` }}>
            <Typography sx={{ fontSize: 13, color: colors.danger, textAlign: 'center' }}>{error}</Typography>
          </Paper>
        )}

        {/* Resultado */}
        {resultado && (
          <Paper sx={{ ...cardStyle, p: 2.5, width: '100%', maxWidth: 500, mb: 3 }}>

            {/* Header resultado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 18, fontFamily: 'monospace', color: colors.info, fontWeight: 500, mb: 0.5 }}>
                  {resultado.codigo}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.textMain, fontWeight: 500 }}>
                  {resultado.equipo}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textFaint, mt: 0.3 }}>
                  Técnico: {resultado.tecnico} · Est. entrega: {resultado.entrega}
                </Typography>
              </Box>
              <StatusChip label={resultado.estado} />
            </Box>

            <Divider sx={{ borderColor: colors.border, mb: 2 }} />

            {/* Progreso */}
            <Typography sx={{ fontSize: 10, color: colors.textDisabled, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
              Progreso de reparación
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {pasos.map((paso, idx) => {
                const done   = idx < pasoActualIdx;
                const active = idx === pasoActualIdx;
                return (
                  <Box key={paso} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {/* Línea conectora */}
                    {idx < pasos.length - 1 && (
                      <Box sx={{
                        position: 'absolute', top: 13, left: '60%', width: '80%', height: '1px',
                        bgcolor: done ? colors.success : colors.border,
                      }} />
                    )}
                    {/* Círculo */}
                    <Box sx={{
                      width: 26, height: 26, borderRadius: '50%', zIndex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: done ? colors.success : active ? colors.primary : colors.surfaceHover,
                      border: active ? `2px solid ${colors.primary}` : 'none',
                    }}>
                      {done
                        ? <CheckCircleIcon sx={{ fontSize: 16, color: '#fff' }} />
                        : <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: active ? '#fff' : colors.textDisabled }} />
                      }
                    </Box>
                    {/* Label */}
                    <Typography sx={{
                      fontSize: 9, textAlign: 'center', mt: 0.5, lineHeight: 1.3,
                      color: done ? colors.success : active ? colors.info : colors.textDisabled,
                      fontWeight: active ? 500 : 400,
                    }}>
                      {paso}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

          </Paper>
        )}

        {/* Tarjetas informativas */}
        {!resultado && (
          <Grid container spacing={1.5} sx={{ maxWidth: 500, width: '100%' }}>
            {[
              { icon: <ReceiptIcon />,       title: 'Ingresa tu código',  desc: 'Está en tu comprobante de entrega',  color: colors.info },
              { icon: <VisibilityIcon />,    title: 'Ve el estado',       desc: 'Diagnóstico, reparación o listo',    color: colors.success },
              { icon: <NotificationsIcon />, title: 'Sin llamadas',       desc: 'Todo desde aquí, sin esperar',       color: colors.warning },
            ].map((item) => (
              <Grid item xs={4} key={item.title}>
                <Paper sx={{ ...cardStyle, p: 1.5, textAlign: 'center' }}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '8px', mx: 'auto', mb: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: `${item.color}15`, color: item.color,
                    '& .MuiSvgIcon-root': { fontSize: 17 }
                  }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 500, color: colors.textMain, mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ fontSize: 10, color: colors.textFaint, lineHeight: 1.4 }}>{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

      </Box>

      {/* Footer */}
      <Box sx={{ py: 1.5, bgcolor: colors.surface, borderTop: `0.5px solid ${colors.border}`, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: colors.textDisabled }}>
          © 2025 DrCell · Todos los derechos reservados
        </Typography>
      </Box>

    </Box>
  );
};

export default BusquedaPublica;