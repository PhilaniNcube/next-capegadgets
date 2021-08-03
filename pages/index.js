import { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Grid, Typography } from '@material-ui/core';

import db from '../utils/db';
import Product from '../models/Product';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

import ProductItem from '../components/ProductItem';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';
import Image from 'next/image';

export default function Home(props) {
  const classes = useStyles();
  const { topRatedProducts, featuredProducts } = props;
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
    <Layout title="Home" description="For all your learning & technology items. Avalable for purchase on intellimali. With the widest range of university and professional ebooks. Over 700 000 ebook titles.">
      <Carousel className={classes.mt1} animation="slide">
        {featuredProducts.map((product) => {
          return (
            <Grid
              container
              direction="column"
              key={product.slug}
              justifyContent="center"
              className={classes.grid}
            >
              <Image
                src={product.image}
                width={500}
                height={500}
                alt={product.name}
              />
              <Typography>{product.name}</Typography>
              <Button
                variant="contained"
                className={classes.mt1}
                color="secondary"
              >
                Shop Now
              </Button>
            </Grid>
          );
        })}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => {
          return (
            <Grid item md={4} key={product.name}>
              <ProductItem
                addToCartHandler={addToCartHandler}
                product={product}
              />
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const topRatedProducts = await Product.find({}, '-reviews')
    .lean()
    .sort({ rating: -1 })
    .limit(6);
  const featuredProducts = await Product.find({ featured: true }, '-reviews')
    .lean()
    .limit(3);
  await db.disconnect();

  return {
    props: {
      topRatedProducts: topRatedProducts.map(db.convertDocToObj),
      featuredProducts: featuredProducts.map(db.convertDocToObj),
    },
  };
}
