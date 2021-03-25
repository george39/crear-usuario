'use strict'


//acciones
var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/autenticated');
var admin = require('../middlewares/is-admin')

api.get('/pruebas', [md_auth.ensureAuth, admin.isAdmin], UserController.pruebas);
api.post('/save-user', [md_auth.ensureAuth, admin.isAdmin], UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', [md_auth.ensureAuth, admin.isAdmin], UserController.updateUser);
api.get('/get-admin', UserController.getAdmins);
api.get('/get-users', UserController.getUsers);
api.delete('/delete-user/:id', [md_auth.ensureAuth, admin.isAdmin], UserController.deleteUser);

module.exports = api;