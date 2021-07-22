import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#2C2E43',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    },
  },
  toolbar: {
    padding: '0',
    margin: '0',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.8rem',
    padding: '0',
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
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#f04040',
  },
});

export default useStyles;
