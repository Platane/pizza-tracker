
export type Count = {
    date        : number,
    tweet_id    : string,
    count       : number,
}


export type UserInfo = {
    userName                : string,
    counts                  : Array<Count>,
    lastCheckDate           : ?number,
}