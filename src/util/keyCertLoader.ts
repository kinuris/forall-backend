import { keyCertFunctionHttp, keyCertFunctionHttps } from "src/userType";
import { readFileSync } from "fs";

export const keyCertLoaderHttps: keyCertFunctionHttps = () => {
    
    let key: Buffer
    let cert: Buffer

    try {
        key = readFileSync("/etc/letsencrypt/live/idontknowanymore.xyz/privkey.pem")
        cert = readFileSync("/etc/letsencrypt/live/idontknowanymore.xyz/fullchain.pem")
    } catch (err) {
        console.log("File not found: 'privkey.pem' or 'fullchain.pem'")
    }
    
    return {
        key,
        cert
    }
}

export const keyCertLoaderHttp: keyCertFunctionHttp = () => {
    
    return {
        
    }
}