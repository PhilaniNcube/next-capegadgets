import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import SearchForm from '../../components/SearchForm';
import { connectToDatabase } from '../../utils/mongodb';
import useStyles from '../../utils/styles';

const Books = ({ ebooks, pages, searchQuery }) => {
  console.log(searchQuery);

  console.log(ebooks);

  const router = useRouter();
  const { query = 'all' } = router.query;

  const classes = useStyles();

  const filterSearch = ({ page, searchQuery }) => {
    const path = router.pathname;
    const { query } = router;

    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;

    router.push({ pathname: path, query: query });
  };

  // eslint-disable-next-line no-unused-vars

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
      <Box className={classes.hero}>
        <Typography variant="h1" component="h1" className={classes.pageTitle}>
          Ebooks
        </Typography>
        <Typography component="p" className={classes.subtitle}>
          With one of the largest catalogues of prescribed university ebooks
          anywhere. Over 750 000 ebooks available
        </Typography>
        <SearchForm placeholder="Ebook title" />
      </Box>

      <Grid container spacing={2} className={classes.mt1}>
        <Grid item md={2}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}></Box>
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
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={480}
                          height={697}
                        />
                      </CardActionArea>
                    </NextLink>
                    <CardContent>
                      <NextLink href={`/ebooks/${product.vbid}`} passHref>
                        <Typography>
                          {product.title.substring(0, 50)}...
                        </Typography>
                      </NextLink>
                      <Typography className={classes.author}>
                        Author: {product.author}
                      </Typography>
                      <Typography>
                        <strong>R{(product.price * 18).toFixed(2)}</strong>
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
};

export default Books;

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps({ query }) {
  console.log(query);
  const pageSize = 40;
  const page = query.page || 1;
  const searchQuery = query.title || 'all';

  console.log(searchQuery);

  const { db } = await connectToDatabase();

  const data = await db
    .collection('ebooks')
    .aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query: searchQuery,
            path: ['title', 'vbid'],
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      {
        $limit: pageSize,
      },
    ])
    .skip(pageSize * (page - 1))
    .toArray();

  const ebooks = data.map((ebook) => {
    return {
      title: ebook.title,
      image: ebook.resource_links.cover_image,
      author: ebook.contributors[0].name,
      publisher: ebook.publisher,
      price:
        ebook?.variants[0].prices[3]?.value ||
        ebook?.variants[0].prices[2]?.value ||
        ebook?.variants[0].prices[1]?.value ||
        '',
      vbid: ebook.vbid,
    };
  });

  return {
    props: {
      ebooks,
      pages: Math.ceil(ebooks.length / pageSize),
      searchQuery,
      count: ebooks.length,
    },
  };
}
