const express = require('express');
const UserService = require('../service/service.user');
const validatorHandler = require('../middleware/validator.handler');
const uploadUser = require('./getImage/get.image');
const { updateUser, getUser } = require('../schema/user.schema');

const router = express.Router();
const serviceUser = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const data = await serviceUser.find();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getUser, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await serviceUser.findOne(id);
      if (user === null) {
        res.status(404).json({
          message: 'user not found',
        });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  uploadUser.single('photo'),
  validatorHandler(getUser, 'params'),
  validatorHandler(updateUser, 'body'),
  async (req, res, next) => {
    try {
      const image = req.file.filename;
      const { id } = req.params;
      const changes = req.body;
      const updateUsers = await serviceUser.update(id, changes);
      await serviceUser.addPhoto(id, image);
      res.json(updateUsers);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getUser, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteUser = serviceUser.delete(id);
      res.json(deleteUser);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
