const { schemaUser, User } = require('./user.model');
const { schemaRoom, Room } = require('./room.models');
const { schemaCategory, Category } = require('./category.model');

function setupModel(sequelize) {
  User.init(schemaUser, User.config(sequelize));
  Category.init(schemaCategory, Category.config(sequelize));
  Room.init(schemaRoom, Room.config(sequelize));

  Room.associate(sequelize.models);
  Category.associate(sequelize.models);
  User.associate(sequelize.models);
}

module.exports = setupModel;
