import fetch from 'node-fetch'
import njwt from 'njwt'

export async function userFetch<Type>(jwt: njwt.Jwt, queryString: string): Promise<Type> {
    return await fetch('http://localhost:4000/graphql', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify({
            query: queryString
        })
    })
    .then(res => res.json())
}