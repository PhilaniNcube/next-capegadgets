import nc from 'next-connect';
import Order from '../../../../models/Order';

import db from '../../../../utils/db';

import { onError } from '../../../../utils/error';
import axios from 'axios';

const handler = nc({ onError });

handler.post(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  console.log(req);

  if (order) {
    const response = await axios.post(
      `https://test.intellimali.co.za/web/payment`,
      {
        username: 'capegadgets',
        password: '9d059e3fb4efe73760d5ecee6909c2d2',
        cardNumber: req.body.cardNumber,
        terminalId: '94DVA001',
        amount: order.totalPrice,
        redirectSuccess: `${process.env.REDIRECT_URL}/order/${order._id}?payment=success`,
        redirectCancel: `${process.env.REDIRECT_URL}/order/${order._id}?payment=cancel`,
        reference: order._id,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );

    await db.disconnect();

    res.send(response.data);
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
});

export default handler;
