const Vacante = require('../models/vacantes');

const formularioNuevaVacante = (req, res) => {

    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario para publicar una nueva vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    });

}

const agregarVacante = async(req, res) => {

    const vacante = new Vacante(req.body);

    //Usuario autor de la vacante
    vacante.autor = req.user._id;

    //crear arreglo de skills
    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);

}

const mostrarVacante = async(req, res, next) => {

    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor').lean();

    if(!vacante) return next();

    res.render('vacante',{
        nombrePagina: vacante.titulo,
        barra: true,
        vacante
    })


}

const formEditarVacante = async(req, res, next) => {

    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    if(!vacante) return next();

    res.render('editar-vacante',{
        nombrePagina: `Editar - ${vacante.titulo}`,
        // barra: true,
        vacante,
        cerrarSesion: true,
        nombre: req.user.nombre
    });

}

const editarVacante = async(req, res) => {
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada, {
        new: true,
        runValidators: true
    });

    res.redirect(`/vacantes/${vacante.url}`);

}

const eliminarVacante = async(req, res) => {
    const {id} = req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante,req.user)){
        vacante.remove();
        res.status(200).send('Vacante eliminada');
    }else{
        res.redirect('/');
        res.status(403).send('Error');
    }

}

const verificarAutor = (vacante = {}, usuario = {})=>{
    if(vacante.autor.equals(usuario._id)){
        return true;
    }
    return false;
}

const contactar = async(req,res,next)=>{
    const {url} = req.params;
    const vacante = await Vacante.findOne({url});

    if(!vacante) return next();

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename,
        fecha: new Date()
    }

    //almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    //Mensaje flash y redireccion
    req.flash('correcto', 'Se ha enviado tu solicitud');
    res.redirect('/');

}

const mostrarCandidatos = async(req,res,next)=>{
    const {id} = req.params;
    const vacante = await Vacante.findById(id).lean();

    if(!vacante) return next();

    if(!verificarAutor(vacante,req.user)){
        return res.redirect('/');
    }

    res.render('candidatos',{
        nombrePagina: `Candidatos - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    });

}
module.exports ={
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    eliminarVacante,
    contactar,
    mostrarCandidatos
}