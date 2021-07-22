import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import {
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Store } from '../../utils/Store';
import Image from 'next/image';
import axios from 'axios';
import useStyles from '../../utils/styles';
import CheckoutWizard from '../../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import Cookies from 'js-cookie';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

const OrderPage = ({ params }) => {
  const orderId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);

  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isShipped,
    isPaid,
    shippedAt,
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(error) });
      }
    };

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2" component="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.firstName} {shippingAddress.lastName},{' '}
                  {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.province}, {shippingAddress.country},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.university}
                </ListItem>
                <ListItem>
                  Status:{' '}
                  {isShipped ? `Shipped on ${shippedAt} ` : 'Not Yet Shipped'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2" component="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `Paid on ${paidAt} ` : 'Not Yet Paid'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => {
                          return (
                            <TableRow key={item._id}>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={50}
                                      height={50}
                                    />
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Typography color="secondary">
                                      {item.name}
                                    </Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>{item.quantity}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>R{item.price}</Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">R{itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">R{shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>R{totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(OrderPage), { ssr: false });

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
