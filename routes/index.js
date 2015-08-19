var express = require('express');

var router = express.Router();


//importamos el enrutador
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');



/* P�gina de entrada: GET home page. */

router.get('/', function(req, res) {

  res.render('index', { title: 'Quiz', errors: [] });

});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);	        // autoload :quizId
// Autoload de comandos con :commentId, para que el comentario est� pre-cargado
// cuando se ejecute la acci�n "publish"
router.param('commentId', commentController.load);	// autoload :commentId

// Definici�n de rutas de session
router.get('/login', sessionController.new);     // formulario login
router.post('/login', sessionController.create); // crear sesi�n
router.get('/logout', sessionController.destroy); // destruir sesi�n


// Definici�n de rutas de /quizes
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
// se modifican las rutas de edici�n/creaci�n y borrado para incluir la Autorizaci�n
// introduciendo el middleware loginRequired en las primitivas que s�lo pueden realizar
// los usuarios logados
router.get('/quizes/new',                  sessionController.loginRequierd, quizController.new);
router.post('/quizes/create',              sessionController.loginRequierd, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequierd, quizController.edit); // invoca la acci�n edit del controlador
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequierd, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequierd, quizController.destroy);

// Definici�n de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);
// uso NO correcto de get, uso correcto ser�a PUT porque estamos actualizando la tabla comentarios 
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                          sessionController.loginRequierd, commentController.publish);

router.get('/statistics', statisticsController.index);
 
router.get('/author', quizController.credits);

module.exports = router;
