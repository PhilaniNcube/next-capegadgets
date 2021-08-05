import nc from 'next-connect';
import Ebook from '../../../models/Ebook';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const ebooks = await Ebook.find({});
  db.disconnect();
  console.error();
  res.send(ebooks);
});

export default handler;
