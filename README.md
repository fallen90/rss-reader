# RSS-READER

A dead simple rss-reader / manager for my reading needs.

### Comand Line Options
- `--dbPath` - specify database location
- `list` - list all feeds saved
- `list --unread` - list only unreads
- `list --unread --id <watchlistId>` - list only feeds under `watchlistId`
- `list --table` - show list in a table
- `mark-read --id <watchlistId>` - mark `all` as read under `watchlistId` (no individual yet)
- `add --url <rss-feed-url>` - add `rss-feed-url` to watch list
- `update-schema` - runs `updateSchema.js` to make touch ups on the feed structure.
- `--admin` - show admin console
- `start-server` - start Web API server

### Admin Console Commands
- `list` - lists feeds by watch item name
- `list [watchlistId]` - list feeds for specific watch item (press `Tab` for autocomplete)
- `list --unread` - lists feeds by watch item name with only unreads
- `list --table` - list feeds by watch item as a table
- `list --all` - ambigous of `list`
- `mark-read [watchlistId]` - mark all as read under watch item (press `Tab` for autocomplete)
- `add [feedUrl]` - add feed to watch items
- `exit` - exit admin console

### Web API
- `/` - lists all feeds
- `/?unread` - lists all unread feeds
- `/?id=<watchListId>` - lists all feeds under watch item id
- `/?id=<watchListId>&unread` - lists all unread feeds under watch item id
- `/watch-list` - lists all watch items
- `/list` - lists all feeds in an html table

### Building Binary
install `pkg`
```
npm install -g pkg
```
run `pkg .` in root directory of project
```
cd /path/to/rss-reader
pkg .
```
it only builds for linux-x86_64, but you can edit `pkg` settings on `package.json`

### Setting up Cron
Setup a cron job to periodically updates the lists

Update list every 30mins

```
*/30 * * * * rss-reader --dbPath=/home/fallen90/Projects/rss-reader/data/data.json
```