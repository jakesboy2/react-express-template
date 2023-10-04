import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LockOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import Copyright from '../../components/copyright/copyright';
import { getPublicAxios } from '../../axios';
import { PageType } from './types';

interface IProps {
  setVisiblePage: (value: PageType) => void,
  setEmail?: (email: string) => void
}

export default function ResetPasswordRequest(props: IProps) {
  const { setEmail, setVisiblePage } = props;
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleOnClick = (route: string) => navigate(route, { replace: true });

  if (!setEmail) {
    return (
      <p>Could not load page</p>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axios = getPublicAxios();
    const email = data.get('email');

    if (!email) {
      setIsError(true);
      return;
    }

    try {
      await axios.put('resetpassword', {
        email,
      });

      setIsError(false);
      setEmail(email?.toString());
      setVisiblePage('AccessCodePage');
    } catch (error) {
      setIsError(true);
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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container rowSpacing={2}>
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
            { isError
            && (
              <Typography component="p" color="error" align="center">
                Unable to send request.
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Submit
            </Button>
            <Grid item xs={6}>
              <Link href="" onClick={() => handleOnClick('/login')} variant="body2">
                Return to Login
              </Link>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Link href="" onClick={() => handleOnClick('/signup')} variant="body2">
                {'Don\'t have an account? Sign up'}
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
