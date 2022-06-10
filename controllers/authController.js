const Usuario = require('../models/usuarios');
const Vacante = require('../models/vacantes');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {enviarEmail} = require('../handlers/email');

const formSingup = (req, res) => {

    res.render('crear-cuenta',{
        nombrePagina: 'Crear Cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis, solo registrate'
    })

}

const crearUsuario = async (req, res, next) => {

    const usuario = new Usuario(req.body);

    try {
        await usuario.save();
        res.redirect('/auth/singin');
    } catch (error) {
        req.flash('error', error)
        res.reditect('/auth/singup');
    }

}

const formSingin = (req, res) => {

    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesion'
    })


}

const authUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/auth/singin',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

const mostrarPanel = async(req, res) => {
    
    //consultar usuario autenticado
    const vacantes = await Vacante.find({autor: req.user.id}).lean();
    
        res.render('administracion',{
            nombrePagina: 'Panel de Administracion',
            tagline: 'Crea y administra tus vacantes',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            vacantes,
        })
    
}

const formEditarPerfil = (req, res) => {

    res.render('editar-perfil',{
        nombrePagina: 'Editar Perfil',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre,
    })


}

const editarPerfil = async (req, res) => {
    const usuario = await Usuario.findById(req.user._id);
    
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;

    if(req.body.password){
        usuario.password = req.body.password;
    }

    if(req.file){
        if(usuario.imagen){
            try{
                fs.unlinkSync(path.join(__dirname, '../public/uploads/perfiles/', usuario.imagen));
            }catch(e){
                console.log(e);
            }
            
        }
        usuario.imagen = req.file.filename;
    }

    await usuario.save();
    req.flash('correcto','Se actualizaron los datos correctamente');

    //redirect
    res.redirect('/administracion');

}

const logout = (req, res) => {
    req.logout();
    req.flash('correcto','Se cerró sesión correctamente');
    return res.redirect('/');
}

const restablecerPassword = (req, res) => {
    res.render('restablecer-password',{
        nombrePagina: 'Recupera tu contraseña',
        tagline: 'Si olvidaste tu contraseña ingresa tu correo para restablecerla'
    });
}

const enviarToken = async(req,res,next)=>{

    const usuario = await Usuario.findOne({email: req.body.email});

    if(!usuario){
        req.flash('error', 'No existe un usuario con ese correo');
        return res.redirect('/auth/singin');
    }

    //El usuario existe generar token
    usuario.token = crypto.randomBytes(6).toString('hex');
    usuario.expira = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `${req.headers.origin}/auth/restablecer-password/${usuario.token}`;

    //Enviar email
    await enviarEmail({
        usuario,
        subject: 'Restablecer contraseña',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Se ha enviado un correo con un enlace para restablecer la contraseña');
    res.redirect('/auth/singin')
}

const formRestablecerPassword = async(req,res,next)=>{

    const usuario = await Usuario.findOne({token: req.params.token}).where('expira').gt(Date.now());

    if(!usuario){
        req.flash('error', 'El token es inválido o ha expirado');
        return res.redirect('/auth/restablecer-password');
    }

    //Mostrar formulario
    res.render('nuevo-password',{
        nombrePagina: 'Nueva contraseña'
    })

}

const actualizarPassword = async(req,res,next)=>{
    const usuario = await Usuario.findOne({token: req.params.token}).where('expira').gt(Date.now());

    if(!usuario){
        req.flash('error', 'El token es inválido o ha expirado');
        return res.redirect('/auth/restablecer-password');
    }

    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;
    
    await usuario.save();

    req.flash('correcto', 'Se actualizó la contraseña correctamente');
    res.redirect('/auth/singin');


}

module.exports = {
    formSingup,
    crearUsuario,
    formSingin,
    authUsuario,
    mostrarPanel,
    formEditarPerfil,
    editarPerfil,
    logout,
    restablecerPassword,
    enviarToken,
    formRestablecerPassword,
    actualizarPassword

}