'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const shoppingListSchema = mongoose.Schema({
  date: Date,
  title: String,
  content: {type: String, required: true}
});

shoppingListSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    date: this.date
  }
}

const ShoppingList = mongoose.model('ShoppingList', xxxSchema);

module.exports = {ShoppingList}
