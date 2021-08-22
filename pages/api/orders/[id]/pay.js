import nc from 'next-connect';
import Order from '../../../../models/Order';
import User from '../../../../models/User';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req, res) => {
  console.log(req.body);
  const { token, card, id } = req.body;
  try {
    console.log('paying');
    await db.connect();
    const order = await Order.findById(req.body.reference);
    const user = await User.findById(order.user);
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

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email, // Change to your recipient
        from: 'sales@capegadgets.co.za', // Change to your verified sender
        cc: 'philani@diversivest.co.za',
        subject: 'Order Confirmation For Cape Gadgets', // Change to your
        text: `Hi ${user.firstName}, your order has been confirmed, you can view your order at the following link https://capegadgets.vercel.app/order/${order._id} `,
        html: `
            <div>
            <img src="https://capegadgets.vercel.app/_next/image?url=%2Fimages%2Flogo.png&w=256&q=150" />
                <h1>Cape Gadgets Order Confirmation</h1>
                <h2>Order Number ${order._id}</h2>
                <p>Hello ${user.firstName}</p>
                <p>your order has been confirmed, you can view your order at the following link https://capegadgets.vercel.app/order/${order._id}</p>
                <hr />
                <ul style="list-style-type: none;">
                <li>Sub Total: R ${order.itemsPrice}</li>
                <li>Shipping Price: ${order.shippingPrice}</li>
                <li style="font-size: 2rem;"><strong>Total Price: ${order.totalPrice}</strong></li>
                </ul>

                <p>If your have any questions about your order please contact us on 073 206 2822 or email us on sales@capegadgets.co.za</p>
            </div>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email Sent');
        })
        .catch((error) => {
          console.error(error);
        });

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
