/**
 * Pantalla: Admin – Gestión de contenidos
 * Tabs: Documentos | Horarios académicos – diseño 1:1.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../../../components/AdminLayout';
import type {
  Contenido,
  TipoContenido,
} from './interfaces/contenidos.interface';
import { getContenidos } from './services/contenidos.service';

const TABS: TipoContenido[] = ['Documentos', 'Horarios académicos'];

export default function Contenidos() {
  const [tab, setTab] = useState<TipoContenido>('Documentos');
  const [items, setItems] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (categoria: TipoContenido) => {
    setLoading(true);
    try {
      const res = await getContenidos(categoria);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  const sectionTitle =
    tab === 'Documentos' ? 'Documentos' : 'Horarios academicos';
  const sectionDesc =
    tab === 'Documentos'
      ? 'Gestiona los documentos disponibles en el portal público.'
      : 'Gestiona los documento de los horarios academicos disponibles en el portal público.';

  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#0B1A2A',
            fontSize: '1.75rem',
            mb: 0.5,
          }}
        >
          Gestión de contenidos
        </Typography>
        <Typography sx={{ color: '#5A6A7A', fontSize: '0.95rem' }}>
          Administra los archivos y contenidos informativos que se muestran en el
          portal público.
        </Typography>
      </Box>

      {/* Tabs Documentos / Horarios */}
      <Box
        sx={{
          display: 'flex',
          mb: 3,
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #E5EAF0',
          backgroundColor: '#FFFFFF',
        }}
      >
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <Button
              key={t}
              onClick={() => setTab(t)}
              sx={{
                flex: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1.4,
                borderRadius: 0,
                backgroundColor: active ? '#0B3A5C' : 'transparent',
                color: active ? '#FFFFFF' : '#1A2A3A',
                '&:hover': {
                  backgroundColor: active ? '#062A42' : 'rgba(11,58,92,0.04)',
                },
              }}
            >
              {t}
            </Button>
          );
        })}
      </Box>

      {/* Sección título + botón */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2.5,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0B1A2A', mb: 0.4 }}
          >
            {sectionTitle}
          </Typography>
          <Typography sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
            {sectionDesc}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#E30613',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            py: 1.1,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#C10510', boxShadow: 'none' },
          }}
        >
          + Agregar documento
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5EAF0',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
              {['Documento', 'Archivo', 'Estado', 'Acciones'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    color: '#1A2A3A',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #E5EAF0',
                    py: 1.75,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  Cargando…
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#5A6A7A' }}>
                  No hay documentos en esta sección.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': { backgroundColor: '#F8FAFC' },
                    '& td': { borderBottom: '1px solid #F0F3F7' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#1A2A3A', fontSize: '0.9rem' }}>
                    {item.nombre}
                  </TableCell>
                  <TableCell sx={{ color: '#5A6A7A', fontSize: '0.875rem' }}>
                    {item.tipoArchivo}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.estado}
                      size="small"
                      sx={{
                        backgroundColor: '#E6F4EA',
                        color: '#1B7A3D',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {['Ver', 'Actualizar', 'Retirar'].map((action) => (
                        <Button
                          key={action}
                          variant="text"
                          sx={{
                            color: '#1565C0',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {action}
                        </Button>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        sx={{ color: '#5A6A7A', fontSize: '0.85rem', mt: 2.5 }}
      >
        Los documentos gestionados aquí se reflejan en la sección pública de
        Documentos.
      </Typography>
    </AdminLayout>
  );
}
