import { Context } from 'koa';
import type { Schema } from 'jsonschema';
import { getRepository, Repository } from 'typeorm';
import System from '../models/entity/System';

class SystemSetting {
  static createName: string = 'createSystem';
  static async create(ctx: Context) {
    const repository: Repository<System> = getRepository(System);
    const data = ctx.request.body as any;
    const system = new System();
    system.name = data.name;
    system.config = data.config;
    system.tag = data.tag;
    system.desc = data.desc || '';
    await repository.save(system);
    ctx.status = 201;
    ctx.body = system;
  }

  static updateName: string = 'updateSystem';
  static async update(ctx: Context) {
    const repository: Repository<System> = getRepository(System);
    const system: System | undefined = await repository.findOne(ctx.params.id);
    if (system) {
      const data = ctx.request.body as any;
      system.name = data.name || system.name;
      system.tag = data.tag || system.tag;
      system.desc = data.desc || system.desc;
      system.config = data.config;
      await repository.save(system);
      ctx.status = 200;
      ctx.body = system;
    } else {
      ctx.throw(404, 'not found system');
    }
  }

  static deleteName: string = 'deleteSystem';
  static async delete(ctx: Context) {
    const repository: Repository<System> = getRepository(System);
    const system: System | undefined = await repository.findOne(ctx.params.id);
    if (system) {
      await repository.remove(system);
      ctx.status = 200;
      ctx.body = 'success';
    } else {
      ctx.throw(404, 'not found system');
    }
  }

  static getName: string = 'getSystem';
  static async get(ctx: Context) {
    const repository: Repository<System> = getRepository(System);
    const system: System | undefined = await repository.findOne(ctx.params.id);
    if (system) {
      ctx.status = 200;
      ctx.body = system;
    } else {
      ctx.throw(404, 'not found system');
    }
  }

  static getAllName: string = 'getAllSystem';
  static async getAll(ctx: Context) {
    const repository: Repository<System> = getRepository(System);
    const systems: System[] = await repository.find();
    systems.forEach((system: System) => {
      system.config = system.config;
    });
    ctx.body = systems;
    ctx.status = 200;
  }
}

class SystemSchem {
  static createSchema: Schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      config: {
        type: 'object',
      },
      tag: {
        type: 'string',
      },
      desc: {
        type: 'string',
      },
    },
    required: ['name', 'config', 'tag'],
  };

  static updateSchema: Schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      config: {
        type: 'object',
      },
      tag: {
        type: 'string',
      },
      desc: {
        type: 'string',
      },
    },
    required: ['config'],
  };
}

export { SystemSetting, SystemSchem };
