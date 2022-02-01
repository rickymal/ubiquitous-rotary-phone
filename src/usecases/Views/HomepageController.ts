import {IncomingMessage, ServerResponse} from 'http'
import { IBaseController } from '../IBaseController'
import { IBaseUseCase } from '../IBaseUseCase'

export class HomepageController implements IBaseController {

    constructor(private usecase : IBaseUseCase) {}

    async handle(request: IncomingMessage, response: ServerResponse): Promise<ServerResponse> {
        response.writeHead(200)
        response.end("Entrando na rota principal")
        this.usecase.execute(null)
        return response
    }
}
