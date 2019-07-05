const vorpal = require('vorpal')();
const chalk = vorpal.chalk;
const { kebabCase } = require('lodash');

const WatchList = require('../models/watchList');

/** actions */
const updateList = require('../shared/updateList');
const getList = require('../shared/getList');
const markRead = require('../shared/markRead');
const addToList = require('../shared/addToList');

/** vorpal options */
vorpal.delimiter(chalk.blue('rss-reader >'));

/** vorpal autocomplete */
const watchListIds = WatchList.find().map(l => l.id);

vorpal
    .command('list [watchListId]')
    .option('-u, --unread', 'list unread only')
    .option('-a,--all', 'list all')
    .autocomplete(watchListIds)
    .action(function (args, callback) {
        getList({
            watchListId : args.watchListId,
            unread : args.options.unread
        });
        callback();
    });

vorpal
    .command('mark-read [watchListId]')
    .autocomplete(watchListIds)
    .action(function (args, callback) {
        markRead({
            watchListId : args.watchListId
        });

        callback();
    });

vorpal
    .command('add [url]')
    .action(function(args, callback){
        addToList({ url : args.url });
        callback();
    })


module.exports = () => {
    vorpal.show();
};