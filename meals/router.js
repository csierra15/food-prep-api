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
        start: req.body.values.dateInput,
        end: req.body.values.dateInput,
        desc: req.body.values.desc
    }
    User.findById(req.params.userId)
    .then(user => {
      console.log('adding a new meal')
      user.meals.push(plan)

      user.save(err => {
        if (err) {
          res.send(err)
        }
      })
    })
});

router.put('/:userId/:id', jsonParser, (req, res) => {
    const toUpdate = {};
    const updateableFields = ['title', 'start', 'end', 'desc'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    User.findById(req.params.userId)
      .then(user => {res.json(user.meals)
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(meal => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Could not update' }));
      })

});

router.delete('/:userId/:id', (req, res) => {
    MealPlan
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `Meal Plan \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };
