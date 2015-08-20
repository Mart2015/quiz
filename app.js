var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

var partials = require('express-partials');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); //Semilla 'Quiz 2015' para cifrar cookie
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
     req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next) {
     // Si estamos logados contabilizamos el tiempo para controlar tiempo de inactividad
     if(req.session.user){
         // inicializamos la horaUltimoAcceso
         if(!req.session.horaUltimoAcceso){
             req.session.horaUltimoAcceso=(new Date()).getTime();
             req.session.tiempoMaximoInactividad=2; // 2 minutos
         }
         //Si han pasado más de 2 minutos (en ms) eliminamos la sesión y demás variables
         if(((new Date()).getTime()-req.session.horaUltimoAcceso) >
             (req.session.tiempoMaximoInactividad*60*1000)){
              delete req.session.user;     //eliminamos el usuario
              delete req.session.horaUltimoAcceso;    // eliminamos la variable de hora ultimo acceso
              delete req.session.tiempoMaximoInactividad; // eliminamos la variable de tiempo máximo actividad
         }else{
             // se actualiza la hora de último acceso
             req.session.horaUltimoAcceso=(new Date()).getTime();
         }
    }
    next();
});


app.use(partials());

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {

    res.status(err.status || 500);

    res.render('error', {

      message: err.message,
      error: err, errors: []
    });
  });
}


// production error handler
// no stacktraces leaked to user


app.use(function(err, req, res, next) {

  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: {}, 
    errors: []
  });
});

module.exports = app;