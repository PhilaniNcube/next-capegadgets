import nc from 'next-connect';
import Ebook from '../../models/Ebook';
import db from '../../utils/db';

const handler = nc();

for (let index = 1; index < 775; index++) {
  handler.get(async (req, res) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        'X-VitalSource-API-Key',
        process.env.NEXT_PUBLIC_VITALSOURCE_API_KEY,
      );

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://api.vitalsource.com/v4/products?page=${index}?include_details=metadata,subjects`,
        requestOptions,
      );
      const result = await response.json();
      const { items } = result;

      await db.connect();
      await Ebook.deleteMany();
      await Ebook.insertMany(items);
      // return items;
      await db.disconnect();
      res.send({ message: `Seeded page ${index}` });
    } catch (error) {
      console.log(error);
      res.send({ message: error });
    }
  });
}

export default handler;
