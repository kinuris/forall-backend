import { keyResolverFunction } from "src/userType";

export const keyResolver: keyResolverFunction = (map, message = "Nonexistent kid") => {

    return (kid, cb) => {
        let jtiProd = map.get(kid)

        if(jtiProd) {
            return cb(null, jtiProd)
        }

        return cb(new Error(message), "")
    }
}