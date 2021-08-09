import nc from 'next-connect';
import { v4 as uuidv4 } from 'uuid';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });

  user.resetToken = uuidv4();

  await user.save();
  db.disconnect();

  if (user) {
    res.send({
      message: 'Please check your email for a password reset link',
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

export default handler;
