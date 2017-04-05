import React                    from 'react'
import style                    from './style.css'

const EMBEDDED_OPTIONS = {
    conversation    : 'none',
    'link-color'    : '#4d107b',
}

export class Tweet extends React.Component {

    state = {
        twttr : null,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.tweet_id != this.props.tweet_id
            ||
            nextState.twttr != this.state.twttr
    }

    componentDidMount(){

        const t = window.twttr = window.twttr || {}

        if ( !document.getElementById('twitter-wjs') ) {

            const script = document.createElement('script')
            script.id = 'twitter-wjs'
            script.src = 'https://platform.twitter.com/widgets.js'

            // this will be accessed by twitter widget
            t.ready = fn => t._e.push(fn)
            t._e = []

            document.body.appendChild(script)
        }

        t.ready( twttr => this.setState({ twttr }) )

    }

    componentDidUpdate() {

        if ( this.state.twttr && this.refs.container ) {

            this.state.twttr.widgets.createTweet( this.props.tweet_id, this.refs.container, EMBEDDED_OPTIONS )
        }
    }

    render(){
        return <div className={style.container} ref="container"/>
    }
}