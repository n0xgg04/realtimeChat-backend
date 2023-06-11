export interface Config {
    port : number | string,
    mysql : {
        host : string,
        username : string,
        password : string,
        database : string
    },
    jwt: string
}


