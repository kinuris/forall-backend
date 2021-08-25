import express from "express"
import expressWs from "express-ws"
import https from 'https'
import njwt from 'njwt'
import sr from 'secure-random'
import path from "path"
import cors from 'cors'
import http from 'http'
import { createUserQuery, matchQuery } from "./queries"
import { createUserType, loadedHTML, matchUserType, reqBody } from "./userType"
import { userFetch } from "./util/createUserFetch"
import { keyCertLoaderHttp, keyCertLoaderHttps } from "./util/keyCertLoader"
import { dataChecker } from "./util/dataChecker"
import { keyResolver } from "./util/keyResolver"
import { loadSecretKey } from "./util/secretKeyLoader"
import { redirectIfTokenIsValid } from "./customMiddleware/redirectIfTokenIsValid"
import { minutesToMilliseconds } from "./util/converter"

// html import for webpack
const signup_page: loadedHTML = require('./../public/index.html')
const login_page: loadedHTML = require('./../public/login.html')
const logout_page: loadedHTML = require('./../public/logout.html')

const httpsOptions = keyCertLoaderHttps()
const httpOptions = keyCertLoaderHttp()

// USE "secretKeyProd" WHEN DEPLOYING TO REMOTE SERVER
const secretKeyProd = loadSecretKey()
const secretKeyDev = "4a5ff65e40206a4f66ae3217babe13cd"

// DON'T FORGET TO CHANGE "http.createServer()" to "https.createServer()" WHEN DEPLOYING TO REMOTE SERVER

const appInit = express()
const server = http.createServer(httpOptions, appInit)
// const server = https.createServer(httpsOptions, appInit)

const appWs = expressWs(appInit, server)
const app = appWs.app
const keyMapProd = new Map<string, Buffer>()
const verifier = njwt.createVerifier().withKeyResolver(keyResolver(keyMapProd))
const claims = {
    iss: 'partner',
    sub: 'signup',
    scope: 'HANDLER'
}

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', redirectIfTokenIsValid(verifier, true, '/login'), (req, res) => {
    res.send(logout_page.default)
})

// Websocket
app.ws('/', (ws, req) => {
    ws.addEventListener('message', event => {
        appWs.getWss().clients.forEach(client => {
            client.send(event.data)
        })
    })
})

app.get('/signup', redirectIfTokenIsValid(verifier, false, '/'), (req, res) => {
    res.send(signup_page.default)
})

app.get('/login', redirectIfTokenIsValid(verifier, false, '/'), (req, res) => {
    res.clearCookie('token')
    res.send(login_page.default)
    res.end()
})

app.post('/logout', redirectIfTokenIsValid(verifier, true, '/'), (req, res) => {
    res.clearCookie('token')
    res.end()
})

app.post('/login', redirectIfTokenIsValid(verifier, false, '/'), async (req, res) => {

    let jwt = njwt.create(claims, secretKeyDev)
    let { username, password }: reqBody = req.body

    if(username === "Email Already Taken" || !username){
        res.send(JSON.stringify({ message: "LMAO"}))
        return
    }

    let queryString = matchQuery(username, password)
    let data = await userFetch<matchUserType>(jwt, queryString)
    
    if (dataChecker(data)) {
        let key: Buffer = sr(256, { type: 'Buffer' })
        let { id, email } = data.data.match
        let jwt = njwt.create({ id, sub: `users/${email}` }, key)
        jwt.setExpiration(new Date().getTime() + minutesToMilliseconds(60))

        let kidKey = jwt.body.toJSON().jti.toString()
        jwt.setHeader('kid', kidKey)
        keyMapProd.set(kidKey, key)

        res.cookie('token', jwt.compact())
        res.send(JSON.stringify({ message: data.data.match.email }))
        return
    }

    res.send({ message: data.data.match.email })
})

app.post('/signup', redirectIfTokenIsValid(verifier, false, '/'), async (req, res) => {

    let jwt = njwt.create(claims, secretKeyDev)
    let { username, password }: reqBody = req.body

    if(username === "Email Already Taken"){
        res.send(JSON.stringify({ message: "LMAO"}))
        return
    }

    let queryString = createUserQuery(username, password)
    let data = await userFetch<createUserType>(jwt, queryString)
    
    res.send(JSON.stringify({message: data.data.createUser.email}))
})

server.listen(8080)