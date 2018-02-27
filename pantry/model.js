'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const pantrySchema = mongoose.Schema({
  category: {type: String, required: true},
  item: {type: String, required: true}
});

pantrySchema.methods.serialize = function() {

  return {
    id: this._id,
    category: this.category,
    item: this.item
  }
}

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = {Pantry}
