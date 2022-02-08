import { IncomingMessage, ServerResponse } from "http";
import { IAuthentication } from "../../services/Authentication";
import { IRepository } from "../../services/RouteService";
import { getJSON } from "../../utils";
export class ApiController {
    constructor(
        private apiService: IRepository,
        private authenticationService: IAuthentication
    ) { }
    async add_title(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        // O front-end esta enviando o 'userId', sendo que não é necessário visto que o token já pode nos fornecer essa informação, além de ser o jeito certo de fazer (issue p/ futuro)
        let user = response.getHeader("userId")
        type BookStatus = {
            userId: string | number;
            descr: string | number;
            title: string;
            ID: number
        };
        let data_response: BookStatus = new Object() as BookStatus
        getJSON(request)
            .then(data_converted => {
                data_converted.userId = user
                // eu deveria receber o userId via autenticação. Fiz besteira aqui, preciso corrigir (issue)
                let { title, description, userId } = data_converted
                data_response.userId = userId
                data_response.descr = description
                data_response.title = title
                return this.apiService.insertBook(title, description, userId)
            })
            .then(({ ID }) => {
                data_response.ID = ID
                var json_content = JSON.parse(JSON.stringify(data_response));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
            .catch((err) => {
                var json_content = JSON.parse(JSON.stringify(data_response));
                response.setHeader("Content-type", "application/json")
                response.writeHead(418)
                response.end(JSON.stringify(json_content));
            })
    }
    async edit_title(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        let user = response.getHeader("userId")
        type ReservationStatus = {
            userId: string | number;
            bookId: string | number;
            status: string;
        };
        let data_response: ReservationStatus = new Object() as ReservationStatus
        getJSON(request)
            .then(data_converted => {
                let userId = response.getHeader("userId") as string | number
                let { bookId, title, description } = data_converted
                data_response.userId = userId
                data_response.bookId = bookId
                return this.apiService.editBook(bookId, title, description)
            })
            .then(() => {
                data_response.status = "worked"
                var json_content = JSON.parse(JSON.stringify(data_response));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
    }
    async delete_owner_book(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        let user = response.getHeader("userId")
        type ReservationStatus = {
            userId: string | number;
            bookId: string | number;
            status: string;
        };
        let data_response: ReservationStatus = new Object() as ReservationStatus
        getJSON(request)
            .then(data_converted => {
                let userId = response.getHeader("userId") as string | number
                let { bookId } = data_converted
                data_response.userId = userId
                data_response.bookId = bookId
                return this.apiService.eraseBook(bookId)
            })
            .then(() => {
                data_response.status = "worked"
                var json_content = JSON.parse(JSON.stringify(data_response));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
    }
    async books(request: IncomingMessage, response: ServerResponse) {
        // Implementar o método api_books da versão antiga aqui, fazendo o IAPi Service ter um método para pegar o repositório de acesso ao banco
        this.authenticationService.authenticate(request, response)
        let user = response.getHeader("userId")
        const token = response.getHeader("Authorization")
        if (user == 'null') {
            response.setHeader("Content-type", "text/plain")
            response.writeHead(500)
            response.end("Usuário não logado")
            return
        }
        this.apiService.getAllBooks(user as string)
            .then(data => {
                var json_content = JSON.parse(JSON.stringify(data));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
    }
    async make_login(request: IncomingMessage, response: ServerResponse) {
        // Implementar o método api_books da versão antiga aqui, fazendo o IAPi Service ter um método para pegar o repositório de acesso ao banco
        this.authenticationService.login(request, response)
            .then(({ request, response }) => {
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end()
            })
    }
    async request_reserved_books(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        let user = response.getHeader("userId") as string | number
        this.apiService.getReservedBooks(user)
            .then(data => {
                var json_content = JSON.parse(JSON.stringify(data));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
    }
    async request_owner_books(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        let user = response.getHeader("userId") as string | number
        this.apiService.getOwnerBooks(user)
            .then(data_response => {
                var json_content = JSON.parse(JSON.stringify(data_response.recordset));
                response.setHeader("Content-type", "application/json")
                response.writeHead(200)
                response.end(JSON.stringify(json_content));
            })
    }
    async choose_book(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        type ReservationStatus = {
            userId: string | number;
            bookId: string | number;
            status: string;
        };
        let data_response: ReservationStatus = new Object() as ReservationStatus
        getJSON(request)
            .then(data_converted => {
                let userId = response.getHeader("userId") as string | number
                let { bookId } = data_converted
                data_response.userId = userId
                data_response.bookId = bookId
                return this.apiService.doReservation(userId, bookId)
            })
            .then(reservation => {
                data_response.status = "Added successful"
                response.setHeader("Content-type", "application/json");
                response.writeHead(200);
                response.end(JSON.stringify(data_response));
            })
            .catch(err => {
                if (err.message == "Uma reserva já foi feita?") {
                    data_response.status = "The user only can choose one book per time"
                    response.writeHead(418)
                    response.end(JSON.stringify({ err }))
                } else {
                    throw new Error(err)
                }
            })
    }
    async devolve_reserved_book(request: IncomingMessage, response: ServerResponse) {
        this.authenticationService.authenticate(request, response)
        type ReservationStatus = {
            userId: string | number;
            bookId: string | number;
            status: string;
        };
        let data_response: ReservationStatus = new Object() as ReservationStatus
        getJSON(request)
            .then(async data_converted => {
                let userId = response.getHeader("userId") as string | number
                let { bookId } = data_converted
                data_response.userId = userId
                data_response.bookId = bookId
                return (await this.apiService.discardReservation(userId, bookId)).recordset
            })
            .then(async reservation => {
                data_response.status = "worked"
                response.writeHead(200);
                return response.end(JSON.stringify(data_response))
            })
            .catch(async err => {
                data_response.status = "not worked"
                response.writeHead(481);
                response.end(JSON.stringify(data_response))
            })
    }
}