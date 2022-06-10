//Revisar si el usuario esta autenticado
const autenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/singin');
}

module.exports = {
    autenticado
}