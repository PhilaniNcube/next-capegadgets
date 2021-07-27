import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';
import User from '../../../../../models/User';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.isAdmin = Boolean(req.body.isAdmin);

    await user.save();
    await db.disconnect();
    res.send({ message: 'User updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found' });
  }
});

export default handler;
