'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var posibles_valores = ["M", "F"]; // opciones disponibles

var email_validatino = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "El formato de email no es correcto"];

var password_validation = {
    validator: function (p) { // la p es el campo que optienes, aqui es el password
        return this.password_confirmation == p;
        // this hace referencia al doc que se quiere guardar
        // la funcion validator, debe votar un booleano
    },
    message: "Las contraseñas no son iguales"
};

var user_schema = new Schema({
    name:      { type: String },
    last_name: { type: String },
    username:  { type: String , required: true, maxlength: [50, "El username es muy largo"], minlength: [10, "El username es muy corto"]},
    password:  { 
        type: String,
        minlength: [8, "El password es muy corto"],
        validate: password_validation
    },
    age:       { type: Number , min: [5, "La edad no puede ser menor a 5"], max: [100, "La edad no puede ser mayor a 100"]},
    email:     { type: String, required: "El campo email es obligatorio" , match: email_validatino}, // truo o un mensaje
    dateCreateAt: { type: Date, default: Date.now() },
    // gender:    { type: String, emun: posibles_valores }
    gender:    { type: String, emun: { values: posibles_valores, messages: "Opcion no valiida"} }
})

//match => para validad una estructura en una cadena.
//ser puede usar una expresion regular
// con ello podemos definir la extension de que tendra el path de una archivo para que se guarde, etc



// Virtual => propiedades de un documento
// no se guarda, por lo que podemos usarlos para validacion

// los controladores deben ser delgados
// los modelos deben ser gordos
// las validaciones de parametros deberian estar en el modelo


// Virtual: confirmacion de password
user_schema.virtual("password_confirmation")
    .get(() => {
        return this.p_c;
    })
    .set((password) => {
        this.p_c = password;
    })

// Virtual: full_name
user_schema.virtual("full_name")
    .get(() => {
        return this.name + this.last_name;
    })
    .set((full_name) => {
        var words = full_name.split(' ');
        this.name = words[0];
        this.last_name = words[1];
    })



var userModel = mongoose.model('user', user_schema);

module.exports = userModel;


