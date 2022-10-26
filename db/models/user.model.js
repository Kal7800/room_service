const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

const schemaUser = {
  userId: {
    autoIncrement: true,
    allowNull: false,
    field: 'user_id',
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING(50),
    field: 'user_name',
    unique: false,
  },
  surname: {
    allowNull: false,
    type: DataTypes.STRING(50),
    field: 'user_surnames',
    unique: false,
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(75),
    field: 'user_email',
  },
  number:{
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
    field: 'numero'
  },
  password: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(150),
    field: 'password',
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  photo: {
    allowNull: true,
    unique: true,
    type: DataTypes.STRING(75),
    field: 'profile_photo',
  },
  userReview:{
    allowNull: true,
    type: DataTypes.STRING(180),
    field: 'user_review'
  }
};

class User extends Model {
  static associate(models) {
    this.hasMany(
      models.Room,
      {
        as: 'rooms_for_user',
        foreignKey: 'usuarioPerteneciente',
      },
    );
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      ModelName: 'User',
      timestamps: false,
    };
  }
}

module.exports = { User, USER_TABLE, schemaUser };
