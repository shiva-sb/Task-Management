const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Debug log
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password:" " 
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
 " ",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;