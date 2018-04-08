'use strict'
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uuid = require('uuid');

const mealPlanSchema = mongoose.Schema({
  title: String,
  start: String,
  end: String,
  startTime: String
});

mealPlanSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    start: this.start,
    end: this.end,
    startTime: this.startTime
  }
}

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = { MealPlan, mealPlanSchema }
