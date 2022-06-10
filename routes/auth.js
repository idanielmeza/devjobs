const {Router} = require('express');
const {formSingup, crearUsuario, formSingin, authUsuario, restablecerPassword, enviarToken, formRestablecerPassword, actualizarPassword} = require('../controllers/authController');
const {validarCampos} = require('../middlewares/validarCampos');
const {check} = require('express-validator');

const router = Router();

router.get('/singup', formSingup)
router.post('/singup',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty().escape(),
    check('email', 'El email es obligatorio').isEmail().normalizeEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty().escape(),
    check('password', 'Las contrasenas no coinciden').custom((value,{req})=>{
        if(value !== req.body.password2) throw new Error('Las contrasenas no coinciden');
        return true;

    }),
    validarCampos
] ,crearUsuario)

//Singin

router.get('/singin', formSingin)
router.post('/singin', authUsuario);

router.get('/restablecer-password', restablecerPassword)
router.get('/restablecer-password/:token', formRestablecerPassword)
router.post('/restablecer-password/:token', actualizarPassword)


router.post('/restablecer-password', enviarToken)



module.exports = router;