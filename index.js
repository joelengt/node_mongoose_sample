'use strict';

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var formidable = require('express-formidable');
var path = require('path');
var session = require('express-session')  // se guarda en memoria, una vez que se reinicia el servidor se pierde
// una recomendacion es cachear la informacion
// Redis -> Gestor de informacion
// Alli podemos almacenar la informacion

// cookies
// var cookieSession = require('cookie-session')

var RedisStore = require('connect-redis')(session);
var methodOverride = require('method-override');
var User = require('./models/user.js');

var realtime = require('./realtime.js')

var app = express();
var server = http.Server(app); // un nuevo serevidor, con la aplicacion de express

var port = 4000;

var routes_app = require('./routes/plataform.js')
var routes_index = require('./routes/index.js')

var middleware_session = require('./middlewares/session.js');

var sessionMiddleware = session({
    store: new RedisStore({}),
    secret: 'keyboard cat'
});

realtime(server, sessionMiddleware);
// app.user('/public', express.static('public'));


app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(sessionMiddleware);

// app.use(session({
//     secret: 'dkalsjdh213h123k2m3l',
//     resave: false, // Guardar la session, aunque no se haya modificado, no es bueno con multicuentas
//     saveUninitialized: false //guardae sessiones nuevas no modificadas
//     // genid: function (request) {

    // }
// }))
// las sessions con express, tienen un secret en el backend
// podemos crear logica con el genid para el cliente


// app.use(cookieSession({
//     name: "session",
//     keys: ["llave-1","llave-2"]
// }));

app.use(formidable({
    keepExtensions: true // keepExtensions true, para mantener la extension
    // uploadDir: 'images'
})); 


mongoose.connect('mongodb://localhost/my_app', (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('DataBase connect');
})

app.use('/', routes_index);

app.use('/app', middleware_session);
app.use('/app', routes_app);

server.listen(port, (err) => {
    if(err) {
        return console.log('Error to Start Server: ' + err);
    };
    console.log('Server start on port: ' + port);
});
