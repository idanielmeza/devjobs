const multer = require("multer");
const crypto = require('crypto')

const subirImagen = (req, res, next) => {
    
    upload(req,res,function(error){

        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande')
                }else{
                    req.flash('error', error.message)
                }
            }else{
                req.flash('error',error.message)
            }
            return res.redirect('/administracion');
        }else{
            return next();
        }
    });
}

//Opciones de multoer
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,__dirname+'../../public/uploads/perfiles')
        },
        filename: (req,file,cb)=>{
            const extension = file.mimetype.split('/')[1];
            cb(null,`${crypto.randomUUID()}.${extension}`)
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null,true);
        }else{
            cb(new Error('Formato de imagen no valido'));
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

const subirPDF = (req, res, next) => {
    uploadPDF(req,res,function(error){

        if(error){
            console.log(error);
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande')
                }else{
                    req.flash('error', error.message)
                    console.log(error)
                    console.log('hola')
                }
            }else{
                req.flash('error',error.message)
            }
            return res.redirect('back');
        }else{
            return next();
        }
    });
}

//Opciones de multoer
const configuracionMulterPDF = {
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,__dirname+'../../public/uploads/cv')
        },
        filename: (req,file,cb)=>{
            const extension = file.mimetype.split('/')[1];
            cb(null,`${crypto.randomUUID()}.${extension}`)
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            cb(null,true);
        }else{
            cb(new Error('Formato no valido'));
        }
    }
}

const uploadPDF = multer(configuracionMulterPDF).single('cv');



module.exports = {
    subirImagen,
    subirPDF
}