import nc from 'next-connect';
import Ebook from '../../../models/Ebook';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const ebooks = await Ebook.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: 'colour',
          path: 'title',
        },
      },
    },
  ]);

  const count = ebooks.length;

  res.send({ count, ebooks });
});

export default handler;
