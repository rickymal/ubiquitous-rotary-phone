
import http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

export interface IAuthentication {
    users : Map<string,string>
    authenticate(request : IncomingMessage, response : ServerResponse) : boolean
    register(request : IncomingMessage, response : ServerResponse) : boolean
    login(request : IncomingMessage, response : ServerResponse) : boolean
    
}


export class AuthenticationService implements IAuthentication {
    users: Map<string, string>;

    constructor() {
        this.users = new Map()
    }
    register(request: http.IncomingMessage, response: http.ServerResponse): boolean {
        throw new Error('Method not implemented.');
    }
    login(request: http.IncomingMessage, response: http.ServerResponse): boolean {
        throw new Error('Method not implemented.');
    }

    authenticate(request: http.IncomingMessage, response: http.ServerResponse): boolean {
        // throw new Error('Method not implemented.')
        const headers = new Object()
        Object.entries(request.headers).forEach((e) => (headers[e[0]] = e[1]));
        let auth : string = headers["authorization"];
        
        if (!auth) {
            response.setHeader("userId","null")
            return false
        }

        let [bearer, hash] = auth.split(" ")

        if (bearer != "Bearer") {
            throw new Error("Formato incorreto")
        }

        let userId = this.users.get(hash)

        if(userId) {
            response.setHeader("userId",userId)
            return true 
        } else {
            response.setHeader("userId","null")
            return false
        }

    }

}