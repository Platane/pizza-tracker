
import type {Action}        from '../action'

export type State = {
    k : number,
}

export const reducer = ( state: State, action: Action ) : State => {

    switch( action.type ){

        case 'setTimeCursor' :
            return { ...state, k: action.k }

        // case 'allHistoryInited' :
        //     return { ...state, k: 0 }

        default :
            return state || { k: 0 }

    }
}