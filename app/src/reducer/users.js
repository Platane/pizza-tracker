
import type {Action}        from '../action'
import type {UserInfo}      from '../type/commonType'

export type State = Array<UserInfo>

export const reducer = ( state: State, action: Action ) : State => {

    switch( action.type ){

        case 'initHistory' :
            return [
                { counts: action.counts, userName: action.userName },
                ...state.filter( x => x.userName != action.userName )
            ]

        default :
            return state || []

    }
}