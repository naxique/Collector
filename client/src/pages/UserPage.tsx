import { Box, Button, Container, CssBaseline, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { strings as localeStrings } from '../locales/localeStrings';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from "react-router-dom";

interface UserPageProps {
  locale: keyof typeof localeStrings
}

const UserPage = ({ locale }: UserPageProps) => {
  const [editDescription, setEditDescription] = useState(false);
  const [userDesc, setUserDesc] = useState('description');
  const [isAdmin, setIsAdmin] = useState(true);

  const handleDescriptionSave = () => {
    setEditDescription(false);
  };

  const handleDescriptionChange = (e: any) => {
    setUserDesc(e.target.value);
  };

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />
      <Grid container spacing={2} sx={{ padding: '2rem' }}>
        <Typography component='h2' variant='h3' sx={{ margin: '1rem' }}>username</Typography>
        { isAdmin &&
          <Container sx={{ margin: '.5rem', justifyItems: 'center', alignItems: 'center' }}>
            <Button key='adminpage' component={Link} to='/admin' variant='contained' color='error'>
              { localeStrings[locale].AdminPage }
            </Button>
          </Container>
        }
      </Grid>
      { !editDescription && 
        <Grid container spacing={2}>
          <Grid item xs>
            <p>{ userDesc }</p>
          </Grid>
          <Grid item xs>
            <IconButton key='edit' onClick={() => setEditDescription(true)}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      } {editDescription &&
        <Grid container spacing={2}>
          <TextField 
            id="profile-description"
            placeholder={localeStrings[locale].ProfileDescription}
            value={userDesc}
            onChange={handleDescriptionChange}
            multiline
          />
          <IconButton key='save' onClick={handleDescriptionSave} sx={{ margin: '1rem', height: '100%' }}>
            <SaveIcon />
          </IconButton>
        </Grid>
      }

      <Box>
        <Typography component='h3' variant='h4'>{ localeStrings[locale].YourCollections }</Typography>
      </Box>
    </Box>
  );
};

export default UserPage;