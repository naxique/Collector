import { Box, Button, Chip, CssBaseline, Grid, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import * as network from '../network/network';
import { Collection } from "../models/Collections";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { strings as localeStrings } from '../locales/localeStrings';
import { User } from "../models/User";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

  const getAuthor = async (authorId: string | undefined) => {
    if (!authorId) console.log(authorId);
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
    console.log('yes')
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
    if (collection?.authorId !== cookies.user?.userId) getAuthor(collection?.authorId);
    else setIsAuthor(true);
  }, [collection]);

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />
      <Grid container direction='column' spacing={2} sx={{ padding: '2rem' }}>
        { newCollection &&
          <Grid item container>
            <Typography component='h2' variant='h3' sx={{ margin: '1rem' }}>{ localeStrings[locale].NewCollection }</Typography>
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
                  { collection?.items.map((c, i) => {
                    return (
                      <TableRow key={'item'+i}>
                        <TableCell>{ c.id }</TableCell>
                        <TableCell>{ c.tags.map((t, i) => {return (<Chip key={'tag'+i} sx={{marginRight: '.2rem'}} label={ t } />);}) }</TableCell>
                        <TableCell>{ c.name }</TableCell>
                        {c.customFields.map((f, i) => {
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