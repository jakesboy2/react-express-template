import React from 'react';
import {
  InputAdornment, InputLabel, OutlinedInput, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface IProps {
  name: string;
  disabled?: boolean;
}

function PasswordField({ name, disabled }: IProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <InputLabel htmlFor={name}>Password</InputLabel>
      <OutlinedInput
        fullWidth
        id={name}
        name={name}
        type={showPassword ? 'text' : 'password'}
        disabled={disabled}
        autoComplete="current-password"
        endAdornment={(
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              disabled={disabled}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )}
        label="Password"
      />
    </>
  );
}

export default PasswordField;
