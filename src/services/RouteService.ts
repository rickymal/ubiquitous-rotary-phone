import { ConnectionPool } from 'mssql'
export interface IRepository {
    insertBook(title: any, description: any, userId: any): any
    login(username: string, password: string): Promise<any>
    getAllBooks(userId: number | string): Promise<any>
    getReservedBooks(userId: number | string): Promise<any>
    doReservation(userId: number | string, bookId: number | string): Promise<any>
    getOwnerBooks(userId: number | string): Promise<any>
    eraseBook(bookId: number | string): Promise<any>
    editBook(bookId: number | string, title: string, description: string): Promise<any>
    discardReservation(userId: number | string, bookId: number | string): Promise<any>
}
export class ApiService implements IRepository {
    constructor(
        private mssql: ConnectionPool
    ) { }
    async insertBook(title, description, userId) {
        await this.mssql.request().query(`INSERT INTO BOOKS VALUES('${title}','${description}',${userId})`)
        const response = await this.mssql.request().query(`SELECT ID FROM BOOKS WHERE BOOKS.title = '${title}' AND BOOKS.descr = '${description}' AND BOOKS.userId = ${userId}`)
        // é importante verificar se a query funcionou corretamente, nesse caso isso não é feito (issue para futuro)
        return {
            title, description, userId, ID: response.recordset[0].ID
        }
    }
    async editBook(bookId: number | string, title, description) {
        const response = await this.mssql.request().query(`UPDATE BOOKS SET BOOKS.title = '${title}', BOOKS.descr = '${description}' WHERE BOOKS.ID = ${bookId}`)
        return response["recordset"]
    }
    async eraseBook(bookId: number | string) {
        const response = await this.mssql.request().query(`DELETE FROM BOOKS WHERE BOOKS.ID = ${bookId}`)
        return response["recordset"]
    }
    async login(username: string, password: string): Promise<Object[]> {
        const response = await this.mssql.request().query(`SELECT * FROM USERS WHERE USERS.email = '${username}' and USERS.pwd = '${password}'`)
        return response["recordset"]
    }
    async getAllBooks(userId: number | string) {
        const response = await this.mssql.request().query(`SELECT * FROM BOOKS WHERE BOOKS.ID NOT IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.bookId is not null) AND BOOKS.userId != ${userId}`)
        return response["recordset"]
    }
    async getReservedBooks(userId: string | number) {
        const response = await this.mssql.request().query(`SELECT * FROM BOOKS WHERE ID IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.userId = ${userId})`)
        return response["recordset"]
    }
    async doReservation(userId: string | number, bookId: string | number) {
        let response = null
        response = await this.mssql.request().query(`EXEC RESERVE_BOOK @userId = ${userId}, @bookId = ${bookId}`)
        return {
            userId, bookId
        }
    }
    async getOwnerBooks(userId: string | number) {
        return await this.mssql.request().query(`SELECT * FROM BOOKS WHERE BOOKS.userId = ${userId}`)
    }
    async discardReservation(userId, bookId) {
        return await this.mssql.request().query(`EXEC DEVOLVE_BOOK @bookId = ${bookId}, @userId = ${userId}`)
    }
}