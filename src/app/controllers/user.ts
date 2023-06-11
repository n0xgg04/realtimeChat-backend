import jwt from 'jsonwebtoken'
import config from '../../config'

const JWT  = config.jwt
export function getUserInfo(token : string) : any {
    const decode = jwt.verify(token, JWT as string)
    return decode
}