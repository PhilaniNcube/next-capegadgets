import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth, isAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({})
    .sort({ paidAt: -1 })
    .populate('User', 'firstName');
  await db.disconnect();
  res.send(orders);
});

export default handler;
