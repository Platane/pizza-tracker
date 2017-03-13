import {update}                 from './index'

export const handler = (event: Object, context: Object, callback: ( err:?string, res: any ) => void ) =>
    update( event.all )
        .then( callback.bind(null,null) )
        .catch( callback )