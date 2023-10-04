import { CssBaseline, ThemeProvider, Container } from '@mui/material';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import React from 'react';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Navbar from './components/navbar/navbar';
import Signup from './pages/signup/signup';
import nordTheme from './components/nord-theme';
import ResetPasswordContainer from './pages/reset-password/reset-password-container';
import UserProfilePage from './pages/user-profile/user-profile';
import UserConfiguration from './pages/user-configuration/user-configuration';

const ProtectedRoutes: string[] = [
  '/profile',
  '/configuration',
  '/'
]

function App() {
  const { pathname } = useLocation();
  
  return (
    <ThemeProvider theme={nordTheme}>
      <CssBaseline enableColorScheme>
        { ProtectedRoutes.includes(pathname) && <Navbar /> }
        <Container maxWidth="xl" sx={{ height: '90vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ResetPasswordContainer />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="configuration" element={<UserConfiguration />} />
          </Routes>
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
