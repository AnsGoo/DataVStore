import {sign, verify} from 'jsonwebtoken'
import type {Secret, JwtPayload} from 'jsonwebtoken'
import { SECRET } from '../const'



class JwtToken {

    secret: Secret
    constructor(secret: Secret) {
        this.secret = secret
    }

    /**
     * 生成token
     * @param username 用户名
     * @param timeInt 过期时间
     * @returns 用户token
     */
    public encrypt(username: string, timeInt: number): string {
        return sign({username},this.secret, {expiresIn:timeInt})
    }

    /**
     * 根据token获取用户名
     * @param token 用户token
     * @returns 用户名
     */
    public decrypy(token:string): string | undefined {
        try {
            const payload :JwtPayload = verify(token,this.secret) as JwtPayload
            return payload.username

        } catch(e) {
            return undefined
        }  
    }

}


export default new JwtToken(SECRET)


