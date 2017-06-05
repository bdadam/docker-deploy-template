const datastore = require('nedb-promise');

module.exports = datastore({ inMemoryOnly: true, autoload: true });