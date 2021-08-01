import React, { useContext, useState } from 'react';
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
  TextField,
  CircularProgress,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import useStyles from '../../utils/styles';
import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/dist/client/router';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { useEffect } from 'react';

const ProductPage = (props) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  const { product } = props;
  console.log(product);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
      console.log(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
          firstName: userInfo.firstName,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoading(false);
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      fetchReviews();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
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
              <Rating value={product.rating} readOnly />
              <NextLink href="#reviews" passHref>
                <Typography>({product.numReviews} reviews)</Typography>
              </NextLink>
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
      <List>
        <ListItem>
          <Typography name="reviews" variant="h2" id="reviews">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && (
          <ListItem>Be the first to review this product</ListItem>
        )}

        {reviews.map((review) => (
          <ListItem key={review._id} md={12} fullWidth>
            <Grid container md={12}>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  {' '}
                  <strong>{review.firstName}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave Your Review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    minRows={6}
                    maxRows={8}
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter comment/review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                  >
                    Submit
                  </Button>

                  {loading && <CircularProgress />}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant="h2">
              <NextLink href={`/login?redirect=/product/${product.slug}`}>
                Please Log In to write a review
              </NextLink>
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
