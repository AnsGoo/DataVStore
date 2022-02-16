import type {Context} from "koa";
import type { Schema } from 'jsonschema'
import jwtToken  from '../utils/jwt'
import { readFileSync } from "fs";
import type { User } from '../typer/auth'

const loginAction = async (ctx: Context) => {
    const data = ctx.request.body
    const { username, password} : { username:'string', password:'string' } = data
    if(username && password) {
        const userList: User[] = JSON.parse(readFileSync('userInfo.json',{encoding:'utf-8'})) as User[]
        let users: User[] = userList.filter((el:User) => el.username === username && el.password === password)
        if (users.length > 0) {
            const timeInt = new Date().getTime()
            const token: string = jwtToken.encrypt(username, timeInt)
            const user: User = users[0]
            user.password = undefined
            user.token = token
            ctx.body = user
            ctx.status = 200
        } else {
            ctx.throw(400,'username or password is unmatched')
        }
    } else {
        ctx.throw(400,'username or password is not exists')
    }
}

const getUsersAction = async (ctx: Context) => {
    const userList: User[] = JSON.parse(readFileSync('userInfo.json',{encoding:'utf-8'})) as User[]
    const users = userList.map((el: User) => el.username)
    ctx.body = users
    ctx.status = 200
}

const schema: Schema = {
    type:'object',
    properties:{
    username:{
        type: 'string'
    },
    password:{
        type:'string'
    }
    },
    required: ['username','password']
}


const getUsers = { action: getUsersAction, name: 'getUsers'}
const login = { action: loginAction, schema: schema, name: 'login'}
export { getUsers, login } 