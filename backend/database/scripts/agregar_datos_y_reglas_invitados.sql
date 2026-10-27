ALTER TABLE invitado
    ADD COLUMN IF NOT EXISTS telefono VARCHAR(50),
    ADD COLUMN IF NOT EXISTS parentesco VARCHAR(100);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_invitado_identificacion_digitos'
          AND conrelid = 'invitado'::regclass
    ) THEN
        ALTER TABLE invitado
            ADD CONSTRAINT chk_invitado_identificacion_digitos
            CHECK (
                identificacion IS NOT NULL
                AND identificacion ~ '^[0-9]{1,50}$'
            ) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_ceremonia_cupo_invitados_no_negativo'
          AND conrelid = 'ceremonia_grado'::regclass
    ) THEN
        ALTER TABLE ceremonia_grado
            ADD CONSTRAINT chk_ceremonia_cupo_invitados_no_negativo
            CHECK (cupo_invitados >= 0) NOT VALID;
    END IF;
END
$$;
