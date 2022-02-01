
import {IncomingMessage, ServerResponse} from 'http'


export interface IRouting {
    routers : Map<string,(req : IncomingMessage, res : ServerResponse) => void>
    insert(path : string, definition : (req : IncomingMessage, res : ServerResponse) => void) : void
    default(definition : (req : IncomingMessage, res : ServerResponse) => void) : void

}


export class RouterService implements IRouting {
    routers: Map<string, (req: IncomingMessage, res: ServerResponse) => void>;

    constructor() {
        this.routers = new Map()
    }

    insert(path: string, definition: (req: IncomingMessage, res: ServerResponse) => void): void {
        this.routers.set(path,definition)
    }
    default(definition: (req: IncomingMessage, res: ServerResponse) => void): void {
        this.routers.set(null, definition);
    }
}


