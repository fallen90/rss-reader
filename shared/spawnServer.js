const fastify = require('fastify')({ logger: true });

const Feeds = require('../models/feeds');
const WatchList = require('../models/watchList');

const getList = require('./getList');

module.exports = function(argv){

    fastify.get('/', async (request, reply) => {
        const queryParam = request.query;

        let filter = null;
        
        if(typeof queryParam.unread !== 'undefined'){
            filter = { isRead : false };
        }

        if(typeof queryParam.id !== 'undefined'){
            if(filter != null) filter.watchListId = queryParam.id;
            else filter = { watchListId : queryParam.id }
        }

        return Feeds.find(filter);
    });

    fastify.get('/watch-list', async (request, reply) => {
        return WatchList.find().map(item => Object.assign(item, {
            endpoint : `http://${request.hostname}/?id=${item.id}`,
        }));
    });

    fastify.get('/list', async (request, reply) => {
        
        const list = WatchList.find().map(item => {
            const feeds = Feeds.find({ watchListId : item.id });
            const unread = feeds.filter(i => !i.isRead);
            const read = feeds.filter(i => i.isRead);
            
            const headerBackgroundColor = unread.length >= 1 ? '#e05050' : '#e0e0e0';
            const headerFontColor = unread.length >= 1 ? '#fff' : '#111';

            const container = `
                <thead>
                    <tr border="1">
                        <th colspan="5" style="text-align:left;border-bottom:1px solid #ccc;padding-top:12px;background:${headerBackgroundColor};color:${headerFontColor}">${item.name}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style="text-align:left;border-bottom:1px solid #ccc;">ID</th>
                        <th style="text-align:left;border-bottom:1px solid #ccc;width:20vw">Name</th>
                        <th style="text-align:left;border-bottom:1px solid #ccc;">Items</th>
                        <th style="text-align:left;border-bottom:1px solid #ccc;">Unread</th>
                        <th style="text-align:left;border-bottom:1px solid #ccc;">Read</th>
                    </tr>
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${feeds.length}</td>
                        <td>${unread.length}</td>
                        <td>${read.length}</td>
                    </tr>
                    <tr>
                        <th style="text-align:left;border-top:2px solid #ccc;">Latest Unread</th>
                        <th style="text-align:left;border-top:2px solid #ccc;${unread[0] ? '' : 'display:none'}"><strong>${unread[0] ? unread[0].title : ''}</strong></th>
                        <td style="text-align:left;border-top:2px solid #ccc;" colspan="${unread[0] ? 3 : 4}">
                            <a style="text-decoration:none;" target="_new" href="${unread[0] ? unread[0].link : 'javascript:void(0)'}">${unread[0] ? unread[0].link : 'None'}</a>
                        </td>
                    </tr>
                    <tr>
                        <th style="text-align:left;border-bottom:2px solid #ccc;border-top:2px solid #ccc;background-color:#28a745;color:white;">Latest Read</th>
                        <th style="text-align:left;border-bottom:2px solid #ccc;border-top:2px solid #ccc;background-color:#28a745;color:white;" colspan="2"><storng>${read[0] ? read[0].title : ''}</th>
                        <td style="text-align:left;border-bottom:2px solid #ccc;border-top:2px solid #ccc;background-color:#28a745;color:white;" colspan="2">
                            <a style="text-decoration:none;color:white;" target="_new" href="${read[0] ? read[0].link : ''}">${read[0] ? read[0].link : 'None'}</a>
                        </td>
                    </tr>
                <tbody>
            `

            return container;
        });

        return reply
                .code(200)
                .header('Content-Type', 'text/html')
                .send(`
                    <body style="font-family:'Calibri">
                        <h1>Complete List</h1>
                        <table style="width:80vw;margin:0 auto;" cellpadding="0">
                            ${list.join('')}
                        </table>
                    </body>
                `)
    });
    
    const start = async () => {
        try {
            await fastify.listen(argv.port ? argv.port : 3000)
            fastify.log.info(`server listening on ${fastify.server.address().port}`)
        } catch (err) {
            fastify.log.error(err)
            process.exit(1)
        }
    }
    
    start()
}