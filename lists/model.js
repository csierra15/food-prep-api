'use strict'
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uuid = require('uuid');

const listSchema = mongoose.Schema({
  date: String,
  title: String,
  content: String
});

listSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    date: this.date
  }
}

const List = mongoose.model('List', listSchema);

module.exports = {List, listSchema}
