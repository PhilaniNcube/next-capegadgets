import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: '#efefef',
    '& a': {
      color: '#208080',
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
  },
  footer: {
    textAlign: 'center',
    marginTop: '6rem',
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

  menuButton: {
    padding: 0,
  },
  mt1: { marginTop: '1rem', marginBottom: '1rem' },

  // search
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  searchForm: {
    border: '1px solid #fff',
    backgroundColor: '#fff',
    borderRadius: 5,
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
    color: '#208080',
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
}));

export default useStyles;
