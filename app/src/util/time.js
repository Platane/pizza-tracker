export const throttle = ( delay: number, fn: any => void ) => {

    let timeout = null
    let args    = null

    const _fn = () => {
        timeout = null
        fn( ...args )
    }

    return ( ..._args ) => {

        args = _args

        if ( timeout )
            return

        timeout = setTimeout( _fn, delay )
    }
}