const chalk = require('chalk');
const Feeds = require('../models/feeds');

module.exports = function(args){
    console.log(chalk.green('Marking all items for'), chalk.cyan(args.watchListId), chalk.green('as read'));
    const filter = args.watchListId ? ['watchListId',args.watchListId] : null;
    const feeds = Feeds.find(filter);

    feeds.forEach(feed => {
        feed = Object.assign(feed, {
            isRead : true
        })

        Feeds.collection.update(feed).write();
    });

    console.log(chalk.green('Done!'));
}