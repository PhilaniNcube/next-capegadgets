import { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Grid, Typography } from '@material-ui/core';
import Link from 'next/link';

import db from '../utils/db';
import Product from '../models/Product';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

import ProductItem from '../components/ProductItem';
import SearchForm from '../components/SearchForm';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';
import Image from 'next/image';

export default function Home(props) {
  const classes = useStyles();
  const { topRatedProducts, featuredProducts } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const addToCartHandler = async (product) => {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [
          {
            item_name: product.name, // Name or ID is required.
            item_id: product._id,
            price: product.price,
            item_brand: product.brand,
            item_category: product.category,
            quantity: 1,
          },
        ],
      },
    });

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
    <Layout
      title="Home"
      description="For all your learning & technology items. Avalable for purchase on intellimali. With the widest range of university and professional ebooks. Over 700 000 ebook titles."
    >
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
              <Link passHref href={`/product/${product.slug}`}>
                <Button
                  variant="contained"
                  className={classes.mt1}
                  color="secondary"
                >
                  Shop Now
                </Button>
              </Link>
            </Grid>
          );
        })}
      </Carousel>
      <SearchForm />
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

export async function getStaticProps() {
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
