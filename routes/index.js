var express = require('express');

var router = express.Router();


//importamos el enrutador
var quizController = require('../controllers/quiz_controller');


/* GET home page. */

router.get('/', function(req, res) {

  res.render('index', { title: 'Quiz' });

});



router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
router.get('/author', quizController.credits);

module.exports = router;
