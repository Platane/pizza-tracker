import type {Count} from '../../type/commonType'

type ActionInitHistory = { type: 'initHistory', userName: string, counts: Array<Count> }


export const initHistory = ( counts: Array<Count>, userName: string ) : ActionInitHistory =>
    ({
        type    : 'initHistory',
        counts,
        userName
    })

type ActionAllHistoryInited = { type: 'initHistory', userName: string, counts: Array<Count> }

export const allHistoryInited = () : ActionAllHistoryInited =>
    ({
        type    : 'allHistoryInited',
    })


export type Action = ActionInitHistory | ActionAllHistoryInited
