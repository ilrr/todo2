const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class ShoppingListSection extends Model { }

ShoppingListSection.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 6],
    },
  },
  order: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'shoppingListSection',
});

module.exports = ShoppingListSection;
