// تسجيل خدمة العمل بدون إنترنت (بتشتغل بس على https أو localhost)
// جوّا تطبيق الأندرويد (Capacitor) الملفات أصلاً على الجهاز، فما في داعي لخدمة العمل.
try{if(!window.Capacitor&&"serviceWorker" in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(function(){})}catch(e){}
