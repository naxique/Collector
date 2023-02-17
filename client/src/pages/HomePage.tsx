import { Box, Button, Card, CardActions, CardContent, Chip, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { strings as localeStrings } from '../locales/localeStrings';
import React, { useState } from 'react'

interface HomePageProps {
  locale: keyof typeof localeStrings
}

const HomePage = ({ locale }: HomePageProps) => {

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
              <Grid item xs>     
                <Card sx={{ minWidth: 150 }}>
                  <CardContent>
                    <Typography variant="h5">
                      Andy's bar
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      23 { localeStrings[locale].Items }
                    </Typography>
                    <Typography variant="body2">
                      My collection of alcohol drinks
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">{ localeStrings[locale].Open }</Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs>     
                <Card sx={{ minWidth: 150 }}>
                  <CardContent>
                    <Typography variant="h5">
                      boardzy mices
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      83 { localeStrings[locale].Items }
                    </Typography>
                    <Typography variant="body2">
                      too many mices tbh
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">{ localeStrings[locale].Open }</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs>     
                <Card sx={{ minWidth: 150 }}>
                  <CardContent>
                    <Typography variant="h5">
                      Glarses
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      42 { localeStrings[locale].Items }
                    </Typography>
                    <Typography variant="body2">
                      keebs
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">{ localeStrings[locale].Open }</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>  
            <Box sx={{ textAlign: 'center', margin: '.5rem' }}>
              <Typography component='h3' variant='h4'>{ localeStrings[locale].PopularTags }</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs>
                <Chip label='Keyboards' />
              </Grid>

              <Grid item xs>
                <Chip label='Books' />
              </Grid>
              <Grid item xs>
                <Chip label='Videogames' />
              </Grid>
              <Grid item xs>
                <Chip label='Poststamps' />
              </Grid>
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