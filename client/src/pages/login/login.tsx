import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Container,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { LockOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import Copyright from '../../components/copyright/copyright';
import { User } from '../../shared/types';
import { getPublicAxios } from '../../axios';
import PasswordField from '../../components/shared/passwordField';

interface ILoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export default function Login() {
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleOnClick = (route: string) => navigate(route, { replace: true });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axios = getPublicAxios();
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await axios.post('auth/login', {
        email,
        password,
      });

      const responseData = response.data as ILoginResponse;
      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      window.dispatchEvent(new Event('storage'));
      setIsError(false);
      navigate('/', { replace: true });
    } catch (error) {
      setIsError(true);
    }
  };

  const { state } = useLocation();
  const showAccountCreated = state?.isNewAccount;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container rowSpacing={2}>
            { showAccountCreated
              && (
              <Grid item xs={12}>
                <Alert severity="success" variant="filled">Account created!</Alert>
              </Grid>
              )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="password" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            { isError
            && (
              <Typography component="p" color="error" align="center">
                Invalid email and password.
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
            <Grid item xs={6}>
              <Link href="" onClick={() => handleOnClick('/forgot-password')} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Link href="" onClick={() => handleOnClick('/signup')} variant="body2">
                {'Don\'t have an account? Sign up'}
              </Link>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }} sx={{ mt: 4 }}>
              <Link href="" onClick={() => handleOnClick('/')} variant="body2">
                Use the app without signing in
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Copyright sx={{ mb: 4 }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
