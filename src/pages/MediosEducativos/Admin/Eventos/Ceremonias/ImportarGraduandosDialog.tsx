import { useState, type ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import * as XLSX from 'xlsx';
import {
  importGraduandosConfig,
  type ImportGraduandoField,
  type ImportGraduandoIssue,
  type ImportGraduandoRow,
  type ImportGraduandosPreview,
  type ImportGraduandosResult,
} from './importGraduandos.config';
import {
  importGraduandos,
  previewImportGraduandos,
} from './services/ceremonias.service';

interface ImportarGraduandosDialogProps {
  open: boolean;
  ceremoniaId: string;
  onClose: () => void;
  onImported: () => void;
}

const fieldKeys = Object.keys(
  importGraduandosConfig.fields,
) as ImportGraduandoField[];

function normalizarEncabezado(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function convertirCelda(value: unknown): string {
  return String(value ?? '').trim();
}

async function leerArchivo(file: File): Promise<ImportGraduandoRow[]> {
  if (file.size > importGraduandosConfig.maxFileSizeBytes) {
    throw new Error('El archivo supera el límite de 5 MB.');
  }
  if (!/\.xlsx$/i.test(file.name)) {
    throw new Error('Selecciona un archivo de Excel con formato .xlsx.');
  }

  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const nombreHoja = workbook.SheetNames[0];
  if (!nombreHoja) {
    throw new Error('El archivo no contiene hojas para importar.');
  }

  const hoja = workbook.Sheets[nombreHoja];
  if (!hoja || !hoja['!ref']) {
    throw new Error('La primera hoja del archivo está vacía.');
  }

  const rango = XLSX.utils.decode_range(hoja['!ref']);
  if (rango.e.r - rango.s.r > importGraduandosConfig.maxRows) {
    throw new Error(`El archivo supera el límite de ${importGraduandosConfig.maxRows} filas.`);
  }

  const filasHoja = XLSX.utils.sheet_to_json(hoja, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: true,
  }) as unknown[][];
  const encabezados = filasHoja[0] ?? [];
  const columnas = new Map<ImportGraduandoField, number>();

  for (const key of fieldKeys) {
    const config = importGraduandosConfig.fields[key];
    const encabezadosAceptados = [config.header, ...config.synonyms]
      .map(normalizarEncabezado);
    const indices = encabezados
      .map((encabezado, index) =>
        encabezadosAceptados.includes(normalizarEncabezado(encabezado)) ? index : -1,
      )
      .filter((index) => index >= 0);

    if (indices.length > 1) {
      throw new Error(`Hay más de una columna para el campo "${config.header}".`);
    }
    if (indices.length === 1) columnas.set(key, indices[0]);
  }

  const encabezadosObligatoriosFaltantes = fieldKeys
    .filter((key) =>
      importGraduandosConfig.fields[key].requiredHeader && !columnas.has(key),
    )
    .map((key) => importGraduandosConfig.fields[key].header);

  if (encabezadosObligatoriosFaltantes.length > 0) {
    const encontrados = encabezados
      .map(convertirCelda)
      .filter(Boolean)
      .join(', ') || '(ninguno)';
    throw new Error(
      `Faltan columnas obligatorias: ${encabezadosObligatoriosFaltantes.join(', ')}. ` +
      `Encabezados encontrados: ${encontrados}.`,
    );
  }

  const filas: ImportGraduandoRow[] = [];
  for (let index = 1; index < filasHoja.length; index += 1) {
    const celdas = filasHoja[index] ?? [];
    const fila = {} as Record<ImportGraduandoField, string>;
    for (const key of fieldKeys) {
      const columna = columnas.get(key);
      fila[key] = columna === undefined ? '' : convertirCelda(celdas[columna]);
    }
    if (Object.values(fila).every((value) => value === '')) continue;
    filas.push({ filaExcel: rango.s.r + index + 1, ...fila });
  }

  if (filas.length === 0) {
    throw new Error('El archivo no contiene filas con datos para revisar.');
  }
  if (filas.length > importGraduandosConfig.maxRows) {
    throw new Error(`El archivo supera el límite de ${importGraduandosConfig.maxRows} filas.`);
  }

  return filas;
}

function crearPlantilla(): void {
  const encabezados = fieldKeys.map(
    (key) => importGraduandosConfig.fields[key].header,
  );
  const ejemplo = fieldKeys.map(
    (key) => importGraduandosConfig.exampleRow[key],
  );
  const hojaGraduandos = XLSX.utils.aoa_to_sheet([encabezados, ejemplo]);
  hojaGraduandos['!cols'] = encabezados.map((encabezado) => ({
    wch: Math.max(encabezado.length + 4, 20),
  }));
  hojaGraduandos['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(encabezados.length - 1)}2` };

  const hojaInstrucciones = XLSX.utils.aoa_to_sheet([
    ['Plantilla de importación de graduandos'],
    ['La primera fila contiene los encabezados. No los elimines.'],
    ['Identificación, nombres y apellidos son columnas obligatorias.'],
    ['Programa debe coincidir con un programa activo del sistema.'],
    ['Sesión es opcional y debe ser un número configurado para el programa y la ceremonia.'],
    ['Reemplaza o elimina la fila ficticia de ejemplo antes de importar.'],
    ['Los documentos se comparan usando solo sus dígitos.'],
  ]);
  hojaInstrucciones['!cols'] = [{ wch: 105 }];

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hojaGraduandos, 'Graduandos');
  XLSX.utils.book_append_sheet(libro, hojaInstrucciones, 'Instrucciones');
  XLSX.writeFile(libro, 'plantilla_graduandos.xlsx');
}

function protegerFormulaCsv(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function crearReporteCsv(reporte: ImportGraduandoIssue[]): string {
  const filas = [
    ['fila_excel', 'identificacion', 'motivo'],
    ...reporte.map((issue) => [
      String(issue.filaExcel),
      issue.identificacion,
      issue.errores.join('; '),
    ]),
  ];
  return filas
    .map((fila) =>
      fila
        .map((value) => `"${protegerFormulaCsv(value).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\r\n');
}

export default function ImportarGraduandosDialog({
  open,
  ceremoniaId,
  onClose,
  onImported,
}: ImportarGraduandosDialogProps) {
  const [archivo, setArchivo] = useState('');
  const [filas, setFilas] = useState<ImportGraduandoRow[]>([]);
  const [vistaPrevia, setVistaPrevia] = useState<ImportGraduandosPreview | null>(null);
  const [resultado, setResultado] = useState<ImportGraduandosResult | null>(null);
  const [error, setError] = useState('');
  const [mensajeReporte, setMensajeReporte] = useState('');
  const [revisando, setRevisando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const limpiar = () => {
    setArchivo('');
    setFilas([]);
    setVistaPrevia(null);
    setResultado(null);
    setError('');
    setMensajeReporte('');
  };

  const cerrar = () => {
    if (revisando || confirmando) return;
    limpiar();
    onClose();
  };

  const seleccionarArchivo = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    limpiar();
    setArchivo(file.name);
    setRevisando(true);
    try {
      const filasLeidas = await leerArchivo(file);
      setFilas(filasLeidas);
      setVistaPrevia(await previewImportGraduandos(ceremoniaId, filasLeidas));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible revisar el archivo.');
    } finally {
      setRevisando(false);
    }
  };

  const confirmar = async () => {
    if (!vistaPrevia || vistaPrevia.validos === 0) return;
    setConfirmando(true);
    setError('');
    try {
      const finalizado = await importGraduandos(ceremoniaId, filas);
      setResultado(finalizado);
      onImported();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible importar los graduandos.');
    } finally {
      setConfirmando(false);
    }
  };

  const reporte = resultado?.reporte ?? vistaPrevia?.reporte ?? [];
  const resumen = resultado ?? vistaPrevia;
  const filasValidasMuestra = vistaPrevia
    ? filas.filter((fila) =>
      !vistaPrevia.reporte.some((issue) => issue.filaExcel === fila.filaExcel),
    ).slice(0, 10)
    : [];

  const descargarReporte = () => {
    const blob = new Blob([`\uFEFF${crearReporteCsv(reporte)}`], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'reporte_importacion_graduandos.csv';
    enlace.click();
    URL.revokeObjectURL(url);
  };

  const copiarReporte = async () => {
    try {
      await navigator.clipboard.writeText(crearReporteCsv(reporte));
      setMensajeReporte('Reporte copiado al portapapeles.');
      setError('');
    } catch {
      setError('No se pudo copiar el reporte. Puedes descargarlo como CSV.');
    }
  };

  const descargarPlantilla = () => {
    try {
      crearPlantilla();
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible generar la plantilla.');
    }
  };

  return (
    <Dialog open={open} onClose={cerrar} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Importar graduandos desde Excel</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ color: '#5A6A7A', mb: 2 }}>
          Descarga la plantilla o carga un archivo .xlsx. Se revisará la primera hoja;
          ningún graduando se guarda hasta que confirmes.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <Button variant="outlined" onClick={descargarPlantilla} disabled={revisando || confirmando}>
            Descargar plantilla .xlsx
          </Button>
          <Button component="label" variant="contained" disabled={revisando || confirmando}>
            Seleccionar archivo Excel
            <input
              hidden
              type="file"
              accept=".xlsx"
              onChange={seleccionarArchivo}
            />
          </Button>
          {archivo && <Typography sx={{ color: '#5A6A7A' }}>{archivo}</Typography>}
        </Box>
        <Typography variant="caption" sx={{ display: 'block', color: '#5A6A7A', mb: 2 }}>
          Máximo 5 MB y {importGraduandosConfig.maxRows} filas. Los encabezados ignoran mayúsculas,
          tildes y espacios.
        </Typography>

        {revisando && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
            <CircularProgress size={20} />
            <Typography>Validando filas sin guardar...</Typography>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {mensajeReporte && <Alert severity="success" sx={{ mb: 2 }}>{mensajeReporte}</Alert>}

        {resumen && (
          <>
            {resultado && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Se importaron {resultado.importados} graduandos. Se omitieron {resultado.invalidos} filas inválidas.
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Typography><strong>Filas revisadas:</strong> {resumen.total}</Typography>
              <Typography><strong>Válidas:</strong> {resultado ? resultado.importados : resumen.validos}</Typography>
              <Typography><strong>Inválidas:</strong> {resumen.invalidos}</Typography>
            </Box>

            {!resultado && filasValidasMuestra.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 600, mb: 0.75 }}>Vista previa de filas válidas</Typography>
                <TableContainer sx={{ maxHeight: 220, border: '1px solid #E5EAF0', borderRadius: 1 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fila</TableCell>
                        <TableCell>Identificación</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Programa</TableCell>
                        <TableCell>Sesión</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filasValidasMuestra.map((fila) => (
                        <TableRow key={fila.filaExcel}>
                          <TableCell>{fila.filaExcel}</TableCell>
                          <TableCell>{fila.identificacion}</TableCell>
                          <TableCell>{`${fila.nombres} ${fila.apellidos}`}</TableCell>
                          <TableCell>{fila.programa}</TableCell>
                          <TableCell>{fila.sesion || 'Sin asignar'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {resumen.validos > filasValidasMuestra.length && (
                  <Typography variant="caption" sx={{ color: '#5A6A7A' }}>
                    Se muestran las primeras {filasValidasMuestra.length} filas válidas.
                  </Typography>
                )}
              </Box>
            )}

            {reporte.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
                  <Typography sx={{ fontWeight: 600 }}>Filas que no se importarán</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={copiarReporte}>Copiar reporte</Button>
                    <Button size="small" onClick={descargarReporte}>Descargar CSV</Button>
                  </Box>
                </Box>
                <TableContainer sx={{ maxHeight: 260, border: '1px solid #E5EAF0', borderRadius: 1 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fila Excel</TableCell>
                        <TableCell>Identificación</TableCell>
                        <TableCell>Motivo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reporte.map((issue) => (
                        <TableRow key={`${issue.filaExcel}-${issue.identificacion}`}>
                          <TableCell>{issue.filaExcel}</TableCell>
                          <TableCell>{issue.identificacion || '—'}</TableCell>
                          <TableCell>{issue.errores.join(' ')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={cerrar} disabled={revisando || confirmando}>
          {resultado ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!resultado && (
          <Button
            variant="contained"
            onClick={confirmar}
            disabled={!vistaPrevia || vistaPrevia.validos === 0 || revisando || confirmando}
          >
            {confirmando
              ? 'Importando...'
              : `Confirmar e importar ${vistaPrevia?.validos ?? 0} válidos`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
