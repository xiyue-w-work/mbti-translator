const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHandler}=require('../api/translate');

function response(){return {statusCode:0,headers:{},body:null,setHeader(name,value){this.headers[name]=value;},status(code){this.statusCode=code;return this;},json(value){this.body=value;return this;}};}

test('Vercel function accepts a valid mobile translation request',async()=>{
 let captured;
 const handler=createHandler({translateImpl:async body=>{captured=body;return {demo:false,versions:[]};}});
 const req={method:'POST',headers:{'x-forwarded-for':'203.0.113.8'},body:{scene:'love',mode:'rewrite',mine:'ENFP',theirs:'INTP',text:'你为什么总是不回我的消息？'}};
 const res=response();await handler(req,res);
 assert.equal(res.statusCode,200);assert.equal(res.body.demo,false);assert.equal(captured.text,req.body.text);assert.equal(res.headers['Cache-Control'],'no-store');
});

test('Vercel function rejects other methods and oversized requests',async()=>{
 const handler=createHandler({translateImpl:async()=>assert.fail('must not call model')});
 let res=response();await handler({method:'GET',headers:{},body:null},res);assert.equal(res.statusCode,405);
 res=response();await handler({method:'POST',headers:{'content-length':'25000'},body:{}},res);assert.equal(res.statusCode,413);
});
