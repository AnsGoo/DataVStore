import { log4js } from "../../utils/logger";
import { EntityRepository, Like, Repository } from "typeorm";
import type { SelectQueryBuilder } from "typeorm";
import Page from '../entity/Page'
import type { Logger } from "log4js";

const logger: Logger = log4js.getLogger('sql')

@EntityRepository(Page)
export default class PageRepository extends Repository<Page> {
  private _getAllowedQueryBuild(username: string| undefined, options:Record<string,any> = {}) {
    let queryBuild: SelectQueryBuilder<Page> = this.createQueryBuilder()
                      .where({isDelete: false, ...options})
    if (username) {
      queryBuild = queryBuild.andWhere([{allowed: ''},{allowed: null}, {allowed: Like(`%${username}%`)}])
    } else {
      queryBuild = queryBuild.andWhere([{allowed: ''},{allowed: null}])
    }
    logger.info(queryBuild.getSql(),queryBuild.getParameters())
    return queryBuild
  }

  public findAllowedPages(username: string| undefined, options:Record<string,any> = {}):Promise<Page[]> {
    return this._getAllowedQueryBuild(username,options).getMany()    
  }

  public findAllowedOne(id: string, username:string | undefined ): Promise<Page| undefined> {
    return this._getAllowedQueryBuild(username).andWhere('id=:id',{id}).getOne()
  }
}