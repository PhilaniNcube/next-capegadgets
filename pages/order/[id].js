import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import * as CryptoJS from 'crypto-js';
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

  console.log(order);

  useEffect(() => {
    if (router.query.payment === 'success' && !order.isPaid) {
      console.log('commence paying');
      const paymentResponse = async () => {
        const token = localStorage.getItem('intelliToken');
        const card = localStorage.getItem('cardNumber');
        const paymentRes = await axios.put(
          `/api/orders/${orderId}/pay`,
          {
            username: 'capegadgets',
            password: '9d059e3fb4efe73760d5ecee6909c2d2',
            cardNumber: card,
            terminalId: '94DVA001',
            redirectSuccess: `https://capegadgets.co.za/order/${orderId}?payment=success`,
            redirectCancel: `https://capegadgets.co.za/${orderId}?payment=cancel`,
            reference: orderId,
            token: token,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          },
        );
        console.log(paymentRes);
        dispatch({ type: 'PAY_SUCCESS', payload: paymentRes });
        enqueueSnackbar('Payment Successful', { variant: 'success' });
      };
      paymentResponse();

      const dataLayer = window.dataLayer;
      console.log('the order');
      console.log(order);

      if (order) {
        console.log('dataLayer');
        dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: order._id,
            affiliation: 'Cape Gadgets',
            value: order.itemsPrice,
            tax: 0,
            shipping: order.shippingPrice,
            currency: 'ZAR',
            coupon: '',
            items: [
              order.orderItems.map((item) => {
                return {
                  item_name: item.name,
                  item_id: item._id,
                  price: item.price,
                  item_brand: item.brand,
                  item_category: item.category,
                  item_variant: '',
                  quantity: item.quantity,
                };
              }),
            ],
          },
        });
      }

      console.log(dataLayer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    _id,
  } = order;

  console.log(window.dataLayer);

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
          cardNumber: cardNumber,
          terminalId: '94DVA001',
          amount: order.totalPrice,
          redirectSuccess: `https://capegadgets.co.za/order/${order._id}?payment=success`,
          redirectCancel: `https://capegadgets.co.za/${order._id}?payment=cancel`,
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

      window.location.href = `https://portal.intellimali.co.za/web/payment?paymentToken=${response.data.token}`;
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
          id: order._id,
          totalPrice: order.totalPrice,
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

  const tempDay = new Date();

  const day = tempDay.toUTCString();
  console.log(day);
  console.log(day);

  const data = {
    PAYGATE_ID: '10011072130',
    REFERENCE: orderId,
    AMOUNT: totalPrice * 100,
    CURRENCY: 'ZAR',
    RETURN_URL: `https://capegadgets.vercel.app/order/${orderId}?cardPayment=result`,
    TRANSACTION_DATE: day,
    LOCALE: 'en-za',
    COUNTRY: 'ZAF',
    EMAIL: userInfo.email,
    KEY: 'secret',
  };

  // eslint-disable-next-line no-unused-vars
  const checkString = `${data.PAYGATE_ID}${data.REFERENCE}${data.AMOUNT}${data.CURRENCY}${data.RETURN_URL}${data.TRANSACTION_DATE}${data.LOCALE}${data.COUNTRY}${data.EMAIL}${data.KEY}`;

  const checksum = CryptoJS.MD5(checkString);
  console.log(checksum.toString());
  console.log(checksum.toString());

  const handleCardSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('PAYGATE_ID', '10011072130');
    formdata.append('REFERENCE', `${_id}`);
    formdata.append('AMOUNT', `${totalPrice * 100}`);
    formdata.append('CURRENCY', 'ZAR');
    formdata.append(
      'RETURN_URL',
      `https://capegadgets.vercel.app/order/${orderId}?cardPayment=result`,
    );
    formdata.append('TRANSACTION_DATE', day);
    formdata.append('LOCALE', 'en-za');
    formdata.append('COUNTRY', 'ZAF');
    formdata.append('EMAIL', userInfo.email);
    formdata.append('CHECKSUM', checksum.toString());

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    const payRes = await fetch(
      'https://secure.paygate.co.za/payweb3/initiate.trans',
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        const arr = result.split('&');
        console.log(arr);

        return arr;
      })
      .catch((error) => console.log('error', error));

    console.log(payRes);

    const payReqId = payRes[1].split('=')[1];
    const newChecksum = payRes[3].split('=')[1];

    console.log({ payReqId, newChecksum });

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const newFormData = new FormData();
    newFormData.append('PAYGATE_ID', '10011072130');
    newFormData.append('PAY_REQUEST_ID', payReqId);
    newFormData.append('REFERENCE', orderId);
    newFormData.append('CHECKSUM', newChecksum);

    // eslint-disable-next-line no-unused-vars
    const newRequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: newFormData,
      redirect: 'follow',
    };

    window.location.replace(
      'https://secure.paygate.co.za/payweb3/process.trans',
      newRequestOptions,
    );
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
                  {shippingAddress.university}, {shippingAddress.mobileNumber}
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
                {!isPaid && paymentMethod === 'Card' && (
                  <ListItem>
                    <form onSubmit={handleCardSubmit}>
                      <Button
                        className={classes.mt1}
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        {' '}
                        Pay With Card{' '}
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
