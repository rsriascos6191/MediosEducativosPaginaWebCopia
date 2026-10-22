ALTER TABLE graduando
ADD COLUMN IF NOT EXISTS id_sesion INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_graduando_sesion'
      AND conrelid = 'graduando'::regclass
  ) THEN
    ALTER TABLE graduando
      ADD CONSTRAINT fk_graduando_sesion
      FOREIGN KEY (id_sesion)
      REFERENCES sesion(id_sesion)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_graduando_id_sesion
ON graduando(id_sesion);


