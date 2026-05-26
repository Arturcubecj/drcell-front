import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import {
  Box, Typography, Modal, TextField, Grid,
  IconButton, Tooltip, Divider
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon   from '@mui/icons-material/Info';

import DataTable    from '../../DataTable';
import ActionButton from '../../Boton';
import { colors, cardStyle, inputStyle } from '../../../utils/styles';

import {obtenerTecnicosService, crearTecnicoService, actualizarTecnicoService, eliminarTecnicoService} from '../../../services/tecnicosServices.js';

const campoVacio = { nombre: '', telefono: '', correo: '', password: '', especialidad: '' };

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
};

// ── Componente principal ───────────────────────────────────────
const TecnicosAdmin = () => {
  const [rows, setRows]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [modalInfo, setModalInfo]         = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado]   = useState(null);
  const [form, setForm]                   = useState(campoVacio);
  const [modoEditar, setModoEditar]       = useState(false);

  useEffect(()=> { cargarTecnicos();}, []);

  const cargarTecnicos = async () => {
    try{
      setLoading(true);
      const response = await obtenerTecnicosService();
      setRows(response.data);
    }catch(error){
      console.error('Error al cargar tecnicos: ', error);
    } finally {
      setLoading(false);
    }
  }

  // ── Abrir modales ──
  const abrirNuevo    = () => { setForm(campoVacio); setModoEditar(false); setModalNuevo(true); };
  const abrirEditar   = (row) => { setForm({ ...row }); setModoEditar(true); setModalNuevo(true); };
  const abrirInfo     = (row) => { setSeleccionado(row); setModalInfo(true); };
  const abrirEliminar = (row) => { setSeleccionado(row); setModalEliminar(true); };

  // ── Guardar ──
  const guardar = async () => {
    try{
      if (modoEditar) {
        await actualizarTecnicoService(form.id, form);
        } else {
          await crearTecnicoService(form);
          }
          setModalNuevo(false);
          cargarTecnicos();
          }catch(error){
            console.error('Error al guardar tecnico: ', error);
            }
  };

  // ── Eliminar ──
  const eliminar = async () => {
    try{
      await eliminarTecnicoService(seleccionado.id);
      setModalEliminar(false);
      cargarTecnicos();
    }catch(error){
      console.error('Error al eliminar tecnico: ', error);
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
  if (loading){
    return(<Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box>

      {/* Botón nuevo técnico */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton label="Nuevo técnico" icon={<AddIcon />} onClick={abrirNuevo} />
      </Box>

      {/* Tabla */}
      <DataTable
        title="Técnicos registrados"
        columns={['ID', 'Nombre', 'Teléfono', 'Correo', 'Especialidad', 'Acción']}
        columnKeys={['id', 'nombre', 'telefono', 'correo', 'especialidad', 'accion']}
        rows={rows}
        codeKey="id"
        nameKey="nombre"
        renderAction={acciones}
      />

      {/* ── Modal Nuevo / Editar ── */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2.5 }}>
            {modoEditar ? 'Editar técnico' : 'Nuevo técnico'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Nombre completo" name="nombre" value={form.nombre}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Teléfono" name="telefono" value={form.telefono}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Correo electrónico" name="correo" value={form.correo}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Contraseña" name="password" type="password" value={form.password} onChange={handleForm} sx={inputStyle} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Especialidad" name="especialidad" value={form.especialidad}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalNuevo(false)} />
            <ActionButton label={modoEditar ? 'Guardar cambios' : 'Agregar técnico'} onClick={guardar} />
          </Box>
        </Box>
      </Modal>

      {/* ── Modal Más información ── */}
      <Modal open={modalInfo} onClose={() => setModalInfo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>
            Información del técnico
          </Typography>
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
          {seleccionado && (
            <Grid container spacing={1.5}>
              {[
                { label: 'ID',           value: seleccionado.id },
                { label: 'Nombre',       value: seleccionado.nombre },
                { label: 'Teléfono',     value: seleccionado.telefono },
                { label: 'Correo',       value: seleccionado.correo },
                { label: 'Especialidad', value: seleccionado.especialidad },
              ].map(({ label, value }) => (
                <Grid item xs={6} key={label}>
                  <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, color: colors.textMain, fontWeight: 500 }}>{value}</Typography>
                </Grid>
              ))}
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
            ¿Eliminar técnico?
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 3 }}>
            ¿Estás seguro que deseas eliminar a <strong style={{ color: colors.textMain }}>{seleccionado?.nombre}</strong>? Esta acción no se puede deshacer.
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

export default TecnicosAdmin;