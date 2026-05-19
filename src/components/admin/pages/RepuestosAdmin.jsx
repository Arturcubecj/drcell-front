import { useState } from 'react';
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

// ── Datos de ejemplo ───────────────────────────────────────────
const dataInicial = [
  { id: 'REP-001', nombre: 'Pantalla OLED',      compatibilidad: 'iPhone 14 Pro',  stock: 3,  precio: '$120.00' },
  { id: 'REP-002', nombre: 'Batería 4500mAh',    compatibilidad: 'Samsung S23',    stock: 5,  precio: '$35.00'  },
  { id: 'REP-003', nombre: 'Módulo cámara',       compatibilidad: 'Xiaomi 12T',     stock: 2,  precio: '$55.00'  },
  { id: 'REP-004', nombre: 'Conector de carga',   compatibilidad: 'Motorola G82',   stock: 8,  precio: '$15.00'  },
  { id: 'REP-005', nombre: 'Pantalla LCD',        compatibilidad: 'Redmi Note 12',  stock: 0,  precio: '$45.00'  },
  { id: 'REP-006', nombre: 'Batería 3500mAh',     compatibilidad: 'iPhone 13',      stock: 4,  precio: '$40.00'  },
];

const campoVacio = { nombre: '', compatibilidad: '', stock: '', precio: '' };

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, ...cardStyle, p: 3, outline: 'none', borderRadius: '12px',
};

// ── Componente principal ───────────────────────────────────────
const RepuestosAdmin = () => {
  const [rows, setRows]                   = useState(dataInicial);
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [modalInfo, setModalInfo]         = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado]   = useState(null);
  const [form, setForm]                   = useState(campoVacio);
  const [modoEditar, setModoEditar]       = useState(false);

  // ── Abrir modales ──
  const abrirNuevo    = () => { setForm(campoVacio); setModoEditar(false); setModalNuevo(true); };
  const abrirEditar   = (row) => { setForm({ ...row }); setModoEditar(true); setModalNuevo(true); };
  const abrirInfo     = (row) => { setSeleccionado(row); setModalInfo(true); };
  const abrirEliminar = (row) => { setSeleccionado(row); setModalEliminar(true); };

  // ── Guardar ──
  const guardar = () => {
    if (modoEditar) {
      setRows(rows.map(r => r.id === form.id ? { ...form } : r));
    } else {
      const nuevoId = `REP-00${rows.length + 1}`;
      setRows([...rows, { id: nuevoId, ...form }]);
    }
    setModalNuevo(false);
  };

  // ── Eliminar ──
  const eliminar = () => {
    setRows(rows.filter(r => r.id !== seleccionado.id));
    setModalEliminar(false);
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

  return (
    <Box>

      {/* Botón nuevo repuesto */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton label="Nuevo repuesto" icon={<AddIcon />} onClick={abrirNuevo} />
      </Box>

      {/* Tabla */}
      <DataTable
        title="Inventario de repuestos"
        columns={['ID', 'Nombre', 'Compatibilidad', 'Stock', 'Precio', 'Acción']}
        columnKeys={['id', 'nombre', 'compatibilidad', 'stock', 'precio', 'accion']}
        rows={rows}
        codeKey="id"
        nameKey="nombre"
        renderAction={acciones}
      />

      {/* ── Modal Nuevo / Editar ── */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2.5 }}>
            {modoEditar ? 'Editar repuesto' : 'Nuevo repuesto'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre del repuesto" name="nombre" value={form.nombre}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Compatibilidad (marca/modelo)" name="compatibilidad"
                value={form.compatibilidad} onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Stock" name="stock" type="number" value={form.stock}
                onChange={handleForm} sx={inputStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Precio" name="precio" value={form.precio}
                onChange={handleForm} sx={inputStyle} placeholder="$0.00" />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <ActionButton label="Cancelar" variant="outlined" onClick={() => setModalNuevo(false)} />
            <ActionButton label={modoEditar ? 'Guardar cambios' : 'Agregar repuesto'} onClick={guardar} />
          </Box>
        </Box>
      </Modal>

      {/* ── Modal Más información ── */}
      <Modal open={modalInfo} onClose={() => setModalInfo(false)}>
        <Box sx={modalStyle}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.textMain, mb: 2 }}>
            Información del repuesto
          </Typography>
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
          {seleccionado && (
            <Grid container spacing={1.5}>
              {[
                { label: 'ID',              value: seleccionado.id },
                { label: 'Nombre',          value: seleccionado.nombre },
                { label: 'Compatibilidad',  value: seleccionado.compatibilidad },
                { label: 'Stock',           value: seleccionado.stock },
                { label: 'Precio',          value: seleccionado.precio },
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
            ¿Eliminar repuesto?
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 3 }}>
            ¿Estás seguro que deseas eliminar <strong style={{ color: colors.textMain }}>{seleccionado?.nombre}</strong>? Esta acción no se puede deshacer.
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

export default RepuestosAdmin;