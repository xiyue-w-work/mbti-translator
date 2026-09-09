const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const cp=require('node:child_process');
test('public demo builds with relative assets and an offline-only config',()=>{
 cp.execFileSync(process.execPath,['scripts/build-demo.js']);
 const html=fs.readFileSync('dist/index.html','utf8'),runtime=fs.readFileSync('dist/runtime.js','utf8');
 assert.match(html,/src="\.\/runtime.js"/);assert.match(runtime,/fetch\('\.\/bundle.json'\)/);
 const bundle=JSON.parse(fs.readFileSync('dist/bundle.json','utf8'));
 assert.equal(bundle.modules['config.js'],'module.exports={demoMode:true,apiBaseUrl:""};');
 assert.ok(bundle.modules['utils/personality.js']);assert.ok(bundle.templates.result);
 assert.deepEqual(fs.readdirSync('dist').sort(),['.nojekyll','bundle.json','index.html','runtime.js']);
});
