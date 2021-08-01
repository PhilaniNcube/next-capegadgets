import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#efefef',
    '& a': {
      color: '#208080',
      marginLeft: 10,
      fontWeight: 'bold',
    },
  },
  toolbar: {
    padding: '0',
    margin: '0',
  },
  brand: {
    height: '100%',
    objectFit: 'cover',
    padding: '3px',
  },
  grow: {
    flexGrow: 1,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  main: {
    minHeight: '80vh',
  },
  price: {
    width: '100%',
    fontWeight: 700,
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: '#208080',
    textTransform: 'initial',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#f04040',
  },
  fullWidth: {
    width: '100%',
  },
  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewIte: {
    marginRight: '1rem',
    borderRight: '1px solid #808080',
    paddingRight: '1rem',
  },
});

export default useStyles;
