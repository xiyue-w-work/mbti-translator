// Editorial communication rules derived from preference descriptions, not validated persuasion claims.
const {types}=require('./catalog');
const sources=[
 {id:'preferences',title:'Myers & Briggs Foundation · 四组偏好定义',url:'https://www.myersbriggs.org/my-mbti-personality-type/the-mbti-preferences/',kind:'类型理论'},
 {id:'communication',title:'Introduction to Type and Communication · 第 2 页',url:'https://asia.themyersbriggs.com/wp-content/uploads/MB6289_preview.pdf',kind:'官方实践指南'},
 {id:'limits',title:'McCrae & Costa (1989) · 类型划分的证据局限',url:'https://pubmed.ncbi.nlm.nih.gov/2709300/',kind:'实证研究'}
];
const rules={
 E:{axis:'E / I',letter:'E',title:'对话感',action:'表达清楚后，可邀请对方讨论；不要求立刻回应。'},
 I:{axis:'E / I',letter:'I',title:'思考空间',action:'把意思组织完整，适当分段；避免连续追问。'},
 S:{axis:'S / N',letter:'S',title:'具体事实',action:'从原文已有的事件、时间和细节说起，不编造例子。'},
 N:{axis:'S / N',letter:'N',title:'整体意义',action:'先说明核心问题或诉求，再用原文事实支撑，不添加远期后果。'},
 T:{axis:'T / F',letter:'T',title:'原因与逻辑',action:'说明事实、影响和请求之间的因果；原文的感受也必须保留。'},
 F:{axis:'T / F',letter:'F',title:'感受与价值',action:'让人的感受和在意的事更清晰，同时保留事实与拒绝。'},
 J:{axis:'J / P',letter:'J',title:'明确安排',action:'请求或已有决定说清楚；只沿用原文的时间，不新增承诺。'},
 P:{axis:'J / P',letter:'P',title:'方式留余地',action:'可协商执行方式，但不能把已确定的拒绝改成可能同意。'}
};
function profileFor(type){
 const known=types.includes(type)&&type!=='不确定';
 const selected=known?type.split('').map(letter=>({...rules[letter]})):[];
 return {type:known?type:'不确定',rules:selected,summary:known?selected.map(r=>r.title).join(' · '):'按事实、感受和明确诉求表达，不猜测人格',sources,notice:'偏好是参考，不是对个体的定论；中文话术为编辑推导，尚未经接受度实验验证。'};
}
function communicationPlan(input){
 const receiver=profileFor(input.theirs),sender=profileFor(input.mine);
 const bridge=sender.rules.filter((rule,i)=>receiver.rules[i]&&rule.letter!==receiver.rules[i].letter).map(rule=>({from:rule.letter,to:receiver.rules.find(r=>r.axis===rule.axis).letter}));
 return {receiver,sender,bridge,priority:'原文与实际沟通偏好 > 场景和目的 > MBTI 倾向',instructions:[
  '依据 receiver.rules 改变信息顺序、论据呈现和请求方式，不要仅更换称呼或添加人格标签。',
  'sender 仅帮助检查表达差异，不据此推断原文没有的情绪、性格或立场。',
  '输入中的 preference 明确覆盖与其冲突的类型建议；不得为制造类型差异牺牲自然性与原意。',
  'reason 只描述本条输出实际发生的改动，不声称接收者一定喜欢、一定接受。',
  'T/F 不是智力或情绪强弱，E/I 不是社交能力，J/P 不是责任心高低。'
 ]};
}
module.exports={profileFor,communicationPlan,sources};
