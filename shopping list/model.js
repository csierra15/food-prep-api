'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const xxxSchema = mongoose.Schema({

});

xxxSchema.methods.serialize = function() {

  return {
    id: this._id,
  }
}

const xxx = mongoose.model('xxx', xxxSchema);

module.exports = {xxx}
