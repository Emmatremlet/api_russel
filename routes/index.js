var express = require('express');
var router = express.Router();
var userRoute = require('../routes/users');
var catwayRoute = require('../routes/catways');
var catwayService = require('../services/catways');

/* GET home page avec données de catways */
router.get('/', async (req, res, next) => {
    try {
      const catwaysData = await catwayService.getAll(); 
      res.render('index', { title: 'Accueil', data: catwaysData });
    } catch (error) {
        next(error);
    }
});

// Route pour afficher le formulaire d'ajout
router.get('/catways/add', (req, res) => {
    res.render('addCatways', {title: 'Ajouter un catway'});
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
module.exports = router;
