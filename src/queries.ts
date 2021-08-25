export function matchQuery(email: string, password: string): string {
    return `query {
            match(email: "${email}", password: "${password}") {
                id
                email
            }
    } `
}

export function createUserQuery(email: string, password: string): string {
    return `mutation {
                createUser (data: {
                    email: "${email}",
                    password: "${password}"
                }) {
                    id
                    email
                }
            }
        `
}