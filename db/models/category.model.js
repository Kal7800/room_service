const { Model, DataTypes } = require('sequelize');

const CATEGORY_TABLE = 'category';

const schemaCategory = {
  categoryId: {
    allowNull: false,
    field: 'category_id',
    type: DataTypes.STRING(7),
    primaryKey: true,
  },
  typeCategory: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'tipo_categoria',
    unique: true,

  },

};

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Room, {
      as: 'rooms_for_category',
      foreignKey: 'categoriaPerteneciente',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      ModelName: 'Category',
      timestamps: false,
    };
  }
}

module.exports = { Category, CATEGORY_TABLE, schemaCategory };
