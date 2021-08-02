import React, { useContext } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
// import axios from 'axios';
import useStyles from '../../utils/styles';
import Layout from '../../components/Layout';
// import db from '../../utils/db';

import { Store } from '../../utils/Store';
import { useRouter } from 'next/dist/client/router';

const ProductPage = (props) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(Store);

  const { ebook } = props;
  console.log(ebook);

  const classes = useStyles();

  if (ebook.errors) {
    return (
      <Layout>
        {' '}
        <Typography>Ebook Not Found</Typography>
      </Layout>
    );
  }

  const addToCartHandler = async (product) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.vbid === product.vbid,
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // const { data } = await axios.get(`/api/products/${product._id}`);
    // if (data.countInStock < quantity) {
    //   window.alert('Sorry, product is out of stock');
    //   return;
    // }

    const name = product.title;
    const price = (product.variants[0].prices[3].value * 18).toFixed(2);
    const image = product.resource_links.cover_image;
    const brand = product.publisher;
    const category = 'ebook';

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { name, price, image, brand, category, quantity },
    });
    router.push('/cart');
  };

  return (
    <Layout title={ebook.title} description={ebook.description}>
      <div className={classes.section}>
        <Head>
          <title>{ebook.title} | Cape Gadgets</title>
          <meta
            name="Description"
            CONTENT={`Author: ${
              ebook.contributors[0].name
            }, Category: eBooks, Price: R ${(
              ebook.variants[0].prices[3].value * 18
            ).toFixed(2)}`}
          ></meta>
          <meta
            name="keywords"
            content={`Textbooks, ebooks, university ebooks, ${ebook.subjects.map(
              (subject) => `${subject.name},`,
            )} ,university textbooks, ${ebook.title}, ${ebook.contributors.map(
              (author) => `${author.name},`,
            )}`}
          ></meta>
          <meta property="og:site_name" content="Cape Gadgets" />
          <meta property="og:title" content={ebook.title} />
          <meta property="og:type" content="book" />
          <meta
            property="og:url"
            content={`https://capegadgets.co.za/ebooks/${ebook.vbid}`}
          ></meta>

          <meta
            property="og:image"
            content={ebook.resource_links.cover_image}
          />
          <meta property="og:image:width" content="50"></meta>
          <meta property="og:image:height" content="75"></meta>
          <meta
            property="book:author"
            content={ebook.contributors[0].name}
          ></meta>
          <meta
            property="book:isbn"
            content={ebook.identifiers.eisbn_canonical}
          ></meta>
          <meta property="book:tag" content={ebook.subjects[1].name}></meta>

          <meta
            property="twitter:card"
            content={ebook.resource_links.cover_image}
          />
          <meta
            property="twitter:url"
            content={`https://capegadgets.co.za/ebooks/${ebook.vbid}`}
          />
          <meta property="twitter:title" content={ebook.title} />
          <meta
            property="twitter:description"
            content={`${ebook.subjects[1].name} Ebook available for sale at Cape Gadgets Learning & Lifestyle`}
          />
          <meta
            property="twitter:image"
            content={ebook.resource_links.cover_image}
          ></meta>
        </Head>

        <NextLink href="/" passHref>
          <Link>Back To Products</Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={ebook.resource_links.cover_image}
            alt={ebook.title}
            width={400}
            height={500}
            layout="responsive"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <List>
            <ListItem>
              <Typography>{ebook.title}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Format: {ebook.format}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Language: {ebook.language}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Publisher: {ebook.publisher}</Typography>
            </ListItem>
            <ListItem>
              <Grid container>
                <Grid item xs={12}>
                  <Typography>Subjects: {ebook.subjects[1].name}</Typography>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem>
              <Typography component="span">Status</Typography>
              <Typography>
                {ebook.variants[0].distributable
                  ? ': Available'
                  : ': Unavailable'}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>ISBN: {ebook.identifiers.eisbn_canonical}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Print ISBN: {ebook.identifiers.print_isbn_canonical}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h2">
                R{(ebook.variants[0].prices[3].value * 18).toFixed(2)}
              </Typography>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => addToCartHandler(ebook)}
              >
                Add To Cart
              </Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  const { params } = context;

  const { vbid } = params;

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
    `https://api.vitalsource.com/v4/products/${vbid}?include_details=subjects`,
    requestOptions,
  );
  const ebook = await response.json();

  return {
    props: {
      ebook,
    },
  };
}
