const { orderBy } = require('lodash');

const Collection = function(collection){
    this.collection = collection;
}

Collection.prototype.findOne = function(id){
    return this.collection.findOne(id);
}

Collection.prototype.find = function(filter, sort){
    const baseTransact =  this.collection.filter(filter);

    if(sort) return baseTransact.sortBy(sort).value();

    return orderBy(baseTransact.value(), ['pubDate'], ['desc']);
}

Collection.prototype.delete = function(id){
    if(id) return this.collection.remove(id);
}

Collection.prototype.insert = function(data, primaryField='title'){
    if(!this.hasCollision(data[primaryField], primaryField)){
        console.log('Added', data.title);
        
        this.collection.insert(data).write();
    }
}

Collection.prototype.hasCollision = function(fieldValue, primaryField){
    const results = this.collection.filter(item => {
        return (item[primaryField] === fieldValue)
    }).size().value();

    return !!results;
}

module.exports = Collection;