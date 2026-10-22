import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface Props {
  open: boolean;
  titulo: string;
  etiqueta: string;
  textoConfirmar: string;
  cargando?: boolean;
  onClose: () => void;
  onConfirmar: (motivo: string) => Promise<boolean>;
}

export default function ModalMotivo({
  open,
  titulo,
  etiqueta,
  textoConfirmar,
  cargando = false,
  onClose,
  onConfirmar,
}: Props) {
  const [motivo, setMotivo] = useState('');

  const cerrar = () => {
    if (cargando) return;
    setMotivo('');
    onClose();
  };

  const confirmar = async () => {
    const motivoLimpio = motivo.trim();
    if (!motivoLimpio || cargando) return;

    const confirmado = await onConfirmar(motivoLimpio);
    if (confirmado) {
      setMotivo('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={cerrar}
      fullWidth
      maxWidth="xs"
      aria-labelledby="modal-motivo-title"
    >
      <DialogTitle id="modal-motivo-title">{titulo}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          fullWidth
          multiline
          minRows={3}
          maxRows={7}
          label={etiqueta}
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={cerrar} disabled={cargando} sx={{ textTransform: 'none' }}>
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={confirmar}
          disabled={!motivo.trim() || cargando}
          sx={{
            backgroundColor: '#0B3A5C',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#062A42' },
          }}
        >
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
