import { combineReducers }  from 'redux'

import { reducer as usersReducer }     from './users'

import type { State as UsersState }    from './users'

export type State = {
    users  : UsersState,
}

export const reduce = combineReducers({ users: usersReducer })


