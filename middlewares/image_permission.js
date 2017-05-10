var Image = require('../models/image');

function ImagePermission (image, request, response) {
	// True -> tienes permisos
	// False -> no tienes permisos
	
	if(request.method === "GET" && request.path.indexOf('edit') < 0) {
		// Todos pueden ver las imagenes
		return true;
	}

	if(typeof image.creator == "undefined") return false;

	if(image.creator._id.toString() == response.locals.user._id) {
		// Esta imagen me pertenece
		return true;
	}

	return false;

}

module.exports = ImagePermission;