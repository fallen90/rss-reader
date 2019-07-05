const { watchList } = require('./database');
const Collection = require('../shared/Collection');

const WatchList = new Collection(watchList);

module.exports = WatchList;