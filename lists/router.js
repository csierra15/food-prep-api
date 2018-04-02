'use strict'
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false })
const { List } = require('./model');

mongoose.Promise = global.Promise;

router.use(jsonParser);
router.use(jwtAuth);

router.get('/:userId', (req, res) => {
  router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
      .then(user => {
        res.json(user.lists)
      });
  });


router.post('/:userId', (req, res) => {
  console.log(req.body);
  const plan = {
        title: req.body.title,
        date: req.body.date,
        content: req.body.content
    }
    User.findById(req.params.userId)
    .then(user => {
      user.lists.push(plan)

      user.save(err => {
        if (err) {
          res.send(err)
        }
      })
    })
});

router.put('/:userId/:id', jsonParser, (req, res) => {
    const toUpdate = {};
    const updateableFields = ['date', 'title', 'content'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    User.findById(req.params.userId)
      .then(user => {res.json(user.lists)
        .findByIdAndUpdate(req.params.listId, { $set: toUpdate })
        .then(user => {
          user.save()
          res.status(204).end()
        })
        .catch(err => res.status(500).json({ message: 'Could not update' }));
      })
});

router.delete('/:userId/:id', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {res.json(user.lists)
      .findByIdAndRemove(req.params.listId)
      .then(() => {
        res.status(204).json({message: `list \`${req.params.listId}\` was deleted`});
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not DELETE'});
      });
});

module.exports = { router };
