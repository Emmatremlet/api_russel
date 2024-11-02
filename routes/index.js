var express = require('express');
var router = express.Router();
var userRoute = require('../routes/users');
var catwayRoute = require('../routes/catways');
var reservationRoute = require('../routes/reservations');
var catwayService = require('../services/catways');
var userService = require('../services/users');
var reservationService = require('../services/reservations');
const authMiddleware = require('../middlewares/private');
const userController = require('../controllers/users');

// Middleware pour vérifier le JWT
router.use(authMiddleware.checkJWT);

/**
 * @route GET /
 * @group Home - Operations about home page
 * @returns {Object} 200 - A rendered homepage
 */
router.get('/', async (req, res) => {
  res.render('index', { titlePage: 'Accueil', user: req.user});
})

/**
 * @route GET /dashboard
 * @group Dashboard - Operations about the dashboard
 * @returns {Object} 200 - A rendered dashboard page with catway data
 * @returns {Error} 500 - Internal server error
 */
router.get('/dashboard', authMiddleware.checkJWT, async (req, res, next) => {
    try {
        const dataCatway = await catwayService.getAll();
        res.render('dashboard', { titlePage: 'Tableau de bord', user: req.user, dataCatway, catway: null, reservation: null });
    } catch (error) {
        next(error);
    }
});

/**
 * @route POST /dashboard
 * @group Dashboard - Operations about the dashboard
 * @param {string} catwayNumberUpdate.body - Catway number to update
 * @param {string} clientName.body - Client name to search reservations
 * @returns {Object} 200 - A rendered dashboard page with searched catway and reservation
 * @returns {Error} 500 - Internal server error
 */
router.post('/dashboard', authMiddleware.checkJWT, async (req, res, next) => {
    try {
        const dataCatway = await catwayService.getAll();
        const { catwayNumberUpdate, clientName } = req.body;
        

        const catway = catwayNumberUpdate ? await catwayService.findByCatwayNumber(catwayNumberUpdate) : null;
        const reservation = clientName ? await reservationService.findByClientName(clientName) : null;

        res.render('dashboard', {
            titlePage: 'Tableau de bord',
            user: req.user,
            dataCatway,
            catway: catway || null,
            reservation: reservation || null
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /catways/list
 * @group Catways - Operations about catways
 * @returns {Object} 200 - A rendered page with the list of catways
 * @returns {Error} 500 - Internal server error
 */
router.get('/catways/list', authMiddleware.checkJWT,async (req, res, next) => {
  const catwaysData = await catwayService.getAll(); 
  res.render('catwaysList', { titlePage: 'Liste des catways', data: catwaysData, user: req.user});
})

/**
 * @route GET /reservations/list
 * @group Reservations - Operations about reservations
 * @returns {Object} 200 - A rendered page with the list of reservations
 * @returns {Error} 500 - Internal server error
 */
router.get('/reservations/list', authMiddleware.checkJWT,async (req, res, next) => {
  const dataReservations = await reservationService.getAll(); 
  res.render('reservationsList', { titlePage: 'Liste des réservations', dataReservations, user: req.user});
})

/**
 * @route GET /catways/:id/update
 * @group Catways - Operations about catways
 * @param {string} id.path.required - Catway ID
 * @returns {Object} 200 - A rendered form for updating the catway
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/catways/:id/update', authMiddleware.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const catway = await catwayService.getById(req.params.id);
    res.render('updateCatways', { titlePage: 'Modifier Catway', catway, user });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /catways/:id/details
 * @group Catways - Operations about catways
 * @param {string} id.path.required - Catway ID
 * @returns {Object} 200 - A rendered page with catway details
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/catways/:id/details', authMiddleware.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const catway = await catwayService.getById(req.params.id);
    res.render('catwayDetails', { titlePage: 'Détails du Catway', catway, user });
  } catch (error) {
    next(error);
  }
});


/**
 * @route GET /reservations/:id/details
 * @group Reservations - Operations about reservations
 * @param {string} id.path.required - Reservation ID
 * @returns {Object} 200 - A rendered page with reservation details
 * @returns {Error} 404 - Reservation not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/reservations/:id/details', authMiddleware.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const reservation = await reservationService.getById(req.params.id);
    res.render('reservationDetails', { titlePage: 'Détails de la réservation', reservation, user });
  } catch (error) {
    next(error);
  }
});


/**
 * @route GET /users/add
 * @group Users - Operations about user registration
 * @returns {Object} 200 - A rendered form for user registration
 * @returns {Error} 500 - Internal server error
 */
router.get('/users/add', (req, res, next) => {
  try {
    const user = req.user || null;
    res.render('signUp', { titlePage: 'S\'inscrire', user });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /users/signin
 * @group Users - Operations about user login
 * @returns {Object} 200 - A rendered form for user login
 * @returns {Error} 500 - Internal server error
 */
router.get('/users/signin', async (req, res, next) => {
  try {
    const user = req.user || null;
    res.render('signIn', { titlePage: 'Se connecter', user});
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /users/authenticate
 * @group Users - Operations about user authentication
 * @param {User.model} user.body.required - User credentials for authentication
 * @returns {Object} 200 - Authentication successful
 * @returns {Error} 401 - Authentication failed
 */
router.post('/users/authenticate', async (req, res, next) => {
    try {
        await userController.authenticate(req, res); 
    } catch (error) {
        res.status(401).json({ message: 'Échec de l\'authentification' });
    }
});

/**
 * @route GET /logout
 * @group Users - Operations about user session
 * @returns {Object} 200 - User successfully logged out
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/'); 
});

/**
 * @route GET /users/:id/account
 * @group Users - Operations about user account
 * @param {string} id.path.required - User ID
 * @returns {Object} 200 - A rendered page with user account information
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/users/:id/account', async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.render('account', { titlePage: 'Mon compte', user });
  } catch (error) {
    next(error);
  }
});


/**
 * @route GET /users/:id/update
 * @group Users - Operations about updating user information
 * @param {string} id.path.required - User ID
 * @returns {Object} 200 - A rendered form for updating user information
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/users/:id/update', async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.render('updateUsers', { titlePage: 'Modifier les informations', user });
  } catch (error) {
    next(error);
  }
})

/**
 * @route GET /reservations/:id/update
 * @group Reservations - Operations about updating reservations
 * @param {string} id.path.required - Reservation ID
 * @returns {Object} 200 - A rendered form for updating the reservation
 * @returns {Error} 404 - Reservation not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/reservations/:id/update', async (req, res, next) => {
  try {
    const dataCatway = await catwayService.getAll();
    const reservation = await reservationService.getById(req.params.id);
    res.render('updateReservations', { titlePage: 'Modifier la réservation', reservation, dataCatway, user : req.user });
  } catch (error) {
    next(error);
  }
})

// Mount user, catway, and reservation routes
router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute);

module.exports = router;
