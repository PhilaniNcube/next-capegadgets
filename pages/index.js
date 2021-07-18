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

import db from '../utils/db';
import Product from '../models/Product';
import Layout from '../components/Layout';

export default function Home(props) {
  const { products } = props;

  return (
    <Layout title="Home">
      <Typography variant="h2">Products</Typography>
      <Grid container spacing={3}>
        {products.map((product) => {
          return (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                  </CardActionArea>
                </NextLink>
                <CardContent>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <Typography>{product.name}</Typography>
                  </NextLink>
                  <Typography>R{product.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    fontWeight="700"
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

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
