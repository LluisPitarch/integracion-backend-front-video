import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import '../assets/styles/components/Login.css';
import Header from '../components/Header';

import crossIcon from '../assets/static/cross.png';
import loading from '../assets/static/loading.gif';

const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
    id: '',
    name: '',
    loading: false,
  });

  const updateInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginUser(form, '/');
    setValues({ ...form, loading: true });
  };

  return (
    <>
      <Header isLogin />
      <section className="login">
        <section className="login__container">
          <h2>Login</h2>
          <form className="login__container--form" onSubmit={handleSubmit}>
            <input
              name="email"
              className="input"
              type="email"
              placeholder="Correo"
              onChange={updateInput}
              autoComplete="Off"
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Contraseña"
              onChange={updateInput}
              autoComplete="Off"
            />
            <button className="button" type="submit">
              {form.loading ? (
                props.error ? (
                  'LOGIN'
                ) : (
                  <img className="loadingIcon" src={loading} alt="loading" />
                )
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          <div className="error">
            {props.error && (
              <>
                <img className="crossIcon" src={crossIcon} alt="error icon" />
                <span className="errorText">{props.error}</span>
              </>
            )}
          </div>
          <p className="login__container--register">
            Don't have an account? <br></br>
            <br></br>
            <Link to="/register">Register</Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.error,
  };
};

const mapDispatchToProps = {
  loginUser,
};

Login.propTypes = {
  loginUser: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
