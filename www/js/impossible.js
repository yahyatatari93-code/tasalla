/* ============================================================
   مستحيل تكملوا للآخر — من ألعاب «تسلّى غو» (الثنائي)
   ثنائي قدام الشلة: ملف علاقة بنقاط الضعف، 5 مستويات، 3 قلوب و2 جوكر. بتقدروا تكملوا للآخر؟
   ============================================================ */
{
const IN_APP=!!document.querySelector('meta[name="tg-app"]');
const LV=[
  {n:"تسخين",c:"#FF8FA8",t:"سؤال خفيف ليحمى الجو"},
  {n:"محرج",c:"#FF6B8B",t:"هون بلّش الإحراج"},
  {n:"محرج كتير",c:"#FF5A6E",t:"هون بتبلّش الأعذار"},
  {n:"خطير",c:"#FF4D4D",t:"في ناس بتنسحب هون"},
  {n:"مستحيل",c:"#E0213A",t:"ما حدا كمّل لهون… لهلّق"}];

/* أنواع: conf اعتراف، sync إشارة أو جواب بنفس اللحظة، dare تحدّي
   {X} صاحب الدور، {Y} التاني، {s:..|..} حسب جنس X، {o:..|..} حسب جنس Y
   {FIGHT} موضوع خناقة، {LAST} آخر خناقة، {ANNOY} شو بيزعج Y ب X، {PROMISE} وعد ما تنفّذ
   {INL} «أهل فلان»، {Z} صاحب الأهل. need: شو لازم يكون معبّى، tag: موضوع بينمنع */
const BANK=[
 // 1 تسخين
 [1,"conf","{X}، شو أول انطباع إجاك عن {Y}؟ وكون {s:صادق|صادقة} قدام الكل."],
 [1,"conf","{X}، شو الكذبة الصغيرة اللي {s:بتقولها|بتقوليها} ل{Y} دايماً؟"],
 [1,"sync","مين فينا بيكذب كذبات صغيرة أكتر؟"],
 [1,"sync","مين فينا أصعب بالمصالحة بعد الخناقة؟"],
 [1,"sync","مين فينا الحاكم الحقيقي بالبيت؟"],
 [1,"dare","{X}، {s:قلّد|قلّدي} {Y} وقت {o:بيعصّب|بتعصّب}، قدام الكل."],
 [1,"conf","{Y} قال{o:|ت} إنو أكتر شي بيزعج{o:ه|ها} فيك: «{ANNOY}». {X}، {s:دافع|دافعي} عن حالك قدام الكل!",{need:"annoy"}],
 [1,"sync","مين فينا بيتأخر أكتر وبيخلّي التاني يستنّى؟"],
 [1,"conf","{X}، شو الشي اللي {s:بتعمله|بتعمليه} بالبيت وما بتعمله قدام الناس؟"],
 // 2 محرج
 [2,"conf","آخر مرة تخانقتوا على «{FIGHT}»: {X}، {s:احكي|احكي} القصة كاملة، ومين كان الغلطان؟",{need:"fight"}],
 [2,"sync","آخر خناقة كبيرة كانت على «{LAST}». مين فينا كان الغلطان؟",{need:"last"}],
 [2,"conf","{X}، شو الشي اللي {o:بيعمله|بتعمله} {Y} و{s:بتستحي|بتستحي} فيه قدام الناس؟"],
 [2,"sync","مين فينا بيفتّش موبايل التاني أكتر؟",{tag:"phone"}],
 [2,"dare","{X}، {s:اقرأ|اقرئي} آخر رسالة {s:بعتّها|بعتّيها} ل{Y} بصوت عالي.",{tag:"phone"}],
 [2,"conf","{X}، لو {s:بتقدر|بتقدري} {s:تغيّر|تغيّري} شي واحد ب{Y} بكبسة زر، شو هو؟"],
 [2,"sync","على شو منتخانق أكتر شي؟ (قولوها بصوت عالي سوا)",{say:true}],
 [2,"conf","{X}، شو أكتر شي {o:بيصرف|بتصرف} عليه {Y} مصاري و{s:بتشوفه|بتشوفيه} تبذير؟",{tag:"money"}],
 [2,"sync","مين فينا أنكد؟"],
 // 3 محرج كتير
 [3,"conf","{X}، شو أكتر شي {Z_DO} {INL} وبيضايقك؟ و{Z} ممنوع {z:يقاطع|تقاطع}.",{need:"inl",tag:"family",inl:"other"}],
 [3,"sync","مين فينا أغير؟ وبعدها كل واحد بيحكي موقف غيرة واحد.",{tag:"jealous"}],
 [3,"conf","{X}، {s:قيّم|قيّمي} {Y} من 10 كشريك قدام الكل، و{s:برّر|برّري} الرقم."],
 [3,"sync","مين فينا بيتحمّل التاني أكتر؟"],
 [3,"dare","{X}، {s:اعطي|اعطي} موبايلك ل{Y} 30 ثانية {o:يفتح|تفتح} فيه أي تطبيق {o:بدّه|بدّها}.",{tag:"phone"}],
 [3,"conf","{Y} بيقول إنك وعدت{s:|ي} «{PROMISE}» وما نفّذت{s:|ي}. {X}، ليش؟",{need:"promise"}],
 [3,"conf","{X}، شو الشي اللي {s:عملته|عملتيه} وما {s:خبّرت|خبّرتي} فيه {Y} لهلّق؟ (شي صغير بيكفّي)"],
 [3,"conf","{X}، شو الجملة اللي {o:بيقولها|بتقولها} {Y} وقت الخناقة و{s:بتجنّنك|بتجنّنك}؟ {s:قولها|قوليها} بنفس النبرة."],
 [3,"conf","{X}، مين من أصحاب {Y} ما {s:بتطيقه|بتطيقيه}؟ وليش؟"],
 // 4 خطير
 [4,"conf","{X}، في حدا من الماضي لسّا {s:بتتذكره|بتتذكريه} أحياناً؟ نعم أو لا، بلا لفّ ودوران.",{need:"ex",tag:"ex"}],
 [4,"conf","{X}، شو الشي اللي كان أحلى بالماضي قبل {Y}؟ جملة وحدة بس.",{need:"ex",tag:"ex"}],
 [4,"sync","مين فينا فكّر جدياً ينهي العلاقة ولو مرة؟"],
 [4,"conf","{X}، {s:احكي|احكي} عن أكتر مرة {Y} {o:خيّب|خيّبت} ظنك فيها."],
 [4,"sync","مين فينا بيحب التاني أكتر؟"],
 [4,"conf","{X}، إذا صار خلاف بين {Y} و{INL}، مع مين {s:بتوقف|بتوقفي}؟ قدام الكل.",{need:"inl",tag:"family",inl:"self"}],
 [4,"dare","{X}، {s:خلّي|خلّي} {Y} {o:يكتب|تكتب} ستاتس من موبايلك، وبيضل ساعة كاملة.",{tag:"phone"}],
 [4,"conf","{X}، شو الشي اللي {o:بيعمله|بتعمله} {Y} و{s:بتحسّ|بتحسّي} إنو بيكذب فيه؟"],
 // 5 مستحيل
 [5,"dare","{X}، {s:فرجي|فرجي} الحضور آخر 5 صور بموبايلك.",{tag:"phone"}],
 [5,"conf","{X}، شو أكبر شي {s:ندمان|ندمانة} عليه بهالعلاقة؟"],
 [5,"conf","{X}، لو رجع فيك الزمن، كنت {s:بتختار|بتختاري} {Y} مرة تانية؟ نعم أو لا، وليش."],
 [5,"dare","{X}، {s:خلّي|خلّي} الحضور يشوفوا آخر محادثة بينك وبين {Y}.",{tag:"phone"}],
 [5,"conf","{X}، شو الشي اللي {s:بتخاف|بتخافي} إنو {Y} {o:يعرفه|تعرفه} عنك؟ {s:احكي|احكي} جزء منه."],
 [5,"sync","مين فينا غلطان أكتر بهالعلاقة؟"],
 [5,"sync","مين فينا لازم يعتذر هلّق؟ واللي بيطلع عليه، بيعتذر فعلاً."],
 [5,"conf","{X}، {s:قول|قولي} ل{Y} قدام الكل الشي اللي من زمان بدك تقوله وما {s:قدرت|قدرتي}."]
];
const PEN=["{L} بيقول 3 أشياء حلوة عن {W} قدام الكل","{L} بيغنّي مقطع من أغنية بيحبها {W}","{L} بيعمل حركة {W} المشهورة","{L} بيعتذر عن شي قديم قدام الكل","{L} بيعمل لـ{W} شاي أو قهوة هلّق","{L} بيحكي أول مرة شاف فيها {W}"];
const FIGHTS=["المصاري","الأهل","الموبايل","الغيرة","الطلعات","ترتيب البيت","الأولاد","الشغل","الأصحاب","التأخير"];
const LIMITS=[["ex","الماضي والاكس"],["family","الأهل"],["money","المصاري"],["phone","فتح الموبايل"],["jealous","الغيرة"]];

const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const app=document.getElementById("app");const $=s=>app.querySelector(s),$$=s=>[...app.querySelectorAll(s)];
let F=ld("imp_file",{p:[{n:"",g:"m"},{n:"",g:"f"}],rel:"",fights:[],jealous:"",annoy:["",""],inl:"",ex:"",last:"",promise:"",limits:[]});
let G=null;

let AC=null;function tone(f,d=.15,t="sine",v=.2,w=0){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const s=AC.currentTime+w,o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.setValueAtTime(f,s);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g).connect(AC.destination);o.start(s);o.stop(s+d)}catch(e){}}
const SFX={tick:()=>tone(660,.12,"triangle",.22),go:()=>{tone(880,.12,"square",.16);tone(1320,.22,"triangle",.18,.08)},yes:()=>[660,880,1175].forEach((f,i)=>tone(f,.16,"triangle",.2,i*.08)),no:()=>{tone(220,.25,"sawtooth",.14);tone(150,.4,"sawtooth",.14,.18)},up:()=>[392,523,659,784,1046].forEach((f,i)=>tone(f,.22,"triangle",.17,i*.1))};

