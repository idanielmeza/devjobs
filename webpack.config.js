const path = require('path');
const webpack = require('webpack');


module.exports = {

    entry: {
        entry: './public/js/app.js',
    },
    output:{
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist' )
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }

}