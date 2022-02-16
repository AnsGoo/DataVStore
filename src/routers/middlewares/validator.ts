import { Validator } from 'jsonschema'
import type { Validator as ValidatorType, Schema, ValidatorResult, ValidationError} from 'jsonschema'
import type {Context, Next} from "koa";



const ValidatorMiddleware = (schema:Schema) => {
    return async (ctx: Context, next: Next) => {
        const data: any  = ctx.request.body
        let validator: ValidatorType = new Validator()
        const result: ValidatorResult = validator.validate(data,schema)
        let errors: string[] = []
        if (!result.valid) {
            errors = result.errors.map((el: ValidationError) => el.message)
            ctx.throw(400,JSON.stringify(errors))
        } else {
            await next()
        }
    } 
}

export default ValidatorMiddleware


