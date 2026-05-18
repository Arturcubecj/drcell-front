import React from "react";
import {Box,Typography,Grid,Card,CardContent,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button
} from "@mui/material";
import DataTable  from "../../DataTable";
import { colors, cardStyle, tableHeadCell, tableCellBase } from "../../../utils/styles";
import MetricCard from './../../Metricas';
import { render } from '@testing-library/react';

function DashboardTecnico() {

  const reparaciones = [
    { codigo: '#REP-1048', cliente: 'Carlos Vega',  equipo: 'iPhone 14 Pro', tecnico: 'Luis T.',     estado: 'En reparación' },
    { codigo: '#REP-1047', cliente: 'Ana Morales',  equipo: 'Samsung S23',   tecnico: 'Pedro G.',    estado: 'Lista' },
    { codigo: '#REP-1046', cliente: 'Diego Saltos', equipo: 'Xiaomi 12T',    tecnico: 'Luis T.',     estado: 'Diagnóstico' },
    { codigo: '#REP-1045', cliente: 'María Paz',    equipo: 'Motorola G82',  tecnico: 'Sin asignar', estado: 'Pendiente' },
    { codigo: '#REP-1044', cliente: 'Roberto Loor', equipo: 'iPhone 13',     tecnico: 'Pedro G.',    estado: 'En reparación' },
  ];

  return ( 
    //BOX GENERAL
    <Box sx={{ p: 4, bgcolor: "#0f1117", color: "white"}}>
      {/* BOX DE CARDS DE PRESENTACIÓN */}
      <Box>
        <Box>
          {/* Métricas */}
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12}>
              <MetricCard label="Asignadas" value={58} sub="+0 hoy"/>
            </Grid>
            <Grid item xs={3}>
              <MetricCard label="En Proceso" value={9} sub="Notificar clientes"subColor={colors.warning} />
            </Grid>
            <Grid item xs={3}>
              <MetricCard label="Completadas" value={4} sub="Felicidades"/>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{mt:1}}>
        <DataTable title="Mis reparaciones pendientes" columns={['Código','Cliente', 'Equipo', 'Tecnico', 'Estado', 'Acción']}
        columnKeys={['codigo', 'cliente','equipo', 'tecnico', 'estado', 'accion']} rows={reparaciones} codeKey="codigo" nameKey="cliente" statusKey="estado"renderAction={(row) => (<Button variant="contained" color="primary"   sx={{ textTransform: 'none', borderRadius: 2 }} > Cambiar estado</Button>)}/>
      </Box>
     </Box>
     );
  }
export default DashboardTecnico;
