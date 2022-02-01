import { HomepageController } from './usecases/Views/HomepageController'
import { RouterService } from './services/RoutesService'
import { GetHomepageUseCase } from './usecases/Views/HomepageUseCase'


// Aqui eu devo injetar todos os serviços necessários para cumprir com este uso de caso, repositores, etc;
const getHomepageUseCase = new GetHomepageUseCase()


// No controller só devo injetar o 
const homepageController = new HomepageController(getHomepageUseCase)
export const routerService = new RouterService()

routerService.insert("/", (request, response) => homepageController.handle(request,response))




// import { Router } from "express";
// import { createUserController } from "./Cases/CreateUser";

// const router = Router()

// router.post('/users',(req,res) => {
//     return createUserController.handle(req,res)
// })

// export { router }

// S : A classe deve ter apenas uma única tarefa
// O
// interface Remuneravel {
//     remuneracao() : any;
// }

// class Clt implements Remuneravel {
//     remuneracao() {
//         return 0;
//     }
// }

// class Pj implements Remuneravel {
//     remuneracao() {
//         return 1;
//     }
// }

// class Folha {
//     public function calcular()
// }

// L: 

// I : Uma classe não deve ser obrigada a implementa algo que ela não precisa

// D: depender de abstrações e não de implementações