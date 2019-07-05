const chalk = require('chalk');
const moment = require('moment');
const Parser = require('rss-parser');
const parser = new Parser();
const { kebabCase } = require('lodash');

const WatchList = require('../models/watchList');
const Feeds = require('../models/feeds');

module.exports = async function({ url }){
    if(url){
        let feed = await parser.parseURL(url);
        const name = feed.title;
        const id = kebabCase(name);

        const listEntry = {
            id, name, url
        };

        WatchList.insert(listEntry, primaryField='id');
        
        /** check */

        const insertedDoc = WatchList.find(['id', id]);
        
        if(insertedDoc != null && insertedDoc.length){
            console.log(chalk.green('Success!'), 'Added', chalk.cyan(name), 'to list');
            console.log(chalk.green('Updating list...'));
            
            feed.items.forEach(item => {
                const feedItem = Object.assign(item, {
                    watchListId : id,
                    isRead : false,
                    pubDate : moment(item.pubDate).local().format('YYYY-MM-DD hh:mm:ss')
                })

                Feeds.insert(feedItem, 'title');
            });
        } else {
            console.log(chalk.red('Failed to add entry to list'));
        }
    } else console.log(chalk.red('Nothing to do'));
}