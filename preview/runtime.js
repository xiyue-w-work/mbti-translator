/* Local preview adapter for this project's WXML subset; not a WeChat emulator. */
(async function () {
 const bundle = await (await fetch('./bundle.json')).json();
 const app = {globalData:{request:null,result:null}};
 const cache = {}; const instances = {}; let current = 'index'; let captured;
 window.getApp = () => app;
 window.Page = spec => { captured = spec; };
 function toast(title) { const el=document.createElement('div');el.className='toast';el.textContent=title;document.body.append(el);setTimeout(()=>el.remove(),2200); }
 window.wx = {
  navigateTo:()=>navigate('result'), navigateBack:()=>navigate('index'), redirectTo:()=>navigate('index'),
  showToast:({title})=>toast(title),
  setClipboardData:async({data,success,fail})=>{try{await navigator.clipboard.writeText(data);success?.();}catch{fail?.();}},
  request:({url,method='GET',data,timeout=30000,header={},success,fail})=>{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
   fetch(url,{method,headers:header,body:data===undefined?undefined:JSON.stringify(data),signal:controller.signal})
    .then(async response=>{let body;try{body=await response.json();}catch{body={};}success?.({statusCode:response.status,data:body});})
    .catch(error=>fail?.({errMsg:error.name==='AbortError'?'request:fail timeout':'request:fail network'}))
    .finally(()=>clearTimeout(timer));
   return {abort:()=>controller.abort()};
  }
 };
 function load(id) {
  if(cache[id])return cache[id].exports;
  const module={exports:{}};cache[id]=module;
  function localRequire(relative){const parts=id.split('/');parts.pop();for(const part of relative.split('/')){if(part==='..')parts.pop();else if(part!=='.')parts.push(part);}let key=parts.join('/');if(!key.endsWith('.js'))key+='.js';return load(key);}
  new Function('require','module','exports',bundle.modules[id])(localRequire,module,module.exports);
  return module.exports;
 }
 load('config.js');
 function evaluate(expression,scope){return new Function('scope','with(scope){return ('+expression+')}')(scope);}
 function value(raw,scope){if(raw===null)return null;const full=raw.match(/^\{\{([\s\S]*)\}\}$/);if(full)return evaluate(full[1],scope);return raw.replace(/\{\{([\s\S]*?)\}\}/g,(_,exp)=>evaluate(exp,scope)??'');}
 function renderNode(node,scope,parent,skipLoop=false){
  if(node.nodeType===3){parent.append(document.createTextNode(value(node.textContent,scope)));return;}
  if(node.nodeType!==1)return;
  const attr=name=>node.getAttribute(name);
  if(attr('wx:for')&&!skipLoop){const list=value(attr('wx:for'),scope)||[];list.forEach((item,index)=>renderNode(node,{...scope,[attr('wx:for-item')||'item']:item,[attr('wx:for-index')||'index']:index},parent,true));return;}
  if(attr('wx:if')&&!value(attr('wx:if'),scope))return;
  if(node.hasAttribute('wx:else')){let prev=node.previousElementSibling;if(prev&&value(prev.getAttribute('wx:if'),scope))return;}
  const tag=node.tagName;const el=document.createElement({view:'div',text:'span',picker:'select'}[tag]||tag);
  for(const a of node.attributes){if(a.name.startsWith('wx:')||a.name.startsWith('bind')||['range','value','auto-height','adjust-position','cursor-spacing','placeholder-class','loading','selectable'].includes(a.name))continue;const v=value(a.value,scope);if(a.name==='disabled'){el.disabled=!!v;continue;}el.setAttribute(a.name,String(v??''));}
  if(tag==='picker'){const selected=Number(value(attr('value'),scope));value(attr('range'),scope).forEach((text,i)=>{const option=document.createElement('option');option.textContent=text;option.value=i;option.selected=i===selected;el.append(option);});}
  else for(const child of node.childNodes)renderNode(child,scope,el);
  if(tag==='input'||tag==='textarea')el.value=value(attr('value'),scope)||'';
  for(const [binding,event] of [['bindtap','click'],['bindinput','input'],['bindchange','change']])if(attr(binding)){
   const instance=instances[current];
   const notify=()=>{if(instances[current]!==instance||!el.isConnected)return;instance[attr(binding)]({currentTarget:{dataset:{...el.dataset}},detail:{value:el.value}});};
   if(binding==='bindinput'&&(tag==='input'||tag==='textarea'))window.MbtiTextInput.bindTextInput(el,notify);
   else el.addEventListener(event,notify);
  }
  parent.append(el);
 }
 const templates={};for(const name of ['index','result']){
  const xml='<root xmlns:wx="urn:wx">'+bundle.templates[name].replace(/&(?!amp;|lt;|gt;|quot;)/g,'&amp;').replace(/wx:else(?=[\s>])/g,'wx:else=""')+'</root>';
  const doc=new DOMParser().parseFromString(xml,'application/xml');if(doc.querySelector('parsererror'))throw Error(doc.querySelector('parsererror').textContent);templates[name]=doc.documentElement;
 }
 function render(){
  const active=document.activeElement;const field=active?.dataset?.field;const start=active?.selectionStart;const end=active?.selectionEnd;
  const root=document.getElementById('app');root.replaceChildren();
  document.getElementById('mini-style').textContent=(bundle.common+'\n'+bundle.styles[current]).replace(/(-?[\d.]+)rpx/g,(_,n)=>Number(n)/2+'px').replace(/(^|\n)page\s*\{/g,'$1#app{');
  for(const node of templates[current].childNodes)renderNode(node,instances[current].data,root);
  if(field){const input=root.querySelector(`[data-field="${field}"]`);if(input&&['INPUT','TEXTAREA'].includes(input.tagName)){input.focus({preventScroll:true});if(start!==null)input.setSelectionRange(start,end);}}
 }
 function navigate(name){
  current=name;if(!instances[name]){load(`pages/${name}/${name}.js`);instances[name]={...captured,data:structuredClone(captured.data),setData(update){Object.assign(this.data,update);if(instances[current]===this)render();}};}
  if(name==='result')instances[name].onLoad?.();render();window.scrollTo(0,0);
 }
 navigate('index');
})().catch(error=>{console.error(error);document.getElementById('app').textContent='预览加载失败：'+error.message;});
