import nc from 'next-connect';
import Ebook from '../../../models/Ebook';
import db from '../../../utils/db';
import APIFeatures from '../../../utils/apiFeatures';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const apiFeatures = new APIFeatures(Ebook.find(), req.query).search();
  const ebooks = await apiFeatures.query;
  db.disconnect();
  console.error();
  res.status(200).send({ success: true, count: ebooks.length, ebooks });
});

export default handler;
