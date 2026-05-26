import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Paper,
   Divider, Alert
} from '@mui/material';
import PhoneAndroidIcon  from '@mui/icons-material/PhoneAndroid';
import ShieldIcon        from '@mui/icons-material/Shield';
import EngineeringIcon   from '@mui/icons-material/Engineering';
import LockIcon          from '@mui/icons-material/Lock';
import ArrowBackIcon     from '@mui/icons-material/ArrowBack';
import InfoIcon          from '@mui/icons-material/Info';

import ActionButton from '../Boton';
import { colors, inputStyle, cardStyle } from '../../utils/styles';

import { loginService } from '../../services/authServices.js';;

const Login = () => {
  const navigate = useNavigate();
  const [rolSeleccionado, setRolSeleccionado] = useState('admin');
  const [correo, setCorreo]                   = useState('');
  const [password, setPassword]               = useState('');
  const [error, setError]                     = useState('');

  const handleLogin = async () => {
    setError('');
    try{
      const response = await loginService(correo, password, rolSeleccionado);
      // Guardar Sesion
      localStorage.setItem('usuario', JSON.stringify(response.data));
      // Redirigir según rol
      if (response.data.rol === 'admin'){
        navigate('/admin/dashboard');
      }else{
        navigate('/tecnico/dashboard');
      }
    }catch(error){
      setError('Correo, contraseña o perfil incorrecto.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: colors.bg,
      display: 'flex', flexDirection: 'column',
    }}>

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
          label="Volver al inicio"
          icon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/')}
        />
      </Box>

      {/* ── Cuerpo ── */}
      <Box sx={{ flex: 1, display: 'flex' }}>

        {/* Formulario */}
        <Box sx={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', p: 4,
          borderRight: `0.5px solid ${colors.border}`,
        }}>
          <Box sx={{ width: '100%', maxWidth: 360 }}>

            {/* Ícono y título */}
            <Box sx={{
              width: 44, height: 44, bgcolor: colors.primary, borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
            }}>
              <LockIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 500, color: colors.textMain, mb: 0.5 }}>
              Acceso al sistema
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.textFaint, mb: 3 }}>
              Ingresa tus credenciales para acceder a tu panel.
            </Typography>

            {/* Selector de perfil */}
            <Divider sx={{ borderColor: colors.border, mb: 2 }}>
              <Typography sx={{ fontSize: 11, color: colors.textDisabled }}>Selecciona tu perfil</Typography>
            </Divider>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              {[
                { rol: 'admin',   label: 'Administrador', icon: <ShieldIcon sx={{ fontSize: 20 }} />,       color: colors.info },
                { rol: 'tecnico', label: 'Técnico',        icon: <EngineeringIcon sx={{ fontSize: 20 }} />, color: colors.success },
              ].map((item) => (
                <Box
                  key={item.rol}
                  onClick={() => setRolSeleccionado(item.rol)}
                  sx={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 0.8, py: 1.5, borderRadius: '8px', cursor: 'pointer',
                    border: rolSeleccionado === item.rol
                      ? `0.5px solid ${item.color}`
                      : `0.5px solid ${colors.border}`,
                    bgcolor: rolSeleccionado === item.rol ? `${item.color}15` : colors.surface,
                    transition: 'all .15s',
                  }}
                >
                  <Box sx={{ color: item.color }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 500, color: item.color }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Campos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <TextField
                fullWidth label="Correo electrónico" type="email"
                value={correo} onChange={(e) => setCorreo(e.target.value)}
                sx={inputStyle}
              />
              <TextField
                fullWidth label="Contraseña" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                sx={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </Box>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: '#1a0a0a', color: colors.danger, border: `0.5px solid ${colors.danger}33` }}>
                {error}
              </Alert>
            )}

            {/* Botón ingresar */}
            <ActionButton
              label="Ingresar"
              icon={<LockIcon />}
              onClick={handleLogin}
              sx={{ width: '100%' }}
            />

          </Box>
        </Box>

        {/* Panel derecho */}
        <Box sx={{ width: 260, bgcolor: colors.surface, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Niveles de acceso */}
          <Box>
            <Typography sx={{ fontSize: 10, color: colors.textDisabled, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.5 }}>
              Niveles de acceso
            </Typography>
            <Paper sx={{ ...cardStyle, p: 1.5 }}>
              {[
                { label: 'Administrador', badge: 'Acceso total', dotColor: colors.primary,  badgeBg: '#0e1f3a', badgeColor: colors.info },
                { label: 'Técnico',       badge: 'Solo estado',  dotColor: colors.success,  badgeBg: '#14301a', badgeColor: colors.success },
              ].map((item) => (
                <Box key={item.label} sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  py: 0.8, borderBottom: `0.5px solid ${colors.border}`,
                  '&:last-child': { borderBottom: 'none' }
                }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.dotColor, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, color: colors.textMuted, flex: 1 }}>{item.label}</Typography>
                  <Box sx={{ bgcolor: item.badgeBg, color: item.badgeColor, fontSize: 10, fontWeight: 500, px: 1, py: 0.3, borderRadius: '10px' }}>
                    {item.badge}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>

          {/* Info */}
          <Box>
            <Typography sx={{ fontSize: 10, color: colors.textDisabled, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.5 }}>
              Información
            </Typography>
            <Box sx={{ bgcolor: '#0e1f3a', border: `0.5px solid #1e3a5f`, borderRadius: '8px', p: 1.5, display: 'flex', gap: 1 }}>
              <InfoIcon sx={{ fontSize: 15, color: colors.info, flexShrink: 0, mt: 0.2 }} />
              <Typography sx={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.5 }}>
                Las credenciales son asignadas por el administrador del sistema.
              </Typography>
            </Box>
          </Box>

          {/* Cliente */}
          <Box sx={{ mt: 'auto' }}>
            <Typography sx={{ fontSize: 10, color: colors.textDisabled, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.5 }}>
              ¿Eres cliente?
            </Typography>
            <Box sx={{ bgcolor: colors.bg, border: `0.5px solid ${colors.border}`, borderRadius: '9px', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: 11, color: colors.textFaint, lineHeight: 1.5 }}>
                No necesitas cuenta. Usa tu código de seguimiento en la página principal.
              </Typography>
              <ActionButton
                label="Rastrear mi equipo"
                variant="outlined"
                onClick={() => navigate('/')}
              />
            </Box>
          </Box>

        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 1.5, bgcolor: colors.surface, borderTop: `0.5px solid ${colors.border}`, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: colors.textDisabled }}>
          © 2025 DrCell · Acceso restringido a personal autorizado
        </Typography>
      </Box>

    </Box>
  );
};

export default Login;