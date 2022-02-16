
import {BooleanType} from '../typer/base'


/**
 * 将疑似boolean值转化为boolean值
 * @param value 疑似boolean值
 * @returns boolean值
 */
export const toBoolean = (value: BooleanType):boolean =>{
    if(typeof value === 'string') {
        switch(value){
            case 'true':
                return true
            default:
                return false
        }
    } else {
        return Boolean(value)
    }
}