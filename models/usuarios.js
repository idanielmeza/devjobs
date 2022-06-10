const {model, Schema} = require('mongoose');
const bcrypt = require('bcrypt');

const usuariosSchema = new Schema({
    email:{
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    password:{
        type: String,
        required: [true, 'La contraseña es necesaria'],
        trim: true
    },
    token:{
        type: String
    },
    expira:{
        type: Date
    },
    imagen:{
        type: String
    }
})

//Metodo para hashear los passwords
usuariosSchema.pre('save', async function(next){
    //si el password ya esta hasheado no hacemos nada
    if(!this.isModified('password')){
        return next();
    }
    //Si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//Cuando un usuario esta registrado
usuariosSchema.post('save', function(error,doc,next){
    if(error.name === 'MongoError' && error.code === 11000){
        next('El correo ya esta en uso');

    }else{
        next(error);
    }
})

//Autenticar el usuario
usuariosSchema.methods.compararPassword = async function(password){
    return await bcrypt.compareSync(password, this.password);
}

module.exports = model('Usuarios', usuariosSchema);