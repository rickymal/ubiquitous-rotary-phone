import { ViewController } from './usecases/Views/HomepageController'
import { RouterService } from './services/RoutesService'
import { GetHomepageUseCase } from './usecases/Views/HomepageUseCase'
import { ViewService } from './services/ViewService'
import { ApiController } from './usecases/Apis/ApiController'
import { ApiService } from './services/RouteService'
import sql from 'mssql'
import { AuthenticationService } from './services/Authentication'
const viewService = new ViewService()
const viewController = new ViewController(viewService)
const config = {
  server: 'localhost',
  port: 49679,
  user: 'sa',
  database: "mvp_biblioteca_01",
  password: '123456789',
  options: {
    enableArithAbort: true,
    trustedConnection: true,
    encrypt: true,
    trustServerCertificate: true
  }
}
export const routerService = new RouterService()
sql.connect(config)
  .then(mssqlRepository => {
    const apiService = new ApiService(mssqlRepository)
    const authenticationService = new AuthenticationService(apiService)
    const apiController = new ApiController(apiService, authenticationService)
    routerService.insert("/", (request, response) => viewController.main_page(request, response))
    routerService.insert("/index", (request, response) => viewController.get_html_page(request, response, "index"))
    routerService.insert("/login", (request, response) => viewController.get_html_page(request, response, "login"))
    routerService.insert('/styles/login.css', (request, response) => viewController.get_css_style(request, response, "login"))
    routerService.insert('/scripts/login.js', (request, response) => viewController.get_javascript_code(request, response, "login"))
    routerService.insert("/dashboard", (request, response) => viewController.get_html_page(request, response, "dashboard"))
    routerService.insert('/styles/dashboard.css', (request, response) => viewController.get_css_style(request, response, "dashboard"))
    routerService.insert('/scripts/dashboard.js', (request, response) => viewController.get_javascript_code(request, response, "dashboard"))
    routerService.insert('/styles/global.css', (request, response) => viewController.get_css_style(request, response, "global"))
    routerService.insert('/styles/dashboard.css', (request, response) => viewController.get_css_style(request, response, "dashboard"))
    routerService.insert('/scripts/fetcher.js', (request, response) => viewController.get_javascript_code(request, response, "fetcher"))
    routerService.insert('/scripts/main.js', (request, response) => viewController.get_javascript_code(request, response, "main"))
    routerService.insert('/favicon.ico', (request, response) => viewController.favicon(request, response))
    routerService.insert('/api/books', (request, response) => apiController.books(request, response))
    routerService.insert('/api/make_login', (request, response) => apiController.make_login(request, response))
    routerService.insert('/api/request_reserved_books', (request, response) => apiController.request_reserved_books(request, response))
    routerService.insert('/api/request_owner_books', (request, response) => apiController.request_owner_books(request, response))
    routerService.insert('/api/choose_book', (request, response) => apiController.choose_book(request, response))
    routerService.insert('/api/devolve_reserved_book', (request, response) => apiController.devolve_reserved_book(request, response))
    routerService.insert('/api/delete_owner_book', (request, response) => apiController.delete_owner_book(request, response))
    routerService.insert('/api/edit_title', (request, response) => apiController.edit_title(request, response))
    routerService.insert('/api/add_title', (request, response) => apiController.add_title(request, response))
  })
  .catch(err => {
    throw new Error(err)
  })
