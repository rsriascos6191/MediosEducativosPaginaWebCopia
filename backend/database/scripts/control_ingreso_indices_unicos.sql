CREATE UNIQUE INDEX IF NOT EXISTS uq_control_ingreso_sesion_graduando
    ON control_ingreso (id_sesion, id_graduando)
    WHERE id_graduando IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_control_ingreso_sesion_invitado
    ON control_ingreso (id_sesion, id_invitado)
    WHERE id_invitado IS NOT NULL;
