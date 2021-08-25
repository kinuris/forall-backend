import { readFileSync } from "fs";

export function loadSecretKey(): Buffer {
    let sKey: Buffer
    try {
        sKey = readFileSync("/etc/letsencrypt/live/idontknowanymore.xyz/privkey.pem")
    } catch (error) {
        console.log("File not found: 'privkey.pem'")
    }

    return sKey
}