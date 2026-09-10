const {scenes,styles}=require('./catalog');
const {profileFor}=require('./personality');
const DEMO_CUSTOM_INPUT_MESSAGE='公开演示尚未接入 AI，不能翻译自定义内容。请点击“试试一个例子”查看人格适配示例。';
// Original Chinese examples composed from four preference axes; no efficacy claims.
const bodies={
 love:{
  ST:['你多次临时改计划，这让我觉得自己不被重视。','每次计划临时变动，我都会觉得自己不被重视；我想把这件事和你说清楚。','多次临时改计划，让我觉得不被重视。'],
  SF:['每次你临时改计划，我都会觉得自己不被重视。','你每次临时改计划，我心里都会有些难受，觉得自己不被重视。我希望你听见这个感受。','每次临时变动，我都会觉得自己不被重视。'],
  NT:['我想说清楚的是：反复临时改计划，会让我觉得自己不被重视。','我想让你理解这件事对我的影响：你每次临时改计划，我都会觉得自己不被重视。','我觉得不被重视，原因是你多次临时改计划。'],
  NF:['我在意的是自己有没有被重视。你每次临时改计划，都会让我觉得自己不被重视。','我希望自己的感受也被看见：每次你临时改计划，我都会难受，觉得自己不被重视。','我在意被重视的感觉；多次临时改计划让我觉得不被重视。']
 },
 work:{
  ST:['需求持续变化，周五前无法完成。','目前需求一直在变，因此周五前无法完成。我想先把这个情况说清楚。','需求一直变，周五前无法完成。'],
  SF:['我想和你对齐目前的情况：需求持续变化，周五前无法完成。','我想把进度和你说明白：需求持续变化，周五前无法完成。','和你说明一下：需求一直变，周五前无法完成。'],
  NT:['当前的问题是需求变化和交付安排不匹配：需求一直在变，周五前无法完成。','我想和你说明交付安排的问题：需求持续变化，按目前的情况，周五前无法完成。','交付安排需要调整：需求持续变化，周五前无法完成。'],
  NF:['我希望我们对交付有一致的理解：需求持续变化，周五前无法完成。','我想先和你对齐我们对交付的理解：因为需求一直在变，周五前无法完成。','先对齐交付预期：需求一直变，周五前无法完成。']
 },
 daily:{
  ST:['这周我很累，所以周末想休息。','这周我有些累，想用周末好好休息。','这周很累，周末想休息。'],
  SF:['我这周很累，周末想让自己好好休息。','想和你说一下我的状态：这周我很累，周末想好好休息。','我这周很累，想在周末休息。'],
  NT:['周末我想留给休息，原因是这周很累。','我想把周末留给自己恢复精力，这周确实很累。','周末需要休息，这周很累。'],
  NF:['我想照顾一下自己的状态：这周很累，周末想休息。','我想尊重自己现在需要休息的感受，这周很累，周末想留给自己。','想照顾自己的状态，这周很累，周末想休息。']
 }
};
const endings={
 love:{IJ:'希望下次有变化时，能提前告诉我。',IP:'希望下次有变化时能提前告诉我，具体怎么沟通可以商量。',EJ:'我们商量一下，下次有变化时提前告诉我，好吗？',EP:'下次有变化时，我希望你提前告诉我。你觉得怎么沟通更合适？'},
 work:{IJ:'需要重新确认需求范围和交付安排。',IP:'需要重新评估需求范围和交付安排，具体调整方式可以讨论。',EJ:'我们一起确认需求范围，再明确交付安排，好吗？',EP:'我们可以一起讨论怎么调整范围和交付安排，你有什么想法？'},
 daily:{IJ:'这次就不一起出去了。',IP:'这次不一起出去了，周末就留给休息。',EJ:'和你说一下我的安排：这次不一起出去了。',EP:'和你说一声，这次不一起出去了，周末想放松着休息。'}
};
function demoResult(request){
 const input=typeof request==='string'?{scene:request}:request||{};
 const scene=scenes.find(s=>s.id===input.scene)||scenes[2];
 const profile=profileFor(input.theirs);
 const type=profile.type==='不确定'?null:profile.type;
 const group=type?type.slice(1,3):'ST';
 const ending=type?endings[scene.id][type[0]+type[3]]:endings[scene.id].IJ;
 const join=type&&type[0]==='I'?'\n\n':'';
 const versions=styles.map((style,i)=>({style,text:bodies[scene.id][group][i]+join+ending,reason:type?
  `${profile.rules[1].title}：${type[1]==='S'?'从已有情况说起':'先呈现核心诉求'}；${profile.rules[2].title}：${type[2]==='T'?'交代原因与影响':'照顾人的体验'}。${profile.rules[0].title}，${profile.rules[3].title}，保留原意。`:
  '类型未知，使用事实与明确诉求，不推测对方偏好。'}));
 return {demo:true,exampleOriginal:scene.example,versions,profile};
}
function isDemoExample(request){
 const input=request||{};
 const scene=scenes.find(s=>s.id===input.scene);
 return !!scene&&typeof input.text==='string'&&input.text.trim()===scene.example;
}
module.exports={demoResult,isDemoExample,DEMO_CUSTOM_INPUT_MESSAGE};
