import { ViewController } from './usecases/Views/HomepageController'
import { RouterService } from './services/RoutesService'
import { GetHomepageUseCase } from './usecases/Views/HomepageUseCase'
import {ViewService} from './services/ViewService'
import { ApiController } from './usecases/Apis/ApiController'
import { ApiService } from './services/RouteService'
// Aqui eu devo injetar todos os serviços necessários para cumprir com este uso de caso, repositores, etc;
const getHomepageUseCase = new GetHomepageUseCase()

// No controller só devo injetar o 
const viewService = new ViewService()
const viewController = new ViewController(viewService)


import pkg from "sequelize"

const {Sequelize,  Model, DataTypes} = pkg

// 'mvcbook','123'
const sequelize = new Sequelize('mvp_biblioteca_01','mvcbook','123456789',{
    dialect : 'mssql',
    host : '127.0.0.1',
    port : 49679
})


export class User extends Model {}

var dt = DataTypes;
User.init(
  {
    email: dt.STRING,
    password: dt.STRING,
  },
  { sequelize, modelName: "user" }
);

sequelize.sync({ force: true })

// const apiService = new ApiService(sequelize)
// const apiController = new ApiController(apiService)

// export const routerService = new RouterService()
// routerService.insert("/", (request, response) => viewController.main_page(request,response))

// routerService.insert("/index",(request,response) => viewController.get_html_page(request,response,"index"))

// routerService.insert('/styles/global.css',(request,response) => viewController.get_css_style(request,response,"global"))
// routerService.insert('/styles/dashboard.css',(request,response) => viewController.get_css_style(request,response,"dashboard"))

// routerService.insert('/scripts/fetcher.js',(request,response) => viewController.get_javascript_code(request,response,"fetcher"))
// routerService.insert('/scripts/main.js',(request,response) => viewController.get_javascript_code(request,response,"main"))
// routerService.insert('/favicon.ico',(request,response) => viewController.favicon(request,response))

// routerService.insert('/api/books',(request,response) => apiController.books(request,response))




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