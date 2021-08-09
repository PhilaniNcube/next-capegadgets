import nc from 'next-connect';
import { v4 as uuidv4 } from 'uuid';
import User from '../../../models/User';
import db from '../../../utils/db';
import sgMail from '@sendgrid/mail';

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });

  user.resetToken = uuidv4();
  await user.save();
  db.disconnect();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email, // Change to your recipient
    from: 'sales@capegadgets.co.za', // Change to your verified sender
    subject: 'Password Reset For Cape Gadgets', // Change to your
    text: `We have received a request to reset your password. To reset your password click on the link below.`,
    html: `
            <div>
                <h1>Password Reset For Cape Gadgets</h1>
                <p>Hello ${user.firstName}</p>
                <p>We have received a request to reset your password. If you did not request this please contact us immediately on sales@capegadgets.co.za</p>
                <p>To reset your password, please follow the link below</p>
                <a rel="stylesheet" href="${process.env.URI}/reset-password?token=${user.resetToken}">Reset Password</a>
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

  if (user) {
    res.send({
      message: 'Please check your email for a password reset link',
    });
  } else {
    res.status(401).send({ message: 'No User Found' });
  }
});

export default handler;
