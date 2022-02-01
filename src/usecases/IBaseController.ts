import {IncomingMessage, ServerResponse} from 'http'

export interface IBaseController {
    handle(request : IncomingMessage, response : ServerResponse) : Promise<ServerResponse>;
}
