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

import SearchForm from '../../components/SearchForm';

export default function Home(props) {
  const { ebooks } = props;
  const router = useRouter();

  const classes = useStyles();

  console.log(ebooks);

  // const { state, dispatch } = useContext(Store);

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
    </Layout>
  );
}

// eslint-disable-next-line no-unused-vars
export async function getStaticProps() {
  await db.connect();

  const ebooksDocs = await Ebook.find({}, '-created')
    .limit(30)
    .lean();

  const ebooks = ebooksDocs.map(db.convertDocToObj);

  await db.disconnect();

  // console.log(ebooks);

  return {
    props: {
      ebooks,
    },
  };
}
