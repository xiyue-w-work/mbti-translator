const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('../preview/bundle');
const out = path.resolve(__dirname, '../dist');
fs.mkdirSync(out, {recursive:true});
for (const name of ['index.html','runtime.js']) fs.copyFileSync(path.resolve(__dirname,'../preview',name),path.join(out,name));
// Always ship a demo config; deployment must never export a local service address or credentials.
const data = JSON.parse(bundle());
data.modules['config.js'] = 'module.exports={demoMode:true,apiBaseUrl:""};';
fs.writeFileSync(path.join(out,'bundle.json'), JSON.stringify(data));
fs.writeFileSync(path.join(out,'.nojekyll'), '');
console.log('Static demo built in dist/');
