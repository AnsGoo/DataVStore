import { createHash } from 'crypto'
import type { Hash } from 'crypto'
import { createReadStream,  mkdirSync, existsSync } from 'fs'
import type { ReadStream } from 'fs'
import { dirname } from 'path'


/**
 * 获取文件的MD5值
 * @param filepath 文件路径
 * @returns 文件的MD5值 异步对象
 */
const calculateMd5 = (filepath:string) :Promise<string> => {
    let fs: ReadStream = createReadStream(filepath)
    const hash: Hash = createHash('md5')
    let hex: string
    
   return new Promise( (resolve) => {
        fs.on('data', hash.update.bind(hash))
        fs.on('end', () => {
            hex = hash.digest('hex')
            resolve(hex)
        })
    })
}

/**
 *  递归创建多层文件夹
 * @param dir 需要创建的文件夹目录
 * @returns 创建结果
 */
const createDirSync = function(dir:string): boolean{
    if(existsSync(dir)){
        return true        
    } else  {
        if(createDirSync(dirname(dir))){
            mkdirSync(dir)
            return true
        }
        return false
    }

}

export { calculateMd5,createDirSync}