var express = require('express');
var router = express.Router();
var userRoute = require('../routes/users');
var catwayRoute = require('../routes/catways');
var reservationRoute = require('../routes/reservations');
var catwayController = require('../controllers/catways');
var catwayService = require('../services/catways');
var userService = require('../services/users');
var reservationService = require('../services/reservations');
const private = require('../middlewares/private');
const userController = require('../controllers/users');


router.use(private.checkJWT);

router.get('/', async (req, res) => {
  res.render('index', { titlePage: 'Accueil', user: req.user});
})

router.get('/dashboard', private.checkJWT, async (req, res, next) => {
    try {
        const dataCatway = await catwayService.getAll();
        res.render('dashboard', { titlePage: 'Tableau de bord', user: req.user, dataCatway, catway: null, reservation: null });
    } catch (error) {
        next(error);
    }
});

router.post('/dashboard', private.checkJWT, async (req, res, next) => {
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

router.get('/catways/list', private.checkJWT,async (req, res, next) => {
  const catwaysData = await catwayService.getAll(); 
  res.render('catwaysList', { titlePage: 'Liste des catways', data: catwaysData, user: req.user});
})

router.get('/reservations/list', private.checkJWT,async (req, res, next) => {
  const dataReservations = await reservationService.getAll(); 
  res.render('reservationsList', { titlePage: 'Liste des réservations', dataReservations, user: req.user});
})



// Route pour afficher le formulaire de modification
router.get('/catways/:id/update', private.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const catway = await catwayService.getById(req.params.id);
    res.render('updateCatways', { titlePage: 'Modifier Catway', catway, user });
  } catch (error) {
    next(error);
  }
});


router.get('/catways/:id/details', private.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const catway = await catwayService.getById(req.params.id);
    res.render('catwayDetails', { titlePage: 'Détails du Catway', catway, user });
  } catch (error) {
    next(error);
  }
});

router.get('/reservations/:id/details', private.checkJWT, async (req, res, next) => {
  try {
    const user = req.user || null;
    const reservation = await reservationService.getById(req.params.id);
    res.render('reservationDetails', { titlePage: 'Détails de la réservation', reservation, user });
  } catch (error) {
    next(error);
  }
});

// Route pour afficher le formulaire d'inscription
router.get('/users/add', (req, res, next) => {
  try {
    const user = req.user || null;
    res.render('signUp', { titlePage: 'S\'inscrire', user });
  } catch (error) {
    next(error);
  }
});

// Route pour afficher le formulaire de connexion
router.get('/users/signin', async (req, res, next) => {
  try {
    const user = req.user || null;
    res.render('signIn', { titlePage: 'Se connecter', user});
  } catch (error) {
    next(error);
  }
});

// Route pour afficher le formulaire de connexion
router.post('/users/authenticate', async (req, res, next) => {
    try {
        await userController.authenticate(req, res); 
    } catch (error) {
        res.status(401).json({ message: 'Échec de l\'authentification' });
    }
});


// Route pour déconnecter l'utilisateur
router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/'); 
});

// Route pour voir son compte
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


router.get('/users/:id/update', async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.render('updateUsers', { titlePage: 'Modifier les informations', user });
  } catch (error) {
    next(error);
  }
})


router.get('/reservations/:id/update', async (req, res, next) => {
  try {
    const dataCatway = await catwayService.getAll();
    const reservation = await reservationService.getById(req.params.id);
    res.render('updateReservations', { titlePage: 'Modifier la réservation', reservation, dataCatway, user : req.user });
  } catch (error) {
    next(error);
  }
})


router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute);

module.exports = router;
