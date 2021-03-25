'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_curso_de_angular7';

exports.ensureAuth = function(request, response, next) {
    if (!request.headers.authorization) {
        return response.status(403).send({ message: 'La peticion no tiene la cabecera' });
    }

    var token = request.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return response.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return response.status(404).send({
            message: 'El token no es valido'
        });
    }

    request.user = payload;

    next();
};