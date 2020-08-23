import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Categories from '../components/Categories';
import Search from '../components/Search';
import SearchMovies from '../components/SearchMovies';
import '../assets/styles/Home.css';

const Home = ({ myList, trends, originals, search }) => {
  return (
    <>
      <Header />
      <Search isHome />
      {search ? (
        <>
          <Categories title={search}>
            <Carousel>
              <SearchMovies />
            </Carousel>
          </Categories>
        </>
      ) : (
        <>
          {myList.length > 0 && (
            <Categories title="My List">
              <Carousel>
                {myList.map((item) => (
                  <CarouselItem key={item.id} {...item} isList />
                ))}
              </Carousel>
            </Categories>
          )}
          <Categories title="Trending">
            <Carousel>
              {trends.map((item) => (
                <CarouselItem key={item.id} {...item} />
              ))}
            </Carousel>
          </Categories>
          <Categories title="Appflix Orginal's">
            <Carousel>
              {originals.map((item) => (
                <CarouselItem key={item.id} {...item} />
              ))}
            </Carousel>
          </Categories>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    search: state.search,
  };
};

export default connect(mapStateToProps, null)(Home);
