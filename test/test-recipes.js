// 'use strict';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
// const should = chai.should();
//
// const { Recipes, router } = require('../recipes');
// const { app, runServer, closeServer } = require('../server');
// const { DATABASE_URL } = require('../config');
//
// chai.use(chaiHttp);
//
// function seedRecipeData() {
//     console.info('seeding recipe data');
//     const seedData = [];
//
//     for (let i=0; i<=10; i++) {
//       seedData.push({
//         title: faker.lorem.words(),
//         content: faker.lorem.words(),
//         cookingTime: faker.random.number(),
//         servings: faker.random.number(),
//         notes: faker.lorem.sentence()
//       });
//     }
//
//     return Recipes.insertMany(seedData);
// }
//
// function tearDownDb() {
//     console.warn('Deleting database');
//     return mongoose.connection.dropDatabase();
//   }
//
// describe('Recipe API resource', function() {
//     before(function() {
//         return runServer(DATABASE_URL);
//       });
//
//       beforeEach(function() {
//         return seedRecipeData();
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
//           it('should return all recipes', function() {
//               let res;
//               let resRecipes;
//               return chai.request(app)
//                 .get('/api/recipes/')
//                 .then(function(res) {
//                     res.should.have.status(200);
//                     res.should.be.json;
//                     res.body.should.be.a('array');
//                     res.body.should.have.length.of.at.least(1);
//
//                     res.body.forEach(function(recipe) {
//                         recipe.should.be.a('object');
//                         recipe.should.include.keys('id', 'title', 'content', 'cookingTime', 'servings', 'notes');
//                     });
//
//                     resRecipes = res.body[0];
//                     return Recipes.findById(resRecipes.id);
//                 })
//                 .then(function(recipe) {
//                     resRecipes.id.should.equal(recipe.id);
//                 });
//           });
//       });
//
//       describe('POST endpoint', function() {
//           it('should add a new recipe', function() {
//               const newRecipe = {
//                 title: faker.lorem.words(),
//                 content: faker.lorem.words(),
//                 cookingTime: faker.random.number(),
//                 servings: faker.random.number(),
//                 notes: faker.lorem.sentence()
//               };
//
//               return chai.request(app)
//                 .post('/api/recipes/')
//                 .send(newRecipe)
//                 .then(function(res) {
//                     res.should.have.status(201);
//                     res.body.should.be.a('object');
//                     res.body.should.include.keys('id', 'title', 'content', 'cookingTime', 'servings', 'notes');
//                     res.body.id.should.not.be.null;
//                 });
//           });
//       });
//
//       // describe('PUT endpoint', function() {
//       //     it('should update fields sent over', function() {
//       //         const updateData = {
//                     // title: Black Bean Quesadillas,
//                     // content: 1 can black beans, tortillas, cheese,
//                     // cookingTime: 15 min
//       //         }
//       //
//       //
//       //         return Recipes
//       //           .findOne()
//       //           .then(function(res) {
//       //               updateData.id = res.body.id;
//       //
//       //               return chai.request(app)
//       //                   .put(`/api/recipes/${recipe.id}`)
//       //                   .send(updateData);
//       //           })
//       //           .then(function(res) {
//       //               res.should.have.status(204)
//       //               return Recipes.findById(updateData.id);
//       //           })
//       //           .then(function(res) {
//       //               res.body.menu.should.equal(updateData.menu);
//       //           });
//       //     });
//       // });
//
//       describe('DELETE endpoint', function() {
//         it('delete a recipe by id', function() {
//
//           let recipe;
//
//           return Recipes
//             .findOne()
//             .then(function(_recipe) {
//               recipe = _recipe;
//               return chai.request(app).delete(`/api/recipes/${recipe.id}`);
//             })
//             .then(function(res) {
//               res.should.have.status(204);
//               return Recipes.findById(recipe.id);
//             })
//             .then(function(_recipe) {
//               should.not.exist(_recipe);
//             });
//         });
//       });
//   });
