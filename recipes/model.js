'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const recipeSchema = mongoose.Schema({
  title: String,
  content: String,
  cookingTime: String,
  servings: String,
  notes: String
});

recipeSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    cookingTime: this.cookingTime,
    servings: this.servings,
    notes: this.notes
  }
}

const Recipes = mongoose.model('Recipes', recipeSchema);

module.exports = {Recipes}
