

type Config = {
    consumer_key            : string,
    consumer_secret         : string,
    access_token_key        : string,
    access_token_secret     : string,
}


declare module 'twitter' {
    declare class Twitter {
        constructor(config: Config): void,
        get : ( url: string, params: Object ) => Promise<any>,
    }
}