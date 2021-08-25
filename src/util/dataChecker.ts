import { matchUserType } from "src/userType";

export function dataChecker(data: matchUserType): boolean {

    return data.data.match.email !== "Wrong Username or Password" && data.data.match.email !== "Account Does Not Exist" && Number (data.data.match.id) !== 0 && data.data.match.password !== ""
}