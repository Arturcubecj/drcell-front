import { Box, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuildIcon       from '@mui/icons-material/Build';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InventoryIcon   from '@mui/icons-material/Inventory';
import AddIcon         from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

import MetricCard    from '../../Metricas';
import DataTable     from '../../DataTable';
import ActionButton  from '../../Boton';
import { colors }    from '../../../utils/styles';

import { obtenerReparacionesService } from '../../../services/reparacionesServices.js';
import { obtenerTecnicosService } from '../../../services/tecnicosServices.js';
import { obtenerRepuestosService } from '../../../services/repuestosServices.js';

const DashboardAdmin = () => {

  const navigate                          = useNavigate();                 
  const [loading, setLoading]             = useState(true);
  const [ reparaciones, setReparaciones ] = useState([]);
  const [totalActivas, setTotalActivas]   = useState(0);
  const [totalListas, setTotalListas]     = useState(0);
  const [totalTecnicos, setTotalTecnicos] = useState(0);
  const [stockBajo, setStockBajo]         = useState(0);

  useEffect(() => { cargarDatos();} , []);

  const cargarDatos = async () => {
    try{
      setLoading(true);
      const [ reps, tecs, repu_stock ] = await Promise.all([ obtenerReparacionesService(), obtenerTecnicosService(), obtenerRepuestosService() ]);
      const todasReps = reps.data;

    //Metricas calculdas
      setTotalActivas(todasReps.filter(r => r.estado !== 'Lista').length);
      setTotalListas(todasReps.filter(r => r.estado === 'Lista').length);
      setTotalTecnicos(tecs.data.length);
      setStockBajo(repu_stock.data.filter(r => r.stock <= 2).length);

      // Solo las ultimas 5 reparaciones

      setReparaciones(todasReps.slice(-5).reverse());
      }catch(error){
        console.error('Error al cargar datos del dashboard:', error);
        }finally{
          setLoading(false);
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
      {/* Botón nueva reparación */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
        <ActionButton
          label="Nueva reparación"
          icon={<AddIcon />}
          onClick={() => navigate('/admin/reparaciones')}
        />
      </Box>
      {/* Métricas */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={3}>
          <MetricCard label="Reparaciones activas" value={totalActivas} sub="En progreso" icon = {<BuildIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Listas para retiro" value={totalListas} sub="Notificar clientes"
            subColor={colors.warning} icon={<MoveToInboxIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Técnicos activos" value={totalTecnicos} sub="En turno"
            icon={<EngineeringIcon />} />
        </Grid>
        <Grid item xs={3}>
          <MetricCard label="Stock bajo" value={stockBajo} sub="Repuestos críticos"
            subColor={colors.warning} icon={<InventoryIcon />} />
        </Grid>
      </Grid>
      {/* Tabla reparaciones recientes */}
      <Box sx={{ mt: 3 }}>
        <DataTable
          title="Reparaciones recientes"
          action={{ label: 'Ver todas', onClick: () => navigate('/admin/reparaciones') }}
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