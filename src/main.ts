import http from 'http'
import {IncomingMessage, ServerResponse} from 'http'
import { getHeader, getJSON } from './utils'
import { AuthenticationService } from './services/Authentication';
// toda requisução que é feita para o servidor chama a função

import {routerService} from './routes'
const port = 3000;
const host = "localhost";
const authenticationService = new AuthenticationService()


const server = http.createServer((request : IncomingMessage ,response : ServerResponse) => {

    // Configuração para o CORS 
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");

    const headers = getHeader(request)
    let auth = headers["authorization"]

    const isAuthenticated = authenticationService.authenticate(request, response);

    let controllerToAct = routerService.routers.get(request.url)

    if (controllerToAct) {
        controllerToAct(request, response)
    }

})


server.listen(port,host,null,() => {
    console.log("O servidor está rodando")
})