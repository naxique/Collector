import { Box, Button, Container, CssBaseline, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { strings as localeStrings } from '../locales/localeStrings';
import React, { useState } from 'react'

interface LoginPageProps {
  locale: keyof typeof localeStrings
}

const LoginPage = ({ locale }: LoginPageProps) => {

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />

      <Box sx={{ textAlign: 'center', margin: '2.5rem' }}>
        <Typography component='h2' variant='h3'>{ localeStrings[locale].Log_in }</Typography>
      </Box>

      <FormGroup sx={{ alignContent: 'center', justifyContent: 'center' }}>
        <TextField required id="login" label={ localeStrings[locale].Username } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>
        <TextField required type="password" id="password" label={ localeStrings[locale].Password } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>

        <Stack direction="row" sx={{ alignContent: 'center', justifyContent: 'center' }}>  
          <Button key="login" onClick={() => {}} sx={{ margin: '1rem' }} variant='contained' color='success'>
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