const sig=()=>``;
const head=(extra="")=>`<div class="top"><div class="brand">${IN_APP?`<a class="ib" href="index.html" aria-label="الرئيسية">⌂</a>`:""}<i>🔥</i> مستحيل تكملوا للآخر</div>${extra}</div>`;

/* ---------- 1. الأسماء ---------- */
function screenNames(){
  const C=["var(--a)","var(--b)"];
  app.innerHTML=`${head()}<section class="hero"><span class="kick">الثنائي · بحضور الجميع</span><h1>مستحيل <em>تكملوا</em> للآخر</h1>
    <p>الثنائي بيقعد قدام الشلة، والأسئلة بتسخن من «تسخين» لـ«مستحيل». معكم 3 قلوب و2 جوكر، وكل رفض بيكلّفكم قلب. السؤال الوحيد: بتقدروا تكملوا للآخر؟</p></section>
  <div class="card"><h3>مين الثنائي؟</h3><div class="pl">${F.p.map((x,i)=>`<label class="pi" style="--c:${C[i]}"><span class="dot"></span><input id="n${i}" value="${esc(x.n)}" placeholder="${i?"الاسم التاني":"الاسم الأول"}" maxlength="14" aria-label="الاسم ${i+1}">
    <span class="gsel">${[["m","هو"],["f","هي"]].map(([g,l])=>`<button data-g="${i}${g}" class="${x.g===g?"on":""}">${l}</button>`).join("")}</span></label>`).join("")}</div></div>
  <button class="btn go" id="next">التالي: ملف العلاقة</button>`;
  const keep=()=>F.p.forEach((x,i)=>x.n=$("#n"+i).value.trim());
  $$("[data-g]").forEach(b=>b.onclick=()=>{keep();F.p[+b.dataset.g[0]].g=b.dataset.g[1];sv("imp_file",F);screenNames()});
  $("#next").onclick=()=>{keep();F.p.forEach((x,i)=>{if(!x.n)x.n=i?"التاني":"الأول"});sv("imp_file",F);screenFile()};
}

