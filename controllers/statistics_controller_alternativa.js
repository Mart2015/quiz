var models = require('../models/models.js');

// GET /statistics
exports.index = function(req, res) {
  var total_preguntas = 0;
  var total_comentarios = 0;
  var promedio_comentarios = 0;
  var preguntas_comentadas = 0;
  var preguntas = 0;

   // obtenemos total_preguntas
   models.Quiz.count().then( 
      function(total_preguntas) {

        // obtenemos total_comentarios
        models.Comment.count().then( 
          function(total_comentarios) {
             promedio_comentarios = total_comentarios/total_preguntas;

             // obtenemos preguntas_comentadas con findAll (alternativa a count)
             models.Quiz.findAll({
               include: [{ model: models.Comment, required: true }], // incluye todos los comentarios asociados a traves del model
               group:['Quiz.id','Comments.id']
                }).then(
                   function(QuizesCommented) { 
                   for (var i in QuizesCommented) {
                       
                       preguntas_comentadas=preguntas_comentadas+1;
                   }
                   
                   // renderizamos pasando los datos obtenidos
                   res.render('statistics/index.ejs', {total_quizes: total_preguntas, 
                                                   total_comments: total_comentarios,
                                                   comments_average: promedio_comentarios,
                                                   quizes_commented: preguntas_comentadas, errors: []});
                 } // cierre de function(preguntas_comentadas) {
               ).catch(function(error) {next(error);}); // cierre de models.Quiz.count({
          } // cierre de function(total_comentarios) {
         ).catch(function(error) {next(error);}); // cierre de models.Comment.count().then(
        } // cierre de function(total_preguntas) {
   ).catch(function(error) { next(error);}); // cierre de models.Quiz.count().then(

};




