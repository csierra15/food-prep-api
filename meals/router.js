'use strict'
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const { MealPlan } = require('./model');
const { User } = require('../users/model')

mongoose.Promise = global.Promise;

router.use(jsonParser);
router.use(jwtAuth);

router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      res.json(user.meals)
    });
});

router.post('/:userId', (req, res) => {
  console.log(req.body);
  const plan = {
        title: req.body.values.mealDescription,
        start: req.body.values.start,
        end: req.body.values.end,
        startTime: req.body.values.timeInput
    }
    User.findById(req.params.userId)
    .then(user => {
      user.meals.push(plan);

      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user.meals);
      });
    });
});

router.put('/:userId/:mealId', jsonParser, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      let meal = user.meals.id(req.params.mealId);
      meal.title = req.body.values.title;
      meal.start = req.body.values.start;
      meal.end = req.body.values.end;

      user.save((err, user) => {
        if (err) {
          res.send(err);
        };
        res.json(user.meals);
      });
    });
});

router.delete('/:userId/:mealId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      user.meals.id(req.params.mealId).remove();
      user.save((err, user) => {
        if (err) {
          res.send(err);
        };
        res.json(user.meals);
      });
    });
});

module.exports = { router };
