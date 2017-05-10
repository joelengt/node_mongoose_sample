var express = require('express');
var router = express.Router()
var User = require('../models/user.js');


router.get('/layout', (request, response) => {
    response.render('./bloque');
})

router.get('/test', (request, response) => {
    response.locals = { pet: 'hello' }

    console.log(response.locals);

    response.status(200).json({
        data: {
            user: 'fino'
        }
    })
})

router.get('/', (request, response) => {
    console.log('he');

    console.log(request.session.user_id);

    // User.find((err, users) => {
    //     if(err) {
    //         return console.log(err);
    //     }

    //     response.status(200).json({
    //         users: users
    //     });
    // })

    // User.find()
    //     .then((users) => {
    //         response.status(200).json({
    //             users: users
    //         });

    //     }, (err) => {
    //         if(err) {
    //             return response.status(500).json({
    //                 meta: {
    //                     message: err
    //                 }
    //             });
    //         }
    //     })

    // User.find({}, "username email")  // el campo de filtro, el campo fillable (para traer solo los atributos que pases)
    User.find()  // devuelve la coleccion completa
        .then((users) => {
            response.status(200).json({
                users: users
            });
        })
        .catch((err) => {
            if(err) {
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                });
            }
        })

})

router.post('/signup', (request, response) => {

    var usuario = new User({
        name:     request.body.name,
        password: request.body.password,
        password_confirmation: request.body.password_confirmation
    })

    console.log('DATOS DEL USUARIO');
    console.log(usuario);

    // usuario.save((err, user, numero) => {  // error, documento que guardo, numero de documentos persistentes en la DB
    //     if(err) {
    //         console.log(String(err))
    //         return response.status(422).json({
    //             error: err
    //         });
    //     }

    //     console.log('USER');
    //     console.log(user);

    //     response.status(200).json({
    //         data: usuario
    //     })

    // })

    // Promesas de mongoose
    usuario.save()
        .then((user) => {
            response.status(200).json({
                data: {
                    user: user
                }
            });

        })
        .catch((err) => {
            if(err) {
                console.log(String(err));
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                });
            }
        })
})

router.post('/login', (request, response) => {
    // trae multiples documentos
    User.find({ email: request.body.email, password: request.body.password })  // devuelve la coleccion completa
        .then((users) => {
            response.status(200).json({
                users: users
            });
        })
        .catch((err) => {
            if(err) {
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                });
            }
        })

    // trae uno solo
    User.findOne({ email: request.body.email, password: request.body.password })  // devuelve la coleccion completa
        .then((user) => {

            request.session.user_id = user.id;  // almaceno en la session el user_id
            // ojo las sessions de express no tienen un storage y consumen mucha memoria, es bueno en produccion usar redis para cachear esto

            response.status(200).json({
                user: user
            });
        })
        .catch((err) => {
            if(err) {
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                });
            }
        })

    //por id de mongoDB
    User.findById(req.body._id)  // devuelve la coleccion completa
        .then((user) => {
            response.status(200).json({
                user: user
            });
        })
        .catch((err) => {
            if(err) {
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                });
            }
        })

})

module.exports = router;