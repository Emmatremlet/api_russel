var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
const fs = require('fs');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
const mongodb = require('./db/mongo');
const Catway = require('./models/catways');

const dataPath = path.join(__dirname, 'data', 'catways.json');
const catwaysData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));


mongodb.initClientDbConnection();

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((err, req, res, next) => {
    console.error('Erreur :', err); 
    res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' });
});

const insertData = async () => {
  try {
    for (const newCatway of catwaysData) {
      const existingCatway = await Catway.findOne({ catwayNumber: newCatway.catwayNumber });
      if (!existingCatway) {
        await Catway.create(newCatway);
      }
    }
    console.log('Données insérées sans doublons !');
  } catch (err) {
    console.error("Erreur d'insertion", err);
  }
};

insertData();

module.exports = app;
