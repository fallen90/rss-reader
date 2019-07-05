const chalk = require('chalk');
const moment = require('moment');
const Feeds = require('../models/feeds');

module.exports = function updateSchema(){
    console.log(chalk.green('Updating feeds schema...'));

    const feeds = Feeds.find();

    feeds.forEach(item => {
        const feedItem = Object.assign(item, {
            pubDate : item.pubDate ? moment(item.pubDate).local().format('YYYY-MM-DD hh:mm:ss') : moment().local().format('YYYY-MM-DD hh:mm:ss'),
            hasPubDate : !!item.pubDate,
            content : item.content ? item.content.replace(/(\r|\n|\t)/gm, '').replace(/(?:\s)\s/g, ''): '',
            creator : item.creator ? item.creator : 'fallen90',
            author : item.author ? item.author : 'fallen90'
        });
                
        Feeds.collection.update(feedItem).write();
    });

    console.log(chalk.green('Done!'));
}