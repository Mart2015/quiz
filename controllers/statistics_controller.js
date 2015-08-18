var models = require('../models/models.js');

// GET /statistics
exports.index = function(req, res) {
  var total_preguntas = 0;
  var total_comentarios = 0;
  var promedio_comentarios = 0;
  var preguntas_comentadas = 0;
  var comentarios_publicados = 0;
  var comentarios_nopublicados = 0;

   // obtenemos total_preguntas
   models.Quiz.count().then( 
      function(total_preguntas) {

        // obtenemos total_comentarios
        models.Comment.findAll({
              group:['Comment.id']
                }).then( 
          function(comentarios) {
             total_comentarios = comentarios.length;
             promedio_comentarios = total_comentarios/total_preguntas;

                         for (var i in comentarios) {
                           if (Boolean(comentarios[i].publicado)) {
                             comentarios_publicados = comentarios_publicados+1;
                           } else {
                             comentarios_nopublicados = comentarios_nopublicados+1;
                           }
                         }


             // obtenemos preguntas_comentadas
             models.Quiz.findAll({
               include: [{ model: models.Comment, required: true }], // incluye todos los comentarios asociados a traves del model
               group:['Quiz.id', 'Comments.id']
                }).then(
                   function(total_comentadas) { 
                   
                   preguntas_comentadas = total_comentadas.length;
                   // obtenemos preguntas sin comentar
                   preguntas_sincomentar = total_preguntas - preguntas_comentadas;

                   // renderizamos pasando los datos obtenidos
                   res.render('statistics/index.ejs', {total_quizes: total_preguntas, 
                                                   total_comments: total_comentarios,
                                                   comments_average: promedio_comentarios,
                                                   quizes_commented: preguntas_comentadas,
                                                         comments_published: comentarios_publicados,
                                                         comments_unpublished: comentarios_nopublicados,
                                                   quizes_uncommented: preguntas_sincomentar, errors: []});
                 } // cierre de function(preguntas_comentadas) {
               ).catch(function(error) {next(error);}); // cierre de models.Quiz.count({
          } // cierre de function(total_comentarios) {
         ).catch(function(error) {next(error);}); // cierre de models.Comment.count().then(
        } // cierre de function(total_preguntas) {
   ).catch(function(error) { next(error);}); // cierre de models.Quiz.count().then(

};




