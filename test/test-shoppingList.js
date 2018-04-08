// 'use strict';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
// const should = chai.should();
//
// const { List, router } = require('../lists');
// const { app, runServer, closeServer } = require('../server');
// const { DATABASE_URL } = require('../config');
//
// chai.use(chaiHttp);
//
// function seedListData() {
//     console.info('seeding list data');
//     const seedData = [];
//
//     for (let i=0; i<=10; i++) {
//         seedData.push({
//           date: faker.lorem.word(),
//           title: faker.lorem.words(),
//           content: faker.lorem.sentences()
//         });
//     }
//     return List.insertMany(seedData);
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
//         return seedListData();
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
//               let resList;
//               return chai.request(app)
//                 .get('/api/shopping-lists/')
//                 .then(function(res) {
//                     res.should.have.status(200);
//                     res.should.be.json;
//                     res.body.should.be.a('array');
//                     res.body.should.have.length.of.at.least(1);
//
//                     res.body.forEach(function(list) {
//                         list.should.be.a('object');
//                         list.should.include.keys('id', 'date', 'title', 'content');
//                     });
//
//                     resList = res.body[0];
//                     return List.findById(resList.id);
//                 })
//                 .then(function(list) {
//                     resList.id.should.equal(list.id);
//                 });
//           });
//       });
//
//       describe('POST endpoint', function() {
//           it('should add a new shopping list', function() {
//               const newList = {
//                 date: '3-8-18',
//                 title: 'My Shopping List',
//                 content: 'bananas, apples, butter'
//             };
//
//               return chai.request(app)
//                 .post('/api/shopping-lists/')
//                 .send(newList)
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
//       //               list: 'spinach, bacon, mushroom, swiss omelette'
//       //             }]
//       //         };
//       //
//       //         return List
//       //           .findOne()
//       //           .then(function(res) {
//       //               updateData.id = res.body.id;
//       //
//       //               return chai.request(app)
//       //                   .put(`/api/shopping-lists/${list.id}`)
//       //                   .send(updateData);
//       //           })
//       //           .then(function(res) {
//       //               res.should.have.status(204)
//       //               return List.findById(updateData.id);
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
//           let list;
//
//           return List
//             .findOne()
//             .then(function(_list) {
//               list = _list;
//               return chai.request(app).delete(`/api/shopping-lists/${list.id}`);
//             })
//             .then(function(res) {
//               res.should.have.status(204);
//               return List.findById(list.id);
//             })
//             .then(function(_list) {
//               should.not.exist(_list);
//             });
//         });
//       });
//   });
