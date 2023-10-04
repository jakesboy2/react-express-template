import {
  Container, Box, Typography, Grid, TextField, Button, Stack, Skeleton, Alert,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getPrivateAxios } from '../../axios';
import PasswordField from '../../components/shared/passwordField';
import QueryKeys from '../../shared/query-keys';
import { User } from '../../shared/types';

type UserProfile = Pick<User, 'displayName' | 'email'>;

export default function UserProfilePage(props: any) {
  const [profileErrorMessage, setProfileErrorMessage] = React.useState<string>('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState<string>('');
  const [profileFormDisabled, setProfileFormDisabled] = React.useState<boolean>(true);
  const [passwordFormDisabled, setPasswordFormDisabled] = React.useState<boolean>(true);
  const [passwordSuccess, setPasswordSuccess] = React.useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const privateAxios = getPrivateAxios();

  const fetchUserProfile = async () => {
    if (!privateAxios) return;
    const fetchedProfile = await privateAxios.get('users');
    return fetchedProfile.data.user as User;
  };

  const updateUserProfile = async (userProfile: UserProfile) => {
    if (!privateAxios) return;

    try {
      const result = await privateAxios.patch('users', { user: userProfile });
      return result.data;
    } catch (err) {
      console.error('save profile failed');
    }
  };

  const updateUserPassword = async (passwordRequest: { password: string, newPassword: string}) => {
    if (!privateAxios) return;
    const { password, newPassword } = passwordRequest;

    try {
      await privateAxios.patch('users/password', { password, newPassword });
      return true;
    } catch (err) {
      console.error('save password failed');
      return false;
    }
  };

  const {
    isLoading, data: userProfile, isError: isFetchProfileError, error: fetchProfileError,
  } = useQuery(QueryKeys.GetUserProfile, fetchUserProfile);

  const updateUserPasswordMutation = useMutation(updateUserPassword, {
    onSuccess: async (data) => {
      if (data) {
        setPasswordSuccess(true);
        setPasswordFormDisabled(true);
        return;
      }

      setPasswordErrorMessage('Current password is invalid');
    },
  });

  const updateUserProfileMutation = useMutation(updateUserProfile, {
    onSuccess: async (data, updatedUserProfile) => {
      setProfileSuccess(true);
      setProfileFormDisabled(true);
      queryClient.setQueriesData(
        QueryKeys.GetUserProfile,
        (old: UserProfile | undefined) => updatedUserProfile,
      );
    },
  });

  const handleProfileInformationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString();
    const displayName = data.get('displayName')?.toString();

    if (!displayName) {
      setProfileErrorMessage('Display Name must not be blank');
      return;
    }

    if (!email) {
      setProfileErrorMessage('Email must not be blank');
      return;
    }

    setProfileErrorMessage('');
    updateUserProfileMutation.mutate({ displayName, email });
  };

  const handlePasswordChangeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const password = data.get('currentPassword')?.toString();
    const newPassword = data.get('newPassword')?.toString();
    const confirmNewPassword = data.get('confirmPassword')?.toString();

    if (!password) {
      setPasswordErrorMessage('Current Password must not be blank');
      return;
    }

    if (!newPassword) {
      setPasswordErrorMessage('New Password must not be blank');
      return;
    }

    if (!confirmNewPassword) {
      setPasswordErrorMessage('Confirm Password must not be blank');
      return;
    }

    if (confirmNewPassword !== newPassword) {
      setPasswordErrorMessage('Passwords must match');
      return;
    }

    setPasswordErrorMessage('');
    updateUserPasswordMutation.mutate({ password, newPassword });
  };

  if (isFetchProfileError) {
    return (
      <p>
        Error...
        {JSON.stringify(fetchProfileError)}
      </p>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ paddingBottom: 2 }}>
          Update Profile
        </Typography>
        <Box component="form" id="profileForm" noValidate onSubmit={handleProfileInformationSubmit} sx={{ paddingTop: 1, paddingBottom: 10 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              { !isLoading
                ? (
                  <TextField
                    required
                    fullWidth
                    disabled={profileFormDisabled}
                    id="displayName"
                    label="Display Name"
                    name="displayName"
                    defaultValue={userProfile?.displayName}
                  />
                )
                : (
                  <Skeleton variant="rectangular" width="100%" height="100%">
                    <TextField
                      fullWidth
                    />
                  </Skeleton>
                )}
            </Grid>
            <Grid item xs={12}>
              { !isLoading
                ? (
                  <TextField
                    required
                    fullWidth
                    disabled={profileFormDisabled}
                    id="email"
                    label="Email Address"
                    name="email"
                    defaultValue={userProfile?.email}
                  />
                )
                : (
                  <Skeleton variant="rectangular" width="100%" height="100%">
                    <TextField
                      fullWidth
                    />
                  </Skeleton>
                )}
            </Grid>
          </Grid>
          { profileSuccess
            && <Alert severity="success" variant="filled" sx={{ marginTop: '16px' }}>Profile Updated!</Alert>}
          { profileErrorMessage.length > 0
            && (
            <Typography component="p" color="error" align="center" sx={{ paddingTop: '16px' }}>
              {profileErrorMessage}
            </Typography>
            )}
          <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ paddingTop: '16px' }}>
            <Button
              type="button"
              fullWidth
              onClick={() => setProfileFormDisabled(!profileFormDisabled)}
              variant="contained"
            >
              { profileFormDisabled ? 'Edit' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={profileFormDisabled}
              variant="contained"
            >
              Update
            </Button>
          </Stack>
        </Box>
        <Typography component="h1" variant="h5" sx={{ paddingBottom: 2 }}>
          Change Password
        </Typography>
        <Box component="form" id="passwordChangeForm" noValidate onSubmit={handlePasswordChangeSubmit} sx={{ paddingTop: 1 }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <PasswordField name="currentPassword" disabled={passwordFormDisabled} />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="newPassword" disabled={passwordFormDisabled} />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="confirmPassword" disabled={passwordFormDisabled} />
            </Grid>
          </Grid>
          { passwordSuccess
            && <Alert severity="success" variant="filled" sx={{ marginTop: '16px' }}>Password Updated!</Alert>}
          { passwordErrorMessage.length > 0
            && (
            <Typography component="p" color="error" align="center" sx={{ paddingTop: '16px' }}>
              {passwordErrorMessage}
            </Typography>
            )}
          <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ paddingTop: '16px' }}>
            <Button
              type="button"
              fullWidth
              onClick={() => setPasswordFormDisabled(!passwordFormDisabled)}
              variant="contained"
            >
              { passwordFormDisabled ? 'Edit' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={passwordFormDisabled}
              variant="contained"
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
