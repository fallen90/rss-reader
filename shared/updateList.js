const moment = require('moment');
const Parser = require('rss-parser');
const parser = new Parser();
const WatchList = require('../models/watchList');
const Feeds = require('../models/feeds');
const chalk = require('chalk');

module.exports = function(){
    console.log(chalk.green('Updating RSS Feeds...'));

    WatchList.find().forEach(watchListItem => {
        (async () => {
     
            let feed = await parser.parseURL(watchListItem.url);
            
            feed.items.forEach(item => {
                const feedItem = Object.assign(item, {
                    watchListId : watchListItem.id,
                    isRead : false,
                    pubDate : item.pubDate ? moment(item.pubDate).local().format('YYYY-MM-DD hh:mm:ss') : moment().local().format('YYYY-MM-DD hh:mm:ss'),
                    hasPubDate : !!item.pubDate,
                    content : item.content ? item.content.replace(/(\r|\n|\t)/gm, '').replace(/(?:\s)\s/g, ''): ''
                })
                Feeds.insert(feedItem, 'title');
            });
        
        })();
    });

    console.log(chalk.green('Updated!...'));
}
