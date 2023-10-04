import React from 'react';
import { LockOutlined } from '@mui/icons-material';
import {
  Avatar, Box, Button, Container, Grid, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPublicAxios } from '../../axios';
import { PageType } from './types';
import Copyright from '../../components/copyright/copyright';
import PasswordField from '../../components/shared/passwordField';

interface IProps {
  setVisiblePage: (value: PageType) => void,
  email?: string;
  accessCode?: string;
}

function ResetPasswordChangeForm(props: IProps) {
  const [errorText, setErrorText] = React.useState<string>('');
  const { email, accessCode, setVisiblePage } = props;
  const navigate = useNavigate();

  if (!email || !accessCode) {
    return (
      <p>Could not load page</p>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axios = getPublicAxios();
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (!password) {
      setErrorText('Password must not be blank');
      return;
    }

    if (!confirmPassword) {
      setErrorText('Confirm Password must not be blank.');
      return;
    }

    if (confirmPassword !== password) {
      setErrorText('Passwords do not match.');
      return;
    }

    try {
      await axios.post('resetpassword/updatePassword', {
        email,
        accessCode,
        password,
      });

      setErrorText('');
      setVisiblePage('RequestPage');
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorText('Unable to change password.');
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
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <PasswordField name="password" />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="confirmPassword" />
            </Grid>
            { errorText.length > 0
            && (
              <Typography component="p" color="error" align="center">
                {errorText}
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

export default ResetPasswordChangeForm;
