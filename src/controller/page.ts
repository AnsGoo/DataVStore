import type {Context} from "koa";
import { Repository } from "typeorm";
import { getRepository, getCustomRepository  } from "typeorm";
import Page from '../models/entity/Page'
import type { Schema } from "jsonschema";
import { toBoolean } from "../utils/transform";
import type { Files,File } from 'formidable'
import { join } from "path";
import log4js from '../utils/logger'
import PageRepository from '../models/repositorys/page'

const logger = log4js.getLogger('service');
const getPagesAction = async (ctx: Context) => {
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    logger.info(username)
    let pages :Page[] = await repository.findAllowedPages(username)
    
    pages.forEach((page:Page) => {
        page.canvasData = JSON.parse(page.canvasData)
        page.canvasStyle = JSON.parse(page.canvasStyle)
    })
    ctx.body = pages
    ctx.status = 200

}

const createPageAction = async (ctx: Context) => {
    const data: Page = ctx.request.body
    let page = new Page()
    page.name = data.name
    page.canvasData = data.canvasData
    page.canvasStyle = data.canvasStyle
    page.isHome = data?.isHome ? toBoolean(data.isHome) :false
    // page.createTime = moment().format('YYY-MM-DD HH:mm:ss')
    page.isDelete = false
    page.author = ctx.auth
    const files:Files | undefined = ctx.request.files
    if(files) {
        const myFiles: File = Object.values(files)[0] as File
        const curPath: string = join(myFiles.path!.split('public')[1])
        page.thumbnail = curPath
    }
    const repository: Repository<Page> = getRepository(Page)
    await repository.save(page)
    ctx.body = page
    ctx.status = 200
}


const updatePageAction = async (ctx: Context) => {
    const { id }:{id:string} = ctx.params as any
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    let page :Page|undefined = await repository.findAllowedOne(id, username)

    if(page) {
        const data = ctx.request.body as any
        page.name = data.name || page.name
        page.canvasData = data.canvasData
        page.canvasStyle = data.canvasStyle
        page.isHome = ((data.isHome === undefined) ? toBoolean(page.isHome) : data.isHome ) as boolean
        const files:Files | undefined = ctx.request.files
        if(files) {
            const myFiles: File = Object.values(files)[0] as File
            const curPath: string = join(myFiles.path!.split('public')[1])
            page.thumbnail = curPath
        }
        await repository.save(page)
        ctx.body = page
        ctx.status = 202
    } else {
        ctx.throw(404, 'not found page')
    }
}

const deletePageAction = async (ctx: Context) => {
    const { id }:{id:string} = ctx.params as any
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    let page :Page|undefined = await repository.findAllowedOne(id, username)
    if(page) {
        await repository.remove(page)
        ctx.body = 'remove successsfully'
        ctx.status = 202
    } else {
        ctx.throw(404, 'not found page')
    }
}


const getPageAction = async (ctx: Context) => {
    const { id }:{id:string} = ctx.params as any
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    let page :Page|undefined = await repository.findAllowedOne(id, username)
    if(page) {
        ctx.status = 200
        page.canvasData = JSON.parse(page.canvasData)
        page.canvasStyle = JSON.parse(page.canvasStyle)
        ctx.body = page
    } else {
        ctx.throw(404, 'not found page')
    }
}


const getHomePageAction = async (ctx: Context) => {
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    let pages : Page[]  = await repository.findAllowedPages(username, {isHome:true})
    let page: Page|undefined
    if(pages.length > 0) {
        page = pages[0]
    } else {
        pages = await repository.findAllowedPages(username)
        if (pages.length > 0) {
            page = pages[0]
        }
        logger.info(page)
    }
    
    if(page) {
        ctx.status = 200
        page.canvasData = JSON.parse(page.canvasData)
        page.canvasStyle = JSON.parse(page.canvasStyle)
        ctx.body = page
    } else {
        logger.info('not found home page')
        ctx.throw(404, 'not found home page')
    }
}

const setHomePageAction = async (ctx: Context) => {
    const { id }:{id:string} = ctx.params as any
    const repository: Repository<Page> = getRepository(Page)
    let page :Page|undefined = await repository.findOne(id)
    if(page) {
        await repository.createQueryBuilder().where('isHome = true').update().set({isHome:false}).execute()
        page.allowed = null
        page.isHome = true
        await repository.save(page)
        ctx.status = 200
        page.canvasData = JSON.parse(page.canvasData)
        page.canvasStyle = JSON.parse(page.canvasStyle)
        ctx.body = page
    } else {
        ctx.throw(404, 'not found page')
    }
}

const setPagePermissionAction = async (ctx: Context) => {
    const { id }:{id:string} = ctx.params as any
    const repository: PageRepository = getCustomRepository(PageRepository)
    const username: string | undefined = ctx.auth
    let page :Page|undefined = await repository.findAllowedOne(id, username)
    if(page) {
        const data = ctx.request.body as any
        const permissions :string[] = data.permissions
        page.allowed = permissions.join(',')
        await repository.save(page)
        ctx.body = page
        ctx.status = 202
    } else {
        ctx.throw(404, 'not found page')
    }
}

const createSchema: Schema = {
    type:'object',
    properties:{
        name:{
            type: 'string'
        },
        isHome: {
           oneOf:[
                {
                    type: 'boolean',
                },
                {
                    type: 'string',
                    enum: ['false','true']
                },
                {
                    type: 'integer',
                    maximum:1,
                    minimum:0
                }
            ]
        },
        canvasData:{
            type:'string',
        },
        canvasStyle:{
            type:'string',
        }
    },
    required: ['name','canvasData','canvasStyle'],
    additionalProperties: true
}


const updateSchema: Schema = {
    type:'object',
    properties:{
        name:{
            type: 'string'
        },
        isHome: {
            oneOf:[
                {
                    type: 'boolean',
                },
                {
                    type: 'string',
                    enum: ['false','true']
                },
                {
                    type: 'integer',
                    maximum:1,
                    minimum:0
                }
            ]
        },
        canvasData:{
            type:'string',
        },
        canvasStyle:{
            type:'string',
        }
    },
    additionalProperties: true
}


const setPermisonsSchema: Schema = {
    type:'object',
    properties:{
        permissions:{
            type: 'array',
            items: {
                type: "string"
            }
        }
    },
    additionalProperties: true
}

const getPages = { action: getPagesAction, name: 'getpages'}
const getPage = { action: getPageAction, name: 'getPage'}
const createPage = { action: createPageAction, schema: createSchema, name: 'createPage'}
const updatePage = { action: updatePageAction, schema: updateSchema, name: 'updatePage'}
const deletePage = { action: deletePageAction, name: 'detelePage'}
const getHomePage = { action: getHomePageAction, name: 'getHomePage' }
const setHomePage = { action: setHomePageAction, name: 'setHomePage'}
const setPagePermission = { action: setPagePermissionAction, name:'setPagePermission',schema: setPermisonsSchema}
export { 
    getPages, 
    createPage, 
    updatePage, 
    deletePage, 
    getPage, 
    getHomePage, 
    setHomePage, 
    setPagePermission 
}