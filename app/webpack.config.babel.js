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
                        options : production
                        ? {
                            presets : [ 'react', 'es2017', 'flow', 'babili' ],
                            plugins : [
                                'transform-class-properties',
                                ['transform-es2015-modules-commonjs', {'allowTopLevelThis': true}],
                                'transform-object-rest-spread'
                            ]
                        }
                        : {}
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

        new webpack.DefinePlugin(
                [
                    'NODE_ENV',
                    'SOURCE_URL',
                ]
                    .reduce( (o,name) =>
                        !(name in process.env)
                            ? o
                            : { ...o, [ 'process.env.'+name ] : `'${ process.env[ name ] }'`}
                    ,{})
        )
    ],

    devtool : production ? false : 'source-map',
}
