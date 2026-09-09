const {test}=require('node:test');const assert=require('node:assert/strict');const {createServer}=require('../server');
async function withServer(options,fn){const server=createServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));try{await fn(`http://127.0.0.1:${server.address().port}`)}finally{await new Promise(r=>server.close(r))}}
const input={scene:'daily',mode:'rewrite',mine:'INFP',theirs:'INTJ',text:'我想休息'};
test('HTTP demo endpoint and malformed JSON',()=>withServer({env:{DEMO_MODE:'true'}},async base=>{
 let r=await fetch(base+'/api/translate',{method:'POST',body:JSON.stringify(input)});assert.equal(r.status,200);assert.equal((await r.json()).demo,true);
 r=await fetch(base+'/api/translate',{method:'POST',body:'{'});assert.equal(r.status,400);
}));
test('HTTP rejects oversized bodies and throttles requests',()=>withServer({env:{},rateLimit:1},async base=>{
 let r=await fetch(base+'/api/translate',{method:'POST',body:'x'.repeat(25000)});assert.equal(r.status,413);
 r=await fetch(base+'/api/translate',{method:'POST',body:JSON.stringify(input)});assert.equal(r.status,429);
}));
