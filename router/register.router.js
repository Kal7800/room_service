const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserService = require('../service/service.user');
const validatorHandler = require('../middleware/validator.handler');
const { createUser } = require('../schema/user.schema');

const AuthService = require('../service/auth.mail');
const { config } = require('../config/config');

const serivceAuth = new AuthService();
const serviceUser = new UserService();
const router = express.Router();

router.post(
  '/',
  validatorHandler(createUser, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req; await serivceAuth.sendMailUser(body);
      res.status(200).json({
        mesage: body.email,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const body = req.headers.authorization.slice(7);
      const secret = config.jwtSecret;
      const payload = await jwt.verify(body, secret);
      const newUser = await serviceUser.create(payload);
      res.json({
        status: 200,
         ...newUser
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
