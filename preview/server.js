const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {bundle}=require('./bundle');
http.createServer((req,res)=>{
 const files={'/':'index.html','/runtime.js':'runtime.js','/text-input.js':'text-input.js'};
 if(req.url==='/bundle.json'){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});return res.end(bundle());}
 const file=files[req.url];if(!file){res.writeHead(404);return res.end();}
 res.writeHead(200,{'Content-Type':file.endsWith('.js')?'application/javascript; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(__dirname,file)));
}).listen(8790,'127.0.0.1',()=>console.log('MBTI preview: http://127.0.0.1:8790'));
