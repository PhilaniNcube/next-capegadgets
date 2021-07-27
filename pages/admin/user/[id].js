import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Store } from '../../../utils/Store';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyles from '../../../utils/styles';
import { getError } from '../../../utils/error';
import Layout from '../../../components/Layout';
import { useSnackbar } from 'notistack';
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

const UserEdit = ({ params }) => {
  const userId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,

    error: '',
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const [isAdmin, setIsAdmin] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          setIsAdmin(data.isAdmin);
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('firstName', data.firstName);
          setValue('lastName', data.lastName);
        } catch (error) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ firstName, lastName }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          firstName,
          lastName,
          isAdmin,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('User updated successfully', { variant: 'success' });
      router.push('/admin/users');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(error) });
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Edit User`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText caption="Admin Dashboard">
                    Admin Dashboard
                  </ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText caption="Orders">Orders</ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText caption="Products">Products</ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText caption="Users">Users</ListItemText>
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
                  Edit User {userId}
                </Typography>
              </ListItem>

              <ListItem>
                {loading && <CircularProgress />}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
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
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            error={Boolean(errors.firstName)}
                            helperText={
                              errors.name ? 'First name is required' : ''
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
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            error={Boolean(errors.lastName)}
                            helperText={
                              errors.lastName ? 'Last Name is required' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <FormControlLabel
                        label="Is Admin"
                        control={
                          <Checkbox
                            onClick={(e) => setIsAdmin(e.target.checked)}
                            checked={isAdmin}
                            name="isAdmin"
                          ></Checkbox>
                        }
                      />
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
                      {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
