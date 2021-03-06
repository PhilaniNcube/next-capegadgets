import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import User from '../../../models/User';
import Product from '../../../models/Product';

const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
    '$match': {
      'isPaid': true
    }
  }, {
    '$group': {
      '_id': '$isPaid', 
      'totalPrice': {
        '$sum': '$totalPrice'
      }
    }
  },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
     {
    '$match': {
      'isPaid': true
    }
  },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
