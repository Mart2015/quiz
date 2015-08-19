var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
   { dialect:  protocol, 
     protocol: protocol, 
     port:     port, 
     host:     host, 
     storage:  storage,	// solo SQLite (.env)
     omitNull: true	// solo Postgres
   }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path); //Objeto para acceso a la tabla

Comment.belongsTo(Quiz, { onDelete: 'cascade' }); //1 comentario pertenece a 1 pregunta
Quiz.hasMany(Comment, { onDelete: 'cascade' }); // 1 quiz puede tener muchos comentarios

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment; // exportar el objeto de acceso a la tabla de comentarios

// sequelize.sync() crea e inicializa tabla de preguntas en DB
// sincroniza las definiciones del modelo en fichero quiz.sqlite
sequelize.sync().then(function() {
        // then(..) ejecuta el manejador una vez creada la tabla
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si est� vac�a
            Quiz.create( 
               {tema:      'Humanidades',
                pregunta:  'Capital de Italia',
                respuesta: 'Roma'});
            Quiz.create( 
               {tema:      'Ciencia',
                pregunta: "Dos por tres (en letras)",
                respuesta: 'Seis'});
            Quiz.create( 
               {tema:      'Humanidades',
                pregunta: 'Capital de Portugal',
                respuesta: 'Lisboa'})
            .then(function(){console.log('Base de datos inicializada')});
          };
        });
    });




