const config=require('../config');const {styles}=require('./catalog');const {demoResult,isDemoExample,DEMO_CUSTOM_INPUT_MESSAGE}=require('./demo');
function translate(input){
 if(config.demoMode)return isDemoExample(input)?Promise.resolve(demoResult(input)):Promise.reject(new Error(DEMO_CUSTOM_INPUT_MESSAGE));
 if(!config.apiBaseUrl)return Promise.reject(new Error('AI 服务尚未配置，请联系开发者'));
 return new Promise((resolve,reject)=>wx.request({url:config.apiBaseUrl.replace(/\/$/,'')+'/api/translate',method:'POST',data:input,timeout:30000,header:{'content-type':'application/json'},success(res){
  if(res.statusCode!==200)return reject(new Error(res.data&&res.data.error||'生成失败，请稍后重试'));
  if(!res.data||!Array.isArray(res.data.versions)||res.data.versions.length!==3||typeof res.data.demo!=='boolean'||!res.data.versions.every((v,i)=>v&&v.style===styles[i]&&typeof v.text==='string'&&v.text.trim()&&v.text.length<=3000&&typeof v.reason==='string'&&v.reason.trim()&&v.reason.length<=400)||(res.data.demo&&typeof res.data.exampleOriginal!=='string'))return reject(new Error('返回内容不完整，请重试'));
  resolve(res.data);
 },fail(error){reject(new Error(/timeout/.test(error.errMsg||'')?'生成超时，请重试':'网络连接失败，请检查网络后重试'));}}));
}
module.exports={translate};
