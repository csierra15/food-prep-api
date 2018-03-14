// 'use strict';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
// const should = chai.should();
//
// const { ShoppingList, router } = require('../shoppingList');
// const { app, runServer, closeServer } = require('../server');
// const { DATABASE_URL } = require('../config');
//
// chai.use(chaiHttp);
//
// function seedShoppingListData() {
//     console.info('seeding shoppingList data');
//     const seedData = [];
//
//     for (let i=0; i<=10; i++) {
//         seedData.push({
//           date: faker.lorem.word(),
//           title: faker.lorem.words(),
//           content: faker.lorem.sentences()
//         });
//     }
//     return ShoppingList.insertMany(seedData);
// }
//
// function tearDownDb() {
//     console.warn('Deleting database');
//     return mongoose.connection.dropDatabase();
//   }
//
// describe('Shopping lists API resource', function() {
//     before(function() {
//         return runServer(DATABASE_URL);
//       });
//
//       beforeEach(function() {
//         return seedShoppingListData();
//       });
//
//       afterEach(function() {
//         return tearDownDb();
//       });
//
//       after(function() {
//         return closeServer();
//       });
//
//       describe('GET endpoint', function() {
//           it('should return all shopping lists', function() {
//               let res;
//               let resShoppingList;
//               return chai.request(app)
//                 .get('/api/shopping-lists/')
//                 .then(function(res) {
//                     res.should.have.status(200);
//                     res.should.be.json;
//                     res.body.should.be.a('array');
//                     res.body.should.have.length.of.at.least(1);
//
//                     res.body.forEach(function(shoppingList) {
//                         shoppingList.should.be.a('object');
//                         shoppingList.should.include.keys('id', 'date', 'title', 'content');
//                     });
//
//                     resShoppingList = res.body[0];
//                     return ShoppingList.findById(resShoppingList.id);
//                 })
//                 .then(function(shoppingList) {
//                     resShoppingList.id.should.equal(shoppingList.id);
//                 });
//           });
//       });
//
//       describe('POST endpoint', function() {
//           it('should add a new shopping list', function() {
//               const newShoppingList = {
//                 date: '3-8-18',
//                 title: 'My Shopping List',
//                 content: 'bananas, apples, butter'
//             };
//
//               return chai.request(app)
//                 .post('/api/shopping-lists/')
//                 .send(newShoppingList)
//                 .then(function(res) {
//                     res.should.have.status(201);
//                     res.body.should.be.a('object');
//                     res.body.should.include.keys('id', 'date', 'title', 'content');
//                     res.body.id.should.not.be.null;
//                 });
//           });
//       });
//
//       // describe('PUT endpoint', function() {
//       //     it('should update fields sent over', function() {
//       //         const updateData = {
//       //             menu: [{
//       //               type: 'Breakfast',
//       //               shoppingList: 'spinach, bacon, mushroom, swiss omelette'
//       //             }]
//       //         };
//       //
//       //         return ShoppingList
//       //           .findOne()
//       //           .then(function(res) {
//       //               updateData.id = res.body.id;
//       //
//       //               return chai.request(app)
//       //                   .put(`/api/shopping-lists/${shoppingList.id}`)
//       //                   .send(updateData);
//       //           })
//       //           .then(function(res) {
//       //               res.should.have.status(204)
//       //               return ShoppingList.findById(updateData.id);
//       //           })
//       //           .then(function(res) {
//       //               res.body.menu.should.equal(updateData.menu);
//       //           });
//       //     });
//       // });
//
//       describe('DELETE endpoint', function() {
//         it('delete a shopping list by id', function() {
//
//           let shoppingList;
//
//           return ShoppingList
//             .findOne()
//             .then(function(_shoppingList) {
//               shoppingList = _shoppingList;
//               return chai.request(app).delete(`/api/shopping-lists/${shoppingList.id}`);
//             })
//             .then(function(res) {
//               res.should.have.status(204);
//               return ShoppingList.findById(shoppingList.id);
//             })
//             .then(function(_shoppingList) {
//               should.not.exist(_shoppingList);
//             });
//         });
//       });
//   });
