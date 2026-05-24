// ── Colores base ──────────────────────────────────────────────
export const colors = {
  bg:           '#0f1117',
  surface:      '#141620',
  surfaceHover: '#1e2130',
  border:       '#2a2d3a',
  borderLight:  '#1e2130',
  primary:      '#2563eb',
  primaryHover: '#1d4ed8',
  textMain:     '#e2e8f0',
  textMuted:    '#94a3b8',
  textFaint:    '#64748b',
  textDisabled: '#475569',
  success:      '#22c55e',
  warning:      '#f59e0b',
  danger:       '#ef4444',
  info:         '#60a5fa',
};

// ── Estilos de tarjeta/panel reutilizable ─────────────────────
export const cardStyle = {
  bgcolor:      colors.surface,
  border:       `0.5px solid ${colors.border}`,
  borderRadius: 2,
};

// ── Estados de reparación ─────────────────────────────────────
export const statusStyles = {
  'Pendiente':       { bgcolor: '#1c1608', color: colors.warning },
  'Diagnóstico':     { bgcolor: '#0e1f3a', color: colors.info },
  'En reparación':   { bgcolor: '#14160e', color: '#84cc16' },
  'Control calidad': { bgcolor: '#1a0e2a', color: '#a78bfa' },
  'Lista':           { bgcolor: '#0e2a1a', color: colors.success },
};

// ── Estilos de celdas de tabla ────────────────────────────────
export const tableCellBase = {
  borderColor: colors.borderLight,
  fontSize: 12,
  color: colors.textMuted
};

export const tableHeadCell = {
  borderColor: colors.border,
  fontSize: 10,
  color: colors.textDisabled,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  py: 1,
};

// ── Botón primario ────────────────────────────────────────────
export const primaryBtn = {
  bgcolor:         colors.primary,
  textTransform:   'none',
  fontWeight:      500,
  fontSize:        13,
  borderRadius:    '7px',
  color:          colors.textMain,
  '&:hover': { bgcolor: colors.primaryHover },
};

// ── Input / campo de formulario ───────────────────────────────
export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor:      colors.bg,
    borderRadius: '7px',
    fontSize:     13,
    color:        colors.textMain,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.textDisabled },
    '&.Mui-focused fieldset': { borderColor: colors.primary },
  },
  '& .MuiInputLabel-root': { color: colors.textFaint, fontSize: 13 },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.primary },
};
