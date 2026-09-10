const {types,scenes}=require('../../utils/catalog');const api=require('../../utils/api');const config=require('../../config');
Page({
 data:{types,scenes,scene:'daily',sceneExample:scenes[2].example,mineIndex:0,theirsIndex:0,mode:'rewrite',text:'',purpose:'',preference:'',expanded:false,isExample:false,canSubmit:false,busy:false,error:'',demo:config.demoMode},
 selectScene(e){
  const scene=e.currentTarget.dataset.id;const sceneExample=scenes.find(s=>s.id===scene).example;
  this.setData(this.data.isExample?{scene,sceneExample,text:sceneExample,isExample:true,canSubmit:true,error:''}:{scene,sceneExample,isExample:false,canSubmit:!this.data.demo&&!!this.data.text.trim(),error:''});
 },
 selectType(e){this.setData({[e.currentTarget.dataset.field]:Number(e.detail.value)});},
 swap(){this.setData({mineIndex:this.data.theirsIndex,theirsIndex:this.data.mineIndex});},
 selectMode(e){this.setData({mode:e.currentTarget.dataset.mode});},
 input(e){
  const field=e.currentTarget.dataset.field;const value=e.detail.value;
  if(field!=='text')return this.setData({[field]:value,error:''});
  const isExample=value.trim()===this.data.sceneExample;
  this.setData({text:value,isExample,canSubmit:!!value.trim()&&(!this.data.demo||isExample),error:''});
 },
 example(){this.setData({text:this.data.sceneExample,isExample:true,canSubmit:true,error:''});},
 toggle(){this.setData({expanded:!this.data.expanded});},
 async submit(){
  if(this.data.busy)return;
  if(!this.data.text.trim())return this.setData({error:'先写下你想说的话吧。'});
  if(this.data.demo&&!this.data.isExample)return this.setData({error:'公开演示尚未接入 AI，不能翻译自定义内容。请点击“试试一个例子”查看人格适配示例。'});
  const d=this.data;const request={scene:d.scene,mode:d.mode,mine:types[d.mineIndex],theirs:types[d.theirsIndex],text:d.text,purpose:d.purpose,preference:d.preference};
  this.setData({busy:true,error:''});
  try{const result=await api.translate(request);getApp().globalData.request=request;getApp().globalData.result=result;wx.navigateTo({url:'/pages/result/result',fail:()=>this.setData({error:'页面打开失败，请重试'})});}
  catch(error){this.setData({error:error.message});}finally{this.setData({busy:false});}
 }
});
