const express = require('express');
const userRouter = require('./user.router');
const categoryRouter = require('./category.router');
const roomRouter = require('./room.router');
const loginRouter = require('./login.router');
const registerRouter = require('./register.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', userRouter);
  router.use('/categories', categoryRouter);
  router.use('/rooms', roomRouter);
  router.use('/login', loginRouter);
  router.use('/register', registerRouter);
}

module.exports = routerApi;