/* ---------- 2. ملف العلاقة: نقاط الضعف بس ---------- */
function screenFile(){
  const [A,B]=F.p;
  const chips=(key,opts,multi)=>`<div class="chips${key==="limits"?" no":""}">${opts.map(([v,l])=>`<button data-k="${key}" data-v="${esc(v)}" data-m="${multi?1:0}" class="${multi?(F[key].includes(v)?"on":""):(F[key]===v?"on":"")}">${l}</button>`).join("")}</div>`;
  const filled=[F.rel,F.fights.length,F.jealous,F.annoy[0],F.annoy[1],F.inl,F.ex,F.last].filter(Boolean).length;
  app.innerHTML=`${head()}<div class="card"><h3>ملف العلاقة 🔍</h3><p class="mut small" style="margin:0 0 6px">نقاط القوة ما بتهمّنا. كل ما عبّيتوا أكتر، كل ما الأسئلة صارت محرجة أكتر.</p>
    <div class="meter">${Array.from({length:8},(_,k)=>`<i class="${k<filled?"on":""}"></i>`).join("")}</div></div>
  <div class="card">
    <div class="q"><span>شو وضعكم؟</span>${chips("rel",[["متزوجين","متزوجين"],["مخطوبين","مخطوبين"],["مرتبطين","مرتبطين"]])}</div>
    <div class="q"><span>على شو بتتخانقوا؟ <small>(اختاروا كل اللي بينطبق)</small></span>${chips("fights",FIGHTS.map(x=>[x,x]),true)}</div>
    <div class="q"><span>مين أغير؟</span>${chips("jealous",[["0",esc(A.n)],["1",esc(B.n)],["2","الاتنين"],["3","ولا حدا 😇"]])}</div>
    <div class="q"><label for="an0">شو أكتر شي بيزعج ${esc(B.n)} ب${esc(A.n)}؟</label><input class="tin" id="an0" maxlength="60" value="${esc(F.annoy[0])}" placeholder="مثلاً: ${A.g==="f"?"بتتأخر بالجهزة":"بينام عالكنباية"}"></div>
    <div class="q"><label for="an1">شو أكتر شي بيزعج ${esc(A.n)} ب${esc(B.n)}؟</label><input class="tin" id="an1" maxlength="60" value="${esc(F.annoy[1])}" placeholder="مثلاً: ${B.g==="f"?"ماسكة الموبايل دايماً":"ماسك الموبايل دايماً"}"></div>
    <div class="q"><span>أهل مين بيدخلوا بينكم أكتر؟</span>${chips("inl",[["0","أهل "+esc(A.n)],["1","أهل "+esc(B.n)],["2","الاتنين"],["3","ولا حدا"]])}</div>
    <div class="q"><span>في شي من الماضي (اكس) بيعرف عنه التاني؟</span>${chips("ex",[["y","إي"],["n","لا"]])}</div>
    <div class="q"><label for="last">آخر خناقة كبيرة كانت على شو؟</label><input class="tin" id="last" maxlength="60" value="${esc(F.last)}" placeholder="مثلاً: عيد ميلاد أمه"></div>
    <div class="q"><label for="prom">وعد انوعد وما تنفّذ؟ <small>(اختياري)</small></label><input class="tin" id="prom" maxlength="60" value="${esc(F.promise)}" placeholder="مثلاً: سفرة شهر العسل"></div>
    <div class="q"><span>ممنوع نسأل عن <small>(حدودكم، منحترمها)</small></span>${chips("limits",LIMITS,true)}</div>
  </div>
  <button class="btn go" id="go">🔥 ابدأوا</button><button class="btn ghost" id="back">رجوع</button>`;
  const keep=()=>{F.annoy=[$("#an0").value.trim(),$("#an1").value.trim()];F.last=$("#last").value.trim();F.promise=$("#prom").value.trim();sv("imp_file",F)};
  $$("[data-k]").forEach(b=>b.onclick=()=>{keep();const k=b.dataset.k,v=b.dataset.v;
    if(b.dataset.m==="1"){F[k]=F[k].includes(v)?F[k].filter(x=>x!==v):[...F[k],v]}else F[k]=F[k]===v?"":v;sv("imp_file",F);const y=scrollY;screenFile();scrollTo(0,y)});
  $("#back").onclick=()=>{keep();screenNames()};
  $("#go").onclick=()=>{keep();start()};
}

