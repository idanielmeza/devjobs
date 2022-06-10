const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},async(email,password,done)=>{
    const usuario = await Usuario.findOne({email});
    if(!usuario) return done(null,false,{
        message: 'El usuario no existe'
    });

    const verificarPassword = await usuario.compararPassword(password);

    if(!verificarPassword) return done(null,false,{
        message: 'Contraseña incorrecta'
    });

    //Si todo es correcto
    return done(null,usuario);

}));

passport.serializeUser((usuario,done)=>{done(null,usuario._id)});

passport.deserializeUser(async(id,done)=>{
    const usuario = await Usuario.findById(id);
    done(null,usuario);
});

module.exports = passport;