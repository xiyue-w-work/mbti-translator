const {test}=require('node:test');const assert=require('node:assert/strict');const config=require('../miniprogram/config');const api=require('../miniprogram/utils/api');
test('demo rejects custom text instead of returning an unrelated canned answer',async()=>{
 const saved={...config};config.demoMode=true;
 try{
  await assert.rejects(api.translate({scene:'love',mine:'ENFP',theirs:'INTP',text:'你老是不回我消息，怎么回事？'}),/公开演示.*自定义内容/);
 }finally{Object.assign(config,saved)}
});
test('demo accepts only the visible example for the selected scene',async()=>{
 const saved={...config};config.demoMode=true;
 try{
  const result=await api.translate({scene:'love',mine:'ENFP',theirs:'INTP',text:'你每次临时改计划，我都觉得自己不被重视。'});
  assert.equal(result.exampleOriginal,'你每次临时改计划，我都觉得自己不被重视。');
 }finally{Object.assign(config,saved)}
});
test('client rejects malformed successful responses',async()=>{const saved={...config};config.demoMode=false;config.apiBaseUrl='https://example.com';global.wx={request(options){options.success({statusCode:200,data:{versions:[{},{},{}]}})}};try{await assert.rejects(api.translate({}),/不完整/)}finally{Object.assign(config,saved)}});
test('client surfaces network timeout',async()=>{const saved={...config};config.demoMode=false;config.apiBaseUrl='https://example.com';global.wx={request(options){options.fail({errMsg:'request:fail timeout'})}};try{await assert.rejects(api.translate({}),/超时/)}finally{Object.assign(config,saved)}});
