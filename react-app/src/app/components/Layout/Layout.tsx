import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../../constants/config';
import { NavBar } from '../NavBar/NavBar';
import { PageContainer } from '../PageContainer/PageContainer';

export const Layout = () => {

  return (
    <Box height="100vh">
      <NavBar/>
      <PageContainer sx={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
        <Outlet />
      </PageContainer>
    </Box>
  );
};
