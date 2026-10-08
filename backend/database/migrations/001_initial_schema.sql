CREATE TABLE campus (
    id_campus INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion_sede VARCHAR(255)
);

CREATE TABLE programa (
    id_programa INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE dependencia (
    id_dependencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE area (
    id_area INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE grupo (
    id_grupo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tipo_espacio (
    id_tipo_espacio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE categoria_documento (
    id_categoria_documento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE espacio (
    id_espacio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    id_campus INTEGER NOT NULL,
    id_tipo_espacio INTEGER NOT NULL,
    capacidad INTEGER,
    ubicacion VARCHAR(255),
    recursos TEXT,
    recursos_otro TEXT,
    imagen VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    descripcion TEXT,

    CONSTRAINT fk_espacio_campus
        FOREIGN KEY (id_campus) REFERENCES campus(id_campus),

    CONSTRAINT fk_espacio_tipo
        FOREIGN KEY (id_tipo_espacio) REFERENCES tipo_espacio(id_tipo_espacio)
);

CREATE TABLE usuario_admin (
    id_admin INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo_institucional VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    id_campus INTEGER,
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_usuario_admin_campus
        FOREIGN KEY (id_campus) REFERENCES campus(id_campus)
);

CREATE TABLE solicitante (
    id_solicitante INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_programa INTEGER,
    id_dependencia INTEGER,
    id_area INTEGER,
    id_grupo INTEGER,
    nombre VARCHAR(150) NOT NULL,
    cargo VARCHAR(100),
    correo VARCHAR(150),
    numero_contacto VARCHAR(50),

    CONSTRAINT fk_solicitante_programa
        FOREIGN KEY (id_programa) REFERENCES programa(id_programa),

    CONSTRAINT fk_solicitante_dependencia
        FOREIGN KEY (id_dependencia) REFERENCES dependencia(id_dependencia),

    CONSTRAINT fk_solicitante_area
        FOREIGN KEY (id_area) REFERENCES area(id_area),

    CONSTRAINT fk_solicitante_grupo
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);

CREATE TABLE solicitud_reserva (
    id_solicitud INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_solicitante INTEGER NOT NULL,
    id_espacio INTEGER NOT NULL,
    codigo_solicitud VARCHAR(50) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    nombre_actividad VARCHAR(255) NOT NULL,
    requerimientos TEXT,
    estado VARCHAR(50) NOT NULL,
    motivo_cancelacion TEXT,
    id_admin_gestion INTEGER,

    CONSTRAINT fk_solicitud_solicitante
        FOREIGN KEY (id_solicitante) REFERENCES solicitante(id_solicitante),

    CONSTRAINT fk_solicitud_espacio
        FOREIGN KEY (id_espacio) REFERENCES espacio(id_espacio),

    CONSTRAINT fk_solicitud_admin
        FOREIGN KEY (id_admin_gestion) REFERENCES usuario_admin(id_admin)
);

CREATE TABLE notificacion (
    id_notificacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_solicitud INTEGER NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    fecha_envio TIMESTAMP,
    estado_envio BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_notificacion_solicitud
        FOREIGN KEY (id_solicitud) REFERENCES solicitud_reserva(id_solicitud)
);

CREATE TABLE evento_institucional (
    id_evento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_admin_gestion INTEGER NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    requerimientos_basicos TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_evento_admin
        FOREIGN KEY (id_admin_gestion) REFERENCES usuario_admin(id_admin)
);

CREATE TABLE requerimiento_evento (
    id_requerimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_evento INTEGER NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    proveedor VARCHAR(150),
    estado VARCHAR(50),

    CONSTRAINT fk_requerimiento_evento
        FOREIGN KEY (id_evento) REFERENCES evento_institucional(id_evento)
);

CREATE TABLE ceremonia_grado (
    id_ceremonia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_evento INTEGER NOT NULL,
    id_espacio INTEGER NOT NULL,
    codigo_ceremonia VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    evidencia_fotografia_1 BYTEA,
    evidencia_fotografia_2 BYTEA,
    evidencia_fotografia_3 BYTEA,
    evidencia_fotografia_4 BYTEA,
    resolucion_grados VARCHAR(255),
    informacion_historica TEXT,

    CONSTRAINT fk_ceremonia_evento
        FOREIGN KEY (id_evento) REFERENCES evento_institucional(id_evento),

    CONSTRAINT fk_ceremonia_espacio
        FOREIGN KEY (id_espacio) REFERENCES espacio(id_espacio)
);

CREATE TABLE sesion (
    id_sesion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ceremonia INTEGER NOT NULL,
    numero_sesion INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    fecha_ensayo DATE,
    orden_del_dia TEXT,

    CONSTRAINT fk_sesion_ceremonia
        FOREIGN KEY (id_ceremonia) REFERENCES ceremonia_grado(id_ceremonia)
);

CREATE TABLE sesion_programa (
    id_sesion INTEGER NOT NULL,
    id_programa INTEGER NOT NULL,

    PRIMARY KEY (id_sesion, id_programa),

    CONSTRAINT fk_sesion_programa_sesion
        FOREIGN KEY (id_sesion) REFERENCES sesion(id_sesion),

    CONSTRAINT fk_sesion_programa_programa
        FOREIGN KEY (id_programa) REFERENCES programa(id_programa)
);

CREATE TABLE graduando (
    id_graduando INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ceremonia INTEGER NOT NULL,
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    identificacion VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(150),
    telefono VARCHAR(50),
    codigo_estudiantil VARCHAR(50),
    talla_toga VARCHAR(20),
    requisitos_cumplidos BOOLEAN NOT NULL DEFAULT FALSE,
    ubicacion_cronograma VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_graduando_ceremonia
        FOREIGN KEY (id_ceremonia) REFERENCES ceremonia_grado(id_ceremonia)
);

CREATE TABLE graduando_programa (
    id_graduando INTEGER NOT NULL,
    id_programa INTEGER NOT NULL,

    PRIMARY KEY (id_graduando, id_programa),

    CONSTRAINT fk_graduando_programa_graduando
        FOREIGN KEY (id_graduando) REFERENCES graduando(id_graduando),

    CONSTRAINT fk_graduando_programa_programa
        FOREIGN KEY (id_programa) REFERENCES programa(id_programa)
);

CREATE TABLE invitado (
    id_invitado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_graduando INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    identificacion VARCHAR(50),
    tipo INTEGER,
    autorizado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_invitado_graduando
        FOREIGN KEY (id_graduando) REFERENCES graduando(id_graduando)
);

CREATE TABLE control_ingreso (
    id_control_ingreso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion INTEGER NOT NULL,
    id_graduando INTEGER,
    id_invitado INTEGER,
    ingreso BOOLEAN NOT NULL DEFAULT FALSE,
    hora_ingreso TIME,

    CONSTRAINT fk_control_ingreso_sesion
        FOREIGN KEY (id_sesion) REFERENCES sesion(id_sesion),

    CONSTRAINT fk_control_ingreso_graduando
        FOREIGN KEY (id_graduando) REFERENCES graduando(id_graduando),

    CONSTRAINT fk_control_ingreso_invitado
        FOREIGN KEY (id_invitado) REFERENCES invitado(id_invitado)
);

CREATE TABLE documento (
    id_documento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria_documento INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    archivo BYTEA,
    tipo_archivo VARCHAR(100),
    ubicacion_publicacion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documento_categoria
        FOREIGN KEY (id_categoria_documento)
        REFERENCES categoria_documento(id_categoria_documento)
);