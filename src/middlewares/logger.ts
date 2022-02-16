
import type {Context, Next} from "koa";
import log4js from '../utils/logger';
export const loggerMiddleware = () => {
    return async (ctx: Context,next: Next) => {
        const start = Date.now()
        const end: number = Date.now()
        try {
            await next()
            const responseTime: number = end - start;
            const statusCode: number = ctx.status
            let message = ctx.body

            if( statusCode < 400 || (typeof message) !== 'string') {
                message = ''
            }

        
            handlerRequest(statusCode,ctx.url,ctx.method,message as string,responseTime)
        } catch (err: any) {
            const message : string = err?.message || err || 'Internal Server Error'
            const statusCode: number = err?.status || 500
            handlerRequest(statusCode,ctx.url,ctx.method,message)
            ctx.status = statusCode
            ctx.body = message
        }
    }
}


const handlerRequest = (statusCode: number, url:string, method:string, message?:string,countTime?: number): void => {
    const logger = log4js.getLogger('http');
    let msg: string = `[${method}][${statusCode}] ${url}`

    if(message && message !== '') {
        msg = msg + `- ${message}`
    }

    if(countTime && countTime > 0) {
        msg = msg + `- ${countTime} ms`
    }
    if( statusCode < 400) {
        logger.info(`[${method}][${statusCode}] ${url} - ${message}` );
    } else if(statusCode < 500) {
        logger.warn(`[${method}][${statusCode}] ${url} - ${message}` )
    } else if(statusCode >= 500) {
        logger.error(`[${method}][${statusCode}] ${url} - ${message}` );
    }
} 
