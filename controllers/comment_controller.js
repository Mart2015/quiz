var models = require ('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
   models.Comment.find({
      where: {
         id: Number(commentId)
      }
   }).then(function(comment) {
      if (comment) {
         req.comment = comment;
         next();
      } else {
         next(new Error('No existe commentId=' + commentId))
      }
   }).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
      res.render('comments/new.ejs', {quizid: req.params.quizId, errors:[]});
};


// POST /quizes/:quizId/comments

exports.create = function(req, res) {
  if (!req.body.comment.texto){
    req.body.comment.texto = "comentario no valido. No publicar";
  }
  var comment= models.Comment.build(
       { texto: req.body.comment.texto,
         QuizId: req.params.quizId
       });

  comment
  .validate()
  .then(
    function(err) {
      if (err) {
         res.render('comments/new.ejs',
              {comment: comment,
               quizId: req.params.quizId,
               errors: err.errors
              });
      } else {
        // guarda en DB los campos pregunta y respuesta de quiz
        comment
          .save()
          .then(function(){
             res.redirect('/quizes/'+req.params.quizId)})
      }   // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET  /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
   req.comment.publicado = true;

   req.comment.save( {fields: ["publicado"]})
      .then(function(){ res.redirect('/quizes/'+req.params.quizId);})
      .catch(function(error){next(error)});
};

// quizes/quizId
exports.destroy = function(req, res){
	req.comment.destroy().then( function() {
		res.redirect('/quizes/'+req.params.quizId); // ponemos quizId para que se quede en los comentarios de la pregunta
	}).catch(function(error){ next(error)});
};
