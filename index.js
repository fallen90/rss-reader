require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const initDisplay = require('./shared/Display');
const updateList = require('./shared/updateList');
const addtoList = require('./shared/addToList');
const getList = require('./shared/getList');
const markRead = require('./shared/markRead');
const updateSchema = require('./shared/updateSchema');
const spawnServer = require('./shared/spawnServer');

console.log('Running in', process.cwd());

if (argv.admin) {
    initDisplay();
} else if (argv._.includes('add')) {
    const { url } = argv;
    if (url) {
        addtoList({
            url: url
        });
    } else {
        console.log('Add requires --url');
    }
} else if (argv._.includes('list')) {
    let options = { table: false };

    if (argv.unread) options = Object.assign(options, { unread: true });
    if (argv.table) options = Object.assign(options, { table: true });

    if (argv.watchListId || argv.id) options = Object.assign(options, { watchListId: argv.watchListId || argv.id });

    getList(options);
} else if (argv._.includes('mark-read')) {
    markRead({
        watchListId: argv.watchListId || argv.id
    });
} else if(argv._.includes('update-schema')){
    updateSchema();
} else if(argv._.includes('start-server')){
    spawnServer(argv);
} else { 
    updateList();
}

