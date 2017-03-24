const path = require('path');
const fs = require('fs');

class View 
{	
	["@properties"](){ return {

	folder: null,

	html: new Map(),

	app: null
		
	};}

	constructor({folder, app})
	{
		this.folder = folder;
	}

	getFolder() 
	{ 
		return path.normalize(this.folder); 
	}

	getTpl(name) 
	{
		return this.html.get(path.join(this.getFolder(), name));
	}

	loadTemplates()
	{
		return new Promise((resolve) => {

			fs.readdir(this.getFolder(), (err, fnames) => {
				if (err) {throw err; }

				console.log('loading templates...');
				let files = [];

				fnames
				.filter(fname => {return fname.endsWith('.html');})
				.forEach(fname => {
					files.push(new Promise((resolve)=>{
						loadFile.call(this, fname, resolve);
					}));
				});

				Promise.all(files).then((values)=>{
					saveFiles.call(this, values, resolve);
					console.log('templates loaded ok');
					resolve();
				})
				.catch();
			});
		});

		function loadFile(fname, resolve) {
			fname = path.join(this.folder, fname);

			fs.readFile(fname, 'utf8', (err,data) =>{
				if (err) {throw err; }
				resolve({fname: fname, data: data});
			});
		}

		function saveFiles(values, resolve) {
			values.forEach((file)=>{
				this.html.set(file.fname, file.data);
			});
		}
	}

	render(tplName, data = {})
	{
		let tpl = this.getTpl(tplName);

		for(let key in data){
			tpl = tpl.split('{{'+key+'}}').join(data[key]);
		}

		return tpl;
	}
}

Object.assign(View.prototype, View.prototype["@properties"]());

module.exports = View;