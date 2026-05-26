import { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, TextField, Grid, MenuItem,
  IconButton, Tooltip, Divider, CircularProgress
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon   from '@mui/icons-material/Info';

import DataTable    from '../../DataTable';
import ActionButton from '../../Boton';
import StatusChip   from '../../StatusChip';
import { colors, cardStyle, inputStyle } from '../../../utils/styles';
import {
  obtenerReparacionesService,
  crearReparacionService,
  actualizarReparacionService,
  eliminarReparacionService
} from '../../../services/reparacionesServices.js';
import { obtenerTecnicosService } from '../../../services/tecnicosServices.js';
import { obtenerClientesService }  from '../../../services/clientesServices.js';

const estados = ['Pendiente', 'Diagnóstico', 'En reparación', 'Control calidad', 'Lista'];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '80vh',
  overflow: 'auto',
  width: 600, ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
};

const campoVacio = {
  codigo: '', cliente_id: '', equipo: '',
  tecnico_id: '', estado: 'Pendiente', nota: '',
  precio_servicio: 0, precio_repuestos: 0,
  fecha_entrega_estimada: '', garantia_dias: 30
};

const ReparacionesAdmin = () => {
  const [rows, setRows]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [tecnicos, setTecnicos]           = useState([]);
  const [clientes, setClientes]           = useState([]);
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [modalInfo, setModalInfo]         = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado]   = useState(null);
  const [form, setForm]                   = useState(campoVacio);
  const [modoEditar, setModoEditar]       = useState(false);

  // ── Cargar datos al montar ──
  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reps, tecs, clts] = await Promise.all([
        obtenerReparacionesService(),
        obtenerTecnicosService(),
        obtenerClientesService()
      ]);
      setRows(reps.data);
      setTecnicos(tecs.data);
      setClientes(clts.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Abrir modales ──
  const abrirNuevo = () => { const numeros = rows.map(r => parseInt(r.codigo.replace('#REP-', ''))); const maximo = numeros.length > 0 ? Math.max(...numeros) : 1040;  const nuevocodigo = `#REP-${maximo + 1}`;
  setForm({ ...campoVacio, codigo: nuevocodigo });
  setModoEditar(false);
  setModalNuevo(true);
};
  const abrirEditar = (row) => { setForm({ ...row, cliente_id: row.cliente_id || '', tecnico_id: row.tecnico_id || '', fecha_entrega_estimada: row.fecha_entrega_estimada ? row.fecha_entrega_estimada.split('T')[0] : '',});
  setModoEditar(true);
  setModalNuevo(true);
};
  const abrirInfo     = (row) => { setSeleccionado(row); setModalInfo(true); };
  const abrirEliminar = (row) => { setSeleccionado(row); setModalEliminar(true); };

  // ── Guardar ──
const guardar = async () => {
  try {
    const data = {
      ...form,
      cliente_id: parseInt(form.cliente_id),
      tecnico_id: form.tecnico_id ? parseInt(form.tecnico_id) : null,
      precio_servicio: parseFloat(form.precio_servicio),
      precio_repuestos: parseFloat(form.precio_repuestos),
      garantia_dias: parseInt(form.garantia_dias),
    };
    if (modoEditar) {
      await actualizarReparacionService(form.id, data);
    } else {
      await crearReparacionService(data);
    }
    setModalNuevo(false);
    cargarDatos();
  } catch (error) {
    console.error('Error al guardar reparación:', error);
  }
};

  // ── Eliminar ──
  const eliminar = async () => {
    try {
      await eliminarReparacionService(seleccionado.id);
      setModalEliminar(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar reparación:', error);
    }
  };

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Acciones por fila ──
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

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
                onChange={handleForm} sx={inputStyle} disabled={modoEditar} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={6}>
              {/* Cliente desde la BD */}
              <TextField select fullWidth label="Cliente" name="cliente_id"
                value={form.cliente_id} onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}>
                {clientes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Equipo" name="equipo" value={form.equipo}
                onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={6}>
              {/* Técnico desde la BD */}
              <TextField select fullWidth label="Técnico" name="tecnico_id"
                value={form.tecnico_id} onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">Sin asignar</MenuItem>
                {tecnicos.map(t => (
                  <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Estado" name="estado"
                value={form.estado} onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}>
                {estados.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Precio servicio" name="precio_servicio"
                type="number" value={form.precio_servicio}
                onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Precio repuestos" name="precio_repuestos"
                type="number" value={form.precio_repuestos}
                onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Entrega estimada" name="fecha_entrega_estimada"
                type="date" value={form.fecha_entrega_estimada}
                onChange={handleForm}
                InputLabelProps={{ shrink: true }}
                sx={{
                  ...inputStyle,
                  '& .MuiInputLabel-root': { 
                    color: colors.textFaint, 
                    fontSize: 13,
                    transform: 'translate(14px, -9px) scale(0.75)',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',  // ← esto pone el icono del calendario en blanco
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Garantia dias" name="garantia_dias"
                type="number" value={form.garantia_dias}
                onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Nota de falla" name="nota"
                value={form.nota} onChange={handleForm} sx={inputStyle} InputLabelProps={{ shrink: true }}/>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalNuevo(false)} />
            <ActionButton label={modoEditar ? 'Guardar cambios' : 'Crear reparación'} onClick={guardar} />
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
                { label: 'Código',          value: seleccionado.codigo },
                { label: 'Cliente',         value: seleccionado.cliente },
                { label: 'Equipo',          value: seleccionado.equipo },
                { label: 'Técnico',         value: seleccionado.tecnico },
                { label: 'Precio servicio', value: `$${seleccionado.precio_servicio}` },
                { label: 'Precio repuestos',value: `$${seleccionado.precio_repuestos}` },
                { label: 'Total',           value: `$${seleccionado.total}` },
                { label: 'Garantia dias',   value: `${seleccionado.garantia_dias} días` },
                { label: 'Fecha entrega',   value: seleccionado.fecha_entrega_estimada ? new Date(seleccionado.fecha_entrega_estimada).toLocaleDateString('es-EC'): 'No definida' },
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

export default ReparacionesAdmin;