import {IncomingMessage, ServerResponse} from 'http'
import { IViewService } from '../../services/ViewService'
import { IBaseController } from '../IBaseController'
import { IBaseUseCase } from '../IBaseUseCase'



export class ViewController {
    favicon(request: IncomingMessage, response: ServerResponse): void {
        response.setHeader("Content-type", "text/javascript");
        response.writeHead(200);
        response.end();
    }

    constructor(
        private viewService : IViewService
    ){}

    async main_page(request: IncomingMessage, response: ServerResponse): Promise<ServerResponse> {
        response.writeHead(200)
        response.end("Entrando na rota principal")
        return response
    }

    async get_html_page(request: IncomingMessage, response: ServerResponse, name : string) {
        // console.log("Compadre")
        response.setHeader("Content-type","text/html")
        response.writeHead(200)
        
        // console.log("Compadre")
        // console.log("Name " + name)
        let html_page = this.viewService.getHTML(name)
        response.end(html_page)
        // console.log("Compadre")
    }

    
    async get_css_style(request: IncomingMessage, response: ServerResponse, name : string) {
        // console.log("Compadre")
        response.setHeader("Content-type","text/css")
        response.writeHead(200)
        
        // console.log("Compadre")
        // console.log("Name " + name)
        let html_page = this.viewService.getCSS(name)
        console.log("pagina css")
        response.end(html_page)
        // console.log("Compadre")
    }

    async get_javascript_code(request: IncomingMessage, response: ServerResponse, name : string) {
        // console.log("Compadre")
        response.setHeader("Content-type","text/javascript")
        response.writeHead(200)
        
        // console.log("Compadre")
        // console.log("Name " + name)
        let html_page = this.viewService.getJAVASCRIPT(name)
        response.end(html_page)
        // console.log("Compadre")
    }


}
