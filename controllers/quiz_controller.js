var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find({
      where: { id: Number(quizId)},
      include: [{ model: models.Comment }] // incluye todos los comentarios asociados a traves del model
      }).then(function(quiz) {
         if (quiz){
            req.quiz = quiz;
            next();
         } else {
            next(new Error('No existe quizId = ' + quizId));
         }
       }
    ).catch(function(error) { next(error);});
 };


// GET  /quizes
exports.index = function(req, res) {
   var buscar = req.query.search;
   var search = ('%'+ buscar + '%').replace('undefined','').replace(/ /g,'%');

   models.Quiz.findAll({
	where:["pregunta like ?",search],
	order:"pregunta ASC"}).then(
      function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }
   ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};


// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
     resultado = 'Correcto';
  } 
  res.render('quizes/answer',
                 { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build( // crea objeto quiz
      {tema: "", pregunta: "", respuesta: ""}
  ); 
  res.render('quizes/new',
                 {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.tema = req.body.quiz.tema;
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
     function(err){
        if (err) {
           res.render('quizes/edit',
                 { quiz: req.quiz, errors: err.errors});
        } else {
           req.quiz  // save: guarda campos pregunta y respuesta en DB
           .save( {fields: ["tema", "pregunta", "respuesta"]})
           .then( function(){ res.redirect('/quizes');}); 
        }   // Redirección HTTP a lista de preguntas (URL relativo)
      }
    );
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(
    function(err) {
      if (err) {
         res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        // guarda en DB los campos pregunta y respuesta de quiz
        quiz
          .save({fields: ["tema", "pregunta", "respuesta"]})
          .then(function(){
             res.redirect('/quizes')});  
      }   // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; //autoload de instancia de quiz
  res.render('quizes/edit',
                 { quiz: quiz, errors: []});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
   req.quiz.destroy().then( function() {
      res.redirect('/quizes');
   }).catch(function(error){next(error)});
};



// GET /author
exports.credits = function(req, res) {
  res.render('author', {creditos: 'Web De Juegos Quizes. By Marta Garcia', errors: []});
};