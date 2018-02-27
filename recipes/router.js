'use strict'

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promie = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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
    const requiredFields = ['date', 'menu'];
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
        date: req.body.date,
        menu: req.body.menu
    })
    .then(recipes => res.status(201).json(recipes.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new recipe'});
    });
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.updatedRecipe.id && req.params.id === req.body.updatedRecipe.id)) {
        console.log(req.body.updatedRecipe.id);
        res.status(400).json({
          error: `Request path id and request body id ${req.body.updatedRecipe.id} values must match`
        });
      }

      const updated = {};
      const updateableFields = ['title', 'content', 'cookingTime', 'servings', 'notes'];
      updateableFields.forEach(field => {
          console.log(field);
          console.log(req.body);
        if (field in req.body != 0) {
            console.log(req.body);
          updated[field] = req.body.updatedRecipe[field];
        }
      });

      Recipes
        .findByIdAndUpdate(req.params.id, { $set: req.body.updatedRecipe }, { new: true })
        .then(updatedRecipes => res.json(updatedRecipes))
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
