import { Alert, Autocomplete, Box, Button, Chip, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { strings as localeStrings } from '../locales/localeStrings';
import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import * as network from '../network/network';
import { CustomFields } from "../models/customFields";
import { Tag } from "../models/Tag";

interface ItemPageProps {
  locale: keyof typeof localeStrings,
  cookies: any
}

const ItemPage = ({ locale, cookies }: ItemPageProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isAuthor, setIsAuthor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [customFields, setCustomFields] = useState<CustomFields[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newItemCustomFields, setNewItemCustomFields] = useState<CustomFields[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [item, setItem] = useState<Item>();
  const [tags, setTags] = useState<Tag[]>([]);

  const getItem = async () => {
    if (params.collectionId && params.itemId) {
      const itemId = Number(params.itemId)
      if (Number.isNaN(itemId)) 
        if (params.itemId === 'new') setIsNew(true);
          else throw Error('Bad request: item id should be a number');
      const c = await network.getCollectionById(params.collectionId);
      const t = await network.getAllTags();
      if (cookies.user?.userId === c.authorId || cookies.user?.isAdmin) setIsAuthor(true);
      setCustomFields(c.customFields);
      setItem(c.items[itemId]);
      setTags(t);
    } else throw Error('Bad request: missing parameters');
  };

  const handleGoBack = () => {
    navigate('/collection/'+params.collectionId);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleNewItemName = (e: any) => {
    setNewItemName(e.target.value);
  };

  const handleNewTags = (tag: string) => {
    let t = newTags;
    if (!t.includes(tag)) t.push(tag)
    setNewTags(t);
  };

  const handleNewCustomFields = (e: any) => {
    const newCustomField = { type: customFields[e.target.id].type, content: e.target.value }
    newItemCustomFields[e.target.id] = newCustomField;
  }

  const handleCreate = async () => {
    try {
      const cid = params.collectionId;
      const uid = cookies.user.userId;
      if (newItemCustomFields.length < 1) newItemCustomFields[0] = {type: '', content: ''};
      if (!newItemName || !newTags || !newItemCustomFields) throw Error(localeStrings[locale].FillAllTheFields);
      if (!cid || !uid) throw Error(localeStrings[locale].NotAuthenticated);
      await network.newItem({
        collectionId: cid,
        authorId: uid,
        name: newItemName,
        tags: newTags, 
        customFields: newItemCustomFields
      });
      handleGoBack();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    try {
      getItem()
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <Grid item container direction='column' spacing={2} sx={{ padding: '2rem' }}>
        <CssBaseline />
        <Grid item container direction='row'>
          <Grid item>
            <Button sx={{ marginRight: '.2rem' }} key='back-to-collection' variant='outlined' color='primary' onClick={ handleGoBack }>
              { localeStrings[locale].GoBack }
            </Button>
          </Grid>
          
          { isAuthor && !isNew &&  <Grid item>
            <Button key='edit-item' variant='outlined' color='primary' onClick={ handleEdit }>
              { localeStrings[locale].EditButton }
            </Button>
          </Grid> }
          { isNew && <Grid item>
            <Button key='create-item' variant='contained' color='success' onClick={ handleCreate }>
              { localeStrings[locale].AddNewItem }
            </Button>
          </Grid>
          }
        </Grid>

        <Grid item container direction='row'>
          <Grid item xs>
            { !isNew && <>
              <Typography variant='h6'>{ localeStrings[locale].ItemName + ':'}</Typography>
              <Typography>{ item?.name }</Typography>
            </>}
            { isNew &&
              <TextField id="new-item-name" label="Item name" value={ newItemName } onChange={ handleNewItemName } variant="standard" sx={{ minWidth: '90%' }} />
            }
          </Grid>
          { !isNew && <Grid item xs>
            <Typography variant='h6'>{ localeStrings[locale].Timestamp + ':'}</Typography>
            { item?.createdAt &&
              <Typography>{new Date(item?.createdAt).toLocaleString(locale === 'enUS' ? 'en-GB' : 'ru-RU', { dateStyle: "short" , timeStyle: "short" })}</Typography>
            }
          </Grid> }
          { !isNew && 
            <Grid item xs>
              <Typography variant='h6'>{ localeStrings[locale].ItemTags + ':'}</Typography>
              <Grid item container direction='row'>
                { item?.tags.map((t, i) => {
                  return (
                    <Grid key={'tag'+i} item xs><Chip sx={{ marginRight: '.2rem' }} label={ t } /></Grid>
                  );
                })}
              </Grid>
            </Grid> 
          }
          { isNew &&
            <Grid item xs>
              <Autocomplete
                multiple
                disablePortal
                id="tags-box"
                freeSolo
                options={tags.map(tag => tag.name)}
                renderTags={(value: readonly string[]) =>
                  value.map((option, i) => {
                    handleNewTags(option);
                    return (
                      <Chip key={'autocompleteTag'+i} variant="outlined" label={option} sx={{ margin: '.5rem' }}/>
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Tags"
                    placeholder="Enter"
                  />
                )}
              />
            </Grid>
          }
        </Grid>
        
        { customFields[0]?.content && item?.customFields.map((f, i) => {
          return (
            <Grid item container direction='column' key={'customField'+i}>
              <Typography variant='h6'>{ customFields[i]?.content + ':'}</Typography>
              <Typography variant='h6'>{ f.content }</Typography>
            </Grid>
          );
        })}
        { isNew && customFields[0]?.content && customFields.map((field, i) => {
          return (
            <Grid item container direction='column' key={'customField'+i}>
              <TextField id={i.toString()} label={field?.content} value={ newItemCustomFields[i]?.content } onChange={ handleNewCustomFields } variant="standard" sx={{ minWidth: '90%' }} />
            </Grid>
          );
        })}

        { showError &&
          <Alert severity='error' variant='outlined'>{ errorMessage }</Alert>
        }
      </Grid>
    </Box>
  );
};

export default ItemPage;