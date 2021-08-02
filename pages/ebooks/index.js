// import { useContext } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
// import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Head from 'next/head';

export default function Home(props) {
  const { result } = props;
  const ebooks = result.items;
  console.log(result.items);

  const classes = useStyles();

  // const { state, dispatch } = useContext(Store);
  const router = useRouter();

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
      <Typography variant="h2">Ebooks</Typography>
      <Grid container spacing={3}>
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
                    <Typography>{product.title}</Typography>
                  </NextLink>
                  <Typography className={classes.author}>
                    Author: {product.contributors[0].name}
                  </Typography>
                  <Typography>
                    <strong>
                      R{(product.variants[0].prices[3].value * 18).toFixed(2)}
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
    </Layout>
  );
}

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps(context) {
  const myHeaders = new Headers();
  myHeaders.append(
    'X-VitalSource-API-Key',
    process.env.NEXT_PUBLIC_VITALSOURCE_API_KEY,
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const response = await fetch(
    'https://api.vitalsource.com/v4/products?include_details=subjects',
    requestOptions,
  );
  const result = await response.json();

  return {
    props: { result }, // will be passed to the page component as props
  };
}
