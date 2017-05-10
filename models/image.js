var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
	title: { type: String, required: true },
	creator: { type: Schema.Types.ObjectId, ref:"User" }, // Creando una relacion con el modelos User
	extension: { type: String, required: true }
})


var ImageModel = mongoose.model('images', imageSchema);

module.exports = ImageModel;