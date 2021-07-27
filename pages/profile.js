import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import { Store } from '../utils/Store';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Profile = () => {
  const { state, dispatch } = useContext(Store);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const submitHandler = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          email,
          firstName,
          lastName,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      dispatch({ type: 'USER_LOGIN', payload: data });

      Cookies.set('userInfo', data);
      enqueueSnackbar('Profile updated', { variant: 'success' });
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    setValue('firstName', userInfo.firstName);
    setValue('lastName', userInfo.lastName);
    setValue('email', userInfo.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={`Profile`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText caption="User Profile">Profile</ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText caption="Order History">
                    Order History
                  </ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.firstName)}
                            helperText={
                              errors.firstName
                                ? errors.firstName.type === 'minLength'
                                  ? 'First name length should be more than 2 characters'
                                  : 'First name is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.lastName)}
                            helperText={
                              errors.lastName
                                ? errors.lastName.type === 'minLength'
                                  ? 'Last name length should be more than 2 characters'
                                  : 'Last name is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
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
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password should be more than 6 characters long',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password
                                ? 'Password should be more than 6 characters long'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password should be more than 6 characters long',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.password
                                ? 'Password should be more than 6 characters long'
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
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
