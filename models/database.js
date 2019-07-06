const lodashId = require('lodash-id');
const low = require('lowdb');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const FileSync = require('lowdb/adapters/FileSync');

const getCurrentDB = () => {
  const fs = require('fs');
  const assumedDBOnCWD = path.join(process.cwd(), '/data/data.json');
  if (fs.existsSync(assumedDBOnCWD)) return assumedDBOnCWD;

  //set working database
  return '/home/fallen90/Projects/rss-reader/data/data.json';
}
const defaults = {
  dbPath: argv.dbPath || process.env.DB_PATH || getCurrentDB()
}
const adapter = new FileSync(defaults.dbPath);
const db = low(adapter);

console.log('Using DB from', defaults.dbPath);
db._.mixin(lodashId);

db._.mixin({
  findOne: function (collection, userId = null) {
    if (userId) return collection[0];

    return collection.getById(userId).value();
  }
});

db.defaults({
  watchList: [],
  feeds: []
}).write();

const feeds = db.defaults({ feeds: [] }).get('feeds');
const watchList = db.defaults({ watchList: [] }).get('watchList');

module.exports = {
  db, feeds, watchList
};