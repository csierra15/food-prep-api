'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const { MealPlan, router } = require('../meals');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedMealData() {
    console.info('seeding meal data');
    const seedData = [];

    for (let i=0; i<=10; i++) {
        seedData.push({
            date: faker.date.past(),
            menu: faker.lorem.sentences()
        });
    }
    return MealPlan.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }

describe('Meal Plan API resource', function() {
    before(function() {
        return runServer(DATABASE_URL);
      });

      beforeEach(function() {
        return seedMealData();
      });

      afterEach(function() {
        return tearDownDb();
      });

      after(function() {
        return closeServer();
      });

      describe('GET endpoint', function() {
          it('should return all meals', function() {
              let res;
              let resMeal;
              return chai.request(app)
                .get('/api/meal-plans/')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(meal) {
                        meal.should.be.a('object');
                        meal.should.include.keys('id', 'date', 'menu');
                    });

                    resMeal = res.body[0];
                    return MealPlan.findById(resMeal.id);
                })
                .then(function(meal) {
                    resMeal.id.should.equal(meal.id);
                });
          });
      });

      describe('POST endpoint', function() {
          it('should add a new meal', function() {
              const newMeal = {
                date: faker.lorem.word(),
                menu: faker.lorem.sentences()
            };

              return chai.request(app)
                .post('/api/meal-plans/')
                .send(newMeal)
                .then(function(res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'date', 'menu');
                    res.body.id.should.not.be.null;
                });
          });
      });

      // describe('PUT endpoint', function() {
      //     it('should update fields sent over', function() {
      //         const updateData = {
      //             menu: [{
      //               type: 'Breakfast',
      //               meal: 'spinach, bacon, mushroom, swiss omelette'
      //             }]
      //         };
      //
      //         return MealPlan
      //           .findOne()
      //           .then(function(res) {
      //               updateData.id = res.body.id;
      //
      //               return chai.request(app)
      //                   .put(`/api/meal-plans/${meal.id}`)
      //                   .send(updateData);
      //           })
      //           .then(function(res) {
      //               res.should.have.status(204)
      //               return MealPlan.findById(updateData.id);
      //           })
      //           .then(function(res) {
      //               res.body.menu.should.equal(updateData.menu);
      //           });
      //     });
      // });

      describe('DELETE endpoint', function() {
        it('delete a meal by id', function() {

          let meal;

          return MealPlan
            .findOne()
            .then(function(_meal) {
              meal = _meal;
              return chai.request(app).delete(`/api/meal-plans/${meal.id}`);
            })
            .then(function(res) {
              res.should.have.status(204);
              return MealPlan.findById(meal.id);
            })
            .then(function(_meal) {
              should.not.exist(_meal);
            });
        });
      });
  });
