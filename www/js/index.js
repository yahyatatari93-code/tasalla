// الشاشة الرئيسية: شاشة البداية وزر التثبيت
(function(){
  var sp=document.getElementById("splash"),seen=false;
  try{seen=sessionStorage.getItem("tg_splash")==="1";sessionStorage.setItem("tg_splash","1")}catch(e){}
  if(seen||matchMedia("(prefers-reduced-motion: reduce)").matches){sp.remove()}else{setTimeout(function(){sp.classList.add("out");setTimeout(function(){sp.remove()},600)},1300)}
  var deferred=null,box=document.getElementById("install"),btn=document.getElementById("instBtn"),hint=document.getElementById("instHint");
  var standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;if(!standalone)box.hidden=false});
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  if(ios&&!standalone&&/^https?:$/.test(location.protocol)){box.hidden=false;btn.hidden=true;hint.textContent="من Safari: اكبس زر المشاركة، بعدين «إضافة إلى الشاشة الرئيسية»."}
  btn.onclick=function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(){box.hidden=true;deferred=null})};
})();
