export interface IBaseUseCase {
    execute(data : any) : Promise<void>    
}