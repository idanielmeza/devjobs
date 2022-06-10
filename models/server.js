const express = require('express')
const {engine} = require('express-handlebars')
const conectarDB = require('../config/db');
const path = require('path')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const passport = require('../config/passport');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 4000;

        this.path ={
            home: '/',
            vacantes: '/vacantes',
            auth: '/auth',
            users: '/users'
        }

        this.DB();

        this.midlewares();
        this.router();
        
        
    }

    async DB(){
        await conectarDB();
        console.log('Conectado a la base de datos')
    }

    midlewares(){
        //Habilitar handlebars

        this.app.engine('handlebars', engine({
            defaultLayout: 'layout',
            helpers: require('../helpers/handlebars')
        }));
        this.app.set('view engine', 'handlebars');

        //Static files
        this.app.use(express.static(path.join(__dirname, '../public')));

        //Body parser
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));

        this.app.use(cookieParser());
        this.app.use(session({
            secret: process.env.SECRETKEY,
            key: process.env.KEY,
            resave: false,
            saveUninitialized: false,
            store:  MongoStore.create({
                mongoUrl: process.env.DATABASE
            })
        }));

        //Inicializar passport
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        
        this.app.use(flash());

        this.app.use((req,res,next) => {
            res.locals.mensajes = req.flash();
            next();
        });

    }

    router(){
        this.app.use(this.path.home, require('../routes/home'));
        this.app.use(this.path.vacantes, require('../routes/vacantes'));
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.users, require('../routes/users'));
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log('Server on port', process.env.PORT)
        })
    }

}

module.exports = Server;