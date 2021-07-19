import NextLink from 'next/link';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/dist/client/router';
import Cookies from 'js-cookie';

const RegisterPage = () => {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { redirect } = router.query;

  if (userInfo) {
    router.push('/');
  }

  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        email,
        name,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });

      Cookies.set('userInfo', data);
      router.push(redirect || '/');
    } catch (error) {
      console.log(error.message);
      alert(error.response.data ? error.response.data.message : error.message);
    }
  };

  return (
    <Layout title="Register">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography variant="h1" component="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              inputProps={{ type: 'text' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'email' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              autoComplete="current-password"
              inputProps={{ type: 'password' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              autoComplete="current-password"
              inputProps={{ type: 'password' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="secondary"
            >
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account?&nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link> Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default RegisterPage;
