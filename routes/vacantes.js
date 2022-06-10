const {Router} = require('express');
const {formularioNuevaVacante, agregarVacante,mostrarVacante, formEditarVacante, editarVacante, eliminarVacante, contactar, mostrarCandidatos, buscarVacantes} = require('../controllers/vacantesController');
const {autenticado} = require('../middlewares/autenticado');
const {check} = require('express-validator');
const {validarVacantes} = require('../middlewares/validarCampos');
const {subirPDF} = require('../middlewares/uploadFiles');

const router = Router();

router.get('/nueva',[
    autenticado,
] ,formularioNuevaVacante);
router.post('/nueva',[
    
check('titulo', 'El/la titulo es obligatorio').not().isEmpty().escape(),
check('empresa', 'La empresa es obligatorio').not().isEmpty().escape(),
check('ubicacion', 'La es obligatorio').not().isEmpty().escape(),
check('salario').escape(),
check('contrato', 'El contrato es obligatorio').not().isEmpty().escape(),
check('descripcion').escape(),
check('skills').escape(),
validarVacantes,
autenticado,
],agregarVacante);

//Vacante
router.get('/:url', mostrarVacante);

//recibir mensajes de candidatos
router.post('/:url',[
    subirPDF
],contactar)

router.get('/editar/:url',[
    autenticado
],formEditarVacante);

router.post('/editar/:url',[

    check('titulo', 'El/la titulo es obligatorio').not().isEmpty().escape(),
    check('empresa', 'La empresa es obligatorio').not().isEmpty().escape(),
    check('ubicacion', 'La es obligatorio').not().isEmpty().escape(),
    check('salario').escape(),
    check('contrato', 'El contrato es obligatorio').not().isEmpty().escape(),
    check('descripcion').escape(),
    check('skills').escape(),
    validarVacantes,
    autenticado,
    
] ,editarVacante);

router.delete('/eliminar/:id',[

],eliminarVacante);

//mostrar candidatos de la vacante
router.get('/candidatos/:id',[
    autenticado
],mostrarCandidatos);

//buscador
router.post('/buscador', buscarVacantes)

module.exports = router;