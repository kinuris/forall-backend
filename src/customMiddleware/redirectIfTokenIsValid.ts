import { redirectIfValidFunction } from "src/userType";

export const redirectIfTokenIsValid: redirectIfValidFunction = (verifier, isInvalid, location) => {

    if(!isInvalid) {
        return (req, res, next) => {

            if(req.headers.authorization?.split(' ')[0] === 'Bearer') {
                // console.log(`Authorization: ${req.headers.authorization}`)
                req.headers.authorization = req.headers.authorization.split(' ')[1]
            } else if(req.headers.cookie?.split('=')[0] === 'token') {
                // console.log(`Authorization (Through 'token' Cookie): ${req.headers.cookie.split('=')[1]}`)
                req.headers.authorization = req.headers.cookie.split('=')[1]
            } else {
                return next()
            }

            try {
                verifier.verify(req.headers.authorization)
            } catch (err) {
                res.clearCookie('token')
                return next()
            }

            req.hasValidToken = true
            res.redirect(location)
        }
    } else {
        return (req, res, next) => {

            if(req.headers.authorization?.split(' ')[0] === 'Bearer') {
                // console.log(`Authorization: ${req.headers.authorization}`)
                req.headers.authorization = req.headers.authorization.split(' ')[1]
            } else if(req.headers.cookie?.split('=')[0] === 'token') {
                // console.log(`Authorization (Through 'token' Cookie): ${req.headers.cookie.split('=')[1]}`)
                req.headers.authorization = req.headers.cookie.split('=')[1]
            } else {
                res.redirect(location)
                return
            }

            try {
                verifier.verify(req.headers.authorization)
            } catch (err) {
                res.clearCookie('token')
                res.redirect(location)
                return
            }

            req.hasValidToken = true
            return next()
        }
    }
}