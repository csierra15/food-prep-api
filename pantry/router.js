'use strict'
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
router.use(passport.authenticate('jwt', { session: false }))
const { Pantry } = require('./model');

router.get('/', (req, res) => {
    Pantry
        .find()
        .then(items => {
            res.json(items.map(item => item.serialize()));
        })
        .catch(err => {item
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    Pantry
        .findById(req.params.id)
        .then(item => res.json(item.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['category', 'item'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

Pantry
    .create({
        category: req.body.category,
        item: req.body.item
    })
    .then(pantry => res.status(201).json(pantry.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new transaction'});
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
    const updateableFields = ['category', 'item'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    Pantry
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(items => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Could not update' }));
});

router.delete('/:id', (req, res) => {
    Pantry
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `Pantry Item \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };
