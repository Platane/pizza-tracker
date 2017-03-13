import https            from 'https'
import http             from 'http'
import * as querystring from 'querystring'


export type Options = {
    method  ?: 'GET' | 'POST' | 'PATCH',
    pathname?: string,
    host     : string,
    port    ?: number,
    protocol?: 'https:' | 'http:',
    headers ?: Object,
    query   ?: Object,
    body    ?: string,

    json    ?: boolean,
}

export const request = ( options: Options ): Promise<any> =>

    new Promise( (resolve, reject, onCancel) => {

        const req = ( options.protocol == 'https:' ? https : http )

            .request({ path: `${ options.pathname||'/' }?${ querystring.stringify( options.query || {} ) }`, ...options }, res => {

                let s=''

                res.setEncoding('utf8')
                res.on('data', chunk => s+=chunk )
                res.on('end', () => {

                    if ( res.statusCode != 200 )
                        reject( s )

                    if ( options.json ) {
                        try{
                            resolve( JSON.parse( s ) )
                        }
                        catch( err ){
                            reject( err )
                        }

                    } else
                        resolve( s )
                })

            })
            .on('error', reject )

        if( options.body )
            req.write( options.body )

        req.end()
        onCancel && onCancel( () => req.abort() )
    })
