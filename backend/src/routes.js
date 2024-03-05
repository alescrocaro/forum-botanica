const express = require('express');
const routes = express.Router();
const postController = require('./entities/post/post.controller');
const commentController = require('./controllers/commentController');
const userController = require('./entities/user/user.controller');
const contestationController = require('./entities/contestation/contestation.controller');
const uploadService = require('./services/upload');

routes.get('/posts', postController.index);
routes.get('/posts/:id', postController.get);
routes.post('/posts', uploadService, postController.create);
routes.delete('/posts/:id', postController.delete)
routes.post('/updatePostImage/:id', uploadService, postController.updatePostImage);
/*
routes.post('/posts', postController.update);
*/

// COMMENTS
routes.get('/posts/:id/comments', commentController.index);
routes.post('/posts/:id/comments', commentController.create);
routes.delete('/posts/:id/comments/:id', commentController.delete);
// routes.post('/posts/:id/comments/updateContestation', commentController.updateContestation);

// USER ROUTES
routes.get('/users/:id', userController.get);
routes.post('/users', userController.create);
routes.post('/login', userController.login);

// CONTESTATION
routes.post('/resolve-contestation', contestationController.create);

module.exports = routes;
