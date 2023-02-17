import { Box, Button, CssBaseline, FormGroup, TextField } from '@mui/material';
import React, { useState } from 'react'

const SignupPage = () => {

  return (
    <Box>
      <CssBaseline />
      <h2>Sign up</h2>
      <FormGroup>
        <TextField required id="outlined-basic" label="Login" variant="outlined" />
        <TextField required id="outlined-basic" label="E-mail" variant="outlined" />
        <TextField required type="password" id="outlined-basic" label="Password" variant="outlined" />
        <Button key="signup" onClick={() => {}} sx={{ my: 2, color: 'white', display: 'block' }}>
          Sign up
        </Button>
      </FormGroup>
    </Box>
  )
};

export default SignupPage;