const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Role extends Model { }

Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.ENUM('CREATOR', 'EDIT', 'USE'),
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'role'
})

module.exports = Role