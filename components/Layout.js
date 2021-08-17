import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { Drawer } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import { AccountCircle } from '@material-ui/icons';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: 22,
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: 16,
        fontWeight: 400,
        margin: '1rem 0',
      },
      h3: {
        fontSize: 14,
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#01295F',
      },
    },
  });
  const classes = useStyles();

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const darkModeChangeHandler = () => {
  //   dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
  //   const newDarkMode = !darkMode;
  //   Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  // };

  const [anchorEl, setAnchorEl] = useState(null);

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('cartItems');
    Cookies.remove('userInfo');
    router.push('/');
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Cape Gadgets` : 'Cape Gadgets'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar} display="flex">
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton}></MenuIcon>
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Image
                    src="/images/logo.png"
                    width={115}
                    height={40}
                    alt="Cape Gadgets"
                  />
                </Link>
              </NextLink>
            </Box>

            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box alignItem="center" justifyContent="space-between">
                    <Typography>Shopping By Category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                <NextLink href={`/ebooks`} passHref>
                  <ListItem button component="a" onClick={sidebarCloseHandler}>
                    <ListItemText primary="Ebooks"></ListItemText>
                  </ListItem>
                </NextLink>
                {categories.map((category) => (
                  <NextLink
                    href={`/search?category=${category}`}
                    passHref
                    key={category}
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>

            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      size="large"
                      badgeContent={cart.cartItems.length}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  ) : (
                    <Badge
                      color="secondary"
                      size="large"
                      badgeContent={cart.cartItems.length}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  )}
                </Link>
              </NextLink>

              {userInfo ? (
                <Fragment>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    <AccountCircle />
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </Fragment>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Cape Gadgets.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
