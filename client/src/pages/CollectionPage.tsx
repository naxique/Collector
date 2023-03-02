import { Alert, Box, Button, Chip, CssBaseline, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import * as network from '../network/network';
import { Collection } from "../models/Collections";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { strings as localeStrings } from '../locales/localeStrings';
import { User } from "../models/User";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CustomFields } from "../models/customFields";
import { themes } from '../locales/themes';

interface CollectionPageProps {
  locale: keyof typeof localeStrings,
  cookies: any
}

const CollectionPage = ({ locale, cookies }: CollectionPageProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<User>();
  const [isAuthor, setIsAuthor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [collection, setCollection] = useState<Collection>();
  const [newCollection, setNewCollection] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [customFieldText, setCustomFieldText] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionTheme, setNewCollectionTheme] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionCustomFields, setNewCollectionCustomFields] = useState<CustomFields[]>([]);

  const getAuthor = async (authorId: string | undefined) => {
    if (!authorId) setTimeout(() => getAuthor(authorId), 1000);
    else {
      const u = await network.getUserById(authorId);
      if (cookies.user?.userId === u._id || cookies.user?.isAdmin) setIsAuthor(true);
      setAuthor(u);
    }
  };

  const getCollection = async (cid: string | undefined) => {
    if (!cid) throw Error('Collection doesn\t exist');
    if (cid === 'new') setNewCollection(true);
    else {
      const c = await network.getCollectionById(cid);
      setCollection(c);
    }
  };

  const handleAuthorClick = () => {
    navigate('/user/'+author?._id);
  };

  const handleOpenItem = (itemId: number) => {
    navigate('/collection/'+collection?._id+'/'+itemId);
  };

  const handleNewItem = () => {
    navigate('/collection/'+collection?._id+'/new');
  };

  const handleNewCollectionName = (e: any) => {
    setNewCollectionName(e.target.value);
  };

  const handleNewCollectionTheme = (e: any) => {
    setNewCollectionTheme(e.target.value);
  };

  const handleNewCollectionDesc = (e: any) => {
    setNewCollectionDesc(e.target.value);
  };

  const handleNewCollectionCustomFields = (e: any) => {
    const newCustomField = { type: newCollectionCustomFields[e.target.id].type, content: e.target.value }
    newCollectionCustomFields[e.target.id] = newCustomField;
    customFieldText[e.target.id] = newCustomField.content;
  };

  const handleNewCustomField = () => {
    const fields = [...newCollectionCustomFields, { type: 'text', content: '' }];
    setNewCollectionCustomFields(fields);
  }

  const handleNewCollection = async () => {
    try {
      const uid = cookies.user.userId;
      if (!newCollectionName || !newCollectionTheme || !newCollectionDesc) throw Error(localeStrings[locale].FillAllTheFields);
      if (!uid) throw Error(localeStrings[locale].NotAuthenticated);
      await network.newCollection({
        authorId: uid,
        name: newCollectionName,
        theme: newCollectionTheme,
        description: newCollectionDesc, 
        customFields: newCollectionCustomFields
      });
      navigate('/user/'+uid);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  const handleEditCollection = () => {
    setIsEdit(true);
  };

  useEffect(() => {
    try {
      getCollection(params.collectionId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAuthor(collection?.authorId);
  }, [collection]);

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />
      <Grid container direction='column' spacing={2} sx={{ padding: '2rem' }}> 
        { showError &&
          <Alert severity='error' variant='outlined'>{ errorMessage }</Alert>
        }
        { newCollection &&
          <Grid item container direction='column' spacing={3} sx={{ width: '60%' }}>
            <Grid item>
              <Button key='create-item' variant='contained' color='success' onClick={ handleNewCollection }>
                { localeStrings[locale].NewCollection }
              </Button>
            </Grid>
            <Grid item xs>
              <TextField id="new-col-name" label={localeStrings[locale].CollectionName} value={ newCollectionName } onChange={ handleNewCollectionName } variant="standard" sx={{ minWidth: '100%' }} />
            </Grid>
            
            <Grid item xs>
            <FormControl fullWidth>
              <InputLabel id="new-col-theme">{localeStrings[locale].CollectionTheme}</InputLabel>
              <Select
                labelId="new-col-theme"
                id="new-col-theme"
                value={newCollectionTheme}
                label={localeStrings[locale].CollectionTheme}
                onChange={handleNewCollectionTheme}
              >
                {themes.map((el, i) => {
                  return (
                    <MenuItem key={'theme'+i} value={el}>{ el }</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            </Grid>
            
            <Grid item xs>
              <TextField id="new-col-desc" label={localeStrings[locale].CollectionDescription} value={ newCollectionDesc } onChange={ handleNewCollectionDesc } variant="standard" sx={{ minWidth: '100%' }} />
            </Grid>
            
            <Grid item container direction='row'>
              <Typography variant='h6'>{ localeStrings[locale].AdditionalFields }</Typography>
              <Grid item xs>
                <IconButton onClick={handleNewCustomField} sx={{ margin: '.2rem' }}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Grid item container direction='row'>
              { newCollectionCustomFields.map((field, i) => {
                return (
                  <Grid item container direction='row' key={'customField'+i} spacing={2} sx={{ marginBottom: '1.5rem' }}>
                    <Grid item xs>
                      <FormControl fullWidth>
                        <InputLabel id="custom-field-type">{localeStrings[locale].CustomFieldType}</InputLabel>
                        <Select
                          labelId="custom-field-type"
                          id="custom-field-type"
                          defaultValue={'text'}
                          label={localeStrings[locale].CustomFieldType}
                        >
                          <MenuItem value='text'>Text</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item container xs key={'customFieldContent'+i}>
                      <TextField id={i.toString()} label={localeStrings[locale].AdditionalFieldName} value={ customFieldText[i] } onChange={ handleNewCollectionCustomFields } variant="standard" sx={{ minWidth: '100%' }} />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        }

        { !newCollection &&
          <>
            <Grid container direction='row' sx={{ margin: '2rem', maxWidth: '100%' }}>
              <Grid item container direction='column' xs> 

                <Typography component='h2' variant='h3' sx={{ margin: '1rem' }}>{ collection?.name }</Typography>
                
                <Grid item container direction='row'>
                  <Typography onClick={ handleAuthorClick } variant='body2' sx={{ margin: '1rem', "&:hover": { color: '#5e5e5e', cursor: 'pointer' } }}>
                    { localeStrings[locale].Author + ' ' + author?.username }
                  </Typography> 
                </Grid>
                { isAuthor && <Grid item>
                  <Button key='edit-collection' variant='contained' color='primary' onClick={ handleEditCollection }>
                    { localeStrings[locale].EditCollection }
                  </Button>
                </Grid> }
              </Grid> 
              
              <Grid item container direction='column' xs> 
                <Skeleton variant="rounded" width={450} height={250} />
              </Grid> 

              <Grid item container direction='row' sx={{ margin: '1rem' }}>
                <Grid item container direction='column' xs>
                  <Typography variant='h6' >{ localeStrings[locale].CollectionTheme }</Typography> 
                  <Grid item >
                    <Typography variant='body2'>{ collection?.theme }</Typography> 
                  </Grid>
                </Grid>            
                <Grid item container direction='column' xs>
                  <Typography variant='h6' >{ localeStrings[locale].CollectionDescription }</Typography> 
                  <Grid item >
                    <Typography variant='body2'>{ collection?.description }</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label='collections table'>
                  { isAuthor && <caption>
                    <Tooltip title={ localeStrings[locale].AddNewItem }>
                      <IconButton onClick={ handleNewItem }>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </caption> }
                <TableHead>
                  <TableRow>
                    <TableCell>{ localeStrings[locale].ItemId }</TableCell>
                    <TableCell>{ localeStrings[locale].ItemTags }</TableCell>
                    <TableCell>{ localeStrings[locale].ItemName }</TableCell>
                    {collection?.customFields.map((f, i) => {
                      return (<TableCell key={'customField'+i}>{ f.content }</TableCell>);
                    })}
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>      
                  { collection?.items[0].id && collection?.items?.map((c, i) => {
                    return (
                      <TableRow key={'item'+i}>
                        <TableCell>{ c.id }</TableCell>
                        <TableCell>{ c.tags?.map((t, i) => {return (<Chip key={'tag'+i} sx={{marginRight: '.2rem'}} label={ t } />);}) }</TableCell>
                        <TableCell>{ c.name }</TableCell>
                        {c?.customFields?.map((f, i) => {
                          return (<TableCell key={'itemCustomField'+i}>{ f.content }</TableCell>);
                        })}
                        <TableCell>
                          <IconButton onClick={() => handleOpenItem(c.id)}>
                            <OpenInNewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        }
      </Grid>
    </Box>
  );
};

export default CollectionPage;