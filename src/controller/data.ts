import type {Context} from "koa";
import type { EntityManager } from "typeorm";
import { getManager } from "typeorm";
import log4js from '../utils/logger'
import moment from "moment";
import {RowDataPacket} from 'mysql'

import type { Point }  from '../typer/commont'
const logger = log4js.getLogger('service');
const getCacheDataAction = async (ctx: Context) => {
    const query = ctx.query
    const startDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate: Date = new Date(new Date().setHours(23, 59, 59, 0));
    const start:string = query.start ? query.start as string: moment(startDate).format('%Y-%m-%d %H:%M:%S')
    const end:string = query.end ? query.end as string: moment(endDate).format('%Y-%m-%d %H:%M:%S')

    const manager:EntityManager = getManager()
    const sql: string  = `select \`data\` from cache WHERE  \`time\` BETWEEN '${start}' AND '${end}';`
    logger.info(sql)
    try {
        const results: RowDataPacket[] =  await manager.query(sql) as RowDataPacket[]
        let data: [string,number,number|null][] = []
        results.map((el:RowDataPacket) => {
            let records: Point[] = JSON.parse(el.data)
            records.forEach((point:Point) => {
                data.push(
                    [
                        point.time,
                        Number(point.no),
                        point.value
                    ]
                )
                
            });
        })
        ctx.body = data
        ctx.status = 200
    } catch(error: any) {
        ctx.status = 400
        ctx.body = error.message  || error
    }
}


export default { action: getCacheDataAction, name: 'getCacheData' }