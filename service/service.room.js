const { Op } = require('sequelize');
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { config } = require('../config/config');
const { verifyToken, roundCategoty } = require('../router/handler.id.js/create.relationid');
const sequelize = require('../libs/sequelize');

class roomService {
  constructor() {}

  async create(data, name, user) {
    const { precio } = data;
    const secret = config.jwtSecret;
    const payload = verifyToken(user, secret);
    const idU = payload.sub;
    const categoria = roundCategoty(precio);

    const newRoom = await models.Room.create({
      imageRoom: `http://localhost:3000/public/imgRoom/${name}`,
      usuarioPerteneciente: idU,
      categoriaPerteneciente: categoria,
      ...data,
    });
    return newRoom;
  }

  async find(query) {
    const options = {
      where: {},
    };
    const { category } = query;
    if (category) {
      options.where.categoriaPerteneciente = category;
    }
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { wherePlace } = query;
    if (wherePlace) {
      options.where.departamento = wherePlace;
    }

    const { price } = query;
    if (price) {
      options.where.precio = price;
    }

    const { price_min, price_max } = query;
    if (price_min && price_max) {
      options.where.precio = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }
    const room = await models.Room.findAll(options);
    return room
  }

  async findUserRoom(wherePlace){
    if(wherePlace){

      const rooms = await sequelize.query(`SELECT users.user_name ,users.user_email ,users.numero,
      rooms.room_id,rooms.image_url,rooms.precio, rooms.direccion,rooms.departamento,rooms.titulo_del_cuarto,rooms.descripcion
      FROM rooms INNER JOIN
      users ON users.user_id=rooms.usuario_perteneciente where departamento='${wherePlace}'`)
      return rooms
    }else{
      const rooms = await sequelize.query(`SELECT users.user_name ,users.user_email ,users.numero,
    rooms.room_id,rooms.image_url,rooms.precio, rooms.direccion,rooms.departamento, rooms.titulo_del_cuarto,rooms.descripcion
    FROM rooms INNER JOIN
    users ON users.user_id=rooms.usuario_perteneciente`)
    return rooms;
    }
  }

  async findOneUser (id){
    const room = await sequelize.query(`SELECT users.user_name ,users.user_email ,users.numero,
    rooms.room_id,rooms.image_url,rooms.precio, rooms.direccion,rooms.departamento,rooms.titulo_del_cuarto,rooms.descripcion
    FROM rooms INNER JOIN
    users ON users.user_id=rooms.usuario_perteneciente where room_id=${id}`);
    return room;
  }

  async findOne(id) {
    const room = await models.Room.findByPk(id,{
      include: ['users']
    });
    return room;
  }

  async update(id, changes) {
    const room = await this.findOne(id);
    const updateRoom = await room.update(changes);
    return updateRoom;
  }

  async delete(id) {
    const room = await this.findOne(id);
    const deleteRoom = await room.destroy(room);
    return room;
  }
}

module.exports = roomService;
