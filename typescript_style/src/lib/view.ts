import * as path from "path";
import * as fs from "fs";
import App from "./app";


export default class View 
{   
    protected folder:string;

    protected html:Map<string,string>;

    protected app:App;
        
    public constructor(config : {folder:string, app?:App}) 
    {
        this.folder = config.folder;
        this.html = new Map();
        this.app = config.app;
    }

    public getFolder():string
    {
        return path.normalize(this.folder); 
    }

    protected getTpl(name:string):string
    {
        return this.html.get(path.join(this.getFolder(), name));
    }

    public loadTemplates():Promise<any>
    {
        interface IFileMap {fname:string; data:string; }

        return new Promise((resolve) => {

            fs.readdir(this.getFolder(), (err:Error, fnames:string[]) => {
                if (err) {throw err; }

                console.log('loading templates...');
                let files:Promise<any>[] = [];

                fnames
                .filter(fname => {return fname.endsWith('.html');})
                .forEach(fname => {
                    files.push(new Promise((resolve)=>{
                        loadFile.call(this, fname, resolve);
                    }));
                });

                Promise.all(files).then((values:IFileMap[])=>{
                    saveFiles.call(this, values);
                    console.log('templates loaded ok');
                    resolve();
                })
                .catch((e:Error)=> console.log(e));
            });
        });

        function loadFile(this:View, fname:string, resolve:Function):void 
        {
            fname = path.join(this.folder, fname);

            fs.readFile(fname, 'utf8', (err:Error, data:string) =>{
                if (err) {throw err; }
                let response:IFileMap = {fname: fname, data: data};
                resolve(response);
            });
        }

        function saveFiles(this:View, values:IFileMap[]):void
        {
            values.forEach((file:IFileMap)=>{
                this.html.set(file.fname, file.data);
            });
        }
    }

    public render(tplName:string, data:any={}):string
    {
        let tpl:string = this.getTpl(tplName);

        for(let key in data){
            tpl = tpl.split('{{'+key+'}}').join(data[key]);
        }

        return tpl;
    }
}