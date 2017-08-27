import React                    from 'react'
import style                    from './style.css'

const EMBEDDED_OPTIONS = {
    conversation    : 'none',
    'link-color'    : '#4d107b',
}

export type Props = {

    // between 250 and 550
    width       : number,


    tweet_id    : ?string,
}

const removeChildren = domElement => {
    while( domElement.children[0] )
        domElement.removeChild(domElement.children[0])
}

type State = {
    twttr : *,
    loaded: boolean,
    loading: boolean,
}

export class Tweet extends React.Component {

    state : State = {
        twttr   : null,
        loaded  : false,
        loading : false,
    }

    shouldComponentUpdate(nextProps: Props, nextState) {
        return nextProps.tweet_id != this.props.tweet_id
            ||
            nextState.twttr != this.state.twttr
            ||
            nextState.loaded != this.state.loaded
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

        if ( this.props.tweet_id && this.state.twttr && this.refs.tweetWrapper && !this.state.loaded && !this.state.loading ) {

            this.setState({ loading: true })

            removeChildren( this.refs.tweetWrapper )

            this.state.twttr.widgets.createTweet( this.props.tweet_id, this.refs.tweetWrapper, { ...EMBEDDED_OPTIONS, width: this.props.width } )
                .then( () => {

                    if ( !this.state.loading ) {

                        // should not have the tweet mounted
                        this.refs.tweetWrapper && removeChildren( this.refs.tweetWrapper )

                    } else {
                        // if this is not defined, the component is no longer mounted
                        if ( this.refs.tweetWrapper )
                            this.setState({ loaded: true, loading: false })
                    }
                })
        }
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.tweet_id != this.props.tweet_id )
            this.setState({ loaded: false, loading: false })
    }

    componentWillUnmount() {
        this.setState({ loaded: false, loading: false })
    }

    render(){
        return (
            <div className={style.container} style={{ width: this.props.width || 300, minHeight: this.state.loaded ? null : 180 }}>

                <div className={style.tweetWrapper} ref="tweetWrapper" />

                { !this.state.loaded &&
                    <div className={style.placeholder}>
                        <div className={style.background} />
                        <div className={style.block1} />
                        <div className={style.block2} />
                        <div className={style.block3} />
                        <div className={style.block4} />
                        <div className={style.block5} />
                        <div className={style.block6} />
                    </div>
                }
            </div>
        )
    }
}