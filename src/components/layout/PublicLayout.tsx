import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <PublicHeader />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
        }}
      >
        <Outlet />
      </Box>

      <PublicFooter />
    </Box>
  );
}

export default PublicLayout;
