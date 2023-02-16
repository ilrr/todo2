const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: process.env.DATABASE_URL !== 'localhost',
      },
    },
  },
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected!');
  } catch (error) {
    console.log(`DB connection failed:\n${error}`);
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize };
