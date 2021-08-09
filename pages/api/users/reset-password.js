import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  console.log(req.body);
  const user = await User.findOne({ resetToken: req.body.token });
  console.log(user);
  user.password = bcrypt.hashSync(req.body.password);

  await user.save();

  db.disconnect();
  console.error();

  res.send({
    message: 'Password changed',
  });
});

export default handler;
