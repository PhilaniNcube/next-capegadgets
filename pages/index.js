import { useContext } from 'react';
import axios from 'axios';
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

import db from '../utils/db';
import Product from '../models/Product';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function Home(props) {
  const { products } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const addToCartHandler = async (product) => {
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
    <Layout title="Home">
      <Typography variant="h2">Products</Typography>
      <Grid container spacing={3}>
        {products.map((product) => {
          return (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                  </CardActionArea>
                </NextLink>
                <CardContent>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <Typography>{product.name}</Typography>
                  </NextLink>
                  <Typography>R{product.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    fontWeight="700"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add To Cart
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

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
