const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Task extends Model { }

Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'subtask',
});

module.exports = Task;
