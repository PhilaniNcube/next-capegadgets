import { Box, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import ProductItem from '../../components/ProductItem';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

const Category = ({ products, category }) => {
  console.log(products);

  const classes = useStyles();

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
    <Layout title={category}>
      <Box fullWidth className={classes.box}>
        <Typography className={classes.pageHeading} component="h1">
          {category}
        </Typography>
      </Box>
      <Grid className={classes.mt1} container spacing={3}>
        {products.map((product) => {
          return (
            <Grid item lg={3} md={6} xs={12} key={product.name}>
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
};

export default Category;

export async function getStaticPaths() {
  await db.connect();
  const categories = await Product.find({}, '-reviews')
    .distinct('category')
    .lean();
  await db.disconnect();

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log(params);
  await db.connect();

  const category = params.category;

  const productsDocs = await Product.find(
    { category: category },
    '-reviews',
  ).lean();
  await db.disconnect();

  return {
    props: {
      products: productsDocs.map(db.convertDocToObj),
      category: category,
    },
  };
}
