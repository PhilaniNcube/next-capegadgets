import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import onError from '../../../../utils/error';

const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isShipped = true;
    order.shippedAt = Date.now();

    const shippedOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Order has been shipped', order: shippedOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
});

export default handler;
