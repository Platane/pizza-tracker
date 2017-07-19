const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
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
                            presets : [ 'react', 'es2017', 'flow' ],
                            plugins : [
                                'transform-class-properties',
                                'transform-regenerator',
                                'transform-es2015-spread',
                                'transform-es2015-destructuring',
                                'transform-es2015-shorthand-properties',
                                'transform-es2015-block-scoping',
                                'transform-es2015-block-scoped-functions',
                                'transform-es2015-classes',
                                'transform-es2015-parameters',
                                'transform-es2015-template-literals',
                                'transform-es2015-literals',
                                'transform-es2015-arrow-functions',
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

        production && new webpack.optimize.ModuleConcatenationPlugin(),

        production && new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                comments: false,
            }),

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
    ].filter(Boolean),

    devtool : production ? false : 'source-map',
}
