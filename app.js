/**
 * Module dependencies.
 * @module app
 */

import createError from 'http-errors';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import fs from 'fs';

import { router as indexRouter } from './routes/index.js';
import { router as usersRouter } from './routes/users.js';
import { router as catwaysRouter } from './routes/catways.js';
import { router as reservationsRouter } from './routes/reservations.js';
import { initClientDbConnection } from './db/mongo.js';
import Catway from './models/catways.js';
import Reservation from './models/reservations.js';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Path to JSON data files.
 * @constant {string}
 */
const dataPath = path.join(__dirname, 'data', 'catways.json');
const catwaysData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const dataPath2 = path.join(__dirname, 'data', 'reservations.json');
const reservationsData = JSON.parse(fs.readFileSync(dataPath2, 'utf-8'));

// Initialize MongoDB client connection
await initClientDbConnection();

const app = express();

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware configurations
app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handling
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Log and return JSON error responses
app.use((err, req, res, next) => {
  console.error('Erreur :', err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' });
});

/**
 * Insert catway data into the database if it doesn't already exist.
 * @async
 * @function insertData
 */
const insertData = async () => {
  try {
    for (const newCatway of catwaysData) {
      const existingCatway = await Catway.findOne({ catwayNumber: newCatway.catwayNumber });
      if (!existingCatway) {
        await Catway.create(newCatway);
      }
    }
  } catch (err) {
    console.error("Erreur d'insertion", err);
  }
};

/**
 * Insert reservation data into the database if it doesn't already exist.
 * @async
 * @function insertData2
 */
const insertData2 = async () => {
  try {
    for (const newReservation of reservationsData) {
      const existingReservation = await Reservation.findOne({ catwayNumber: newReservation.catwayNumber });
      if (!existingReservation) {
        await Reservation.create(newReservation);
      }
    }
  } catch (err) {
    console.error("Erreur d'insertion", err);
  }
};

// Call functions to insert data
insertData();
insertData2();

export default app;