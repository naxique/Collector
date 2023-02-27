import { Box, Button, Card, CardActions, CardContent, Chip, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { strings as localeStrings } from '../locales/localeStrings';
import { useState, useEffect } from 'react'
import * as network from '../network/network';
import { Collection } from '../models/Collections';
import { Tag } from '../models/Tag';

interface HomePageProps {
  locale: keyof typeof localeStrings
}

const HomePage = ({ locale }: HomePageProps) => {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const getAllTags = async () => {
    const t = await network.getAllTags();
    if (t.length > 10) setTags(t.sort((a, b) => a.timesUsed - b.timesUsed).slice(0, 9));
    else setTags(t);
  };

  const getAllCollections = async () => {
    const c = await network.getAllCollections();
    setAllCollections(c);
    if (c.length > 3) setFilteredCollections(c.sort((a, b) => a.items.length - b.items.length).slice(0, 2));
    else setFilteredCollections(c);
  }

  const getUsernameById = async (id: string): Promise<string> => {
    try {
      const u = await network.getUserById(id);
      return u.username;
    } catch (error) {
      console.error(error);
      return "";
    }
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
                        <Button size="small">{ localeStrings[locale].Open }</Button>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key='mockup1' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">Finalmouse Ultralight Cape Town</TableCell>
                      <TableCell align="right">boardzy mices</TableCell>
                      <TableCell align="right">10 { localeStrings[locale].Minutes } { localeStrings[locale].Ago }</TableCell>
                    </TableRow>
 
                    <TableRow key='mockup2' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">Homemade chacha</TableCell>
                      <TableCell align="right">Andy's bar</TableCell>
                      <TableCell align="right">7 { localeStrings[locale].Hours } { localeStrings[locale].Ago }</TableCell>
                    </TableRow>
                    <TableRow key='mockup3' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">Марка Швеции 60-х годов</TableCell>
                      <TableCell align="right">Марки</TableCell>
                      <TableCell align="right">30 { localeStrings[locale].Days } { localeStrings[locale].Ago }</TableCell>
                    </TableRow>
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