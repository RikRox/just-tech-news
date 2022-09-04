//import the sequelize constructor from the library
const Sequelize = require('sequelize');

//load .env
require('dotenv').config();


//create connection to pur database, pass in your mysql info for username and pw
const sequelize = new Sequelize('just_tech_news_db', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;