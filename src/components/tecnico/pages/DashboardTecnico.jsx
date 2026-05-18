import { Box, Grid } from '@mui/material';
import BuildIcon    from '@mui/icons-material/Build';
import PendingIcon  from '@mui/icons-material/Pending';
import CheckIcon    from '@mui/icons-material/Check';
import EditIcon     from '@mui/icons-material/Edit';

import MetricCard   from '../../Metricas';
import DataTable    from '../../DataTable';
import ActionButton from '../../Boton';
import { colors }   from '../../../utils/styles';

const reparaciones = [
  { codigo: '#REP-1048', cliente: 'Carlos Vega',  equipo: 'iPhone 14 Pro', tecnico: 'Luis T.', estado: 'En reparación' },
  { codigo: '#REP-1047', cliente: 'Ana Morales',  equipo: 'Samsung S23',   tecnico: 'Pedro G.', estado: 'Lista' },
  { codigo: '#REP-1046', cliente: 'Diego Saltos', equipo: 'Xiaomi 12T',    tecnico: 'Luis T.', estado: 'Diagnóstico' },
  { codigo: '#REP-1045', cliente: 'María Paz',    equipo: 'Motorola G82',  tecnico: 'Sin asignar', estado: 'Pendiente' },
  { codigo: '#REP-1044', cliente: 'Roberto Loor', equipo: 'iPhone 13',     tecnico: 'Pedro G.', estado: 'En reparación' },
];

const DashboardTecnico = () => {
  return (
    <Box>
      {/* Métricas */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={4}>
          <MetricCard label="Asignadas" value={14} sub="Esta semana"
            icon={<BuildIcon />} />
        </Grid>
        <Grid item xs={4}>
          <MetricCard label="En proceso" value={9} sub="Activas"
            subColor={colors.warning} icon={<PendingIcon />} />
        </Grid>
        <Grid item xs={4}>
          <MetricCard label="Completadas" value={4} sub="Este mes"
            icon={<CheckIcon />} />
        </Grid>
      </Grid>
      {/* Tabla */}
      <Box sx={{ mt: 3 }}>
        <DataTable
          title="Mis reparaciones pendientes"
          columns={['Código', 'Cliente', 'Equipo', 'Técnico', 'Estado', 'Acción']}
          columnKeys={['codigo', 'cliente', 'equipo', 'tecnico', 'estado', 'accion']}
          rows={reparaciones}
          codeKey="codigo"
          nameKey="cliente"
          statusKey="estado"
          renderAction={(row) => (
            <ActionButton
              label="Cambiar estado"
              icon={<EditIcon />}
              onClick={() => console.log('Cambiar estado de', row.codigo)}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default DashboardTecnico;