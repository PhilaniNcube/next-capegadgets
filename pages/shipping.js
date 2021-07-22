import {
  Button,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

import { Store } from '../utils/Store';
import { useRouter } from 'next/dist/client/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';

const ShippingPage = () => {
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('firstName', shippingAddress.firstName);
    setValue('lastName', shippingAddress.lastName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('province', shippingAddress.province);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('university', shippingAddress.university);
    setValue('country', shippingAddress.country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  const universities = [
    'Select University...',
    'Cape Peninsula University of Technology',
    'Central University of Technology',
    'Durban University of Technology',
    'Mangosuthu University of Technology',
    'Nelson Mandela University',
    'North-West University',
    'Rhodes University',
    'Sefako Makgatho Health Sciences University',
    'Sol Plaatje University',
    'Tshwane University of Technology',
    'Universiteit Stellenbosch',
    'University of Cape Town',
    'University of Fort Hare',
    'University of Johannesburg',
    'University of KwaZulu-Natal',
    'University of Limpopo',
    'University of Mpumalanga',
    'University of Pretoria',
    'University of the Free State',
    'University of the Western Cape',
    'University of the Witwatersrand',
    'University of Venda',
    'University of Zululand',
    'Vaal University of Technology',
    'Walter Sisulu University',
    'Other',
  ];

  const submitHandler = ({
    firstName,
    lastName,
    address,
    city,
    province,
    postalCode,
    country,
    university,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        country,
        university,
      },
    });

    Cookies.set('shippingAddress', {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      country,
      province,
      university,
    });
    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography variant="h1" component="h1">
          Shipping Address
        </Typography>
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
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 8,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address length should be more than 8 characters'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City length should be more than 2 characters'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="postalCode"
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
                  id="postalCode"
                  label="Postal Code"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal code length should be more than 2 characters'
                        : 'Postal code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="province"
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
                  id="province"
                  label="Province"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.province
                      ? errors.province.type === 'minLength'
                        ? 'Postal code length should be more than 2 characters'
                        : 'Postal code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="country"
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
                  id="country"
                  label="Country"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country length should be more than 2 characters'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <Typography>Select University</Typography>
          <ListItem>
            <Controller
              name="university"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  variant="outlined"
                  fullWidth
                  id="university"
                  label="University"
                  defaultValue="Select University..."
                  error={Boolean(errors.university)}
                  {...field}
                >
                  {universities.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
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
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default ShippingPage;
