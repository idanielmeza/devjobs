const mongoose = require('mongoose');


const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicar la base de datos');
    }
    
}



module.exports = conectarDB;
