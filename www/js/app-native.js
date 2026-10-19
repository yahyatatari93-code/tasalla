// زر الرجوع بالأندرويد (بيشتغل بس جوّا التطبيق المثبّت، وما بيعمل شي بالمتصفح)
// - بالشاشة الرئيسية: بيطلع من التطبيق.
// - بنص لعبة: لازم تكبس رجوع مرتين ورا بعض، حتى ما تضيع اللعبة بالغلط.
// - غير هيك: بيرجع للشاشة الرئيسية.
(function(){
  var C=window.Capacitor;
  if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  var App=C.Plugins&&C.Plugins.App;
  if(!App)return;
  document.documentElement.classList.add("native");
  var armed=0;
  function toast(t){
    var o=document.querySelector(".toast");if(o)o.remove();
    var d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);
    setTimeout(function(){d.remove()},1900);
  }
  App.addListener("backButton",function(){
    var page=location.pathname.split("/").pop()||"index.html";
    if(page==="index.html"||page===""){App.exitApp();return}
    var home=document.getElementById("homeBtn");
    var playing=home&&home.hidden;
    if(playing&&Date.now()-armed>2000){armed=Date.now();toast("اكبس رجوع كمان مرة لتطلع من اللعبة");return}
    location.href="index.html";
  });
})();
