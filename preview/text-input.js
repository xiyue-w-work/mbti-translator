/* Defer page updates until the browser finishes its IME event sequence. */
(function(root){
 function bindTextInput(element,commit,{schedule=setTimeout,cancel=clearTimeout}={}){
  let composing=false;let pending=null;
  function clear(){if(pending!==null){cancel(pending);pending=null;}}
  function enqueue(){clear();pending=schedule(()=>{pending=null;if(!composing)commit();},0);}
  element.addEventListener('compositionstart',()=>{composing=true;clear();});
  element.addEventListener('compositionend',()=>{composing=false;enqueue();});
  element.addEventListener('input',event=>{if(composing||event.isComposing)return;enqueue();});
 }
 if(typeof module==='object'&&module.exports)module.exports={bindTextInput};
 else root.MbtiTextInput={bindTextInput};
})(typeof window==='undefined'?{}:window);
