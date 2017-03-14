import { combineReducers }  from 'redux'

import { reducer as usersReducer }          from './users'
import { reducer as timeCursorReducer }     from './timeCursor'

import type { State as UsersState }         from './users'
import type { State as TimeCursorState }    from './timeCursor'

export type State = {
    users       : UsersState,
    timeCursor  : TimeCursorState,
}

export const reduce = combineReducers({
    users       : usersReducer,
    timeCursor  : timeCursorReducer,
})


