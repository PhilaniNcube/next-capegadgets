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
  Grid,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
// import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Head from 'next/head';
import db from '../../utils/db';
import Ebook from '../../models/Ebook';

import { Pagination } from '@material-ui/lab';
import SearchForm from '../../components/SearchForm';

// eslint-disable-next-line no-unused-vars
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
  const router = useRouter();

  const classes = useStyles();

  // eslint-disable-next-line no-unused-vars
  const { query = 'all' } = router.query;

  // const { state, dispatch } = useContext(Store);

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
          anywhere. Over 700 000 ebooks available
        </Typography>
        <SearchForm placeholder="Ebook title" />
      </Box>

      <Grid container spacing={2} className={classes.mt1}>
        <Grid item md={2}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>
                  {countEbooks} ebooks meet your search criteria
                </Typography>
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
                        <Image
                          src={product.resource_links.cover_image}
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
                        Author: {product.contributors[0].name}
                      </Typography>
                      <Typography>
                        <strong>
                          {product.variants[0].prices[3]
                            ? `R ${(
                                product.variants[0].prices[3].value * 18
                              ).toFixed(2)}`
                            : product.variants[0].prices[2]
                            ? `R ${(
                                product.variants[0].prices[2].value * 22
                              ).toFixed(2)}`
                            : `R ${(
                                product.variants[0].prices[1].value * 22
                              ).toFixed(2)}`}
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
  const pageSize = query.pageSize || 20;
  const page = query.page || 1;
  const searchQuery = query.title || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          title: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  await db.connect();

  const ebookDocs = await Ebook.find(
    { 
$or: [ 
{title: { $regex: searchQuery, $options: 'i', }}, 
 {vbid: { $regex: searchQuery, $options: 'i', }}
] 
,
    '-created',
  )
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countEbooks = await Ebook.countDocuments({
    ...queryFilter,
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
