import React                    from 'react'

import {computePosition}        from './computePosition'


const MAX_LOADED_TWEETS = 35



/**
 * hold the computed position,
 * hold a set of tweets: thoses already loaded + those which should be loaded
 */
export const statify = C => {

    class TweetListBuffer extends React.Component {

        state = { tweets: [], loaded: {} }

        constructor( props ){
            super(props)

            this.state = { tweets: [], loaded: {} }
        }

        componentWillReceiveProps(nextProps) {

            const tweets = computePosition( nextProps.tweets, nextProps.k )

            let loaded = { ...this.state.loaded }

            const sorted_tweets = tweets
                .slice()
                .sort( (a,b) => a.s < b.s ? 1 : -1 )

            sorted_tweets
                .slice(0,4)
                .forEach( a => loaded[a.tweet_id] = true )

            if ( Object.keys(loaded).length > MAX_LOADED_TWEETS ){

                loaded = {}

                sorted_tweets.slice(0,MAX_LOADED_TWEETS).forEach( a => loaded[a.tweet_id] = true )

            }

            this.setState({ tweets:tweets.filter( x => loaded[x.tweet_id] ), loaded })
        }

        render(){
            return <C {...this.props} {...this.state} />
        }
    }

    return TweetListBuffer
}