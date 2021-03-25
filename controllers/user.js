'use strict'

// cargar modulos
var bcrypt = require('bcrypt-nodejs');

// cargar modelos
var User = require('../models/user');

//servicio jwt
var jwt = require('../services/jwt');

function pruebas(request, response) {
    response.status(200).json({
        message: 'Probando el controlador de usuarios',
        user: request.user
    });
}

//acciones

// Metodo para guardar un usuario
function saveUser(request, response) {
    //crear objeto usuario
    var user = new User();

    //recoger parametros
    var params = request.body;

    if (params.name) {
        // Asignar valores al objeto usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.phone = params.phone;


        User.findOne({ email: user.email.toLowerCase() }, (error, issetUser) => {
            if (error) {
                response.status(500).json({ message: 'Error al comprobar usuario' });
            } else {
                if (!issetUser) {
                    bcrypt.hash(params.password, null, null, function(error, hash) {
                        user.password = hash;

                        //guardar usuario en bd
                        user.save((error, userStored) => {
                            if (error) {
                                response.status(500).json({ message: 'Error al guardar el usuario' });
                            } else {
                                if (!userStored) {
                                    response.status(404).json({ message: 'No se ha guardado el usuario' });
                                } else {
                                    response.status(200).json({ user: userStored });
                                }
                            }
                        });
                    });
                } else {
                    response.status(200).json({
                        message: 'El usuario no se ha guardado porque ya existe'
                    });
                }
            }
        });

    } else {
        response.status(200).json({
            message: 'Introduce los datos correctamente'
        });
    }


}

// Metodo de login
function login(request, response) {
    var params = request.body;

    var email = params.email;
    var password = params.password;
    User.findOne({ email: email.toLowerCase() }, (error, user) => {
        if (error) {
            response.status(500).json({ message: 'Error al comprobar usuario' });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (error, check) => {
                    if (check) {

                        //comprobar y generar el token
                        if (params.gettoken) {
                            //devolver token fwt
                            response.status(200).json({
                                token: jwt.createToken(user)
                            });
                        } else {
                            response.status(200).json({ user })
                        }

                    } else {
                        response.status(404).json({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });

            } else {
                response.status(404).json({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}

//Metodo para actualizar un usuario
function updateUser(request, response) {
    var userId = request.params.id;
    var update = request.body;
    delete update.password;



    User.findByIdAndUpdate(userId, update, { new: true }, (error, userUpdated) => {
        if (error) {
            response.status(500).json({
                message: 'Error al actualizar el usuario'
            });
        } else {
            if (!userUpdated) {
                response.status(404).json({
                    message: 'No se ha podido actualizar el usuario'
                });
            } else {
                response.status(200).json({ user: userUpdated });
            }
        }
    });
}

//Metodo para listar los usuarios con role admin
function getAdmins(request, response) {
    User.find({ role: 'ADMIN_ROLE' }).exec((error, users) => {
        if (error) {
            response.status(500).json({
                message: 'Error en la peticion'
            });
        } else {
            if (!users) {
                response.status(404).json({
                    message: 'No hay administradores'
                });
            } else {
                response.status(200).json({ users });
            }
        }
    });

}

//Metodo para listar los usuarios con role user
function getUsers(request, response) {
    User.find({ role: 'USER_ROLE' }, (err, users) => {
        if (err) {
            response.satus(500).json({
                message: 'Error obteniendo usuarios'
            });
        } else {
            if (!users) {
                response.satus(404).json({
                    message: 'No hay usuarios'
                });
            } else {
                response.status(200).json({
                    user: users
                });
            }
        }
    });





}



/************************************************************
 METODO PARA ELIMINAR UN USUARIO
*************************************************************/
function deleteUser(req, res) {
    var userId = req.params.id;

    User.findByIdAndDelete(userId, (err, userDeleted) => {
        if (err) {
            res.status(500).json({
                message: 'Error al eliminar usuario'
            });
        } else {
            if (!userDeleted) {
                res.status(404).json({
                    message: 'El usuario con ese id no existe'
                });
            } else {
                res.status(200).json({
                    user: userDeleted
                });
            }
        }
    });
}


module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    getAdmins,
    getUsers,
    deleteUser
};