import { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@material-ui/core';

import db from '../utils/db';
import Product from '../models/Product';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

import ProductItem from '../components/ProductItem';

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
  const products = await Product.find({}, '-reviews').lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
