const conn = require('./conn');
const Property = require('./Properties');

const sync = () => {
	return conn.sync();
}

module.exports = {
  sync,
  models: {
    Property
  }
}
