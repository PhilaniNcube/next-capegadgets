import React, { useContext } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Card,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
// import axios from 'axios';
import useStyles from '../../utils/styles';
import Layout from '../../components/Layout';
// import db from '../../utils/db';

import { Store } from '../../utils/Store';
import { useRouter } from 'next/dist/client/router';

const ProductPage = (props) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(Store);

  const { ebook } = props;
  console.log(ebook);

  const classes = useStyles();

  if (ebook.errors) {
    return (
      <Layout>
        {' '}
        <Typography>Ebook Not Found</Typography>
      </Layout>
    );
  }

  const addToCartHandler = async (product) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.vbid === product.vbid,
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // const { data } = await axios.get(`/api/products/${product._id}`);
    // if (data.countInStock < quantity) {
    //   window.alert('Sorry, product is out of stock');
    //   return;
    // }

    const name = product.title;
    const price = (product.variants[0].prices[3].value * 18).toFixed(2);
    const image = product.resource_links.cover_image;
    const brand = product.publisher;
    const category = 'ebook';

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { name, price, image, brand, category, quantity },
    });
    router.push('/cart');
  };

  return (
    <Layout title={ebook.title} description={ebook.description}>
      <div className={classes.section}>
        <Head>
          <title>{ebook.name} | Cape Gadgets</title>
        </Head>

        <NextLink href="/" passHref>
          <Link>Back To Products</Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={ebook.resource_links.cover_image}
            alt={ebook.title}
            width={400}
            height={500}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography>{ebook.title}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Format: {ebook.format}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Language: {ebook.language}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Publisher: {ebook.publisher}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {ebook.kind}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      R{(ebook.variants[0].prices[3].value * 18).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {ebook.variants[0].distributable
                        ? 'Available'
                        : 'Unavailable'}
                    </Typography>
                    <Typography>ISBN: {ebook.vbid}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => addToCartHandler(ebook)}
                >
                  Add To Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  const { params } = context;

  const { vbid } = params;

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
    `https://api.vitalsource.com/v4/products/${vbid}`,
    requestOptions,
  );
  const ebook = await response.json();

  return {
    props: {
      ebook,
    },
  };
}
