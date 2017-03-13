import {request}                from './request'
import type { Count, UserInfo } from './commonType'
import regeneratorRuntime       from 'regenerator-runtime'

type Config = {
    token                   : string,
    gist_id                 : string,
}

const parseFile = ( text: string ): Array<Count> =>
    text
        .split(/\n/)
        .map( line => {

            const [ date, tweet_id, count ] = line.split(' ')

            return tweet_id ? { date: +date, tweet_id, count: +count } : null
        })
        .filter( Boolean )

const formatFile = ( counts: Array<Count> ): string  =>
    counts
        .sort( (a,b) => a.date < b.date ? 1 : -1 )
        .map( ({ date, tweet_id, count }) => [date, tweet_id, count].join(' '))
        .join('\n')

export const create = (config: Config) => {


    return {
        read: async () : Promise<Array<UserInfo>> => {

            const data = await request({
                protocol    : 'https:',
                host        : 'api.github.com',
                headers     : {
                    'User-Agent'    : 'robot',
                },
                pathname    : `/gists/${config.gist_id}`,
                method      : 'GET',
                json        : true
            })

            return Object.keys( data.files )
                .map( userName =>
                    ({
                        userName,
                        counts : parseFile( data.files[userName].content )
                    })
                )
        },

        write: async ( users : Array<UserInfo> ) : Promise<Array<UserInfo>> => {

            const data = await request({
                protocol    : 'https:',
                host        : 'api.github.com',
                headers     : {
                    'User-Agent'    : 'robot',
                    'Authorization' : `token ${config.token}`
                },
                pathname    : `/gists/${config.gist_id}`,
                method      : 'PATCH',
                body        : JSON.stringify({
                    files   : users.reduce( (o,user) =>
                        ({
                            ...o,
                            [user.userName]: { content: formatFile( user.counts ) },
                        })
                    , {} )
                }),
                json        : true
            })

            return Object.keys( data.files )
                .map( userName =>
                    ({
                        userName,
                        counts : parseFile( data.files[userName].content )
                    })
                )
        },
    }
}