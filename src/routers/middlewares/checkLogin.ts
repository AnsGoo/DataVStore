
import type { Next, Context } from 'koa';

export const checkLoginMiddleware = () => {
    return async (ctx: Context,next: Next) => {
        const user:string = ctx.auth
        if (user) {
            await next()
        } else {
            ctx.throw(401,'you must be logined')
        }
        
    }
}
