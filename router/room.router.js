const express = require('express');
const passport = require('passport');
const RoomService = require('../service/service.room');
const uploadRoom = require('./getImage/get.image.run');
const validatorHandler = require('../middleware/validator.handler');
const {
  createRoom, updateRoom, getRoom, queryParamsRoom,
} = require('../schema/room.schema');

const router = express.Router();
const serviceRoom = new RoomService();

router.get(
  '/',
  validatorHandler(queryParamsRoom, 'query'),
  async (req, res, next) => {
    try {
      const data = req.query;
      const room= await serviceRoom.find(data);
      if (room.length > 0) {
        res.status(200).json(room);
      } else {
        res.status(404).json({
          message: 'not found',
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user',
  validatorHandler(queryParamsRoom, 'query'),
  async (req, res, next) => {
    try {
      const {wherePlace} = req.query
      const [results, metadata]= await serviceRoom.findUserRoom(wherePlace);
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.sendStatus(404).json({
          message: 'not found',
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user/:id',
  validatorHandler(queryParamsRoom, 'query'),
  async (req, res, next) => {
    try {
      const {id} = req.params
      const [results, metadata]= await serviceRoom.findOneUser(id);
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.sendStatus(404).json({
          message: 'not found',
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  validatorHandler(getRoom, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const roomId = await serviceRoom.findOne(id);
      if (roomId === [] || roomId === null) {
        res.status(404).json({
          message: 'not found',
        });
      } else {
        res.status(200).json(roomId);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadRoom.single('imageRoom'),
  validatorHandler(createRoom, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req;
      const header = req.headers.authorization.slice(7);
      const name = req.file.filename;
      const newRoom = await serviceRoom.create(body, name, header);
      res.status(201).json(newRoom);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getRoom, 'params'),
  validatorHandler(updateRoom, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updateRooms = await serviceRoom.update(id, changes);
      res.json(updateRooms);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getRoom, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteRoom = serviceRoom.delete(id);
      res.json(deleteRoom);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
