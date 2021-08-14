import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
import axios from 'axios';

const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req, res) => {
  console.log(req.body);
  const { token, card, id } = req.body;
  try {
    console.log('paying');
    await db.connect();
    const order = await Order.findById(req.body.reference);
    console.log(order);

    if (order) {
      const intelliConfirmation = await axios.post(
        `https://portal.intellimali.co.za/web/payment`,
        {
          username: 'capegadgets',
          password: '9d059e3fb4efe73760d5ecee6909c2d2',
          cardNumber: card,
          terminalId: '94DVA001',
          amount: order.totalPrice,
          redirectSuccess: `https://capegadgets.vercel.app/order/${id}?payment=success`,
          redirectCancel: `https://capegadgets.vercel.app/order/${id}?payment=cancel`,
          reference: id,
          token: token,
        },
      );

      console.log(intelliConfirmation);

      order.isPaid = true;
      order.paidAt = Date.now();

      // order.paymentResult = {
      //   id: req.body.id,
      //   status: req.body.status,
      //   email_address: req.body.email_address,
      // };
      const paidOrder = await order.save();
      await db.disconnect();
      res.send({ message: 'Order Paid', paidOrder });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Order not found' });
    }
  } catch (error) {
    console.log(onError(error));
  }
});

export default handler;
