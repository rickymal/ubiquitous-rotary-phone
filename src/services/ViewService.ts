export interface IViewService {
    getHTML(content : string) : string;
    getCSS(content : string) : string;
    getJAVASCRIPT(content : string) : string;
}


import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from 'fs'


export class ViewService implements IViewService {
    private pages: Object;
    private styles: Object;
    private scripts: Object;


    constructor() {
        let pages_names = ["index.html", "dashboard.html", "login.html","registration.html"];
        let styles_names = ["dashboard.css", "main.css", "login.css","global.css","registration.css"];
        let scripts_names = ["main.js", "dashboard.js","fetcher.js","login.js","registration.js"];

        this.pages = new Object()
        this.styles = new Object()
        this.scripts = new Object()

        pages_names.forEach((e) => {
            const directory = join(process.cwd(),'src','pages','html',e)
            this.pages[e.split(".")[0]] = fs.readFileSync(directory, {
              encoding: "utf-8",
            });
        });

        styles_names.forEach((e) => {
            const directory = join(process.cwd(),'src','pages','css',e)
            this.styles[e.split(".")[0]] = fs.readFileSync(directory, {
              encoding: "utf-8",
            });
        });

        scripts_names.forEach((e) => {
            const directory = join(process.cwd(),'src','pages','javascript',e)
            this.scripts[e.split(".")[0]] = fs.readFileSync(directory, {
              encoding: "utf-8",
            });
        });
    }

    getHTML(content: string): string {
        return this.pages[content]        
    }

    getCSS(content: string): string {
        return this.styles[content]        
    }

    getJAVASCRIPT(content: string): string {
        return this.scripts[content]        
    }

}