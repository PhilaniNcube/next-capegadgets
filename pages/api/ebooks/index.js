import nc from 'next-connect';
import Ebook from '../../../models/Ebook';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const ebooks = await Ebook.find({});
  db.disconnect();
  console.error();
  res.status(200).send({ success: true, count: ebooks.length, ebooks });
});

export default handler;
