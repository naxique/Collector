import { Box, Button, Card, CardActions, CardContent, Chip, CssBaseline, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { strings as localeStrings } from '../locales/localeStrings';
import { useState, useEffect } from 'react'
import * as network from '../network/network';
import { Collection } from '../models/Collections';
import { Tag } from '../models/Tag';
import { useNavigate } from 'react-router-dom';
import { Item } from '../models/Item';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface HomePageProps {
  locale: keyof typeof localeStrings
}

const HomePage = ({ locale }: HomePageProps) => {
  const navigate = useNavigate();
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const getAllTags = async () => {
    const t = await network.getAllTags();
    if (t.length > 10) setTags(t.sort((a, b) => b.timesUsed - a.timesUsed).slice(0, 10));
    else setTags(t.sort((a, b) => b.timesUsed - a.timesUsed));
  };

  const getAllCollections = async () => {
    const c = await network.getAllCollections();
    setAllCollections(c);
    getAllItems(c);
    if (c.length > 3) setFilteredCollections(c.sort((a, b) => b.items.length - a.items.length).slice(0, 3));
    else setFilteredCollections(c.sort((a, b) => b.items.length - a.items.length));
  };

  const getAllItems = async (c: Collection[]) => {
    let items: Item[] = [];
    c.map(col => col.items.map(i => items.push(i)));
    if (items.length > 5) setAllItems(items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5));
    else setAllItems(items.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleOpenCollection = (cid: string) => {
    navigate('/collection/'+cid);
  };

  useEffect(() => {
    getAllCollections();
    getAllTags();
  }, []);

  return (
    <Box sx={{ margin: 'auto', width: '80%' }}>
      <CssBaseline />

      <Box sx={{ textAlign: 'center', margin: '2.5rem' }}>
        <Typography component='h2' variant='h3'>{ localeStrings[locale].Welcome }</Typography>
      </Box>

      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: 'center', margin: '.5rem' }}>
              <Typography component='h3' variant='h4'>{ localeStrings[locale].LargestCollections }</Typography>
            </Box>

            <Grid container spacing={2}>
              { filteredCollections.map((c, i) => {
                return (  
                  <Grid item xs key={ 'collection'+i }>
                    <Card sx={{ minWidth: 150 }}>
                      <CardContent>
                        <Typography variant="h5">
                          { c.name }
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          { c.items.length.toString() + " " + localeStrings[locale].Items }
                        </Typography>
                        <Typography variant="body2">
                          { c.description }
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleOpenCollection(c._id)}>{ localeStrings[locale].Open }</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>  
            <Box sx={{ textAlign: 'center', margin: '.5rem' }}>
              <Typography component='h3' variant='h4'>{ localeStrings[locale].PopularTags }</Typography>
            </Box>

            <Grid container spacing={2}>
              { tags.map((t, i) => {
                return (
                  <Grid item xs key={ 'tag'+i }>
                    <Chip label={ t.name } />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Grid item xs={12}>  
            <Box sx={{ textAlign: 'center', margin: '.5rem' }}>
              <Typography component='h3' variant='h4'>{ localeStrings[locale].RecentlyAdded }</Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="recent items">
                <TableHead>
                  <TableRow>
                    <TableCell>{ localeStrings[locale].ItemName }</TableCell>
                    <TableCell align="right">{ localeStrings[locale].CollectionName }</TableCell>
                    <TableCell align="right">{ localeStrings[locale].Timestamp }</TableCell>
                    <TableCell align="right"> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allItems.map((item, i) => {
                    return (
                      <TableRow key={'item'+i} sx={{ '&:last-child td, &:last-child th': { border: 0 }, marginBottom: '2rem' }}>
                        <TableCell component="th" scope="row">{ item.name }</TableCell>
                        <TableCell align="right">{ allCollections.filter((c) => c._id === item.collectionId)[0].name }</TableCell>
                        <TableCell align="right">{
                          new Date(item.createdAt).toLocaleString(locale === 'enUS' ? 'en-GB' : 'ru-RU', { dateStyle: "short" , timeStyle: "short" })
                        }</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={ () => handleOpenCollection(item.collectionId) }>
                            <OpenInNewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
};

export default HomePage;