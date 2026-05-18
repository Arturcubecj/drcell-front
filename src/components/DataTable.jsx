import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Box
} from '@mui/material';
import { colors, cardStyle, tableHeadCell, tableCellBase } from '../utils/styles';
import StatusChip from './StatusChip';
import { render } from '@testing-library/react';
/**
 * DataTable — tabla genérica reutilizable
 *
 * Props:
 * - title: string — título del panel
 * - action: { label, onClick } — enlace opcional en la esquina derecha
 * - columns: string[] — nombres de las columnas
 * - rows: object[] — filas de datos
 * - columnKeys: string[] — keys del objeto que corresponden a cada columna
 * - statusKey: string — key que contiene el estado (para renderizar StatusChip)
 * - codeKey: string — key que contiene el código (para darle estilo monospace)
 * - nameKey: string — key que contiene el nombre principal (para resaltarlo)
 */
const DataTable = ({
  title,
  action,
  columns = [],
  rows = [],
  columnKeys = [],
  statusKey = 'estado',
  codeKey = 'codigo',
  nameKey = 'cliente',
  renderAction,

}) => {
  return (
    <Paper sx={cardStyle}>
      {/* Header */}
      <Box sx={{
        px: 2, pt: 2, pb: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.textMain }}>
          {title}
        </Typography>
        {action && (
          <Typography
            onClick={action.onClick}
            sx={{ fontSize: 11, color: colors.primary, cursor: 'pointer' }}
          >
            {action.label}
          </Typography>
        )}
      </Box>

      {/* Tabla */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={tableHeadCell}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                {columnKeys.map((key) => {

                  // Celda de acción 

                  if (key === 'accion') {
                    return (
                      <TableCell key={key} sx={tableCellBase}>
                        {renderAction ? renderAction(row) : null}
                      </TableCell>
                    );
                  }
                  // Celda de estado → StatusChip
                  if (key === statusKey) {
                    return (
                      <TableCell key={key} sx={{ borderColor: colors.borderLight }}>
                        <StatusChip label={row[key]} />
                      </TableCell>
                    );
                  }
                  // Celda de código → monospace azul
                  if (key === codeKey) {
                    return (
                      <TableCell key={key} sx={{ ...tableCellBase, color: colors.primary, fontFamily: 'monospace' }}>
                        {row[key]}
                      </TableCell>
                    );
                  }
                  // Celda de nombre → resaltado
                  if (key === nameKey) {
                    return (
                      <TableCell key={key} sx={{ ...tableCellBase, color: colors.textMain, fontWeight: 500 }}>
                        {row[key]}
                      </TableCell>
                    );
                  }
                  // Celda normal
                  return (
                    <TableCell key={key} sx={tableCellBase}>
                      {row[key]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;