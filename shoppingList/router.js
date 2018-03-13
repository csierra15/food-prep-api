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
const { ShoppingList } = require('./model');

router.get('/', (req, res) => {
    ShoppingList
        .find()
        .then(shoppingLists => {
            res.json(shoppingLists.map(shoppingList => shoppingList.serialize()));
        })
        .catch(err => {shoppingList
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    ShoppingList
        .findById(req.params.id)
        .then(shoppingList => res.json(shoppingList.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['date', 'title', 'content'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

ShoppingList
    .create({
        date: req.body.date,
        title: req.body.title,
        content: req.body.content
    })
    .then(shoppingLists => res.status(201).json(shoppingLists.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new shopping list'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message = (`Request path id and request body id ${req.body.id} must match`)
      console.error(message);
      return res.status(400).json({ message: message })
    }
    const toUpdate = {};
    const updateableFields = ['date', 'title', 'content'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    ShoppingList
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(items => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Could not update' }));
});

router.delete('/:id', (req, res) => {
    ShoppingList
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `shoppingList \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };
