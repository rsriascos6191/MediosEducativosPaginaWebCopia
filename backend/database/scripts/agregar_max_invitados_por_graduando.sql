ALTER TABLE ceremonia_grado
    ADD COLUMN IF NOT EXISTS max_invitados_por_graduando INTEGER NOT NULL DEFAULT 2;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_ceremonia_max_invitados_por_graduando'
          AND conrelid = 'ceremonia_grado'::regclass
    ) THEN
        ALTER TABLE ceremonia_grado
            ADD CONSTRAINT chk_ceremonia_max_invitados_por_graduando
            CHECK (max_invitados_por_graduando BETWEEN 2 AND 4) NOT VALID;
    END IF;
END
$$;
