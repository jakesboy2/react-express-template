import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';

import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { getPublicAxios } from '../../axios';
import Copyright from '../../components/copyright/copyright';

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formError, setFormError] = useState<{ [x: string]: boolean }>(
    { email: false, password: false },
  );
  const navigate = useNavigate();

  function parsePassword(password: string): string {
    const parsedPassword = password.trim();
    return parsedPassword;
  }

  const isValidEmail = (email: string): boolean => {
    const validEmailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return validEmailRegex.test(email.toString());
  };

  const isValidPassword = (password: string): boolean => {
    const parsedPassword = parsePassword(password.toString());
    return parsedPassword.length >= 5 && !parsedPassword.includes(' ');
  };

  const handleChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;

    if (target.value.length === 0) {
      setFormError({
        ...formError,
        [target.name]: false,
      });
      return;
    }

    switch (target.id) {
      case 'email':
        setFormError({
          ...formError,
          email: !isValidEmail(target.value),
        });
        break;
      case 'password':
        setFormError({
          ...formError,
          password: !isValidPassword(target.value),
        });
        break;
      default:
        break;
    }
  };

  const handleOnClick = (route: string) => navigate(route, { replace: true });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(formError).includes(true)) {
      setErrorMessage('The form contains errors that must be corrected before submitting.');
      return;
    }

    const data = new FormData(event.currentTarget);
    const axios = getPublicAxios();
    const email = data.get('email')?.toString();
    let password = data.get('password')?.toString();
    let confirmPassword = data.get('confirmPassword')?.toString();

    password = parsePassword(password || '');
    confirmPassword = parsePassword(confirmPassword || '');

    if (email === undefined || email.length === 0) {
      setErrorMessage('Email must not be blank.');
      return;
    }

    if (password === undefined || password.length === 0) {
      setErrorMessage('Password must not be blank.');
      return;
    }

    if (confirmPassword === undefined || password.length === 0) {
      setErrorMessage('Confirm Password must not be blank.');
      return;
    }

    if (confirmPassword !== password) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post('auth/signup', {
        email,
        password,
      });
      setErrorMessage('');
      navigate('/login', { replace: true, state: { isNewAccount: true } });
    } catch (error: any) {
      setErrorMessage('An account with this email already exists.');
    }
  };

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
          Sign up
        </Typography>
        <Box component="form" id="signUpForm" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={formError.email}
                onChange={handleChange}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={formError.confirmPassword}
                onChange={handleChange}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={formError.password}
                onChange={handleChange}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive motivation, marketing promotions, and updates via email."
              />
            </Grid>
          </Grid>
          { errorMessage.length > 0
            && (
            <Typography component="p" color="error" align="center">
              {errorMessage}
            </Typography>
            )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end" rowSpacing={2}>
            <Grid item>
              <Link href="" onClick={() => handleOnClick('/login')} variant="body2">
                Already have an account? Sign in
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
