import NextLink from 'next/link';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/dist/client/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

const ResetPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { redirect } = router.query;

  if (userInfo) {
    router.push('/');
  }

  console.log(Cookies);

  const classes = useStyles();

  const submitHandler = async ({ email }) => {
    closeSnackbar();
    try {
      const { data } = await axios.put('/api/users/forgot-password', {
        email,
      });

      console.log(data);

      router.push(redirect || '/');
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Forgot Password">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography variant="h1" component="h1">
          Forgot Password
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="secondary"
            >
              Forgot Password
            </Button>
          </ListItem>
          <ListItem>
            Dont have an account?&nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link> Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default ResetPassword;
