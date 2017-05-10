var User = require('../models/user.js');

function evaluateSession(request, response, next) {
    if(!request.session.user_id) {
        return response.redirect('/login')
    
    } else {
        User.findById(request.session.user_id, (err, user) => {
            if(err) {
                response.redirect('/login');
            } else {
                // mandar una respuesta al local
                response.locals.user = user // locals coloca un valor de json para reutilizarlo, puedo usarlo directamente como variable en el interporlador en el render viewer
                next();
            }
        });
    }

}

module.exports = evaluateSession;