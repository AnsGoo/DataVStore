import type {Context} from "koa"
import { getRepository } from "typeorm";
import { join, sep } from "path";
import { BASE_DIR } from "../const";
import { calculateMd5, createDirSync } from "../utils/file";
import { rename, stat, unlinkSync } from 'fs'
import File from '../models/entity/File'

import type { Files,File as FileType } from 'formidable'
import type { Repository } from "typeorm";

const fileDir: string = join(BASE_DIR, 'public', 'upload')
createDirSync(fileDir)

const uploadAction = async (ctx: Context) => {
    const files:Files | undefined = ctx.request.files
    if(files) {
        const myFiles: FileType = Object.values(files)[0] as FileType
        const md5:string = await calculateMd5(myFiles.path)
        const repository: Repository<File> = getRepository(File)
        const uploadFile: File | undefined = await repository.findOne({md5})
        if( uploadFile) {
            ctx.body = uploadFile
            ctx.status = 200
            //  删除文件
            unlinkSync(myFiles.path)
            return 
        } else {
            const curPath: string = join(myFiles.path!.split('public')[1])
            const filenames:string[] = curPath.split(sep)
            const filename: string = filenames[filenames.length - 1]
            let filePath: string =  join(BASE_DIR,'public','upload',filename)
            // 移动文件
            rename(myFiles.path,filePath, (err) => {
                if(err) {
                    ctx.throw(400, err)
                } else {
                    stat(filePath, () => {
                        if(err) {
                            ctx.throw(400, err)
                        }
                    })
                }
            })
            let uploadFile: File = new File()
            uploadFile.md5 = md5
            uploadFile.name = myFiles.name!
            uploadFile.url = filePath.split('public')[1]
            await repository.save(uploadFile)            
            ctx.body = uploadFile
            ctx.status = 200
        }
    }
}


const getFilesAction = async (ctx: Context) => {
    const repository: Repository<File> = getRepository(File)
    const files: File[] =   await repository.find()
    ctx.body = files
    ctx.status = 200
}

const uploadFile = {action: uploadAction, name: 'uploadFile'}
const getFiles = {action: getFilesAction, name: 'getFileds'}
export {uploadFile, getFiles}