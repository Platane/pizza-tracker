import {connect}        from 'react-redux'
import {TweetList as C} from './component'
import {statify}        from './state'

import type {State, Dispatch}       from '../../index'

const mapStateToProps = ( state: State ) => {

    const tweets = [].concat(
        ...state.users.map( ({counts}, i ) =>
            counts.map( ({date, tweet_id}) => ({date, tweet_id}) )
        )
    )
        .filter( x => x.tweet_id )
        .sort( (a, b) => a.date > b.date ? 1 : -1 )

    return {
        tweets,
        k:state.timeCursor.k
    }
}

const mapDispatchToProps = ( dispatch: Dispatch ) =>
    ({

    })

const connector = connect(mapStateToProps, mapDispatchToProps)

export const TweetList = connector( statify( C ) )