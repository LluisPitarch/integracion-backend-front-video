import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../actions';
import Header from '../components/Header';
import '../assets/styles/components/Register.css';

import crossIcon from '../assets/static/cross.png';
import loading from '../assets/static/loading.gif';

const Register = (props) => {
  const [form, setValues] = useState({
    email: '',
    id: '',
    name: '',
    password: '',
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
    props.registerUser(form, '/login');
    setValues({ ...form, loading: true });
  };
  return (
    <>
      <Header isRegister />
      <section className="register">
        <section className="register__container">
          <h2>Register</h2>
          <form className="register__container--form" onSubmit={handleSubmit}>
            <input
              name="name"
              className="input"
              type="text"
              placeholder="Nombre"
              onChange={updateInput}
            />
            <input
              name="email"
              className="input"
              type="text"
              placeholder="Correo"
              onChange={updateInput}
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Contraseña"
              onChange={updateInput}
            />
            <button className="button" type="submit">
              {form.loading ? (
                props.error ? (
                  'REGISTER'
                ) : (
                  <img className="loadingIcon" src={loading} alt="loading" />
                )
              ) : (
                'REGISTER'
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
            You already have account?<br></br>
            <br></br>
            <Link to="/login" className="register__container--login">
              LOGIN
            </Link>
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
  registerUser,
};

Register.propTypes = {
  registerUser: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
