import React, { useContext } from 'react';
import {
  Button,
  Grid,
  List,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { ListItem } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import db from '../utils/db';
import Product from '../models/Product';
import ProductItem from '../components/ProductItem';
import { Store } from '../utils/Store';
import axios from 'axios';
import Rating from '@material-ui/lab/Rating';
import { Pagination } from '@material-ui/lab';

const PAGE_SIZE = 6;

const prices = [
  {
    name: 'R1 - R500',
    value: '1-500',
  },
  {
    name: 'R501 - R1000',
    value: '501-1000',
  },
  {
    name: 'R1001 - R1500',
    value: '1001-1500',
  },
  {
    name: 'R1501 - R2500',
    value: '1501-2500',
  },
  {
    name: 'R2501 - R4000',
    value: '2501-4000',
  },
  {
    name: 'R4001 - R6000',
    value: '4001-6000',
  },
  {
    name: 'R6001 - R10000',
    value: '6001-10000',
  },
  {
    name: 'R10001 - R30000',
    value: '10001-30000',
  },
];

const ratings = [1, 2, 3, 4, 5];

const Search = (props) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;

    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({ pathname: path, query: query });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const pageHandler = (e, page) => {
    filterSearch({ page });
  };

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
    <Layout title="Search">
      <Grid container className={classes.mt1} spacing={1}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Brands</Typography>
                <Select fullWidth value={brand} onChange={brandHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select fullWidth value={price} onChange={priceHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {prices &&
                    prices.map((price) => (
                      <MenuItem key={price.value} value={price.value}>
                        {price.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select fullWidth value={rating} onChange={ratingHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {ratings &&
                    ratings.map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        <Rating value={rating} readOnly />
                        <Typography component="span">&amp; Up</Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>

        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? 'No' : countProducts} Results
              {query !== 'all' && query !== '' && ':' + query}
              {category !== 'all' && category !== '' && ':' + category}
              {brand !== 'all' && brand !== '' && ':' + brand}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              brand !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography>Sort By</Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviews</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Grid className={classes.mt1} container spacing={3}>
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
          <Typography className={classes.mt1}> Pages</Typography>
          <Pagination
            defaultPage={parseInt(query.page || '1')}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;

  const page = query.page || 1;

  const category = query.category || '';

  const brand = query.brand || '';

  const price = query.price || '';

  const rating = query.rating || '';

  const sort = query.sort || '';

  const searchQuery = query.searchQuery || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');

  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    '-reviews',
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });

  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}