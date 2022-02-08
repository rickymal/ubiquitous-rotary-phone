
import {IncomingMessage, ServerResponse} from 'http'
import { ApiService, IApiService } from './RouteService';
import crypto from "crypto";


export interface IAuthentication {
    users : Map<string,string>
    authenticate(request : IncomingMessage, response : ServerResponse) : boolean
    register(request : IncomingMessage, response : ServerResponse) : boolean
    login(request : IncomingMessage, response : ServerResponse) : Promise<{ request: IncomingMessage; response: ServerResponse; }>
    
}

import {getJSON} from '../utils'


export class AuthenticationService implements IAuthentication {
    users: Map<string, string>;
    apiService: IApiService;

    constructor(apiService: IApiService) {
        this.users = new Map()
        this.apiService = apiService
    }

    register(request: IncomingMessage, response: ServerResponse): boolean {
        throw new Error('Method not implemented.');
    }

    async login(request: IncomingMessage, response: ServerResponse): Promise<{ request: IncomingMessage; response: ServerResponse; }> {


        console.log("A")
        const { email, password } = await getJSON(request);
        
        console.log("CONTEUDO DO JSON")
        console.log(email)
        console.log(password)
        console.log("A")
        const data_api_response = await this.apiService.login(email,password)
        
        
        
        console.log("b")
        console.log(data_api_response)
        console.log(Array.isArray(data_api_response))
        console.log(data_api_response.length)
        
        if (data_api_response.length) {
            console.log("c")
            let user_founded  = data_api_response[0]
            var random_bytes = crypto.randomBytes(20).toString("hex");
            var hash = random_bytes;
            this.users.set(hash, user_founded.ID); //aqui eu acesso o banco e pego o userId correto
            console.log(this.users)
            response.setHeader("Authorization", "Bearer " + hash);
        } else {
            response.setHeader("Authorization", "Bearer null");
        }

        return {
            request,response
        }


    }

    authenticate(request: IncomingMessage, response: ServerResponse): boolean {
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

