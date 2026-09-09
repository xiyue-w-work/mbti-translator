const {scenes,directions,types}=require('../../utils/catalog');const api=require('../../utils/api');const {demoResult}=require('../../utils/demo');
Page({
 data:{request:null,result:null,sceneName:'',directions,types,receiverIndex:0,showSources:false,busy:false,error:'',showOriginal:false},
 onLoad(){const {request,result}=getApp().globalData;if(!request||!result){wx.redirectTo({url:'/pages/index/index'});return;}this.setData({request,result,receiverIndex:Math.max(0,types.indexOf(request.theirs)),sceneName:(scenes.find(s=>s.id===request.scene)||scenes[2]).name});},
 selectReceiver(e){
  if(!this.data.result.demo)return;
  const receiverIndex=Number(e.detail.value);
  const request={...this.data.request,theirs:types[receiverIndex]};
  const result=demoResult(request);
  this.setData({request,result,receiverIndex});
  Object.assign(getApp().globalData,{request,result});
 },
 toggleSources(){this.setData({showSources:!this.data.showSources});},
 copySource(e){wx.setClipboardData({data:e.currentTarget.dataset.url});},
 toggleOriginal(){this.setData({showOriginal:!this.data.showOriginal});},
 back(){wx.navigateBack({fail:()=>wx.redirectTo({url:'/pages/index/index'})});},
 copy(e){const version=this.data.result.versions[Number(e.currentTarget.dataset.index)];wx.setClipboardData({data:version.text,success:()=>wx.showToast({title:'已复制，表达由你决定',icon:'none'}),fail:()=>this.setData({error:'复制失败，请重试'})});},
 async refine(e){
  if(this.data.busy||this.data.result.demo)return;
  const {index,direction}=e.currentTarget.dataset;
  this.setData({busy:true,error:''});
  try{const result=await api.translate({...this.data.request,previous:this.data.result.versions[Number(index)].text,direction});this.setData({result});getApp().globalData.result=result;}
  catch(error){this.setData({error:error.message});}finally{this.setData({busy:false});}
 }
});
