import { Alert, Box, Button, CssBaseline, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { strings as localeStrings } from '../locales/localeStrings';
import { useState } from 'react';
import * as network from '../network/network';
import { User } from '../models/User';

interface LoginPageProps {
  locale: keyof typeof localeStrings,
  loginSubmitCallback: (user: User) => void
}

const LoginPage = ({ locale, loginSubmitCallback }: LoginPageProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('Unknown error occured');
  const [showError, setShowError] = useState(false);

  const usernameChange = (e: any) => {
    setUsername(e.target.value);
  }

  const passwordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleLoginSubmit = async () => {
    try {
      if (!username || !password) throw Error(localeStrings[locale].FillAllTheFields);
      const user = await network.login({ username: username, password: password });
      loginSubmitCallback(user);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />

      <Box sx={{ textAlign: 'center', margin: '2.5rem' }}>
        <Typography component='h2' variant='h3'>{ localeStrings[locale].Login }</Typography>
      </Box>

      <FormGroup sx={{ alignContent: 'center', justifyContent: 'center' }}>
        <TextField required id="login" label={ localeStrings[locale].Username } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={usernameChange}/>
        <TextField required type="password" id="password" label={ localeStrings[locale].Password } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={passwordChange}/>

        { showError &&
          <Alert severity='error' variant='outlined'>{ errorMessage }</Alert>
        }

        <Stack direction="row" sx={{ alignContent: 'center', justifyContent: 'center' }}>  
          <Button key="login" onClick={handleLoginSubmit} sx={{ margin: '1rem' }} variant='contained' color='success'>
            { localeStrings[locale].Login }
          </Button>
          <Button key="signup" component={Link} to='/signup' sx={{ margin: '1rem' }} variant='outlined'>
            { localeStrings[locale].Signup }
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  )
};

export default LoginPage;