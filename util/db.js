const Sequelize = require('sequelize')

const sequelize = new Sequelize('todo2', 'todo2', 'salasana22', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('DB connected!')
  } catch (error) {
    console.log(`DB connection failed:\n${error}`)
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }