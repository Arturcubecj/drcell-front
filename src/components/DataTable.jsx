import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Box
} from '@mui/material';
import { colors, cardStyle, tableHeadCell, tableCellBase } from '../utils/styles';
import StatusChip from './StatusChip';

/**
 * DataTable — tabla genérica reutilizable
 * Props:
 * - title: string
 * - action: { label, onClick } — enlace opcional esquina derecha
 * - columns: string[]
 * - rows: object[]
 * - columnKeys: string[]
 * - statusKey: string — key del estado (renderiza StatusChip)
 * - codeKey: string — key del código (monospace azul)
 * - nameKey: string — key del nombre (resaltado)
 * - renderAction: (row) => JSX — botones de acción por fila
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
          <Typography onClick={action.onClick}
            sx={{ fontSize: 11, color: colors.primary, cursor: 'pointer' }}>
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
                  // Celda de acción → renderAction
                  if (key === 'accion') {
                    return (
                      <TableCell key={key} sx={{ borderColor: colors.borderLight, py: 1 }}>
                        {renderAction ? renderAction(row) : null}
                      </TableCell>
                    );
                  }
                  // Celda de estado → StatusChip
                  if (key === statusKey) {
                    return (
                      <TableCell key={key} sx={{ borderColor: colors.borderLight, py: 1, verticalAlign: 'middle' }}>
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