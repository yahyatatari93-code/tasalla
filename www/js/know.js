{
/* مين بيعرفني أكتر — من «تسلّى غو» */
const IN_APP=!!document.querySelector('meta[name="tg-app"]');
/* القوالب: {X} صاحب السؤال، {Y} التاني، {s:مذكر|مؤنث} حسب صاحب السؤال، {o:..|..} حسب التاني */
const FING=[
 ["شو أكتر أكلة {s:بيكرهها|بتكرهها} {X}؟",["الباذنجان","الكبدة","السمك","البامية"]],
 ["شو أكتر أكلة {s:بيحبها|بتحبها} {X}؟",["مشاوي","محاشي","بيتزا أو برغر","كبة"]],
 ["شو أكتر شي {s:بيعصّب|بيعصّب} {X}؟",["التأخير","الكذب","الفوضى","التطنيش"]],
 ["لو {s:ربح|ربحت} {X} مليون دولار، شو أول شي {s:بيعمله|بتعمله}؟",["سفرة","بيت","سيارة","{s:بيخبّيهن|بتخبّيهن}"]],
 ["يوم العطلة، {X} شو {s:بيحب|بتحب} {s:يعمل|تعمل}؟",["نوم","طلعة","زيارات","مسلسلات"]],
 ["شو أكتر شي {s:بيخاف|بتخاف} منه {X}؟",["الحشرات","العتمة","العلو","الوحدة"]],
 ["{X} وقت {s:يزعل|تزعل} شو {s:بيعمل|بتعمل}؟",["{s:بيسكت|بتسكت}","{s:بيعلّي|بتعلّي} صوت{s:ه|ها}","{s:بيطلع|بتطلع} من البيت","{s:بيبكي|بتبكي}"]],
 ["أي فصل {s:بيحبه|بتحبه} {X} أكتر شي؟",["الصيف","الشتي","الربيع","الخريف"]],
 ["شو مشروب {X} المفضّل؟",["قهوة","شاي","عصير","متة"]],
 ["وين {s:بيحلم|بتحلم} {X} {s:يسافر|تسافر}؟",["أوروبا","جزيرة استوائية","اليابان","بلد عربي"]],
 ["شو أول شي {s:بيعمله|بتعمله} {X} أول ما {s:يفيق|تفيق}؟",["الموبايل","قهوة أو مي","{s:بيرجع ينام|بترجع تنام}","الحمّام"]],
 ["أي حيوان بيشبه {X} أكتر شي؟",["قطة","كلب","دب","ثعلب"]],
 ["{X} على شو {s:بيصرف|بتصرف} مصاري أكتر شي؟",["أكل","ملابس","أجهزة","طلعات"]],
 ["أي نوع أفلام {s:بيحب|بتحب} {X}؟",["أكشن","كوميدي","رعب","رومانسي"]],
 ["شو أحلى هدية بتفرّح {X}؟",["ورد","ذهب أو ساعة","سفرة","شي معمول بالإيد"]],
 ["كم ساعة {s:بينام|بتنام} {X} بالعادة؟",["أقل من 6","6 أو 7","8","أكتر من 9"]],
 ["{X} بأي وقت {s:بيكون|بتكون} بأحلى مود؟",["الصبح","الضهر","المسا","نص الليل"]],
 ["{X} إذا {s:ضاع|ضاعت} بالطريق شو {s:بيعمل|بتعمل}؟",["خرائط غوغل","{s:بيسأل|بتسأل} حدا","{s:بيكابر|بتكابر} وبيكمّل","{s:بيتصل|بتتصل} ب{Y}"]],
 ["أكتر تطبيق {s:بيفتحه|بتفتحه} {X}؟",["إنستغرام","واتساب","يوتيوب","تيك توك"]],
 ["شو أكتر شي {s:بينساه|بتنساه} {X}؟",["المفاتيح","المواعيد","الموبايل","أسماء الناس"]],
 ["{X} بالسيارة شو {s:بيعمل|بتعمل}؟",["{s:بيغنّي|بتغنّي} بصوت عالي","ساكت{s:|ة}","عالموبايل","{s:بينام|بتنام}"]],
 ["أي لون {s:بيلبس|بتلبس} {X} أكتر شي؟",["أسود","أبيض","ألوان فاتحة","كحلي"]],
 ["{X} إذا {s:عصّب|عصّبت}، شو اللي {s:بيهدّيه|بيهدّيها}؟",["أكل","حضن","{s:يتركوه|يتركوها} لحال{s:ه|ها}","طلعة"]],
 ["شو {s:بيحب|بتحب} {X} {s:يسمع|تسمع}؟",["طرب قديم","أغاني جديدة","أجنبي","ولا شي، سكوت"]],
 ["شو أكتر شي {s:بيحبه|بتحبه} {X} ب{Y}؟",["ضحكت{o:ه|ها}","اهتمام{o:ه|ها}","طبخ{o:ه|ها}","شكل{o:ه|ها}"]],
 ["شو أكتر شي {s:بيزعّله|بيزعّلها} من {Y}؟",["الموبايل","التأخير","الغيرة","النسيان"]],
 ["لو {s:قدر|قدرت} {X} {s:يعيش|تعيش} بأي زمن؟",["زمن الأبيض والأسود","التسعينات","هلّق","المستقبل"]],
 ["شو {s:بيشتهي|بتشتهي} {X} بنص الليل؟",["شي حلو","شيبس","سندويشة","فواكه"]],
 ["شو أول شي لفت نظر {X} ب{Y}؟",["العيون","الضحكة","الحكي","الستايل"]],
 ["{X} بالخناقة شو {s:بيعمل|بتعمل}؟",["{s:بيعتذر|بتعتذر} أول","{s:بيستنّى|بتستنّى} {Y} {o:يعتذر|تعتذر}","{s:بيعمل|بتعمل} حال{s:ه|ها} {s:ناسي|ناسية}","{s:بيجيب|بتجيب} هدية"]],
 ["وين {s:بيرتاح|بترتاح} {X} أكتر شي؟",["البيت","البحر","الجبل","عند الأهل"]],
 ["شو الكلمة اللي {s:بيقولها|بتقولها} {X} كتير؟",["يلّا","ماشي","شو بدك","والله؟"]]
];
const POINT=["مين فينا أكتر واحد بيعصّب؟","مين بيعتذر أول؟","مين بيصرف مصاري أكتر؟","مين بيطبخ أطيب؟","مين بينام أول؟","مين أكتر واحد غيور؟","مين بيتأخر أكتر؟","مين بيضحك أكتر؟","مين أكتر واحد عنيد؟","مين قال «بحبك» أول مرة؟","مين بينسى المناسبات أكتر؟","مين أكتر واحد ماسك الموبايل؟","مين بيتحمّل التاني أكتر؟","مين أكتر واحد رومانسي؟","مين بيختار المطعم دايماً؟","مين أشطر بالسواقة؟","مين بيربح النقاشات؟","مين بيبكي بالأفلام؟"];
const SAY=["اسم أغنيتنا!","أحلى طلعة طلعناها سوا!","أكلة منطلبها ديليفري أكتر شي!","أول فيلم حضرناه سوا!","وين بدنا نسافر بالسفرة الجاية؟","حيوان بيشبهنا كثنائي!","رقم من 1 لـ10!","لون!","أكلة شامية!","اسم مدينة!","أحلى يوم بحياتنا سوا!","شي بيضحّكنا دايماً!","مكان أول لقاء!","مسلسل منحضره سوا!"];

const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const app=document.getElementById("app");const $=s=>app.querySelector(s),$$=s=>[...app.querySelectorAll(s)];
let set=ld("know_set",{p:[{n:"",g:"m"},{n:"",g:"f"}],len:15});
let G=null;

/* صوت */
let AC=null;function tone(f,d=.15,t="sine",v=.2,w=0){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const s=AC.currentTime+w,o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.setValueAtTime(f,s);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g).connect(AC.destination);o.start(s);o.stop(s+d)}catch(e){}}
const SFX={tick:()=>tone(660,.12,"triangle",.22),go:()=>{tone(880,.12,"square",.16);tone(1320,.22,"triangle",.18,.08)},yes:()=>[660,880,1175].forEach((f,i)=>tone(f,.16,"triangle",.2,i*.08)),no:()=>{tone(260,.2,"sawtooth",.13);tone(190,.3,"sawtooth",.13,.15)}};

