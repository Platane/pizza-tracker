const fs = require('fs')
const aws = require('aws-sdk')
const path = require('path')
const createZip = require('jszip')
const rollup = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')

const babel_options = {
    babelrc : false,
    exclude: [
        'node_modules/**',
        '*.json'
    ],
    presets : [
        'flow',
        // [ 'es2015', {modules: false} ],
        'es2015-rollup',
        'stage-1',
    ],
    plugins : [
        'transform-async-to-generator',
    ],
}

rollup.rollup({
    entry           : './.tmp/lambdaWrapper.js',
    external        : [
        'fs',
        'querystring',
        'zlib',
        'url',
        'crypto',
        'stream',
        'events',
        'path',
        'http',
        'https',
    ],
    plugins         : [
        json(),
        babel(babel_options),
        nodeResolve({ main: true, preferBuiltins: true }),
        commonjs(),
    ]
})

    .then( bundle => bundle.generate({ format: 'cjs' }).code )

    .then( content => {

        const zip = createZip()

        zip.file('index.js', content)

        return zip.generateAsync({
            type        : 'nodebuffer',
            platform    : process.platform,
            compression : 'DEFLATE',
        })
    })

    // .then( content => fs.writeFileSync('./pack.zip', content) )

    .then( content => {
        const lambda = new aws.Lambda({
            apiVersion  : '2015-03-31',
            region      : 'eu-west-1',
        })


        return new Promise((resolve,reject) =>
            lambda.updateFunctionCode(
                {
                    FunctionName: 'pizza-update',
                    ZipFile     : content,
                    Publish     : false,
                },
                ( err, data ) => err ? reject( err ) : resolve( data )
            )
        )
    })

    .catch(err => {
        console.log(err)
        process.exit(1)
    })
