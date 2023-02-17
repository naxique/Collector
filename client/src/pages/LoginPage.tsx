import { Box, Button, CssBaseline, FormGroup, TextField } from '@mui/material';
import React, { useState } from 'react'

const LoginPage = () => {

  return (
    <Box>
      <CssBaseline />
      <h2>Log in</h2>
      <FormGroup>
        <TextField required id="outlined-basic" label="Login" variant="outlined" />
        <TextField required type="password" id="outlined-basic" label="Password" variant="outlined" />
        <Button key="login" onClick={() => {}} sx={{ my: 2, color: 'white', display: 'block' }}>
          Log in
        </Button>
      </FormGroup>
      <small>or</small>
      <Button key="signup" onClick={() => {}} sx={{ my: 2, color: 'white', display: 'block' }}>
        SIGN UP
      </Button>
    </Box>
  )
};

export default LoginPage;