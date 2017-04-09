
export type Count = {
    date        : number,
    count       : number,
    tweet_id    : ?string,
}


export type UserInfo = {
    userName                : string,
    counts                  : Array<Count>,
    estimated_counts        : Array<Count>,
}