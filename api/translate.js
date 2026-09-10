const {translate}=require('../server/translation');

const buckets=new Map();
function clientKey(req){return String(req.headers?.['x-forwarded-for']||req.headers?.['x-real-ip']||'unknown').split(',')[0].trim();}
function createHandler({translateImpl=translate,rateLimit=10}={}){
 return async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST')return res.status(405).json({error:'仅支持 POST 请求'});
  const declared=Number(req.headers?.['content-length']||0);
  if(declared>24576)return res.status(413).json({error:'输入内容过长'});
  const now=Date.now();for(const [key,value] of buckets)if(value.expires<=now)buckets.delete(key);
  const key=clientKey(req);const bucket=buckets.get(key)||{count:0,expires:now+60000};bucket.count++;buckets.set(key,bucket);
  if(bucket.count>rateLimit)return res.status(429).json({error:'操作太频繁，请稍后再试'});
  try{
   const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
   if(Buffer.byteLength(JSON.stringify(body||{}),'utf8')>24576)return res.status(413).json({error:'输入内容过长'});
   return res.status(200).json(await translateImpl(body));
  }catch(error){return res.status(error.status||500).json({error:error.status?error.message:'服务暂时不可用，请重试'});}
 };
}

module.exports=createHandler();
module.exports.createHandler=createHandler;
