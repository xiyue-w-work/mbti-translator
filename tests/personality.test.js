const {test}=require('node:test');const assert=require('node:assert/strict');
const {demoResult}=require('../miniprogram/utils/demo');const {types,scenes}=require('../miniprogram/utils/catalog');
test('receiver changes the actual message, not only its label',()=>{
 const input={scene:'love',mine:'INFP'};
 const a=demoResult({...input,theirs:'INTJ'}),b=demoResult({...input,theirs:'INFP'});
 assert.notEqual(a.versions[0].text,b.versions[0].text);
});
test('all 16 receiver strategies preserve core facts in all three examples',()=>{
 for(const scene of scenes){
  const outputs=types.slice(1).map(theirs=>demoResult({scene:scene.id,mine:'INFP',theirs}));
  assert.equal(new Set(outputs.map(r=>r.versions[0].text)).size,16);
  for(const result of outputs){assert.equal(result.profile.rules.length,4);assert.ok(result.profile.sources.length>=2);
   for(const v of result.versions){assert.ok(v.text.length>10);if(scene.id==='love')assert.match(v.text,/不被重视/);if(scene.id==='work'){assert.match(v.text,/周五/);assert.match(v.text,/无法完成/);}if(scene.id==='daily'){assert.match(v.text,/累/);assert.match(v.text,/不.*出去/);assert.doesNotMatch(v.text,/下次一定|改天约|也许/);}}
  }
 }
});
test('unknown receiver stays neutral and demo admits arbitrary text is not rewritten',()=>{
 const result=demoResult({scene:'work',theirs:'不确定',text:'完全不同的原话'});
 assert.equal(result.profile.type,'不确定');assert.equal(result.demo,true);assert.notEqual(result.exampleOriginal,'完全不同的原话');
});
test('client demo adapter carries receiver type end to end',async()=>{
 const api=require('../miniprogram/utils/api');
 const a=await api.translate({scene:'work',theirs:'ISTJ'});
 const b=await api.translate({scene:'work',theirs:'ENFP'});
 assert.equal(a.profile.type,'ISTJ');assert.equal(b.profile.type,'ENFP');assert.notEqual(a.versions[0].text,b.versions[0].text);
});
test('live strategy retains explicit preference priority and sender/receiver differences',()=>{
 const {communicationPlan}=require('../miniprogram/utils/personality');
 const plan=communicationPlan({mine:'INFP',theirs:'ESTJ',preference:'先回应感受'});
 assert.equal(plan.receiver.type,'ESTJ');assert.equal(plan.sender.type,'INFP');assert.equal(plan.bridge.length,4);
 assert.match(plan.priority,/实际沟通偏好/);assert.ok(plan.instructions.some(s=>s.includes('preference')&&s.includes('覆盖')));
});
