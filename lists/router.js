'use strict'
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false })
const { List } = require('./model');
const { User } = require('../users/model')

mongoose.Promise = global.Promise;

router.use(jsonParser);
router.use(jwtAuth);

router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      res.json(user.lists)
    });
});

router.post('/:userId', (req, res) => {
  console.log(req.body);
  const plan = {
        title: req.body.values.title,
        content: req.body.values.content,
        date: req.body.values.date
    }
    User.findById(req.params.userId)
    .then(user => {
      user.lists.push(plan);

      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user.lists);
      });
    });
});

router.put('/:userId/:listId', jsonParser, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      let list = user.lists.id(req.params.listId);
      list.title = req.body.values.title;
      list.content = req.body.values.content;
      list.date = req.body.values.date;

      user.save((err, user) => {
        if (err) {
          res.send(err);
        };
        res.json(user.lists);
      });
    });
});

router.put('/:userId/:listId/content', jsonParser, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      let list = user.lists.id(req.params.listId);
      list.content = req.body.listContent

      user.save((err, user) => {
        if (err) {
          res.send(err);
        };
        let list = user.lists.id(req.params.listId);
        res.json(list);
      });
    });
});

router.delete('/:userId/:listId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      user.lists.id(req.params.listId).remove();
      user.save((err, user) => {
        if (err) {
          res.send(err);
        };
        res.json(user.lists);
      });
    });
});

module.exports = { router };
