const { Model, DataTypes /* ,DATE */ } = require('sequelize');

const { sequelize } = require('../util/db');

class ShoppingListItem extends Model { }

ShoppingListItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'shoppingListItem',
});

module.exports = ShoppingListItem;
