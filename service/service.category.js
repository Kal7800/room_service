const { models } = require('../libs/sequelize');

class categoryService {
  constructor() {}

  async find() {
    const category = await models.Category.findAll();
    return category;
  }

  async findOne(id) {
    const categoryId = await models.Category.findByPk(id, {
      include: ['rooms_for_category'],
    });
    return categoryId;
  }
}

module.exports = categoryService;
