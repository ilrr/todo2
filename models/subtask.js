const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Subtask extends Model { }

Subtask.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'subtask',
});

module.exports = Subtask;
