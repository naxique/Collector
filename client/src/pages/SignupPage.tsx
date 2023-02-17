import { Box, Button, CssBaseline, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { strings as localeStrings } from '../locales/localeStrings';
import React, { useState } from 'react'

interface SignupPageProps {
  locale: keyof typeof localeStrings
}

const SignupPage = ({ locale }: SignupPageProps) => {

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />

      <Box sx={{ textAlign: 'center', margin: '2.5rem' }}>
        <Typography component='h2' variant='h3'>{ localeStrings[locale].Sign_up }</Typography>
      </Box>

      <FormGroup sx={{ alignContent: 'center', justifyContent: 'center' }}>
        <TextField required id="login" label={ localeStrings[locale].Username } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>
        <TextField required id="email" label={ localeStrings[locale].Email } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>
        <TextField required type="password" id="password" label={ localeStrings[locale].Password } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>
        <TextField required type="password" id="confirmPassword" label={ localeStrings[locale].ConfirmPassword } variant="outlined" sx={{ width: '30%', margin: '1rem' }}/>

        <Stack direction="row" sx={{ alignContent: 'center', justifyContent: 'center' }}> 
          <Button key="signup" onClick={() => {}} sx={{ margin: '1rem' }} variant='contained' color='success'>
            { localeStrings[locale].Signup }
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  )
};

export default SignupPage;