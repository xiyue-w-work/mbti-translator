const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const cp=require('node:child_process');
test('public demo builds with relative assets and an offline-only config',()=>{
 cp.execFileSync(process.execPath,['scripts/build-demo.js']);
 const html=fs.readFileSync('dist/index.html','utf8'),runtime=fs.readFileSync('dist/runtime.js','utf8');
 assert.match(html,/src="\.\/runtime.js"/);assert.match(runtime,/fetch\('\.\/bundle.json'\)/);
 const bundle=JSON.parse(fs.readFileSync('dist/bundle.json','utf8'));
 assert.equal(bundle.modules['config.js'],'module.exports={demoMode:true,apiBaseUrl:""};');
 assert.ok(bundle.modules['utils/personality.js']);assert.ok(bundle.templates.result);
 assert.deepEqual(fs.readdirSync('dist').sort(),['.nojekyll','bundle.json','index.html','runtime.js','text-input.js']);
});
test('live web build enables the same-origin translation API',()=>{
 cp.execFileSync(process.execPath,['scripts/build-demo.js'],{env:{...process.env,WEB_LIVE_MODE:'true'}});
 const bundle=JSON.parse(fs.readFileSync('dist/bundle.json','utf8'));
 assert.equal(bundle.modules['config.js'],'module.exports={demoMode:false,apiBaseUrl:"/"};');
 const html=fs.readFileSync('dist/index.html','utf8');
 assert.match(html,/AI 按对方的沟通偏好实时改写/);assert.doesNotMatch(html,/自定义改写待接入 AI/);
 const runtime=fs.readFileSync('dist/runtime.js','utf8');
 assert.doesNotMatch(runtime,/demoMode\s*=\s*true/);
 assert.match(runtime,/fetch\(url/);
});
