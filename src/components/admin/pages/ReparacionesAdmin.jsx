import {useState } from 'react';
import{
    Box, Typography, Modal, TextField, Grid, MenuItem, IconButton, Tooltip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../DataTable';
import ActionButton from '../../Boton';
import StatusChip from '../../StatusChip';
import { colors, cardStyle, inputStyle } from '../../../utils/styles';
// ──────────────Datos de ejemplo────────────────
const dataInicial = [
  { codigo: '#REP-1048', cliente: 'Carlos Vega',  equipo: 'iPhone 14 Pro', tecnico: 'Luis T.',     estado: 'En reparación', nota: 'Pantalla rota por caída' },
  { codigo: '#REP-1047', cliente: 'Ana Morales',  equipo: 'Samsung S23',   tecnico: 'Pedro G.',    estado: 'Lista',         nota: 'Batería agotada, reemplazada' },
  { codigo: '#REP-1046', cliente: 'Diego Saltos', equipo: 'Xiaomi 12T',    tecnico: 'Luis T.',     estado: 'Diagnóstico',   nota: 'No carga, revisando placa' },
  { codigo: '#REP-1045', cliente: 'María Paz',    equipo: 'Motorola G82',  tecnico: 'Sin asignar', estado: 'Pendiente',     nota: 'No enciende' },
  { codigo: '#REP-1044', cliente: 'Roberto Loor', equipo: 'iPhone 13',     tecnico: 'Pedro G.',    estado: 'En reparación', nota: 'Cámara trasera dañada' },
];

const estados = ['Pendiente', 'Diagnóstico', 'En reparación', 'Control calidad', 'Lista'];
const tecnicos = ['Luis T.', 'Pedro G.', 'Sofía R.', 'Marco L.', 'Sin asignar'];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
};

const campoVacio = { codigo: '', cliente: '', equipo: '', tecnico: '', estado: 'Pendiente', nota: '' };
// ── Componente principal ───────────────────────────────────────
const Reparaciones = () => {
  const [rows, setRows]               = useState(dataInicial);
  const [modalNuevo, setModalNuevo]   = useState(false);
  const [modalInfo, setModalInfo]     = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado]   = useState(null);
  const [form, setForm]               = useState(campoVacio);
  const [modoEditar, setModoEditar]   = useState(false);
 
  
  // ── Abrir modales ──
  const abrirNuevo = () => { setForm(campoVacio); setModoEditar(false); setModalNuevo(true); };
  const abrirEditar = (row) => { setForm({ ...row }); setModoEditar(true); setModalNuevo(true); };
  const abrirInfo = (row) => { setSeleccionado(row); setModalInfo(true); };
  const abrirEliminar = (row) => { setSeleccionado(row); setModalEliminar(true); };
 
  // ── Guardar (nuevo o editar) ──
  const guardar = () => {
    if (modoEditar) {
      setRows(rows.map(r => r.codigo === form.codigo ? { ...form } : r));
    } else {
      setRows([...rows, { ...form }]);
    }
    setModalNuevo(false);
  };
 
  // ── Eliminar ──
  const eliminar = () => {
    setRows(rows.filter(r => r.codigo !== seleccionado.codigo));
    setModalEliminar(false);
  };
 
  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  // ── Columnas de acción ──
  const acciones = (row) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="Más información">
        <IconButton size="small" sx={{ color: colors.info }} onClick={() => abrirInfo(row)}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton size="small" sx={{ color: colors.warning }} onClick={() => abrirEditar(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton size="small" sx={{ color: colors.danger }} onClick={() => abrirEliminar(row)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
 
  return (
    <Box>
 
      {/* Botón nueva reparación */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton label="Nueva reparación" icon={<AddIcon />} onClick={abrirNuevo} />
      </Box>
 
      {/* Tabla */}
      <DataTable
        title="Todas las reparaciones"
        columns={['Código', 'Cliente', 'Equipo', 'Técnico', 'Estado', 'Acción']}
        columnKeys={['codigo', 'cliente', 'equipo', 'tecnico', 'estado', 'accion']}
        rows={rows}
        codeKey="codigo"
        nameKey="cliente"
        statusKey="estado"
        renderAction={acciones}
      />
 
      {/* ── Modal Nueva / Editar ── */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2.5 }}>
            {modoEditar ? 'Editar reparación' : 'Nueva reparación'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Código" name="codigo" value={form.codigo}
                onChange={handleForm} sx={inputStyle} disabled={modoEditar} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Cliente" name="cliente" value={form.cliente}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Equipo" name="equipo" value={form.equipo}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Técnico" name="tecnico" value={form.tecnico}
                onChange={handleForm} sx={inputStyle}>
                {tecnicos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Estado" name="estado" value={form.estado}
                onChange={handleForm} sx={inputStyle}>
                {estados.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Nota de falla" name="nota"
                value={form.nota} onChange={handleForm} sx={inputStyle} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <ActionButton label="Cancelar" variant="outlined"
              onClick={() => setModalNuevo(false)} />
            <ActionButton label={modoEditar ? 'Guardar cambios' : 'Crear reparación'}
              onClick={guardar} />
          </Box>
        </Box>
      </Modal>
 
      {/* ── Modal Más información ── */}
      <Modal open={modalInfo} onClose={() => setModalInfo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>
            Información de reparación
          </Typography>
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
          {seleccionado && (
            <Grid container spacing={1.5}>
              {[
                { label: 'Código',   value: seleccionado.codigo },
                { label: 'Cliente',  value: seleccionado.cliente },
                { label: 'Equipo',   value: seleccionado.equipo },
                { label: 'Técnico',  value: seleccionado.tecnico },
              ].map(({ label, value }) => (
                <Grid item xs={6} key={label}>
                  <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, color: colors.textMain, fontWeight: 500 }}>{value}</Typography>
                </Grid>
              ))}
              <Grid item xs={6}>
                <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>Estado</Typography>
                <StatusChip label={seleccionado.estado} />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>Nota de falla</Typography>
                <Box sx={{ bgcolor: colors.bg, border: `0.5px solid ${colors.border}`, borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: colors.textMuted }}>{seleccionado.nota}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <ActionButton label="Cerrar" variant="outlined" onClick={() => setModalInfo(false)} />
          </Box>
        </Box>
      </Modal>
 
      {/* ── Modal Eliminar ── */}
      <Modal open={modalEliminar} onClose={() => setModalEliminar(false)}>
        <Box sx={{ ...modalStyle, width: 380 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 1 }}>
            ¿Eliminar reparación?
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 3 }}>
            ¿Estás seguro que deseas eliminar <strong style={{ color: colors.textMain }}>{seleccionado?.codigo}</strong>? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalEliminar(false)} />
            <ActionButton label="Eliminar" onClick={eliminar}
              sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: '#b91c1c' } }} />
          </Box>
        </Box>
      </Modal>
 
    </Box>
  );
};
 
export default Reparaciones;