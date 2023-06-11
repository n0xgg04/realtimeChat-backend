import {Config} from '../interfaces'

const config : Config = {
    port :process.env.PORT || 1234,
    mysql : {
        host : process.env.MYSQL_HOST || 'localhost',
        username : 'root',
        password : '',
        database : 'messenger'
    },
    jwt: "DIT_ME_MAY"
}

export default config
