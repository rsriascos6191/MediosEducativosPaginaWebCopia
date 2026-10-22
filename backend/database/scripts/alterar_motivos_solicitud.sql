ALTER TABLE solicitud_reserva
    ADD COLUMN IF NOT EXISTS motivo_rechazo TEXT;

ALTER TABLE solicitud_reserva
    ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT;