/* ---------- بناء الأسئلة من الملف ---------- */
function usable(q){
  const o=q[3]||{};
  if(o.tag&&F.limits.includes(o.tag))return false;
  if(o.need==="annoy"&&!F.annoy[0]&&!F.annoy[1])return false;
  if(o.need==="fight"&&!F.fights.length)return false;
  if(o.need==="last"&&!F.last)return false;
  if(o.need==="promise"&&!F.promise)return false;
  if(o.need==="inl"&&!(F.inl==="0"||F.inl==="1"||F.inl==="2"))return false;
  if(o.need==="ex"&&F.ex!=="y")return false;
  return true;
}
function start(){
  const seen=ld("imp_seen",[]);
  const plan=[];
  for(let l=1;l<=5;l++){
    let pool=BANK.map((q,i)=>i).filter(i=>BANK[i][0]===l&&usable(BANK[i]));
    let fresh=pool.filter(i=>!seen.includes(i));if(fresh.length<3)fresh=pool;
    /* الأسئلة اللي إلها علاقة بملفكم أولاً */
    const pers=shuffle(fresh.filter(i=>BANK[i][3]&&BANK[i][3].need)),rest=shuffle(fresh.filter(i=>!(BANK[i][3]&&BANK[i][3].need)));
    const pick=[...pers.slice(0,2),...rest].slice(0,3);
    pick.forEach((i,k)=>plan.push({i,lv:l,si:(plan.length)%2}));
  }
  sv("imp_seen",[...seen,...plan.map(x=>x.i)].slice(-30));
  G={plan,k:0,hearts:3,jokers:2,done:0,refused:0,pens:0,phase:"lvl",log:[]};
  tone(1,.01);render();
}
function fmt(t,si,extra={}){
  const S=F.p[si],O=F.p[1-si];
  let z=extra.z!=null?F.p[extra.z]:null;
  let s=esc(t)
    .replace(/\{s:([^|}]*)\|([^}]*)\}/g,(m,a,b)=>S.g==="f"?b:a)
    .replace(/\{o:([^|}]*)\|([^}]*)\}/g,(m,a,b)=>O.g==="f"?b:a)
    .replace(/\{z:([^|}]*)\|([^}]*)\}/g,(m,a,b)=>z&&z.g==="f"?b:a)
    .replace(/\{X\}/g,`<b>${esc(S.n)}</b>`).replace(/\{Y\}/g,`<b>${esc(O.n)}</b>`)
    .replace(/\{FIGHT\}/g,esc(extra.fight||rnd(F.fights.length?F.fights:FIGHTS)))
    .replace(/\{LAST\}/g,esc(F.last)).replace(/\{PROMISE\}/g,esc(F.promise))
    .replace(/\{ANNOY\}/g,esc(extra.annoy||""))
    .replace(/\{INL\}/g,z?`<b>أهل ${esc(z.n)}</b>`:"الأهل").replace(/\{Z\}/g,z?`<b>${esc(z.n)}</b>`:"")
    .replace(/\{Z_DO\}/g,"بيعملوه");
  return s;
}
function prep(item){
  const q=BANK[item.i],o=q[3]||{};let si=item.si,extra={};
  if(o.need==="annoy"){const opts=[0,1].filter(k=>F.annoy[k]);si=opts.includes(si)?si:opts[0];extra.annoy=F.annoy[si]}
  if(o.inl){const owner=F.inl==="2"?Math.round(Math.random()):+F.inl;si=o.inl==="other"?1-owner:owner;extra.z=owner}
  if(o.need==="promise")extra.annoy="";
  item.si=si;item.txt=fmt(q[2],si,extra);item.kind=q[1];item.say=!!o.say;
  return item;
}

