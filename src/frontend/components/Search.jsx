import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import '../assets/styles/components/Search.css';

import { setSearch } from '../actions';

const Search = ({ isHome, setSearch }) => {
  const inputStyle = classNames('input', {
    isHome,
  });

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <section className="main">
      <h2 className="main__title">Search your favorite</h2>
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        className={inputStyle}
        placeholder="type here..."
      />
    </section>
  );
};

Search.propTypes = {
  isHome: PropTypes.bool,
  setSearch: PropTypes.func,
};

const mapDispatchToProps = {
  setSearch,
};

export default connect(null, mapDispatchToProps)(Search);
