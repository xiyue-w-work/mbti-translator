const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('../preview/bundle');
const out = path.resolve(__dirname, '../dist');
fs.mkdirSync(out, {recursive:true});
for (const name of ['index.html','runtime.js','text-input.js']) fs.copyFileSync(path.resolve(__dirname,'../preview',name),path.join(out,name));
// The live Vercel build calls a same-origin serverless API. Neither build embeds credentials.
const data = JSON.parse(bundle());
const live = process.env.WEB_LIVE_MODE === 'true';
if(live){
 const htmlPath=path.join(out,'index.html');
 const html=fs.readFileSync(htmlPath,'utf8')
  .replace('MBTI TRANSLATOR / DEMO','MBTI TRANSLATOR / AI')
  .replace('场景示例随对方人格变化；自定义改写待接入 AI。','输入任意原话，由 AI 按对方的沟通偏好实时改写。');
 fs.writeFileSync(htmlPath,html);
}
data.modules['config.js'] = live?'module.exports={demoMode:false,apiBaseUrl:"/"};':'module.exports={demoMode:true,apiBaseUrl:""};';
fs.writeFileSync(path.join(out,'bundle.json'), JSON.stringify(data));
fs.writeFileSync(path.join(out,'.nojekyll'), '');
console.log(`${live?'Live':'Static demo'} web build created in dist/`);
