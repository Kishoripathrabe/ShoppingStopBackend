import { ProdEnvironment } from './environment.prod';

export  * from './environment.prod'
export function getEnvironmentVariable() {
    if(true || process.env.NODE_ENV ==='production'){
        return ProdEnvironment;
    }
}