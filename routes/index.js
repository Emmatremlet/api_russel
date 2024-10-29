var express = require('express');
var router = express.Router();
var userRoute = require('../routes/users');
var catwayRoute = require('../routes/catways');
var catwayService = require('../services/catways');
var userService = require('../services/users');
const private = require('../middlewares/private');

router.use(private.checkJWT);

router.get('/', async (req, res) => {
  res.render('index', { titlePage: 'Accueil', user: req.user});
})

/* GET catways page avec données de catways */
router.get('/catways', private.checkJWT, async (req, res, next) => {
  try {
    const catwaysData = await catwayService.getAll(); 
    res.render('catwaysList', { titlePage: 'Liste des catways', data: catwaysData, user: req.user });
  } catch (error) {
      next(error);
  }
});

// Route pour afficher le formulaire d'ajout
router.get('/catways/add', private.checkJWT, (req, res) => {
  res.render('addCatways', {titlePage: 'Ajouter un catway', user: req.user});
});

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
        await userService.authenticate(req, res, next); 
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
    console.error(error); 
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



router.use('/users', userRoute);
router.use('/catways', catwayRoute);

module.exports = router;
