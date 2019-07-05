const { feeds } = require('./database');
const Collection = require('../shared/Collection');

const Feeds = new Collection(feeds);

module.exports = Feeds;