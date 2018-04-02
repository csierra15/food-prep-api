'use strict'
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false })
const { MealPlan } = require('./model');
const { User } = require('../users/model')

mongoose.Promise = global.Promise;

router.use(jsonParser);
router.use(jwtAuth)

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
      user.meals.push(plan)

      user.save(err => {
        if (err) {
          res.send(err)
        }
        res.json(user)
      })
    })
});

router.put('/:userId/:id', jsonParser, (req, res) => {
  console.log(req.body);
  const toUpdate = {};
  const updateableFields = ['date', 'title', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User.findById(req.params.userId)
    .then(user => {res.json(user.meals)
      .findByIdAndUpdate(req.params.mealId, { $set: toUpdate })
      .then(user => {
        user.save()
        res.status(204).end()
      })
      .catch(err => res.status(500).json({ message: 'Could not update' }));
    })
});

router.delete('/:userId/:id', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {res.json(user.meals)
      .findByIdAndRemove(req.params.mealId)
      .then(() => {
        res.status(204).json({message: `meal \`${req.params.mealId}\` was deleted`});
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not DELETE'});
      });
});

module.exports = { router };
