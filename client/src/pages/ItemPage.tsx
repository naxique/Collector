import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { strings as localeStrings } from '../locales/localeStrings';
import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import * as network from '../network/network';

interface ItemPageProps {
  locale: keyof typeof localeStrings,
  cookies: any
}

const ItemPage = ({ locale, cookies }: ItemPageProps) => {
  const params = useParams();
  const [item, setItem] = useState<Item>();

  const getItem = async () => {
    if (params.collectionId && params.itemId) {
      if (Number.isNaN(params.itemId)) throw Error('Bad request: item id should be a number');
      console.log(Number(params.itemId))
      const i = await network.getItem(params.collectionId, Number(params.itemId));
      setItem(i);
    } else throw Error('Bad request: missing parameters');
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
      <CssBaseline />
      <Grid container direction='column' spacing={2} sx={{ padding: '2rem' }}>
        <Typography>{  }</Typography>
      </Grid>
    </Box>
  );
};

export default ItemPage;