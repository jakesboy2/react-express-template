import { LockOutlined } from '@mui/icons-material';
import {
  Avatar, Box, Button, Container, Grid, TextField, Typography,
} from '@mui/material';
import React from 'react';
import { getPublicAxios } from '../../axios';
import Copyright from '../../components/copyright/copyright';
import { PageType } from './types';

interface IProps {
  setVisiblePage: (value: PageType) => void,
  email?: string;
  setAccessCode?: (accessCode: string) => void
}

function ResetPasswordAccessTokenForm(props: IProps) {
  const { email, setAccessCode, setVisiblePage } = props;
  const [isError, setIsError] = React.useState<boolean>(false);

  if (!email || !setAccessCode) {
    return (
      <p>Could not load page</p>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axios = getPublicAxios();
    const accessCode = data.get('accessCode');

    if (!accessCode) {
      setIsError(true);
      return;
    }

    try {
      await axios.post('resetpassword/verify', {
        email,
        accessCode,
      });

      setIsError(false);
      setAccessCode(accessCode.toString());
      setVisiblePage('ChangePasswordPage');
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
          Enter Access Code
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="accessCode"
                label="Access Code"
                name="accessCode"
                autoFocus
              />
            </Grid>
            { isError
            && (
              <Typography component="p" color="error" align="center">
                Invalid access code
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
            <Grid item xs={12}>
              <Copyright sx={{ mb: 4 }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordAccessTokenForm;
