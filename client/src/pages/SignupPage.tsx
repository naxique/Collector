import { Alert, Box, Button, CssBaseline, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { strings as localeStrings } from '../locales/localeStrings';
import { useState } from 'react';
import * as network from '../network/network';
import { useNavigate } from 'react-router-dom';

interface SignupPageProps {
  locale: keyof typeof localeStrings
}

const SignupPage = ({ locale }: SignupPageProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('Unknown error occured');
  const [showError, setShowError] = useState(false);

  const handleChange = (e: any) => {
    if (e.target.id === 'username') setUsername(e.target.value);
    else if (e.target.id === 'email') setEmail(e.target.value);
    else if (e.target.id === 'password') setPassword(e.target.value);
    else if (e.target.id === 'confirmPassword') setConfirmPassword(e.target.value);
  };

  const handleSignup = async () => {
    try {
      if (!username || !email || !password || !confirmPassword) throw Error(localeStrings[locale].FillAllTheFields);
      if (password !== confirmPassword) throw Error(localeStrings[locale].PasswordsDoesntMeet);
      if (username.length < 3) throw Error(localeStrings[locale].UsernameTooShort);
      if (username.includes(' ') || email.includes(' ')) throw Error(localeStrings[locale].UsernameAndEmailShoulntContainSpaces);
      setShowError(false);

      const user = await network.signup({ username: username, email: email, password: password });
      if (user.username) navigate('/login');
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
        <Typography component='h2' variant='h3'>{ localeStrings[locale].Sign_up }</Typography>
      </Box>

      <FormGroup sx={{ alignContent: 'center', justifyContent: 'center' }}>
        <TextField required id="username" label={ localeStrings[locale].Username } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={handleChange}/>
        <TextField required type="email" id="email" label={ localeStrings[locale].Email } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={handleChange}/>
        <TextField required type="password" id="password" label={ localeStrings[locale].Password } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={handleChange}/>
        <TextField required type="password" id="confirmPassword" label={ localeStrings[locale].ConfirmPassword } variant="outlined" sx={{ width: '30%', margin: '1rem' }} onChange={handleChange}/>

        { showError &&
          <Alert severity='error' variant='outlined'>{ errorMessage }</Alert>
        }

        <Stack direction="row" sx={{ alignContent: 'center', justifyContent: 'center' }}> 
          <Button key="signup" onClick={handleSignup} sx={{ margin: '1rem' }} variant='contained' color='success'>
            { localeStrings[locale].Signup }
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  )
};

export default SignupPage;