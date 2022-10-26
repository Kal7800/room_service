const { Model, DataTypes } = require('sequelize');
const { CATEGORY_TABLE } = require('./category.model');
const { USER_TABLE } = require('./user.model');

const ROOM_TABLE = 'rooms';

const schemaRoom = {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'room_id',
    primaryKey: true,
    autoIncrement: true,
  },
  categoriaPerteneciente: {
    allowNull: false,
    type: DataTypes.STRING(7),
    unique: false,
    field: 'categoria_perteneciente',
    references: {
      model: CATEGORY_TABLE,
      key: 'category_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',

  },
  usuarioPerteneciente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'usuario_perteneciente',
    unique: false,
    references: {
      model: USER_TABLE,
      key: 'user_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  titulo:{
      allowNull: false,
      type: DataTypes.STRING,
      field: 'titulo_del_cuarto'
  },
  imageRoom: {
    allowNull: false,
    type: DataTypes.STRING(150),
    field: 'image_url',
    unique: true,
  },
  departamento: {
    allowNull: false,
    type: DataTypes.STRING(50),
    field: 'departamento',
    unique: false,
  },
  direccion:{
    allowNull: false,
    type: DataTypes.STRING(50),
    field: 'direccion',
    unique: false,
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING(200),
    field: 'descripcion',
  },
  precio: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2),
    field: 'precio',
  },

};

class Room extends Model {
  static associate(models) {
    this.hasOne(
      models.User,
      {
        as: 'users',
      },
    );
    this.hasOne(models.Category, {
      as: 'categories',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROOM_TABLE,
      ModelName: 'Room',
      timestamps: false,
    };
  }
}

module.exports = { Room, ROOM_TABLE, schemaRoom };
