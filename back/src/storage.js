import {request}                from './request'
import type { Count, UserInfo } from './commonType'
import regeneratorRuntime       from 'regenerator-runtime'

type Config = {
    token                   : string,
    gist_id                 : string,
}

const parseFile = ( text: string ): {counts: Array<Count>, lastCheckDate: ?number} => {

    let lastCheckDate = null

    const counts = text
        .split(/\n/)
        .map( line => {

            const [ date, tweet_id, count ] = line.split(' ')

            lastCheckDate = Math.max( +lastCheckDate, +date )

            return tweet_id && tweet_id != '---' ? { date: +date, tweet_id, count: +count } : null
        })
        .filter( Boolean )

    return {counts, lastCheckDate}
}

const formatFile = ( counts: Array<Count>, lastCheckDate: ?number ): string  =>
    ( lastCheckDate ? lastCheckDate + ' ---\n' : '' )
    +
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
                        ...parseFile( data.files[userName].content ),
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
                            [user.userName]: { content: formatFile( user.counts, user.lastCheckDate ) },
                        })
                    , {} )
                }),
                json        : true
            })

            return Object.keys( data.files )
                .map( userName =>
                    ({
                        userName,
                        ...parseFile( data.files[userName].content ),
                    })
                )
        },
    }
}