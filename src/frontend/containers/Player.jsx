import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVideoSource } from '../actions';
import '../assets/styles/components/Player.css';
import NotFount from './NotFount';

const Player = (props) => {
  const { id } = props.match.params;
  const hasPlaying = Object.keys(props.playing).length > 0;
  useEffect(() => {
    props.getVideoSource(id);
  }, []);
  return !hasPlaying ? (
    <NotFount />
  ) : (
    <div className="Player">
      <iframe
        style={{ height: '100vh' }}
        src={props.playing.source}
        width="100%"
        height="100vh"
        frameBorder="0"></iframe>
      <div className="Player-back">
        <button type="button" onClick={() => props.history.goBack()}>
          Regresar
        </button>
      </div>
    </div>
  );
};

Player.propTypes = {
  getVideoSource: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    playing: state.playing,
  };
};

const mapDispatchToProps = {
  getVideoSource,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
