var express = require('express');
var Image = require('../models/image.js');
var fs = require('fs');
var router = express.Router()

var redis = require('redis');
var client = redis.createClient();

var findImageMiddleware = require('../middlewares/find_image.js');

var Imagen = require('../models/image.js')

router.all('/images/:id*', findImageMiddleware);

router.get('/', (request, response) => {
    
    Image.find({})
        .populate('creator')
        .exec((err, images) => {
            if(err) {
                return response.status(500).send({
                    meta: {
                        message: err
                    }
                })
            }

            response.status(200).send({
                meta: {
                    data: images
                }
            })
        })
});


router.get('/images/new', (request, response) => {
    response.render('/app/image/create');
});

router.get('/images/:id/edit', (request, response) => {
    // client.publish('images', response.locals.image.toString());
    response.render('/app/image/edit');
});

// CRUD

// Arquitectura REST
    //-> lo importante son los recursos, no las url

    //- recursos
    //- las acciones no estan definidas por las url, sino por el metodo http, que las esta accesando


// Recurso 1
router.route('/images/:id')
    .get((request, response) => {

        var image = response.locals.image;
        
        res.status(200).send({
            data: {
                image: image
            }
        })

    })
    .put((request, response) => {
        var image = response.locals.image;

        image.title = request.body.title;

        image.save((err, image_saved) => {
            if(err) {
                return response.status(500).json({
                    meta: {
                        message: err
                    }
                })
            }

            res.status(200).send({
                data: {
                    image: image_saved
                }
            })

        })

    })
    .delete((request, response) => {
        var image_id = request.params.id
        Image.findOneAndRemove({'_id': image_id}, (err) => {
            if(err) {
                return response.status(200).json({
                    meta: {
                        message: err
                    }
                })
            }

            response.status(200).json({
                meta: {
                    message: 'Image ' + image_id + ' deleted'
                }
            })
        })
    })


// recurso 2
router.route('/images')
    .get((request, response) => {
        // solo saldran las imagenes que pertenecen al usuario
        Imagen.find({ creator: request.locals.user._id }, (err, images) => {
            if(err) {
                return response.status(200).json({
                    meta: {
                        message: err
                    }
                })
            }

            response.status(200).json({
                data: {
                    images: images
                }
            })

        })
    })
    .post((request, response) => {
        var extension = request.body.archivo.name.split('.').pop();
        var data = {
            title: request.body.title,
            creator: response.locals.user._id,
            extension: extension
        }

        var imagen = new Imagen(data);

        imagen.save((err) => {
            if(err) {
                return console.log(err);
            }

            var imageJSON = {
                'id': imagen._id,
                'title': imagen.title,
                'extension': imagen.extension
            }

            client.publish('images', JSON.stringify(imageJSON));

            // Luego de subir las imagenes, vamos a moverla
            fs.rename(request.body.archivo.path, 'public/images/' + imagen._id+ "." + extension);
            response.redirect('/images/' + imagen._id);
        })

    })


module.exports = router;