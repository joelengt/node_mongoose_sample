var Image = require('../models/image.js');
var owner_check = require('./image_permission.js');

function findImage(request, response, next) {
	var image_id = request.params._id;

	Image.findById(image_id)
		.populate('creator')    // busca la relacion en base al object id, 
		.exec((err, image) => {  // ejecuta los dos querys y haria como el JOIN de tablas con relaciones 
			if(err) {
				return res.status(404).json({
					meta: {
						message: 'Image not found'
					}
				});
			}

			// con populate y la relacion ahora en el campo "creator" tendriamos todo el schema del solicitado
			// ejemplo image.creator -> deberia imprimir solo el id que guardo, pero no
			// image.creator.email -> tendremos acceso a todo el schema del modelo relacionado

			if(image != null && owner_check(image, request, response) == true) {
				res.locals.image = image;
				next();
			}

	})

}

module.exports = findImage;