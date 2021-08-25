import https from "https"
import http from "http"
import { Verifier, KeyResolver } from "njwt"
import { RequestHandler } from "express"

declare module 'express-serve-static-core' {
    interface Request {
        hasValidToken?: boolean
    }
}

export type keyCertFunctionHttps = () => https.ServerOptions
export type keyCertFunctionHttp = () => http.ServerOptions
export type tokenValidatorFunction = (verifier: Verifier, onErrorMessage?: string) => RequestHandler
export type keyResolverFunction = (map: Map<string, Buffer>, onErrorMessage?: string) => KeyResolver
export type redirectIfValidFunction = (verifier: Verifier, isInvalidVariant: boolean, location: string) => RequestHandler

export type createUserType = {
    data: {
        createUser: {
            id: number,
            email?: string,
            password?: string
        }
    }
}

export type matchUserType = {
    data: {
        match: {
            id: number,
            email?: string,
            password?: string
        }
    }
}

export type reqBody = {
    username: string,
    password: string
}

export type loadedHTML = {
    default: string
}