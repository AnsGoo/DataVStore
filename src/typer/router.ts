import { HttpMethod } from "./http";
import type { Schema } from 'jsonschema'
import * as Koa from 'koa';
import type { IMiddleware, } from "koa-router";
import type { Context, Next } from 'koa'


export interface RouterItem {
    name: string
    method: HttpMethod;
    url: string | RegExp;
    action: IMiddleware<any,{}>
    schema?: Schema | undefined
    login?: boolean
}

export interface RouterOption {
    name: string
    path: string | RegExp;
    middleware?: Koa.Middleware<Context,Next>
    routeHandler: IMiddleware<Context,Next>
}



