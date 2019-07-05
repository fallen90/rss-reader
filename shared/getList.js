const chalk = require('chalk');

const Feeds = require('../models/feeds');
const WatchList = require('../models/watchList');
const fromEntries = require('object.fromentries');
const Table = require('cli-table3');

const _ = require('lodash');

module.exports = function (args) {
    const filter = args.watchListId ? ['watchListId', args.watchListId] : null;

    let feeds = Feeds.find(filter)

    if (args.unread) {
        feeds = feeds.filter(feed => !feed.isRead);
    }

    let watchLists = WatchList.find().map(l => ({ id: l.id, name: l.name }));

    if (args.watchListId) {
        watchLists = watchLists.filter(list => list.id === args.watchListId);
    }

    if (!args.table) {
        watchLists.forEach(list => {
            console.log(chalk.cyan(`--------${list.name}-(${list.id})----------`));

            if (feeds.length) {
                feeds
                    .filter(feed => feed.watchListId === list.id)
                    .forEach(feed => {
                        const isUnread = (feed.isRead) ? chalk.gray('\tread') : chalk.red('\tunread');
                        console.log(' > ', feed.title, isUnread, chalk.magenta('\t' + feed.pubDate));
                    })
            } else console.log(chalk.gray('> Nothing to show'));
        });
    } else {
        const table = new Table({
            head: ['ID', 'Name', 'Items', 'Unread', 'Read'],
            colAligns : ['left','left','center', 'center', 'center'],
            colWidths : [20,25,10, 10, 10]
        });
        
        watchLists.forEach(list => {
            const _feeds = feeds.filter(f => f.watchListId === list.id);

            table.push([
                list.id, 
                list.name,
                _feeds.length,
                _.filter(_feeds, ['isRead', false]).length,
                _.filter(_feeds, ['isRead', true]).length
            ]);
        });        

        console.log(table.toString());
    }
}