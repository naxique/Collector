import { Box, Button, CssBaseline, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { strings as localeStrings } from '../locales/localeStrings';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as network from '../network/network'
import { Link, useNavigate, useParams } from "react-router-dom";
import { User } from "../models/User";
import { Collection } from "../models/Collections";

interface UserPageProps {
  locale: keyof typeof localeStrings,
  cookies: any
}

const UserPage = ({ locale, cookies }: UserPageProps) => {
  const params = useParams();
  const [user, setUser] = useState<User>();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState(false);
  const [hasCollections, setHasCollections] = useState(false);
  const navigate = useNavigate();

  const getCollections = async (c: string[]) => {
    try {
      c.map(async (cid, i) => {
        const collection = await network.getCollectionById(cid);
        if (collections.length < c.length)
          setCollections(collections => [...collections, collection]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    if (!params.userId) navigate('/login');
    else {
      const u = await network.getUserById(params.userId);
      if (cookies.user?.userId === params.userId || cookies.user?.isAdmin) setIsReadOnly(false);
      if (u.description !== '') setDescription(u.description);
      else setDescription('-');
      getCollections(u.collections);
      setUser(u);
    }
  };

  useEffect(() => {
    if (!cookies.user) navigate('/login');
    setCollections([]);
    getUser();
  }, []);

  useEffect(() => {
    if (collections[0]?._id) setHasCollections(true);
  }, [collections]);

  const handleOpenCollection = (cid: string) => {
    navigate('/collection/'+cid);
  };

  const handleAddNewCollection = () => {
    navigate('/collection/new');
  };

  const handleEditDescription = () => {
    setEditDescription(true);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    try {
      if (user) await network.patchUserDescripton({ uid: user?._id, newDesc: description });
    } catch (error) {
      console.error(error);
    }
    setEditDescription(false);
  };

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />
      <Grid container direction='column' spacing={2} sx={{ padding: '2rem' }}>
        <Grid item container direction='row' xs>
          <Typography component='h2' variant='h3' sx={{ margin: '1rem' }}>{ user?.username }</Typography>
          { user?._id === cookies.user?.userId && user?.isAdmin &&
            <Grid item sx={{ margin: '1.5rem' }}>
              <Button key='adminpage' component={Link} to='/admin' variant='contained' color='error'>
                { localeStrings[locale].AdminPage }
              </Button>
            </Grid>
          }
        </Grid>
        <Grid item container direction='row' xs>
          { !editDescription &&
            <>
              <Typography variant='body2' sx={{ margin: '1rem' }}>{ description }</Typography>
              { !isReadOnly && <Grid item xs>
                <IconButton onClick={ handleEditDescription }>
                  <EditIcon />
                </IconButton>
              </Grid> }
            </>
          }
          { editDescription &&
            <>
              <Grid item xs>
                <TextField id="edit-desc" label="Description" value={ description } onChange={handleDescriptionChange} variant="standard" sx={{ minWidth: '90%' }} />
              </Grid>
              <Grid item xs>
                <IconButton onClick={ handleSaveDescription }>
                  <SaveIcon />
                </IconButton>
              </Grid>
            </>
          }
        </Grid>
      </Grid>

      <Grid container direction='row' sx={{ margin: '2rem' }}>
        <Typography component='h3' variant='h4'>{ localeStrings[locale].YourCollections }</Typography>
        <Grid item xs>
          { !isReadOnly && <IconButton onClick={ handleAddNewCollection } sx={{ margin: '.1rem' }}>
            <AddCircleOutlineIcon />
          </IconButton> }
        </Grid>
      </Grid>
      <Grid container>
        { hasCollections &&
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label='collections table'>
            <TableHead>
              <TableRow>
                <TableCell>{ localeStrings[locale].CollectionName }</TableCell>
                <TableCell>{ localeStrings[locale].ItemsCount }</TableCell>
                <TableCell>{ localeStrings[locale].CollectionTheme }</TableCell>
                <TableCell>{ localeStrings[locale].Open }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>      
              { collections.map((c, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{ c.name }</TableCell>
                    <TableCell>{ c.items?.length }</TableCell>
                    <TableCell>{ c.theme }</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenCollection(c._id)}>
                        <OpenInNewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer> }
        { !hasCollections &&
            <Typography component='h3' variant='h6' sx={{ marginLeft: '4rem' }}>{ localeStrings[locale].NoCollections }</Typography>
        }
      </Grid>
    </Box>
  );
};

export default UserPage;