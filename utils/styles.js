import { makeStyles } from '@material-ui/core';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: '#efefef',
    '& a': {
      color: '#01295F',
      marginLeft: 10,
      fontWeight: 'bold',
    },
  },
  toolbar: {
    padding: '5px',

    justifyContent: 'space-between',
    maxWidth: '1280px',
    width: '90%',
    margin: '0 auto',
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
    fontSize: '1.8rem',
    color: '#01295F',
  },
  intelli: {
    backgroundImage: 'url(/images/intellimali.jpg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left',
    height: '4rem',
    marginBottom: '1rem',
  },
  paygate: {
    backgroundImage: 'url(/images/paygate.jpg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left',
    height: '4rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '6rem',
    padding: '3rem 1rem',
    backgroundColor: '#01295F',
  },
  footerText: {
    color: '#FFFFFF',
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: '#01295F',
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

  menuButton: {
    padding: 0,
  },
  mt1: { marginTop: '1rem', marginBottom: '1rem' },

  // search
  searchSection: {
    height: '3rem',
    display: 'flex',
    maxWidth: '220px',
  },
  searchForm: {
    height: '100%',
    width: '100%',
    border: '1px solid #efefef',
    backgroundColor: '#efefef',
    borderRadius: 5,
    maxWidth: '220px',
    display: 'flex',
  },
  searchInput: {
    paddingLeft: 5,

    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    height: '100%',
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },
  sort: {
    marginRight: 5,
  },
  author: {
    color: '#01295F',
  },
  carousel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: 300,
  },
  featuredText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    textDecoration: 'none',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  priceGrid: {
    fontSize: '2.2rem',
    padding: '.5rem 1rem',
    backgroundColor: 'blue',
    width: 'fit-content',
    color: '#fff',
    borderRadius: 5,
  },
  grid: {
    maxWidth: '500px',
    margin: '0 auto',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  heading: {
    margin: '2rem',
    textAlign: 'center',
    fontSize: '4rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  hero: {
    marginTop: '2rem',
    borderRadius: '.3rem',
    width: '100%',
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '3rem',
    backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)),
    url('images/ebooks.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
  pageTitle: {
    fontSize: 'clamp(3rem, 2.3878rem + 3.2653vw, 5rem)',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  subtitle: {
    maxWidth: '55ch',
    color: '#fff',
    fontSize: 'clamp(.8rem, 1.1776rem, 1.8rem)',
    lineHeight: '1.1',
  },
  box: {
    minHeight: '80vh',
    width: '100%',
    padding: 10,
    marginBottom: 30,
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(to bottom, rgba(45, 46, 52, 0.32), rgba(17, 29, 33, 0.44)),
    url('/images/laptops.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
  pageHeading: {
    color: 'white',
    fontWeight: 700,
    fontSize: '10vw',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
}));

export default useStyles;
