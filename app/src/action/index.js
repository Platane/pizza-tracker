import type {Count} from '../type/commonType'



type ActionInitHistory = { type: 'initHistory', userName: string, counts: Array<Count> }

export const initHistory = ( counts: Array<Count>, userName: string ) : ActionInitHistory =>
    ({
        type    : 'initHistory',
        counts,
        userName
    })





type ActionAllHistoryInited = { type: 'allHistoryInited' }

export const allHistoryInited = () : ActionAllHistoryInited =>
    ({
        type    : 'allHistoryInited',
    })





type ActionSetTimeCursor = { type: 'setTimeCursor', k: number }

export const setTimeCursor = ( k: number ) : ActionSetTimeCursor =>
    ({
        type    : 'setTimeCursor',
        k,
    })




export type Action = ActionInitHistory | ActionAllHistoryInited | ActionSetTimeCursor
