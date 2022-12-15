const { Model, DataTypes, DATE } = require('sequelize')

const { sequelize } = require('../util/db')

class Task extends Model { }

Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completedAt: {
    type: DataTypes.DATE
  },
  frequency: {
    type: DataTypes.INTEGER
  },
  timeFlexibility: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hasSubtasks: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'task'
})

module.exports = Task