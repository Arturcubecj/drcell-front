import { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, TextField, Grid,
  IconButton, Tooltip, Divider, CircularProgress
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon   from '@mui/icons-material/Info';
import MenuItem   from '@mui/material/MenuItem';

import DataTable    from '../../DataTable';
import ActionButton from '../../Boton';
import { colors, cardStyle, inputStyle } from '../../../utils/styles';
import {
  obtenerFacturasService,
  crearFacturaService,
  eliminarFacturaService
} from '../../../services/facturasServices.js';
import { obtenerReparacionesService } from '../../../services/reparacionesServices.js';
const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520, maxHeight: '85vh', overflow: 'auto',
  ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
};

const campoVacio = { reparacion_id: '', subtotal: 0, iva_pct: 15, impuesto: 0, total: 0, observaciones: '',};

const FacturasAdmin = () => {
  const [rows, setRows]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [reparaciones, setReparaciones]   = useState([]);
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [modalInfo, setModalInfo]         = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado]   = useState(null);
  const [form, setForm]                   = useState(campoVacio);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [facts, reps] = await Promise.all([ obtenerFacturasService(), obtenerReparacionesService(),]);
      setRows(facts.data);
      //ID DE REPARACIONES QUE YA TIENEN FACTURAS
      const idsConFactura = facts.data.map(f => f.reparacion);

      // Solo reparaciones sin factura y listas

      const repsFiltradas = reps.data.filter(r=> r.estado === 'Lista' && !idsConFactura.includes(r.codigo));
      setReparaciones(repsFiltradas);
      
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  //  Cuando cambia la reparación seleccionada 
  const handleReparacion = (e) => {
    const reparacion_id = e.target.value;
    const rep = reparaciones.find(r => r.id === reparacion_id);
    if (rep) {
      const subtotal  = parseFloat(rep.precio_servicio) + parseFloat(rep.precio_repuestos);
      const impuesto  = parseFloat((subtotal * (form.iva_pct / 100)).toFixed(2));
      const total     = parseFloat((subtotal + impuesto).toFixed(2));
      setForm({ ...form, reparacion_id, subtotal, impuesto, total });
    } else {
      setForm({ ...form, reparacion_id });
    }
  };

  //  Cuando cambia el % IVA 
  const handleIva = (e) => {
    const iva_pct  = parseFloat(e.target.value) || 0;
    const impuesto = parseFloat((form.subtotal * (iva_pct / 100)).toFixed(2));
    const total    = parseFloat((form.subtotal + impuesto).toFixed(2));
    setForm({ ...form, iva_pct, impuesto, total });
  };

  const abrirNuevo    = () => { setForm(campoVacio); setModalNuevo(true); };
  const abrirInfo     = (row) => { setSeleccionado(row); setModalInfo(true); };
  const abrirEliminar = (row) => { setSeleccionado(row); setModalEliminar(true); };


  // METODO GUARDAR 
  const guardar = async () => {
    try {
      await crearFacturaService({
        reparacion_id: form.reparacion_id,
        subtotal:      form.subtotal,
        impuesto:      form.impuesto,
        observaciones: form.observaciones || null,
      });
      setModalNuevo(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al crear factura:', error);
    }
  };

  // METODO ELIMINAR
  const eliminar = async () => {
    try {
      await eliminarFacturaService(seleccionado.id);
      setModalEliminar(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
    }
  };

  const acciones = (row) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="Más información">
        <IconButton size="small" sx={{ color: colors.info }} onClick={() => abrirInfo(row)}>
          <InfoIcon fontSize="small" />
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

      {/* Botón nueva factura */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton label="Nueva factura" icon={<AddIcon />} onClick={abrirNuevo} />
      </Box>

      {/* Tabla */}
      <DataTable
        title="Facturas emitidas"
        columns={['ID', 'Reparación', 'Cliente', 'Subtotal', 'IVA', 'Total', 'Fecha', 'Acción']}
        columnKeys={['id', 'reparacion', 'cliente', 'subtotal', 'impuesto', 'total', 'fecha_emision', 'accion']}
        rows={rows}
        codeKey="id"
        nameKey="cliente"
        renderAction={acciones}
      />

      {/* ── Modal Nueva factura ── */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2.5 }}>
            Nueva factura
          </Typography>
          <Grid container spacing={2}>

            {/* Reparación */}
            <Grid item xs={12}>
              <TextField select fullWidth label="Reparación" name="reparacion_id"
                value={form.reparacion_id} onChange={handleReparacion}
                sx={inputStyle} InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}>
                <MenuItem value=""><em>Seleccionar reparación</em></MenuItem>
                {reparaciones.map(r => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.codigo} — {r.cliente} — {r.equipo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Precio servicio y repuestos (solo lectura) */}
            <Grid item xs={6}>
              <TextField fullWidth label="Precio servicio" value={`$${form.subtotal ? (reparaciones.find(r => r.id === form.reparacion_id)?.precio_servicio || 0) : 0}`}
                sx={inputStyle} InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Precio repuestos" value={`$${form.subtotal ? (reparaciones.find(r => r.id === form.reparacion_id)?.precio_repuestos || 0) : 0}`}
                sx={inputStyle} InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} />
            </Grid>

            {/* Subtotal (solo lectura) */}
            <Grid item xs={6}>
              <TextField fullWidth label="Subtotal" value={`$${form.subtotal.toFixed(2)}`}
                sx={inputStyle} InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} />
            </Grid>

            {/* IVA % editable */}
            <Grid item xs={6}>
              <TextField fullWidth label="IVA %" name="iva_pct" type="number"
                value={form.iva_pct} onChange={handleIva}
                sx={inputStyle} InputLabelProps={{ shrink: true }} />
            </Grid>

            {/* Impuesto y total (solo lectura) */}
            <Grid item xs={6}>
              <TextField fullWidth label="Impuesto ($)" value={`$${form.impuesto.toFixed(2)}`}
                sx={inputStyle} InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Total" value={`$${form.total.toFixed(2)}`}
                sx={{ ...inputStyle, '& input': { color: colors.success, fontWeight: 500 } }}
                InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} />
            </Grid>

            {/* Observaciones */}
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Observaciones" name="observaciones"
                value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                sx={inputStyle} InputLabelProps={{ shrink: true }} />
            </Grid>

          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalNuevo(false)} />
            <ActionButton label="Emitir factura" onClick={guardar} />
          </Box>
        </Box>
      </Modal>

      {/* ── Modal Más información ── */}
      <Modal open={modalInfo} onClose={() => setModalInfo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>
            Detalle de factura
          </Typography>
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
          {seleccionado && (
            <Grid container spacing={1.5}>
              {[
                { label: 'ID',          value: seleccionado.id },
                { label: 'Reparación',  value: seleccionado.reparacion },
                { label: 'Cliente',     value: seleccionado.cliente },
                { label: 'Cédula',      value: seleccionado.cedula },
                { label: 'Subtotal',    value: `$${seleccionado.subtotal}` },
                { label: 'IVA',         value: `$${seleccionado.impuesto}` },
                { label: 'Total',       value: `$${seleccionado.total}` },
                { label: 'Fecha',       value: new Date(seleccionado.fecha_emision).toLocaleDateString('es-EC') },
              ].map(({ label, value }) => (
                <Grid item xs={6} key={label}>
                  <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, color: label === 'Total' ? colors.success : colors.textMain, fontWeight: 500 }}>{value}</Typography>
                </Grid>
              ))}
              {seleccionado.observaciones && (
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 11, color: colors.textFaint, mb: 0.5 }}>Observaciones</Typography>
                  <Box sx={{ bgcolor: colors.bg, border: `0.5px solid ${colors.border}`, borderRadius: 1.5, p: 1.5 }}>
                    <Typography sx={{ fontSize: 13, color: colors.textMuted }}>{seleccionado.observaciones}</Typography>
                  </Box>
                </Grid>
              )}
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
            ¿Eliminar factura?
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 3 }}>
            ¿Estás seguro que deseas eliminar la factura de <strong style={{ color: colors.textMain }}>{seleccionado?.cliente}</strong>? Esta acción no se puede deshacer.
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

export default FacturasAdmin;