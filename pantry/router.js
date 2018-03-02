'use strict'

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promie = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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
    const requiredFields = ['date', 'menu'];
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

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.uupdatedPantry.id && req.params.id === req.body.updatedPantry.id)) {
        console.log(req.body.updatedPantry.id);
        res.status(400).json({
          error: `Request path id and request body id ${req.body.updatedPantry.id} values must match`
        });
      }

      const updated = {};
      const updateableFields = ['category', 'item'];
      updateableFields.forEach(field => {
          console.log(field);
          console.log(req.body);
        if (field in req.body != 0) {
            console.log(req.body);
          updated[field] = req.body.updatedPantry[field];
        }
      });

      Pantry
        .findByIdAndUpdate(req.params.id, { $set: req.body.updatedPantry }, { new: true })
        .then(updatedPantry => res.json(updatedPantry))
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
