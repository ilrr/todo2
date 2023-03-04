const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Tasklist extends Model { }

Tasklist.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('TASK', 'SHOPPING'),
    allowNull: true,
  },

}, {
  sequelize, underscored: true, timestamps: false, modelName: 'tasklist',
});

module.exports = Tasklist;
