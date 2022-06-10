const {Router} = require('express');
const {mostrarTrabajos} = require('../controllers/homeController');
const {mostrarPanel} = require('../controllers/authController');
const {autenticado} = require('../middlewares/autenticado');

const router = Router();

router.get('/', mostrarTrabajos);

router.get('/administracion',[
    autenticado
],mostrarPanel)

module.exports = router;