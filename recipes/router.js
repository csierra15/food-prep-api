'use strict'

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promie = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const { Recipes } = require('./model');

router.get('/', (req, res) => {
    Recipes
        .find()
        .then(recipes => {
            res.json(recipes.map(recipe => recipe.serialize()));
        })
        .catch(err => {recipe
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    Recipes
        .findById(req.params.id)
        .then(recipe => res.json(recipe.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'cookingTime', 'servings', 'notes'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

Recipes
    .create({
        title: req.body.title,
        content: req.body.content,
        cookingTime: req.body.cookingTime,
        servings: req.body.servings,
        notes: req.body.notes
    })
    .then(recipes => res.status(201).json(recipes.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new recipe'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message = (`Request path id and request body id ${req.body.id} must match`)
      console.error(message);
      return res.status(400).json({ message: message })
    }
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'cookingTime', 'servings', 'notes'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    Recipes
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(items => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Could not update' }));
});

router.delete('/:id', (req, res) => {
    Recipes
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `Recipe \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };
