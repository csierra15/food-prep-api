'use strict'
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uuid = require('uuid');

const mealPlanSchema = mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  desc: Object
});

mealPlanSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    start: this.start,
    end: this.end,
    desc: this.desc
  }
}

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = { MealPlan, mealPlanSchema }
