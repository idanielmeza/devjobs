const { validationResult } = require('express-validator');
const Vacante = require('../models/vacantes');

const validarCampos = (req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        req.flash('error', errors.array().map(error => error.msg));
        return res.render('crear-cuenta',{
            nombrePagina: 'Crear Cuenta',
            tagline: 'Comienza a publicar tus vacantes gratis, solo registrate',
            mensajes: req.flash()
        })
        
    }
    next();
}

const validarVacantes = async(req,res,next)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('error', errors.array().map(error => error.msg));

        res.render('nueva-vacante',{
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario para publicar una nueva vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })

        return;
    }

    next();
    
}

const validarPerfil = async(req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('error', errors.array().map(error => error.msg));

        res.render('editar-perfil',{
            nombrePagina: 'Editar Perfil',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })

        return;
    }

    next();
}

module.exports = {
    validarCampos,
    validarVacantes,
    validarPerfil
}