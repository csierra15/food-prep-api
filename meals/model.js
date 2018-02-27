'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const mealPlanSchema = mongoose.Schema({
  date: {type: Date, required: true},
  menu: {type: [{
    type: String,
    meal: String
  }], required: true},
});

mealPlanSchema.methods.serialize = function() {

  return {
    id: this._id,
    date: this.date,
    menu: this.menu
  }
}

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = {MealPlan}
