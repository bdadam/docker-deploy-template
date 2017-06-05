const path = require('path');
const datastore = require('nedb-promise');

const dbpath = path.resolve(process.cwd(), 'data/test.db');

const db = datastore({ filename: dbpath, autoload: true });

module.exports = db;