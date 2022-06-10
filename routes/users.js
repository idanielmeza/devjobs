const {Router} = require('express');
const {autenticado} = require('../middlewares/autenticado');
const {formEditarPerfil, editarPerfil, logout} = require('../controllers/authController');
const {validarPerfil} = require('../middlewares/validarCampos');
const {subirImagen} = require('../middlewares/uploadFiles');

const router = Router();

router.get('/editar-perfil',[
    autenticado
],formEditarPerfil)

router.post('/editar-perfil',[
    subirImagen,
    autenticado,
    validarPerfil
],editarPerfil);

router.get('/logout',[autenticado], logout);

module.exports = router;