import React, { useContext, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  TextField,
  CircularProgress,
  Chip,
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
    console.log(window);
    window.dataLayer = [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!product) {
    return <Typography>Product Not Found</Typography>;
  }

  const addToCartHandler = async () => {
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

          <meta name="Description" content={product.description}></meta>
          <meta
            name="keywords"
            content={`${(product.brand, product.category)}`}
          ></meta>
          <meta property="og:site_name" content="Cape Gadgets" />
          <meta property="og:title" content={product.name} />
          <meta property="og:type" content={product.category} />
          <meta
            property="og:url"
            content={`https://capegadgets.co.za/product/${product.slug}`}
          ></meta>

          <meta property="og:image" content={product.image} />
          <meta property="og:image:width" content="50"></meta>
          <meta property="og:image:height" content="50"></meta>
          <meta property="twitter:card" content={product.image} />
          <meta
            property="twitter:url"
            content={`https://capegadgets.co.za/product/${product.slug}`}
          />
          <meta property="twitter:title" content={product.name} />
          <meta
            property="twitter:description"
            content={`${product.description}`}
          />
          <meta property="twitter:image" content={product.image}></meta>
          <Script type="application/ld+json" strategy="beforeInteractive">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.numReviews,
              },
              description: product.description,
              name: product.name,
              image: product.image,
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                price: product.price,
                priceCurrency: 'ZAR',
              },
            })}
          </Script>
        </Head>

        <NextLink href="/" passHref>
          <Link>Back To Products</Link>
        </NextLink>
      </div>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            layout="responsive"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
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
            <ListItem>
              <Typography variant="h2" component="h2">
                R{product.price}
              </Typography>
            </ListItem>
            <ListItem>
              <Chip
                label={product.countInStock ? 'In Stock' : 'Unavailable'}
                clickable
                color="secondary"
                variant="outlined"
              />
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

export async function getStaticPaths() {
  await db.connect();
  const products = await Product.find({}, '-reviews').lean();
  await db.disconnect();

  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
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
