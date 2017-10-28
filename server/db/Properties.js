const conn = require('./conn');
const Sequelize = require('sequelize');

const Property = conn.define('property', {
  center: {
    type: Sequelize.ARRAY(Sequelize.FLOAT)
  },
  mylist: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    defaultValue:  []
  }
});

module.exports = Property;
