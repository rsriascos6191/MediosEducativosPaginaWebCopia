CREATE TABLE IF NOT EXISTS historial_estado_ceremonia (
    id_historial BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ceremonia INTEGER NOT NULL,
    id_admin_responsable INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL,
    estado_anterior VARCHAR(50) NOT NULL,
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,

    CONSTRAINT fk_historial_estado_ceremonia
        FOREIGN KEY (id_ceremonia)
        REFERENCES ceremonia_grado(id_ceremonia)
        ON DELETE RESTRICT,

    CONSTRAINT fk_historial_estado_admin
        FOREIGN KEY (id_admin_responsable)
        REFERENCES usuario_admin(id_admin)
        ON DELETE RESTRICT,

    CONSTRAINT chk_historial_estado_accion
        CHECK (
            (accion = 'Iniciar'
             AND estado_anterior = 'Programada'
             AND estado_nuevo = 'En curso')
            OR
            (accion = 'Finalizar'
             AND estado_anterior = 'En curso'
             AND estado_nuevo = 'Finalizada')
            OR
            (accion = 'Cancelar'
             AND estado_anterior IN ('Programada', 'En curso')
             AND estado_nuevo = 'Cancelada')
        ),

    CONSTRAINT chk_historial_estado_motivo
        CHECK (
            (accion = 'Cancelar' AND NULLIF(BTRIM(motivo), '') IS NOT NULL)
            OR
            (accion <> 'Cancelar' AND motivo IS NULL)
        )
);

CREATE INDEX IF NOT EXISTS idx_historial_estado_ceremonia_fecha
    ON historial_estado_ceremonia (id_ceremonia, fecha DESC);
