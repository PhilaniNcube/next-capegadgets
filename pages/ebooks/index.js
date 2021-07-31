import { useContext } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';

export default function Home(props) {
  const { result } = props;
  console.log(result);
  const ebooks = result.items;

  const { state, dispatch } = useContext(Store);
  const router = useRouter();

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

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title="Home">
      <Typography variant="h2">Products</Typography>
      <Grid container spacing={3}>
        {ebooks.map((product) => {
          return (
            <Grid item md={4} key={product.vbid}>
              <Card>
                <NextLink href={`/ebooks/${product.vbid}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.resource_links.cover_image}
                      title={product.title}
                    ></CardMedia>
                  </CardActionArea>
                </NextLink>
                <CardContent>
                  <NextLink href={`/ebooks/${product.vbid}`} passHref>
                    <Typography>{product.title}</Typography>
                  </NextLink>
                  <Typography>R{product.variants[0].prices[0]}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    fontWeight="700"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add To Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
}

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps(context) {
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
    'https://api.vitalsource.com/v4/products',
    requestOptions,
  );
  const result = await response.json();

  return {
    props: { result }, // will be passed to the page component as props
  };
}
