import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../assets/styles/components/Search.scss';

const Search = ({ isHome }) => {
  const inputStyle = classNames('input', {
    isHome,
  });
  return (
    <section className="main">
      <h2 className="main__title">Search your favorite</h2>
      <input type="text" className={inputStyle} placeholder="type here..." />
    </section>
  );
};

Search.propTypes = {
  isHome: PropTypes.bool,
};

export default Search;
