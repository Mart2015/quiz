var express = require('express');

var router = express.Router();


//importamos el enrutador
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');



/* Página de entrada: GET home page. */

router.get('/', function(req, res) {

  res.render('index', { title: 'Quiz', errors: [] });

});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);	        // autoload :quizId
// Autoload de comandos con :commentId, para que el comentario esté pre-cargado
// cuando se ejecute la acción "publish"
router.param('commentId', commentController.load);	// autoload :commentId

// Definición de rutas de session
router.get('/login', sessionController.new);     // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión


// Definición de rutas de /quizes
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
// se modifican las rutas de edición/creación y borrado para incluir la Autorización
// introduciendo el middleware loginRequired en las primitivas que sólo pueden realizar
// los usuarios logados
router.get('/quizes/new',                  sessionController.loginRequierd, quizController.new);
router.post('/quizes/create',              sessionController.loginRequierd, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequierd, quizController.edit); // invoca la acción edit del controlador
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequierd, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequierd, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);
// uso NO correcto de get, uso correcto sería PUT porque estamos actualizando la tabla comentarios 
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                          sessionController.loginRequierd, commentController.publish);

router.get('/statistics', statisticsController.index);
 
router.get('/author', quizController.credits);

module.exports = router;
