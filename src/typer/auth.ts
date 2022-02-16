
import type { HttpMethod } from './http'

export interface JWtAuthOptions{
    mode:'include'| 'exclude'
    paths: Record<string, HttpMethod[] | '*'>
}

export interface User {
    username: string
    password: string | undefined,
    token?: string,
    permissions?: Array<string>
}