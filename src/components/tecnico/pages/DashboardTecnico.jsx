import { Box, Grid, CircularProgress, Modal, TextField, Typography, MenuItem, Tooltip, IconButton, Divider } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import BuildIcon    from '@mui/icons-material/Build';
import PendingIcon  from '@mui/icons-material/Pending';
import CheckIcon    from '@mui/icons-material/Check';
import EditIcon     from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import MetricCard   from '../../Metricas';
import DataTable    from '../../DataTable';
import ActionButton from '../../Boton';
import { colors, cardStyle, inputStyle }   from '../../../utils/styles';

import { obtenerReparacionesService, actualizarEstadoService} from '../../../services/reparacionesServices.js';

const estados = ['Pendiente', 'Diagnóstico', 'En reparación', 'Control calidad', 'Lista'];

const modalStyle = {

    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500, ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
  };

const DashboardTecnico = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEstado, setModalEstado] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [modalInfo, setModalInfo] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await obtenerReparacionesService();
      const misReps = response.data.filter(r => r.tecnico === usuario.nombre);
      setRows(misReps);
    } catch (error) {
      console.error('Error al cargar reparaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [usuario.nombre]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const abrirModalEstado = (row) => {
    setSeleccionado(row);
    setNuevoEstado(row.estado);
    setModalEstado(true);
  };
  const guardarEstado = async  () => {
    try{
      await actualizarEstadoService(seleccionado.id, nuevoEstado);
      setModalEstado(false);
      cargarDatos();
    }catch(error){
      console.error('Error al actualizar estado:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Métricas */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={4}>
          <MetricCard label="Asignadas" value={rows.length} sub="Total"
            icon={<BuildIcon />} />
        </Grid>
        <Grid item xs={4}>
          <MetricCard label="En proceso" value={rows.filter(r => r.estado === 'En reparación' || r.estado === 'Diagnóstico' || r.estado === 'Control calidad').length} sub="Activas"
            subColor={colors.warning} icon={<PendingIcon />} />
        </Grid>
        <Grid item xs={4}>
          <MetricCard label="Completadas" value={rows.filter(r => r.estado === 'Lista').length} sub="Listas"
            icon={<CheckIcon />} />
        </Grid>
      </Grid>
      {/* Tabla */}
      <Box sx={{ mt: 3 }}>
        <DataTable
          title="Mis reparaciones pendientes"
          columns={['Código', 'Cliente', 'Equipo', 'Técnico', 'Estado', 'Acción']}
          columnKeys={['codigo', 'cliente', 'equipo', 'tecnico', 'estado', 'accion']}
          rows={rows}
          codeKey="codigo"
          nameKey="cliente"
          statusKey="estado"
          renderAction={(row) => (
            <Box sx= {{display: 'flex', gap: 0.5}}>
              <Tooltip tittle="Más información">
                <IconButton size="small" sx={{ color: colors.info }} onClick={() => {setSeleccionado(row); setModalInfo(true);}}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip tittle="Cambiar estado">
                <IconButton size="small" sx={{ color: colors.warning }} onClick={() => abrirModalEstado(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </Box>
      {/* ── Modal Cambiar estado ── */}
      <Modal open={modalEstado} onClose={() => setModalEstado(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>
            Cambiar estado — <span style={{ color: colors.info, fontFamily: 'monospace' }}>{seleccionado?.codigo}</span>
          </Typography>
          <TextField select fullWidth label="Nuevo estado" value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            sx={inputStyle} InputLabelProps={{ shrink: true }}>
            {estados.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2.5 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalEstado(false)} />
            <ActionButton label="Guardar" onClick={guardarEstado} />
          </Box>
        </Box>
      </Modal>

      {/* ── Modal Más información ── */}
      <Modal open={modalInfo} onClose={() => setModalInfo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>Información de reparación </Typography>
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
          {seleccionado && (
            <Grid container spacing={1.5}>
              {[
                { label: 'Código',  value: seleccionado.codigo },
                { label: 'Cliente', value: seleccionado.cliente },
                { label: 'Equipo',  value: seleccionado.equipo },
                { label: 'Técnico', value: seleccionado.tecnico },
                { label: 'Estado',  value: seleccionado.estado },
                { label: 'Nota',    value: seleccionado.nota },
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
    </Box>
  );
};

export default DashboardTecnico;