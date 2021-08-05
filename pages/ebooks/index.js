// import { useContext } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import NextLink from 'next/link';
import Layout from '../../components/Layout';
// import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Head from 'next/head';
import db from '../../utils/db';
import Ebook from '../../models/Ebook';

import { Pagination } from '@material-ui/lab';

const prices = [
  {
    name: 'R1 - R500',
    value: '1-500',
  },
  {
    name: 'R501 - R1000',
    value: '501-1000',
  },
  {
    name: 'R1001 - R1500',
    value: '1001-1500',
  },
  {
    name: 'R1501 - R2500',
    value: '1501-2500',
  },
  {
    name: 'R2501 - R4000',
    value: '2501-4000',
  },
  {
    name: 'R4001 - R6000',
    value: '4001-6000',
  },
  {
    name: 'R6001 - R10000',
    value: '6001-10000',
  },
];

export default function Home(props) {
  const { ebooks, countEbooks, pages } = props;
  console.log(ebooks, countEbooks);
  const router = useRouter();

  const classes = useStyles();

  const { query = 'all', price = 'all' } = router.query;

  // const { state, dispatch } = useContext(Store);

  const filterSearch = ({
    page,

    searchQuery,
    price,
  }) => {
    const path = router.pathname;
    const { query } = router;

    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;

    if (price) query.price = price;

    router.push({ pathname: path, query: query });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  const pageHandler = (e, page) => {
    filterSearch({ page });
  };

  return (
    <Layout
      title="Ebooks"
      description="University and professional ebooks for sale"
    >
      <Head>
        <meta
          name="keywords"
          content="Textbooks, ebooks, university ebooks, university textbooks"
        ></meta>
        <meta property="og:site_name" content="Cape Gadgets" />
        <meta property="og:title" content="Ebooks for sale" />
      </Head>
      <Typography
        variant="h1"
        component="h1"
        className={classes.heading}
        color="secondary"
      >
        Ebooks
      </Typography>
      <Grid container spacing={2} className={classes.mt1}>
        <Grid item md={2}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select fullWidth value={price} onChange={priceHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {prices &&
                    prices.map((price) => (
                      <MenuItem key={price.value} value={price.value}>
                        {price.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={10}>
          <Grid container spacing={2}>
            {ebooks.map((product) => {
              return (
                <Grid item md={4} key={product.vbid}>
                  <Card>
                    <NextLink href={`/ebooks/${product.vbid}`} passHref>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          image={product.resource_links.cover_image}
                          title={product.title}
                        ></CardMedia>
                      </CardActionArea>
                    </NextLink>
                    <CardContent>
                      <NextLink href={`/ebooks/${product.vbid}`} passHref>
                        <Typography>
                          {product.title.substring(0, 50)}...
                        </Typography>
                      </NextLink>
                      <Typography className={classes.author}>
                        Author: {product.contributors[0].name}
                      </Typography>
                      <Typography>
                        <strong>
                          R
                          {(product.variants[0].prices[3].value * 18).toFixed(
                            2,
                          )}
                        </strong>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        fontWeight="700"
                        onClick={() => router.push(`/ebooks/${product.vbid}`)}
                      >
                        View Ebook
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Pagination
        defaultPage={parseInt(query.page || '1')}
        count={pages}
        onChange={pageHandler}
      ></Pagination>
    </Layout>
  );
}

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps({ query }) {
  console.log(query);
  const pageSize = query.pageSize || 30;
  const page = query.page || 1;
  const searchQuery = query.title || '';
  const price = query.price || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          title: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  await db.connect();

  const ebookDocs = await Ebook.find(
    {
      ...queryFilter,
      ...priceFilter,
    },
    '-created',
  )
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countEbooks = await Ebook.countDocuments({
    ...queryFilter,
    ...priceFilter,
  });

  await db.disconnect();

  const ebooks = ebookDocs.map(db.convertDocToObj);

  return {
    props: {
      ebooks,
      countEbooks,
      page,
      pages: Math.ceil(countEbooks / pageSize),
    },
  };
}
