import React from 'react';
import CarouselItem from './CarouselItem';
import notFound from '../assets/static/notFound.png';

import { connect } from 'react-redux';

import '../assets/styles/components/SearchMovies.scss';

export const SearchMovies = ({ trends, originals, search }) => {
  const movies = trends.concat(originals);

  const moviesFound = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {moviesFound.length === 0 ? (
        <div>
          <h3 className="sorry__text">
            Sorry, we can't find what are looking for...
          </h3>
          <img className="sorry__icon" src={notFound} alt="not found icon" />
        </div>
      ) : (
        <>
          {moviesFound.map((item) => (
            <CarouselItem key={item.id} {...item} />
          ))}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    search: state.search,
    trends: state.trends,
    originals: state.originals,
  };
};

export default connect(mapStateToProps, null)(SearchMovies);
