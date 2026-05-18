import { Box, Grid } from '@mui/material';
import BuildIcon       from '@mui/icons-material/Build';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InventoryIcon   from '@mui/icons-material/Inventory';
import AddIcon         from '@mui/icons-material/Add';

import MetricCard    from '../../Metricas';
import DataTable     from '../../DataTable';
import ActionButton  from '../../Boton';
import { colors }    from '../../../utils/styles';

const reparaciones = [
  { codigo: '#REP-1048', cliente: 'Carlos Vega',  equipo: 'iPhone 14 Pro', tecnico: 'Luis T.',     estado: 'En reparación' },
  { codigo: '#REP-1047', cliente: 'Ana Morales',  equipo: 'Samsung S23',   tecnico: 'Pedro G.',    estado: 'Lista' },
  { codigo: '#REP-1046', cliente: 'Diego Saltos', equipo: 'Xiaomi 12T',    tecnico: 'Luis T.',     estado: 'Diagnóstico' },
  { codigo: '#REP-1045', cliente: 'María Paz',    equipo: 'Motorola G82',  tecnico: 'Sin asignar', estado: 'Pendiente' },
  { codigo: '#REP-1044', cliente: 'Roberto Loor', equipo: 'iPhone 13',     tecnico: 'Pedro G.',    estado: 'En reparación' },
];

const DashboardAdmin = () => {
  return (
    <Box>
      {/* Botón nueva reparación */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton
          label="Nueva reparación"
          icon={<AddIcon />}
          onClick={() => {}}
        />
      </Box>
      {/* Métricas */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={3}>
          <MetricCard label="Reparaciones activas" value={38} sub="+4 hoy"
            icon={<BuildIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Listas para retiro" value={9} sub="Notificar clientes"
            subColor={colors.warning} icon={<MoveToInboxIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Técnicos activos" value={4} sub="En turno"
            icon={<EngineeringIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Stock bajo" value={3} sub="Repuestos críticos"
            subColor={colors.warning} icon={<InventoryIcon />} />
        </Grid>
      </Grid>
      {/* Tabla reparaciones recientes */}
      <Box sx={{ mt: 3 }}>
        <DataTable
          title="Reparaciones recientes"
          action={{ label: 'Ver todas', onClick: () => {} }}
          columns={['Código', 'Cliente', 'Equipo', 'Técnico', 'Estado']}
          columnKeys={['codigo', 'cliente', 'equipo', 'tecnico', 'estado']}
          rows={reparaciones}
          codeKey="codigo"
          nameKey="cliente"
          statusKey="estado"
        />
      </Box>
    </Box>
  );
};

export default DashboardAdmin;