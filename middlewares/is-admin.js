'use strict'

exports.isAdmin = function(request, response, next) {
    if (request.user.role != 'ADMIN_ROLE') {
        return response.status(200).send({
            message: 'No tienes acceso a esta zona'
        });
    }
    next();
}