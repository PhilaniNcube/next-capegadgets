import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
import axios from 'axios';

const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req, res) => {
  const { token, card } = req.body;
  try {
    await db.connect();
    const order = await Order.findById(req.query.id);

    const intelliConfirmation = await axios.post(
      `https://portal.intellimali.co.za/web/payment`,
      {
        username: 'capegadgets',
        password: '9d059e3fb4efe73760d5ecee6909c2d2',
        cardNumber: card,
        terminalId: '94DVA001',
        amount: order.totalPrice,
        redirectSuccess: `${process.env.REDIRECT_URL}/order/${order._id}?payment=success`,
        redirectCancel: `${process.env.REDIRECT_URL}/order/${order._id}?payment=cancel`,
        reference: order._id,
        token: token,
      },
    );

    console.log(intelliConfirmation);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // order.paymentResult = {
      //   id: req.body.id,
      //   status: req.body.status,
      //   email_address: req.body.email_address,
      // };
      const paidOrder = await order.save();
      await db.disconnect();
      res.send({ message: 'Order Paid', order: paidOrder });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Order not found' });
    }
    res.send(order);
  } catch (error) {
    console.log(error);
  }
});

export default handler;
