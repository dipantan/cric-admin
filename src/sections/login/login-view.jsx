import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import useAuthStore from 'src/store/authStore';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError); // Assuming you have this action

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
        onClose: clearError,
        onOpen: () => {
          clearError();
        },
      });
    }
  }, [error]);

  const handleClick = async () => {
    if (!email || !password) {
      toast.error('Please fill in email and password', {
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    } else {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      router.push('/');
    }
  };

  const checkValidEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !checkValidEmail()}
          helperText={email && !checkValidEmail() ? 'Invalid email address' : ''}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          error={password && password.length < 4}
          onChange={(e) => setPassword(e.target.value)}
          helperText={
            password && password.length < 4 ? 'Password must be at least 4 characters' : ''
          }
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }} />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={loading}
        disabled={!checkValidEmail() || !password || password.length < 4}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" align="center">
            Sign in to admin
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }} />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
