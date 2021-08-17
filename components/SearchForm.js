import { IconButton, InputBase } from '@material-ui/core';
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';

const SearchForm = () => {
  const classes = useStyles();

  const router = useRouter();
  const [query, setQuery] = useState('');

  console.log(router.pathname);

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      router.pathname === '/ebooks' ||
      router.pathname === '/ebooks/search-books' ||
      router.pathname === '/ebooks/books'
    ) {
      router.push(`/ebooks/search-books?title=${query}`);
      return;
    }
    router.push(`/search?query=${query}`);
  };

  return (
    <div className={`${classes.searchSection} ${classes.mt1}`}>
      <form onSubmit={submitHandler} className={classes.searchForm}>
        <InputBase
          name="query"
          variant="outlined"
          onChange={queryChangeHandler}
          className={classes.searchInput}
        />
        <IconButton
          className={classes.iconButton}
          type="submit"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default SearchForm;
