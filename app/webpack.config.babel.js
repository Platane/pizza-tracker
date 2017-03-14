const path = require('path')
const webpack = require('webpack')

const production = 'production' == process.env.NODE_ENV

module.exports = {

    entry   : {
        'index'     : [ './src/index.js', './src/index.html' ],
    },

    output  : {
        path        : path.join(__dirname, 'dist'),
        filename    : '[name].js'
    },

    module  : {

        rules: [
            {
                test: /\.js$/,
                use : [
                    {
                        loader  : 'babel-loader',
                        // options : {
                            // presets: ['es2015', 'stage-1', 'react'],
                        // }
                    },
                ],
            },

            {
                test: /\.glsl$/,
                use : [
                    {
                        loader  : 'raw-loader',
                    },
                ],
            },

            {
                test: /\.html?$/,
                use : [
                    {
                        loader  : 'file-loader',
                        options : {
                            name: '[name].html',
                        }
                    },
                    {
                        loader  : 'html-minify-loader',
                    },
                ],
            },

            {
                test: /\.css$/,
                use : [
                    {
                        loader  : 'style-loader',
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            modules         : true,
                            importLoaders   : 1,
                            localIdentName  : production
                                ? '[hash:6]'
                                : '[path][name]---[local]'
                            ,
                        },
                    },
                    {
                        loader  : 'postcss-loader',
                        options : {},
                    },
                ],
            },

        ],
    },

    plugins : [

        new webpack.DefinePlugin({

            // env var
            ...(
                [
                    'NODE_ENV',
                    'SOURCE_URL',
                ]
                    .reduce( (o,name) =>
                        !(name in process.env)
                            ? o
                            : { ...o, [ 'process.env.'+name ] : `'${ process.env[ name ] }'`}
                    ,{})
            ),
        })
    ],

    devtool : 'source-map',
}
