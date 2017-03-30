/* global fetch */
import { createStore, applyMiddleware, compose } from 'redux'
import ReactDOM                 from 'react-dom'
import {Provider}               from 'react-redux'
import React                    from 'react'
import {reduce}                 from './reducer'
import * as action              from './action'
import * as config              from './config'
import {App}                    from './component/app'

import regeneratorRuntime       from 'regenerator-runtime'

import type {State}             from './reducer'
export type {State}             from './reducer'
import type {Action}            from './action'
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

export type Store       = ReduxStore<State, Action>
export type Dispatch    = ReduxDispatch<Action>

let store
{
    const crashReporter = store => next => action => {
        try {
            return next(action)
        } catch (err) {
            console.error('Caught an exception!', err)
            throw err
        }
    }

    // create redux store
    const middlewares = [
        crashReporter,
    ]
    const enhancers = [
        ...(
            'undefined' != typeof window && window.__REDUX_DEVTOOLS_EXTENSION__
            ? [ window.__REDUX_DEVTOOLS_EXTENSION__({ maxAge: 50, latency: 500 }) ]
            : []
        ),
        applyMiddleware( ...middlewares ),
    ]
    store = createStore( reduce, compose( ...enhancers ) )
}

{
    ReactDOM.render( <Provider store={store}><App /></Provider>, document.getElementById('app') )
}



(( dispatch:Dispatch, users ) => {

    dispatch(
        action.initHistory([
            {count: 0, date: (new Date('2017-01-01')).getTime(), tweet_id: 'a'},
            {count: 1, date: (new Date('2017-02-01')).getTime(), tweet_id: 'a'},
            {count: 2, date: (new Date('2017-02-21')).getTime(), tweet_id: 'a'},
            {count: 2.4, date: (new Date('2017-03-01')).getTime(), tweet_id: 'a'},
            {count: 2.7, date: (new Date('2017-03-21')).getTime(), tweet_id: 'a'},
            {count: 3, date: (new Date('2017-07-01')).getTime(), tweet_id: 'a'},
            {count: 4, date: (new Date('2017-07-11')).getTime(), tweet_id: 'a'},
            {count: 6, date: (new Date('2017-07-21')).getTime(), tweet_id: 'a'},
            {count: 9, date: (new Date('2017-08-21')).getTime(), tweet_id: 'a'},
        ], 'tim' )
    )

    // dispatch( action.allHistoryInited() )

    dispatch(
        action.initHistory([
            {count: 1, date: (new Date('2017-01-01')).getTime(), tweet_id: 'a'},
            {count: 7, date: (new Date('2017-10-01')).getTime(), tweet_id: 'a'},
        ], 'jim' )
    )

    Promise.all(
        users
            .map( async ({ userName, data_url }) => {

                const data = await ( await fetch( data_url ) ).text()

                const counts = data
                    .split('\n')
                    .map( line => {

                        const [ date, tweet_id, count ] = line.split(' ')

                        return tweet_id && tweet_id != '---' ? { date: +date, tweet_id, count: +count } : null
                    })
                    .filter( Boolean )

                dispatch( action.initHistory( counts, userName ) )
            })
    )
        .then( () => dispatch( action.allHistoryInited() ) )

})( store.dispatch, config.users )