function fmt(t,si){
  const S=G.p[si],O=G.p[1-si];
  return esc(t).replace(/\{s:([^|}]*)\|([^}]*)\}/g,(m,a,b)=>S.g==="f"?b:a).replace(/\{o:([^|}]*)\|([^}]*)\}/g,(m,a,b)=>O.g==="f"?b:a)
    .replace(/\{X\}/g,`<b>${esc(S.n)}</b>`).replace(/\{Y\}/g,`<b>${esc(O.n)}</b>`);
}

/* بناء السهرة: خليط متوازن من الأنواع التلاتة، وعن الاتنين بالتساوي */
function build(len){
  const seen=ld("know_seen",{f:[],p:[],s:[]});
  const pickN=(arr,key,n)=>{let pool=arr.map((x,i)=>i).filter(i=>!seen[key].includes(i));if(pool.length<n){seen[key]=[];pool=arr.map((x,i)=>i)}const out=shuffle(pool).slice(0,n);seen[key].push(...out);return out};
  const nf=Math.round(len*.6),np=Math.round(len*.25),ns=len-nf-np;
  const f=pickN(FING,"f",nf).map((i,k)=>({k:"f",i,si:k%2})),p=pickN(POINT,"p",np).map(i=>({k:"p",i})),s=pickN(SAY,"s",ns).map(i=>({k:"s",i}));
  sv("know_seen",seen);
  /* ترتيب حلو: نبدأ بالأصابع، ونخلط */
  const all=shuffle([...f.slice(2),...p,...s]);return [...f.slice(0,2),...all];
}

