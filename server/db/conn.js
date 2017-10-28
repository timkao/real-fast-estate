
const Sequelize = require('sequelize');
const dataBaseUrl = process.env.DATABASE_URL || 'postgres://localhost/realfastestate'
const conn = new Sequelize(dataBaseUrl, { logging: false, operatorsAliases: false});

module.exports = conn;
