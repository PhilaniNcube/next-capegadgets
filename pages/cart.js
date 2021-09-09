import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Store } from '../utils/Store';
import Image from 'next/image';
import axios from 'axios';

const CartPage = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const router = useRouter();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    
         console.log("begin checkout")
    window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      items: cartItems.map((item) => {
      return ({
        item_name: item.name,
        item_id: item._id,
        price: item.price,
        item_brand: item.brand,
        item_category: item.category,
        quantity: item.quantity
      })
      })
    }
  });
    
    console.log("check dataLayer")
    
    router.push('/shipping');
  };

  return (
    <Layout title="Shopping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <div>
          Cart Is Empty.{' '}
          <NextLink href="/" passHref>
            <Link>Back To Products</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    return (
                      <TableRow key={item._id || item.vbid}>
                        <TableCell>
                          <NextLink
                            href={
                              `/product/${item.slug}` || `/ebooks/${item.vbid}`
                            }
                            passHref
                          >
                            <Link>
                              <Image
                                src={
                                  item.image || item.resource_links.cover_image
                                }
                                alt={item.name || item.title}
                                width={50}
                                height={50}
                              />
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell>
                          <NextLink
                            href={
                              `/product/${item.slug}` || `/ebooks/${item.vbid}`
                            }
                            passHref
                          >
                            <Link>
                              <Typography color="secondary">
                                {item.name || item.title}
                              </Typography>
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell align="right">
                          <Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">R{item.price}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => removeItemHandler(item)}
                          >
                            &times;
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}){' '}
                    items : R{' '}
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
