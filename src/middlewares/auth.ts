
import type { IncomingHttpHeaders } from 'http';
import type { Next, Context } from 'koa';
import jwtToken from '../utils/jwt';

export const authMiddleware = () => {
    return async (ctx: Context,next: Next) => {
        const headers: IncomingHttpHeaders = ctx.headers
        const authorization:string| undefined = headers.authorization
        if (authorization) {
            const tokens = authorization.split(' ')
            const tokenValue:string = tokens.length === 2 ? tokens[1] : tokens[0]
            const username: string| undefined = jwtToken.decrypy(tokenValue)
            if (username) {
                ctx.auth = username 
            }
        }
        await next()
    }
}
