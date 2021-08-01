import React from 'react';
import NextLink from 'next/link';
import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

const ProductItem = ({ product, addToCartHandler }) => {
  return (
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
        <Rating value={product.rating} readOnly />
        <Typography>R{product.price}</Typography>
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
  );
};

export default ProductItem;
