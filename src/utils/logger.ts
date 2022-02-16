import { configure  } from 'log4js'
import type { Log4js } from 'log4js'

export const log4js: Log4js =  configure({
    appenders: { 
        http: { 
            type: 'file', 
            filename: './log/http.log',
            keepFileExt: true, 
            maxLogSize: 10485760, 
            backups: 3,
            pattern: "yyyy-MM-dd"
        },
        service: { 
            type: 'file', 
            filename: './log/service.log',
            keepFileExt: true, 
            maxLogSize: 10485760, 
            backups: 3,
            pattern: "yyyy-MM-dd"
        },
        stdout: { 
            type: 'console',
            layout:{
                type: 'colored'
            }
        }

},
    categories: { 
        default: { 
            appenders: ['stdout'], 
            level: 'info' 
        },
        service: { 
            appenders: ['stdout','service'], 
            level: 'info' 
        },
        http: { 
            appenders: ['stdout','http'], 
            level: 'info' 
        },
        sql: { 
            appenders: ['stdout'], 
            level: 'info' 
        },
        
    }
});

export default log4js