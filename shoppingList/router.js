'use strict'

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promie = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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
    const requiredFields = ['date', 'menu'];
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
        menu: req.body.menu
    })
    .then(shoppingLists => res.status(201).json(shoppingLists.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new shopping list'});
    });
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.updatedShoppingList.id && req.params.id === req.body.updatedShoppingList.id)) {
        console.log(req.body.updatedShoppingList.id);
        res.status(400).json({
          error: `Request path id and request body id ${req.body.updatedShoppingList.id} values must match`
        });
      }

      const updated = {};
      const updateableFields = ['date', 'title', 'content'];
      updateableFields.forEach(field => {
          console.log(field);
          console.log(req.body);
        if (field in req.body != 0) {
            console.log(req.body);
          updated[field] = req.body.updatedShoppingList[field];
        }
      });

      ShoppingList
        .findByIdAndUpdate(req.params.id, { $set: req.body.updatedShoppingList }, { new: true })
        .then(updatedShoppingList => res.json(updatedShoppingList))
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
