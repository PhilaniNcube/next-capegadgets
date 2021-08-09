import nc from 'next-connect';
import Ebook from '../../models/Ebook';
import db from '../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  try {
    const myHeaders = new Headers();

    await Ebook.deleteMany();
    myHeaders.append(
      'X-VitalSource-API-Key',
      process.env.NEXT_PUBLIC_VITALSOURCE_API_KEY,
    );
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    let i = 1;

    while (i < 775) {
      const response = await fetch(
        `https://api.vitalsource.com/v4/products?page=${i}&include_details=subjects,metadata,identifiers`,
        requestOptions,
      );

      const result = await response.json();

      const { items } = result;
      await Ebook.insertMany(items);
      i++;
    }
    db.disconnect();
    res.send({ message: 'Seeded successfully' });
    // return items;
  } catch (error) {
    console.log(error);
    res.send({ message: error });
  }
});

export default handler;
