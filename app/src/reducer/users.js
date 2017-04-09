
import type {Action}            from '../action'
import type {UserInfo, Count}   from '../type/commonType'

export type State = Array<UserInfo>


const START_DATE = (new Date('2017-01-01T00:00:00.100Z')).getTime()
const END_DATE   = (new Date('2017-12-31T23:59:59.100Z')).getTime()

const estimateCounts = ( counts: Array<Count> ) : Array<Count> => {

    const now = Math.min( Date.now(), END_DATE )

    const max = counts[counts.length-1].count
    const count_frequency = counts.length / ( now - START_DATE )

    const l = Math.max( 0, END_DATE - now ) * count_frequency * ( 0.9 + Math.random() * 0.2 )

    let m = max
    let d = now
    const next = []

    for ( let i=0; i< l; i++ )
        next.push({
            date        : ( d = Math.min( END_DATE -1000, d + ( END_DATE - d )/( l-i ) * ( 0.1 + Math.random() * 2 ) ) ),
            tweet_id    : null,
            count       : ( m = m + Math.ceil( max/counts.length * (0.5 + Math.random() * 1.3 ) ) ),
        })

    return [
        { date: START_DATE, count: 0, tweet_id: null },
        ...counts,
        { date: now-1000, count: max, tweet_id: null },
        { date: now+1000, count: max, tweet_id: null },
        ...next,
        { date: END_DATE, count: m, tweet_id: null },
    ]

}

export const reducer = ( state: State, action: Action ) : State => {

    switch( action.type ){

        case 'initHistory' :
            return [
                {
                    userName            : action.userName,
                    counts              : action.counts,
                    estimated_counts    : estimateCounts( action.counts ),
                },
                ...state.filter( x => x.userName != action.userName )
            ]

        default :
            return state || []

    }
}