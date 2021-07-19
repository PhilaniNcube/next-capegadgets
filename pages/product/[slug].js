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
import axios from 'axios';
import useStyles from '../../utils/styles';
import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/dist/client/router';

const ProductPage = (props) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(Store);

  const { product } = props;
  console.log(product);

  const classes = useStyles();

  if (!product) {
    return <Typography>Product Not Found</Typography>;
  }

  const addToCartHandler = async () => {
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id,
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <Head>
          <title>{product.name} | Cape Gadgets</title>
          <meta name="description" content={product.description} />
        </Head>

        <NextLink href="/" passHref>
          <Link>Back To Products</Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography>{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
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
                    <Typography>R{product.price}</Typography>
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
                      {product.countInStock ? 'In Stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
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
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
