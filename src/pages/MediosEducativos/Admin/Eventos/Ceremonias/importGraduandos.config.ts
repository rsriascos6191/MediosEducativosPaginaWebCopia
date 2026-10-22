export const importGraduandosConfig = {
  maxFileSizeBytes: 5 * 1024 * 1024,
  maxRows: 1000,
  fields: {
    identificacion: {
      header: 'identificacion',
      synonyms: ['Cédula', 'Documento', 'No. de identificación', 'Número de documento'],
      requiredHeader: true,
    },
    nombres: {
      header: 'nombres',
      synonyms: ['Nombre', 'Nombres del graduando'],
      requiredHeader: true,
    },
    apellidos: {
      header: 'apellidos',
      synonyms: ['Apellido', 'Apellidos del graduando'],
      requiredHeader: true,
    },
    correo_electronico: {
      header: 'correo_electronico',
      synonyms: ['Correo', 'Correo electrónico', 'Email', 'E-mail'],
      requiredHeader: false,
    },
    telefono: {
      header: 'telefono',
      synonyms: ['Teléfono', 'Celular', 'Móvil'],
      requiredHeader: false,
    },
    codigo_estudiantil: {
      header: 'codigo_estudiantil',
      synonyms: ['Código estudiantil', 'Código', 'Matrícula'],
      requiredHeader: false,
    },
    talla_toga: {
      header: 'talla_toga',
      synonyms: ['Talla toga', 'Talla'],
      requiredHeader: false,
    },
    programa: {
      header: 'programa',
      synonyms: ['Programa académico', 'Carrera'],
      requiredHeader: false,
    },
    sesion: {
      header: 'sesion',
      synonyms: ['Sesión', 'Número de sesión', 'N.º de sesión'],
      requiredHeader: false,
    },
  },
  exampleRow: {
    identificacion: '1234567890',
    nombres: 'Ana Ejemplo',
    apellidos: 'Estudiante Ficticia',
    correo_electronico: 'ana.ejemplo@example.com',
    telefono: '3000000000',
    codigo_estudiantil: 'EJ-0001',
    talla_toga: 'M',
    programa: 'Reemplazar por un programa activo',
    sesion: '',
  },
} as const;

export type ImportGraduandoField = keyof typeof importGraduandosConfig.fields;

export type ImportGraduandoRow = {
  filaExcel: number;
} & Record<ImportGraduandoField, string>;

export interface ImportGraduandoIssue {
  filaExcel: number;
  identificacion: string;
  errores: string[];
}

export interface ImportGraduandosPreview {
  total: number;
  validos: number;
  invalidos: number;
  reporte: ImportGraduandoIssue[];
}

export interface ImportGraduandosResult extends ImportGraduandosPreview {
  importados: number;
}