function render(){
  if(!G)return setup();
  if(G.phase==="q")return question();
  if(G.phase==="count")return countdown();
  if(G.phase==="judge")return judge();
  if(G.phase==="end")return end();
}
const sig=()=>``;

function setup(){
  const C=["var(--a)","var(--b)"];
  app.innerHTML=`${IN_APP?`<div class="top"><a class="ib" href="index.html" aria-label="الرئيسية" style="display:inline-grid;place-items:center;text-decoration:none">⌂</a></div>`:""}<section class="hero"><span class="mut small">❤️ تسلّى غو · الثنائي</span><h1>مين <em>بيعرفني</em> أكتر؟</h1>
    <p>الموبايل بالنص، وما بيتنقّل أبداً. الموبايل بيعدّ «٣، ٢، ١»، والاتنين بيجاوبوا بنفس اللحظة بالأصابع أو بالإشارة أو بالصوت.</p></section>
  <div class="card"><h3>مين الثنائي؟</h3><div class="pl">${set.p.map((x,i)=>`<label class="pi" style="--c:${C[i]}"><span class="dot"></span><input id="n${i}" value="${esc(x.n)}" placeholder="${i?"الاسم التاني":"الاسم الأول"}" maxlength="14" aria-label="الاسم ${i+1}">
    <span class="gsel">${[["m","هو"],["f","هي"]].map(([g,l])=>`<button data-g="${i}${g}" class="${x.g===g?"on":""}">${l}</button>`).join("")}</span></label>`).join("")}</div></div>
  <div class="card"><h3>طول السهرة</h3><div class="seg">${[[10,"سريعة","10 أسئلة"],[15,"عادية","15 سؤال"],[25,"طويلة","25 سؤال"]].map(([n,a,b])=>`<button data-len="${n}" class="${set.len===n?"on":""}">${a}<small>${b}</small></button>`).join("")}</div></div>
  <div class="card"><h3>كيف بتنلعب</h3><ul class="how">
    <li><b>✋</b><span><b>ارفعوا أصابعكم:</b> سؤال عن واحد منكم، ومعه 4 خيارات. عالعد، صاحب السؤال بيرفع رقم الجواب الصح، والتاني بيرفع رقم تخمينه.</span></li>
    <li><b>👉</b><span><b>أشّروا:</b> «مين فينا…؟». عالعد، الاتنين بيأشّروا بنفس اللحظة.</span></li>
    <li><b>🗣️</b><span><b>قولوها سوا:</b> عالعد، الاتنين بيقولوا الجواب بصوت عالي.</span></li>
    <li><b>✓</b><span>كبسة وحدة: تطابقتوا ولا لا؟ تلاتة ورا بعض بتعمل 🔥 وبتاخدوا نقطة زيادة.</span></li></ul></div>
  <button class="btn go" id="start">يلّا نبلّش ❤️</button>`;
  $$("[data-g]").forEach(b=>b.onclick=()=>{const i=+b.dataset.g[0];set.p[i].n=$("#n"+i).value;set.p[i].g=b.dataset.g[1];sv("know_set",set);setup()});
  $$("[data-len]").forEach(b=>b.onclick=()=>{set.p.forEach((x,i)=>x.n=$("#n"+i).value);set.len=+b.dataset.len;sv("know_set",set);setup()});
  $("#start").onclick=()=>{set.p.forEach((x,i)=>x.n=$("#n"+i).value.trim()||(i?"التاني":"الأول"));sv("know_set",set);tone(1,.01);
    G={p:set.p.map(x=>({...x})),qs:build(set.len),i:0,score:0,match:0,streak:0,best:0,know:[0,0],asked:[0,0],phase:"q"};render()};
}
function hud(){
  return `<div class="top"><div class="brand"><i>❤</i> مين بيعرفني أكتر</div><button class="ib" id="quit" aria-label="إنهاء">✕</button></div>
  <div class="hud"><div class="sc"><b>${G.score}</b><span>نقطة · سؤال ${G.i+1} من ${G.qs.length}</span></div>${G.streak>=2?`<span class="streak">🔥 ${G.streak}</span>`:""}</div>
  <div class="bar"><i style="width:${G.i/G.qs.length*100}%"></i></div>`;
}
function qHTML(q){
  if(q.k==="f"){const [t,o]=FING[q.i];const S=G.p[q.si],O=G.p[1-q.si];
    return `<div class="qcard" style="--c:${q.si?"var(--b)":"var(--a)"}"><span class="kind">✋ ارفعوا أصابعكم · عن ${esc(S.n)}</span><h2>${fmt(t,q.si)}</h2>
      <p class="who"><b>${esc(S.n)}</b> بيرفع الجواب الصح، و<b>${esc(O.n)}</b> بيرفع تخمينه.</p>
      <div class="opts">${o.map((x,k)=>`<div class="op"><span class="n">${k+1}</span><span>${fmt(x,q.si)}</span></div>`).join("")}</div></div>`}
  if(q.k==="p")return `<div class="qcard" style="--c:var(--gold)"><span class="kind">👉 أشّروا مع بعض</span><h2>${esc(POINT[q.i])}</h2>
      <p class="who">عالعد، كل واحد بيأشّر عالشخص: على حاله أو على التاني.</p><div class="pt"><div style="color:var(--a)"><span>☝️</span>${esc(G.p[0].n)}</div><div style="color:var(--b)"><span>☝️</span>${esc(G.p[1].n)}</div></div></div>`;
  return `<div class="qcard" style="--c:var(--ok)"><span class="kind">🗣️ قولوها سوا</span><h2>${esc(SAY[q.i])}</h2><p class="who">عالعد، الاتنين بيقولوا الجواب بصوت عالي بنفس اللحظة، بلا تفكير طويل.</p></div>`;
}
function question(){
  const q=G.qs[G.i];
  app.innerHTML=`${hud()}${qHTML(q)}<button class="btn go" id="cnt">جاهزين؟ عدّ ٣، ٢، ١</button><button class="btn ghost" id="skip">سؤال تاني</button>`;
  $("#cnt").onclick=()=>{G.phase="count";render()};
  $("#skip").onclick=()=>{const k=q.k,arr=k==="f"?FING:k==="p"?POINT:SAY;let n;do{n=Math.floor(Math.random()*arr.length)}while(n===q.i&&arr.length>1);q.i=n;render()};
  $("#quit").onclick=()=>{G.phase="end";render()};
}
function countdown(){
  const q=G.qs[G.i];
  const verb=q.k==="f"?"ارفعوا!":q.k==="p"?"أشّروا!":"قولوا!";
  let n=3;
  const draw=()=>{app.innerHTML=`${hud()}<div class="count">${n>0?`<div class="big" key="${n}">${["","١","٢","٣"][n]}</div><p>${q.k==="f"?"جهّزوا أصابعكم تحت الطاولة…":q.k==="p"?"جهّزوا إيديكم…":"جهّزوا الجواب…"}</p>`:`<div class="big now">${verb}</div>`}</div>`;$("#quit").onclick=()=>{clearInterval(h);G.phase="end";render()}};
  draw();SFX.tick();
  const h=setInterval(()=>{n--;if(n>0){draw();SFX.tick()}else{clearInterval(h);draw();SFX.go();setTimeout(()=>{G.phase="judge";render()},1100)}},850);
}
function judge(){
  const q=G.qs[G.i];
  app.innerHTML=`${hud()}${qHTML(q)}<p class="mut" style="text-align:center;margin:0;font-weight:700">تطابقتوا؟</p>
    <div class="judge"><button class="y" id="y"><span>✓</span>تطابقنا</button><button class="n" id="n"><span>✗</span>لا</button></div>`;
  const go=(ok)=>{
    if(q.k==="f"){G.asked[q.si]++;if(ok)G.know[1-q.si]++}
    if(ok){G.match++;G.streak++;G.best=Math.max(G.best,G.streak);G.score+=1+(G.streak>=3?1:0);SFX.yes()}else{G.streak=0;SFX.no()}
    const msgs=ok?(G.streak>=3?[`🔥 ${G.streak} ورا بعض!`,"+2"]:[rnd(["توأم روح! 💞","حافظين بعض!","صح الصح! ✨","عقل واحد! 🧠"]),"+1"]):[rnd(["يا عيب الشوم 🙈","مين إنتو؟ 😅","لا لا لا 🤦","ولا قريب 😬"]),""];
    const r=document.createElement("div");r.className="react";r.innerHTML=`<div style="color:${ok?"var(--ok)":"var(--no)"}">${msgs[0]}${msgs[1]?`<small>${msgs[1]}</small>`:""}</div>`;document.body.appendChild(r);
    setTimeout(()=>{r.remove();G.i++;G.phase=G.i>=G.qs.length?"end":"q";render()},950);
    $("#y").disabled=$("#n").disabled=true;
  };
  $("#y").onclick=()=>go(true);$("#n").onclick=()=>go(false);
  $("#quit").onclick=()=>{G.phase="end";render()};
}
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function end(){
  const done=Math.max(1,G.i),pct=Math.round(G.match/done*100);
  const t=pct>=90?["توأم روح 💞","بتعرفوا بعض أكتر من حالكم."]:pct>=70?["حافظين بعض صمّ 🧠","قليل في ثنائي متلكم."]:pct>=50?["منيح… بس في شغل 💪","نص الطريق، كمّلوا."]:pct>=30?["لسّا عم تتعرّفوا 😅","بدكم سهرات أكتر."]:["مين إنتو؟ 🤨","كأنكم أول مرة بتشوفوا بعض."];
  const [A,B]=G.p;
  const kA=G.asked[1]?Math.round(G.know[0]/G.asked[1]*100):null,kB=G.asked[0]?Math.round(G.know[1]/G.asked[0]*100):null;
  let who="";if(kA!=null&&kB!=null)who=kA===kB?"الاتنين بتعرفوا بعض بنفس الدرجة":`${esc((kA>kB?A:B).n)} ${(kA>kB?A:B).g==="f"?"بتعرف":"بيعرف"} ${esc((kA>kB?B:A).n)} أكتر`;
  app.innerHTML=`<div class="res"><span class="mut small">نتيجة السهرة</span><div class="names">${esc(A.n)} <i>❤</i> ${esc(B.n)}</div>
    <div class="ringp" id="rp"><b>${pct}%</b></div><div class="title">${t[0]}</div><p class="mut" style="margin:0">${t[1]}</p>
    <div class="facts"><div>تطابقتوا<b>${G.match} من ${done}</b></div><div>أطول سلسلة<b>🔥 ${G.best}</b></div>
      ${kA!=null?`<div>${esc(A.n)} ${A.g==="f"?"بتعرف":"بيعرف"} ${esc(B.n)}<b>${kA}%</b></div>`:""}${kB!=null?`<div>${esc(B.n)} ${B.g==="f"?"بتعرف":"بيعرف"} ${esc(A.n)}<b>${kB}%</b></div>`:""}</div>
    ${who?`<p style="margin:0;font-weight:700">${who} 👀</p>`:""}</div>
  <p class="mut small" style="text-align:center;margin:0">صوّروا الشاشة وابعتوها للشلة 📸</p>
  <div class="row"><button class="btn go" id="again">جولة تانية</button><button class="btn ghost" id="home">الإعداد</button></div>`;
  requestAnimationFrame(()=>{let p=0;const rp=$("#rp");const h=setInterval(()=>{p=Math.min(pct,p+2);rp.style.setProperty("--p",p);if(p>=pct)clearInterval(h)},16)});
  if(pct>=70)SFX.yes();
  $("#again").onclick=()=>{G={...G,qs:build(set.len),i:0,score:0,match:0,streak:0,best:0,know:[0,0],asked:[0,0],phase:"q"};render()};
  $("#home").onclick=()=>{G=null;render()};
}
render();
}