/* ---------- اللعب ---------- */
function setLv(l){document.documentElement.style.setProperty("--lv",LV[l-1].c)}
function hud(){
  const it=G.plan[G.k],l=it?it.lv:5;
  return `${head(`<button class="ib" id="quit" aria-label="انسحاب">🏳️</button>`)}
  <div class="hud"><div class="lvl"><b>${l}. ${LV[l-1].n}</b><span>سؤال ${G.k+1} من ${G.plan.length}</span></div>
    <div class="hearts" aria-label="القلوب">${[0,1,2].map(k=>`<i class="${k<G.hearts?"":"off"}">❤️</i>`).join("")}</div><div class="jk" title="الجوكر">🃏 ${G.jokers}</div></div>
  <div class="ladder">${G.plan.map((x,k)=>`<i class="${k<G.k?"on":k===G.k?"cur":""}"></i>`).join("")}</div>`;
}
function render(){
  if(!G)return screenNames();
  const it=G.plan[G.k];if(it)setLv(it.lv);
  if(G.phase==="lvl")return levelIntro();
  if(G.phase==="q")return question();
  if(G.phase==="count")return countdown();
  if(G.phase==="end")return end();
}
function levelIntro(){
  const l=G.plan[G.k].lv;SFX.up();
  app.innerHTML=`${hud()}<div class="levelup"><span class="mut">المستوى</span><div class="n">${l}</div><h1>${LV[l-1].n}</h1><p class="mut" style="margin:0">${LV[l-1].t}</p>
    ${l>=4?`<p style="margin:0">معكم <b>${G.hearts}</b> ${G.hearts===1?"قلب":"قلوب"} و<b>${G.jokers}</b> جوكر. فكّروا منيح.</p>`:""}</div>
    <button class="btn go" id="go">${l===1?"يلّا":"كمّلوا إذا قدّها"}</button>${l>=3?`<button class="btn ghost" id="out">🏳️ انسحبوا هون</button>`:""}`;
  $("#go").onclick=()=>{G.phase="q";render()};
  const o=$("#out");if(o)o.onclick=()=>finish("quit");
  $("#quit").onclick=()=>finish("quit");
}
function question(){
  const it=prep(G.plan[G.k]);const S=F.p[it.si],O=F.p[1-it.si];
  const kinds={conf:"🎙️ اعتراف",sync:it.say?"🗣️ قولوها سوا":"👉 أشّروا مع بعض",dare:"🔥 تحدّي"};
  let acts="";
  if(it.kind==="conf"||it.kind==="dare"){
    acts=`<div class="judge"><button class="y" id="ok"><span>✓</span>${it.kind==="conf"?"جاوب":"عملها"}</button><button class="n" id="no"><span>✗</span>ما بدّي <small style="font-size:.7em;opacity:.85">(راح قلب)</small></button></div>
      <button class="btn ghost" id="jk" ${G.jokers?"":"disabled"}>🃏 جوكر: تخطّوا بلا خسارة (باقي ${G.jokers})</button>`;
  } else if(it.kind==="sync"){
    acts=`<button class="btn go" id="cnt">جاهزين؟ عدّ ٣، ٢، ١</button>`;
  }
  app.innerHTML=`${hud()}<div class="qc"><span class="kind">${kinds[it.kind]}</span><h2>${it.txt}</h2>
    ${it.kind==="sync"?`<p class="q2">${it.say?"عالعد، الاتنين بيقولوا الجواب بصوت عالي.":"عالعد، كل واحد بيأشّر: على حاله أو على التاني."} إذا ما تطابقتوا، في عقوبة.</p>`:""}
</div>
    <div class="acts">${acts}</div>`;
  const ok=$("#ok"),no=$("#no"),jk=$("#jk"),cnt=$("#cnt");
  if(ok)ok.onclick=()=>{G.done++;SFX.yes();react(rnd(["شجاع{s:|ة}! 💪","كمّلوا! 😂","هيك الكلام! 🔥","ما في أجرأ 👏"]).replace(/\{s:\|ة\}/,S.g==="f"?"ة":""),"var(--ok)",next)};
  if(no)no.onclick=()=>{G.hearts--;G.refused++;SFX.no();react(`💔 راح قلب`,"var(--hot)",()=>{if(G.hearts<=0)finish("dead");else next()})};
  if(jk)jk.onclick=()=>{G.jokers--;react("🃏 جوكر!","var(--gold)",next)};
  if(cnt)cnt.onclick=()=>{G.phase="count";render()};
  $("#quit").onclick=()=>finish("quit");
}
function countdown(){
  const it=G.plan[G.k];let n=3;
  const draw=()=>{app.innerHTML=`${hud()}<div class="count">${n>0?`<div class="big">${["","١","٢","٣"][n]}</div><p class="mut">جهّزوا…</p>`:`<div class="big now">${it.say?"قولوا!":"أشّروا!"}</div>`}</div>`};
  draw();SFX.tick();
  const h=setInterval(()=>{n--;draw();if(n>0)SFX.tick();else{clearInterval(h);SFX.go();setTimeout(()=>{
    app.innerHTML=`${hud()}<div class="qc"><span class="kind">${it.say?"🗣️ قولوها سوا":"👉 أشّروا مع بعض"}</span><h2>${it.txt}</h2></div><p class="mut" style="text-align:center;margin:0;font-weight:700">تطابقتوا؟</p>
      <div class="acts"><div class="judge"><button class="y" id="m"><span>✓</span>تطابقنا</button><button class="n" id="x"><span>✗</span>لا</button></div></div>`;
    $("#m").onclick=()=>{G.done++;SFX.yes();react("عقل واحد! 🧠","var(--ok)",next)};
    $("#x").onclick=()=>{SFX.no();penalty(Math.round(Math.random()))};
  },1000)}},850);
}
function penalty(loser){
  const L=F.p[loser],W=F.p[1-loser];G.pens++;
  const t=esc(rnd(PEN)).replace(/\{L\}/g,`<b>${esc(L.n)}</b>`).replace(/\{W\}/g,`<b>${esc(W.n)}</b>`);
  const box=document.createElement("div");box.className="pen";box.innerHTML=`<b>😈 عقوبة</b>${t}`;
  const acts=$(".acts")||app;acts.innerHTML="";acts.appendChild(box);
  const b=document.createElement("button");b.className="btn go";b.textContent="نفّذها، كمّلوا";b.onclick=()=>{G.done++;next()};acts.appendChild(b);
}
function react(msg,color,then){
  const r=document.createElement("div");r.className="react";r.innerHTML=`<div style="color:${color}">${msg}</div>`;document.body.appendChild(r);
  $$("button").forEach(b=>b.disabled=true);
  setTimeout(()=>{r.remove();then&&then()},950);
}
function next(){
  const prev=G.plan[G.k];G.k++;
  if(G.k>=G.plan.length)return finish("win");
  G.phase=G.plan[G.k].lv!==prev.lv?"lvl":"q";render();
}
function finish(how){
  G.how=how;G.phase="end";
  const best=ld("imp_best",0),reached=G.plan[Math.min(G.k,G.plan.length-1)].lv;
  G.reached=how==="win"?6:reached;if(G.reached>best)sv("imp_best",G.reached);G.best=best;
  render();
}
function end(){
  const win=G.how==="win",l=Math.min(5,G.reached);setLv(win?5:l);if(win)SFX.up();else SFX.no();
  const [A,B]=F.p;
  const title=win?"أسطورة! كمّلتوا للآخر 🏆":G.how==="dead"?"خلصت القلوب 💔":"انسحبتوا 🏳️";
  const sub=win?"قلائل بيوصلوا لهون.":`وقفتوا عند المستوى ${l}: «${LV[l-1].n}». عرفتوا ليش اسمها «مستحيل تكملوا للآخر»؟`;
  app.innerHTML=`<div class="res"><span class="mut small">مستحيل تكملوا للآخر</span><div class="names">${esc(A.n)} <i>🔥</i> ${esc(B.n)}</div>
    <div class="n">${win?"5/5":l+"/5"}</div><h2>${title}</h2><p class="mut" style="margin:0">${sub}</p>
    <div class="stat"><div>جاوبوا<b>${G.done}</b></div><div>رفضوا<b>${G.refused}</b></div><div>عقوبات<b>${G.pens}</b></div></div>
    ${G.best&&!win?`<p class="small mut" style="margin:0">أعلى مستوى وصلتوله قبل: ${G.best>5?"كمّلتوا للآخر":G.best}</p>`:""}</div>
  <p class="mut small" style="text-align:center;margin:0">صوّروا الشاشة وتحدّوا ثنائي تاني من الشلة 📸</p>
  <div class="row"><button class="btn go" id="again">جربوا مرة تانية</button><button class="btn ghost" id="file">ملف العلاقة</button></div>`;
  $("#again").onclick=()=>start();
  $("#file").onclick=()=>{G=null;screenFile()};
}
render();
}
