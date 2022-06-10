const {model, Schema} = require('mongoose');
const slug = require('slug');
const shortid = require('shortid');

const vacanteSchema = new Schema({
    titulo:{
        type: String,
        required: [true, 'El nombre de la vacante es necesario'],
        trim: true
    },
    empresa:{
        type: String,
        trim: true
    },
    ubicacion:{
        type: String,
        trim: true,
        required: [true, 'La ubicacion es necesaria']
    },
    salario:{
        type: String,
        default: 0,
        trim: true
    },
    contrato:{
        type: String,
        trim: true
    },
    descripcion:{
        type: String,
        trim: true
    },
    url:{
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor:{
        type: Schema.ObjectId,
        ref: 'Usuarios',
        required: [true, 'El autor es necesario']
    }
});

vacanteSchema.pre('save', function(next){
    //Generar url
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;

    next();
})


module.exports = model('Vacante', vacanteSchema);