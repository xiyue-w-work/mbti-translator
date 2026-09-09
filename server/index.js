const http=require('node:http');const {translate,publicError}=require('./translation');
function createServer(options={}){
 const buckets=new Map();const limit=options.rateLimit??20;
 const server=http.createServer(async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  if(req.url==='/health'&&req.method==='GET')return send(200,{ok:true});
  if(req.url!=='/api/translate'||req.method!=='POST')return send(404,{error:'接口不存在'});
  const now=Date.now();for(const [key,value] of buckets)if(value.expires<=now)buckets.delete(key);
  const key=req.socket.remoteAddress;const bucket=buckets.get(key)||{count:0,expires:now+60000};bucket.count++;buckets.set(key,bucket);
  if(bucket.count>limit){req.resume();return send(429,{error:'操作太频繁，请稍后再试'});}
  try{
   let size=0;const chunks=[];
   for await(const chunk of req){size+=chunk.length;if(size>24576){send(413,{error:'输入内容过长'});req.resume();return;}chunks.push(chunk);}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw publicError('请求格式不正确');}
   send(200,await translate(body,options));
  }catch(error){if(!res.headersSent)send(error.status||500,{error:error.status?error.message:'服务暂时不可用，请重试'});}
 });
 server.requestTimeout=35000;server.headersTimeout=10000;return server;
}
if(require.main===module){const port=Number(process.env.PORT||8787);createServer().listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`MBTI API listening on port ${port}`));}
module.exports={createServer};
