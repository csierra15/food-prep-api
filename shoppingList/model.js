'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const shoppingListSchema = mongoose.Schema({
  date: String,
  title: String,
  content: String
});

shoppingListSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    date: this.date
  }
}

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = {ShoppingList}
