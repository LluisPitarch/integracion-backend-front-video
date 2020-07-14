const passport = require('passport');
const { BasicStrategy } = require('passport-http');

// import config to get env keys (modify to import directly from .env)
import dotenv from 'dotenv';
dotenv.config();

// HTTP callings library
const axios = require('axios');

// Error handler
const boom = require('@hapi/boom');

passport.use(
  new BasicStrategy(async function (email, password, cb) {
    console.log(process.env.API_KEY_TOKEN);
    try {
      const { data, status } = await axios({
        url: `${process.env.API_URL}/api/auth/sign-in`,
        method: 'post',
        auth: {
          username: email,
          password,
        },
        data: {
          apiKeyToken: process.env.API_KEY_TOKEN,
        },
      });

      if (!data || status !== 200) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, data);
    } catch (error) {
      cb(error);
    }
  })
);
