/* eslint-disable func-names */
/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../frontend/reducers';
import Layout from '../frontend/components/Layout';
import serverRoutes from '../frontend/routes/serverRoutes';
import getManifest from './getManifest';

import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';

dotenv.config();

const app = express();
const { ENV, PORT } = process.env;

// Middleware for backend integration
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Basic strategy import
require('./utils/auth/strategies/basic');

if (ENV === 'development') {
  const webPackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webPackConfig);
  const serverConfig = { port: PORT, hot: true };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    req.hashManifest = getManifest();
    next();
  });
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : '/assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : '/assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
  return `
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta charset="utf-8" />
          <meta name="description" content="The all in one video streaming platform">
          <link rel="stylesheet" href="${mainStyles}" type="text/css"/>
          <title>Appflix</title>
        </head>
        <body>
          <div id="app">${html}</div>
          <script id="preloadedState">
            window.__PRELOADED_STATE__ = ${JSON.stringify(
              preloadedState
            ).replace(/</g, '\\u003c')}
          </script>
          <script src="${mainBuild}" type="text/javascript"></script>
          <script src="${vendorBuild}" type="text/javascript"></script>
        </body>
      </html>`;
};

const renderApp = async (req, res) => {
  let initialState;
  const { email, name, id, token } = req.cookies;

  try {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const requests = await axios
      .all([
        axios.get(`${process.env.API_URL}/api/movies`, header),
        axios.get(`${process.env.API_URL}/api/user-movies/${id}`, header),
      ])
      .then(
        axios.spread((movieList, userMovieList) => {
          return {
            movieListData: movieList.data.data,
            userMovieListData: userMovieList.data.data,
          };
        })
      );

    initialState = {
      user: {
        email,
        name,
        id,
      },
      playing: {},
      myList: requests.movieListData.filter((movie) =>
        requests.userMovieListData.some(
          (userMovie) => userMovie.movieId === movie._id
        )
      ),
      trends: requests.movieListData.filter(
        (movie) => movie.contentRating === 'T' && movie._id
      ),
      originals: requests.movieListData.filter(
        (movie) => movie.contentRating === 'O' && movie._id
      ),
      error: '',
      search: '',
    };
  } catch (err) {
    initialState = {
      user: {},
      playing: {},
      myList: [],
      trends: [],
      originals: [],
      error: '',
      search: '',
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = initialState.user.id;
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <Layout>{renderRoutes(serverRoutes(isLogged))}</Layout>
      </StaticRouter>
    </Provider>
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post('/auth/sign-in', async function (req, res, next) {
  passport.authenticate('basic', function (error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !(ENV === 'development'),
          secure: !(ENV === 'development'),
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async function (req, res, next) {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/user-movies', async function (req, res, next) {
  const { id: userId } = req.cookies;

  try {
    const { token } = req.cookies;
    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
      data: userId,
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async function (req, res, next) {
  try {
    const { body: payload } = req;
    const { id } = req.cookies;
    const { token } = req.cookies;

    const userMovie = {
      movieId: payload._id,
      userId: id,
    };

    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: userMovie,
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete('/user-movies/:movieId', async function (req, res, next) {
  try {
    const { movieId } = req.params;
    const { token } = req.cookies;
    const { id } = req.cookies;

    const userMovie = {
      movieId,
      userId: id,
    };

    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies/${movieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
      data: userMovie,
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`${ENV} server running on Port ${PORT}`);
});
