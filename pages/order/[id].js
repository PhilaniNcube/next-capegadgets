import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import {
  Button,
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
  TextField,
  Typography,
} from '@material-ui/core';
import { Store } from '../../utils/Store';
import Image from 'next/image';
import axios from 'axios';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_ERROR':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'SHIPPING_REQUEST':
      return { ...state, loadingShipping: true };
    case 'SHIPPING_SUCCESS':
      return { ...state, loadingShipping: false, successShipping: true };
    case 'SHIPPING_ERROR':
      return {
        ...state,
        loadingShipping: false,
        errorShipping: action.payload,
      };
    case 'SHIPPING_RESET':
      return {
        ...state,
        loadingShipping: false,
        successShipping: false,
        errorShipping: '',
      };
    default:
      state;
  }
}

const OrderPage = ({ params }) => {
  const orderId = params.id;

  const [cardNumber, setCardNumber] = useState('');

  const classes = useStyles();
  const router = useRouter();
  console.log(router.query.payment);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, order, successPay, loadingShipping, successShipping },
    dispatch,
  ] = useReducer(reducer, { loading: true, order: {}, error: '' });

  useEffect(() => {
    if (router.query.payment === 'success' && order._id) {
      const paymentResponse = async () => {
        const token = localStorage.getItem('intelliToken');
        const card = localStorage.getItem('cardNumber');
        const paymentRes = await axios.put(
          `/api/orders/${order._id}/pay`,
          {
            username: 'capegadgets',
            password: '9d059e3fb4efe73760d5ecee6909c2d2',
            cardNumber: card,
            terminalId: '94DVA001',
            amount: order.totalPrice,
            redirectSuccess: `${process.env.REDIRECT_URL}/order/${order._id}?payment=success`,
            redirectCancel: `${process.env.REDIRECT_URL}/order/${order._id}?payment=cancel`,
            reference: order._id,
            token: token,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          },
        );
        console.log(paymentRes);
      };
      paymentResponse();
    }
  }, [order.totalPrice, router.query.payment, userInfo.token]);

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

    if (
      !order._id ||
      successPay ||
      successShipping ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }

      if (successShipping) {
        dispatch({ type: 'SHIPPING_RESET' });
      }
    }
  }, [error, order, orderId, router, successPay, successShipping, userInfo]);

  console.log(order);
  const tokenRequest = async () => {
    if (order._id) {
      const response = await axios.post(
        `/api/orders/${order._id}/token`,
        {
          username: 'capegadgets',
          password: '9d059e3fb4efe73760d5ecee6909c2d2',
          cardNumber: '6374374100353717',
          terminalId: '94DVA001',
          amount: order.totalPrice,
          redirectSuccess: `http://localhost:3000/order/${order._id}?payment=success`,
          redirectCancel: `http://localhost:3000/order/${order._id}?payment=cancel`,
          reference: order._id,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      console.log(response);
      localStorage.setItem('intelliToken', response.data.token);

      window.location.href = `https://test.intellimali.co.za/web/payment?paymentToken=${response.data.token}`;
    }
  };
  // eslint-disable-next-line no-unused-vars
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const onApprove = async (token) => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        {
          token: token,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      enqueueSnackbar('Order has been paid', { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'PAY_ERROR', payload: getError(error) });
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  // eslint-disable-next-line no-unused-vars
  function createOrder(data, actions) {
    return actions.order
      .create({ purchase_units: [{ amount: { value: totalPrice } }] })
      .then((orderID) => {
        return orderID;
      });
  }
  // eslint-disable-next-line no-unused-vars
  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  async function shipOrderHandler() {
    try {
      dispatch({ type: 'SHIPPING_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/ship`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      dispatch({ type: 'SHIPPING_SUCCESS', payload: data });
      enqueueSnackbar('Order has been shipped', { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'SHIPPING_ERROR', payload: getError(error) });
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('cardNumber', cardNumber);
    tokenRequest();
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        {' '}
        Order {orderId}{' '}
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
                    {' '}
                    Shipping Address{' '}
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.firstName}
                  {shippingAddress.lastName}, {shippingAddress.address},
                  {shippingAddress.city}, {shippingAddress.province},
                  {shippingAddress.country}, {shippingAddress.postalCode},
                  {shippingAddress.university}
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
                    {' '}
                    Payment Method{' '}
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
                    {' '}
                    Order Items{' '}
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
                                      {' '}
                                      {item.name}{' '}
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
                        {' '}
                        <strong>Total:</strong>{' '}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        {' '}
                        <strong>R{totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && paymentMethod === 'Intellimali' && (
                  <ListItem>
                    <form onSubmit={handleSubmit}>
                      <TextField
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        fullWidth
                        label="Intelli Card Number"
                        variant="outlined"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />

                      <Button
                        className={classes.mt1}
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        {' '}
                        Pay With Intellimali{' '}
                      </Button>
                    </form>
                  </ListItem>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isShipped && (
                  <ListItem>
                    {loadingShipping && <CircularProgress />}
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={shipOrderHandler}
                    >
                      {' '}
                      Ship Order{' '}
                    </Button>
                  </ListItem>
                )}
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
