'use strict'

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promie = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const { MealPlan } = require('./model');

router.get('/', (req, res) => {
    MealPlan
        .find()
        .then(meals => {
            res.json(meals.map(meal => meal.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    MealPlan
        .findById(req.params.id)
        .then(meal => res.json(meal.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['date', 'menu'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

MealPlan
    .create({
        date: req.body.date,
        menu: req.body.menu
    })
    .then(meals => res.status(201).json(meals.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new meal'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      console.log(req.body, req.body.id, req.params.id);
      const message = (`Request path id and request body id ${req.body.id} must match`)
      console.error(message);
      return res.status(400).json({ message: message })
    }
    const toUpdate = {};
    const updateableFields = ['date', 'menu'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    MealPlan
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(meals => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Could not update' }));
});

router.delete('/:id', (req, res) => {
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
