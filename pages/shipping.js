import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';

const ShippingPage = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Typography>Shipping</Typography>
    </div>
  );
};

export default ShippingPage;
