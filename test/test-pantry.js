'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const { Pantry, router } = require('../pantry');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedPantryData() {
    console.info('seeding pantry data');
    const seedData = [];

    for (let i=0; i<=10; i++) {
        seedData.push({
            category: faker.lorem.word(),
            item: faker.lorem.words()
        });
    }
    return Pantry.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }

describe('Pantry API resource', function() {
    before(function() {
        return runServer(DATABASE_URL);
      });

      beforeEach(function() {
        return seedPantryData();
      });

      afterEach(function() {
        return tearDownDb();
      });

      after(function() {
        return closeServer();
      });

      describe('GET endpoint', function() {
          it('should return all pantry items', function() {
              let res;
              let resItem;
              return chai.request(app)
                .get('/api/pantry/')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(item) {
                        item.should.be.a('object');
                        item.should.include.keys('id', 'category', 'item');
                    });

                    resItem = res.body[0];
                    return Pantry.findById(resItem.id);
                })
                .then(function(item) {
                    resItem.id.should.equal(item.id);
                });
          });
      });

      describe('POST endpoint', function() {
          it('should add a new pantry item', function() {
              const newItem = {
                  category: faker.lorem.word(),
                  item: faker.lorem.words()
              };

              return chai.request(app)
                .post('/api/pantry/')
                .send(newItem)
                .then(function(res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'category', 'item');
                    res.body.category.should.equal(newItem.category);
                    res.body.item.should.equal(newItem.item);
                    res.body.id.should.not.be.null;
                });
          });
      });

      // describe('PUT endpoint', function() {
      //     it('should update fields sent over', function() {
      //         const updateData = {
      //             category: 'spices',
      //             item: 'smoked paprika'
      //         };
      //
      //         return Pantry
      //           .findOne()
      //           .then(function(item) {
      //               updateData.id = item.id;
      //
      //               return chai.request(app)
      //                   .put(`/api/pantry/${item.id}`)
      //                   .send(updateData);
      //           })
      //           .then(function(res) {
      //               res.should.have.status(204)
      //
      //               return Pantry.findById(updateData.id);
      //           })
      //           .then(function(item) {
      //               item.category.should.equal(updateData.category);
      //               item.item.should.equal(updateData.item);
      //           });
      //     });
      // });

      describe('DELETE endpoint', function() {
        it('delete a pantry item by id', function() {

          let item;

          return Pantry
            .findOne()
            .then(function(_item) {
              item = _item;
              return chai.request(app).delete(`/api/pantry/${item.id}`);
            })
            .then(function(res) {
              res.should.have.status(204);
              return Pantry.findById(item.id);
            })
            .then(function(_item) {
              should.not.exist(_item);
            });
        });
      });
  });
