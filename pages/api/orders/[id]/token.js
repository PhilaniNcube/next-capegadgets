import nc from 'next-connect';
import Order from '../../../../models/Order';

import db from '../../../../utils/db';

import { onError } from '../../../../utils/error';
import axios from 'axios';

const handler = nc({ onError });

handler.get(async (req, res) => {
  console.log('Hello', req.body);
  await db.connect();
  const order = await Order.findById(req.query.id);

  if (order) {
    const response = await axios.post(
      `https://test.intellimali.co.za/web/payment`,
      {
        username: 'capegadgets',
        password: '9d059e3fb4efe73760d5ecee6909c2d2',
        cardNumber: '6374374100353717',
        terminalId: '94DVA001',
        amount: order.totalPrice,
        redirectSuccess: `${process.env.URL}/order/${order._id}?payment=success`,
        redirectCancel: `${process.env.URL}/order/${order._id}?payment=cancel`,
        reference: order._id,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );

    await db.disconnect();
    console.log(response.data);
    res.send(response.data);
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
});

export default handler;
