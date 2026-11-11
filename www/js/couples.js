// نسخة الثنائي: بطاقة تعريف مفصّلة، سلّم من 6 درجات، منافسة بين الاثنين، وجائزة للرابح
const $=s=>document.querySelector(s);
const stage=$("#stage");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const nfix=s=>String(s).replace(/([+−-]\d+)/g,'<bdi dir="ltr">$1</bdi>');
function toast(m){const o=document.querySelector(".toast");if(o)o.remove();const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}
let AC=null;function beep(f=880,d=.06,v=.15){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}

/* ---------- الثوابت ---------- */
const LV=[null,{n:"دفا",f:"☕"},{n:"صراحة",f:"🙂"},{n:"حامي",f:"🌶"},{n:"نار",f:"🔥"},{n:"خطر",f:"⚠️"},{n:"الحقيقة المرّة",f:"😈"}];
const TOP=6,PER=2,BANK=[0,1,2,3,5,7,10]; // النقاط المثبّتة بعد كل درجة
const ZOD=["الحمل","الثور","الجوزاء","السرطان","الأسد","العذراء","الميزان","العقرب","القوس","الجدي","الدلو","الحوت"];
const ZT={"الحمل":"متهور وعصبي وبدو يكون الأول","الثور":"عنيد وما بيسامح بسهولة","الجوزاء":"إله وجهين وبيحكي كتير","السرطان":"حساس ونكدي ومتعلق بأهله","الأسد":"شايف حاله وبيحب المديح","العذراء":"موسوس وبينتقد كل شي","الميزان":"متردد ومجامل","العقرب":"غيور وانتقامي وكتوم","القوس":"صريح لدرجة الوقاحة وبيهرب من الالتزام","الجدي":"بارد وبيحسب كل قرش","الدلو":"غريب الأطوار وبيختفي فجأة","الحوت":"حالم وبيكذب كذبات بيضاء"};
const MET={family:"عن طريق الأهل",work:"بالشغل",uni:"بالجامعة أو المدرسة",kin:"من القرايب",social:"عالسوشال ميديا",chance:"صدفة"};
const FIGHT=["المصاري","الأهل","الغيرة","الموبايل","الوقت","البيت والترتيب","الولاد"];
const PRIZES=["الخاسر بيعمل مساج 10 دقايق للرابح","الخاسر بيغسل الصحون أسبوع كامل","الخاسر بيعزم الرابح عالعشا وين ما بدو","الخاسر بيكتب رسالة حب بخط إيده وبيقرأها بصوت عالي","الرابح بيختار فيلم السهرة لأسبوع، وما في اعتراض","الخاسر بيعمل الفطور بكرا ويقدّمه بالسرير","الرابح بيقرأ موبايل الخاسر 5 دقايق وين ما بدو 😈","الخاسر بيغنّي للرابح أغنية بيختارها","الخاسر ما بيحق له يزعل 24 ساعة 😂","الخاسر بيجيب للرابح الشي اللي بيحبه من السوق","الخاسر بيرتّب الغرفة أو المطبخ لحاله","الرابح بيطلب طلب، والخاسر ما بيقدر يقول لا (بالمعقول)"];

/* ---------- الإعداد المحفوظ ---------- */
let P={st:"married",dur:"mid",kids:false,live:"alone",met:"chance",fight:"المصاري",
  pl:[{n:"سامر",g:"m",z:"",mom:"",friend:""},{n:"ليلى",g:"f",z:"",mom:"",friend:""}]};
try{const o=JSON.parse(localStorage.getItem("tg_couple_profile")||"null");if(o&&o.pl)P={...P,...o}}catch(e){}
const saveP=()=>{try{localStorage.setItem("tg_couple_profile",JSON.stringify(P))}catch(e){}};
let SEEN={};try{SEEN=JSON.parse(localStorage.getItem("tg_seen_couples2")||"{}")||{}}catch(e){}
const saveSeen=()=>{try{localStorage.setItem("tg_seen_couples2",JSON.stringify(SEEN))}catch(e){}};

let G=null;
const flags=()=>(P.st==="married"?"M":"E")+(P.dur==="new"?"N":"")+(P.dur==="long"?"J":"")+(P.kids?"K":"")+(P.live==="family"?"L":"");
function fmt(t,s,o){
  const rel=o.g==="m"?(P.st==="married"?"زوج":"خطيب"):(P.st==="married"?"زوجة":"خطيبة");
  return t.replace(/\{S\}/g,s.n).replace(/\{O\}/g,o.n)
    .replace(/\{OMOM\}/g,o.mom||("أم "+o.n)).replace(/\{OFRIEND\}/g,o.friend||("أعز صاحب لـ"+o.n))
    .replace(/\{FIGHT\}/g,P.fight).replace(/\{MET\}/g,MET[P.met]||"").replace(/\{OZ\}/g,o.z).replace(/\{OZT\}/g,ZT[o.z]||"").replace(/\{OREL\}/g,rel)
    .replace(/\{o:([^|}]*)\|([^}]*)\}/g,(_,m,f)=>o.g==="m"?m:f)
    .replace(/\{([^|}]*)\|([^}]*)\}/g,(_,m,f)=>s.g==="m"?m:f);
}
function pickQ(lv,o){
  const fl=flags();
  const src=CQ.filter(q=>q[0]===lv&&[...q[1]].every(c=>fl.includes(c))&&(!q[2].includes("{OZ}")||o.z)).map(q=>q[2]).filter(q=>!G.used.has(q));
  const key="lv"+lv,seen=new Set(SEEN[key]||[]);let fresh=src.filter(x=>!seen.has(x));
  if(!fresh.length){SEEN[key]=(SEEN[key]||[]).filter(x=>!src.includes(x));fresh=src}
  const v=rnd(fresh);(SEEN[key]=SEEN[key]||[]).push(v);saveSeen();G.used.add(v);return v;
}

/* ---------- الإعداد ---------- */
function seg(k,opts,cur,attr="data-k"){return `<div class="cseg" ${attr}="${k}">${opts.map(([v,t])=>`<button data-v="${v}" aria-pressed="${String(cur)===String(v)}">${t}</button>`).join("")}</div>`}
function renderSetup(){
  G=null;document.documentElement.style.setProperty("--phase","var(--hot)");$("#safety").hidden=true;$("#track").hidden=true;$("#homeBtn").hidden=false;
  const pc=(i)=>{const p=P.pl[i];return `<div class="pcard" data-p="${i}">
      <input class="pname" data-f="n" maxlength="14" value="${esc(p.n)}" aria-label="الاسم">
      ${seg("g",[["m","شب"],["f","صبية"]],p.g)}
      <label class="fl">البرج<select data-f="z"><option value="">ما بعرف</option>${ZOD.map(z=>`<option ${p.z===z?"selected":""}>${z}</option>`).join("")}</select></label>
      <label class="fl">اسم أمه أو أمها<input data-f="mom" maxlength="16" value="${esc(p.mom)}" placeholder="اختياري"></label>
      <label class="fl">أعز صاحب أو صاحبة<input data-f="friend" maxlength="16" value="${esc(p.friend)}" placeholder="اختياري"></label></div>`};
  stage.innerHTML=`
  <section class="hero"><span class="edition">تسلّى غو · نسخة الثنائي</span>
    <div class="hero-art" aria-hidden="true"><span>${svg("promise")}</span><span>${svg("hot")}</span><span>${svg("guess")}</span></div>
    <h1>سلّم<em>الحقيقة</em></h1>
    <p>ست درجات من «دفا» لـ«الحقيقة المرّة». كل ما طلعتوا، الأسئلة بتصير أخطر. اللي بيوصل أعلى بيربح، والخاسر بينفّذ طلب.</p></section>
  <section class="block"><span class="label">مين انتو؟ كل ما عبّيتوا أكتر، الأسئلة بتصير أخطر 😈</span>
    <div class="pduo">${pc(0)}${pc(1)}</div></section>
  <section class="block"><span class="label">عنكم انتو الاثنين</span>
    <span class="sub">العلاقة</span>${seg("st",[["engaged","مخطوبين"],["married","متزوجين"]],P.st)}
    <span class="sub">صرلكم سوا</span>${seg("dur",[["new","أقل من سنة"],["mid","1 لـ5 سنين"],["long","أكتر من 5"]],P.dur)}
    <span class="sub">في ولاد؟</span>${seg("kids",[[false,"لا"],[true,"إي"]],P.kids)}
    <span class="sub">ساكنين</span>${seg("live",[["alone","لحالنا"],["family","مع الأهل"]],P.live)}
    <span class="sub">وين تعرّفتوا؟</span>${seg("met",Object.entries({family:"الأهل",work:"الشغل",uni:"الدراسة",kin:"قرايب",social:"سوشال",chance:"صدفة"}),P.met)}
    <span class="sub">أكتر شي بتتخانقوا عليه</span>${seg("fight",FIGHT.map(f=>[f,f]),P.fight)}
  </section>
  <button class="go" id="start">يلا عالسلّم 🔥</button>
  <p class="note">المعلومات بتنحفظ على هالموبايل بس، ولا جواب بينحفظ أبداً.</p>`;
  stage.oninput=stage.onchange=e=>{const el=e.target,c=el.closest(".pcard");if(c&&el.dataset.f){P.pl[+c.dataset.p][el.dataset.f]=el.value.trim();saveP()}};
  stage.onclick=e=>{const b=e.target.closest(".cseg button");
    if(b){const sg=b.parentNode,k=sg.dataset.k,c=b.closest(".pcard"),v=b.dataset.v,val=v==="true"?true:v==="false"?false:v;
      if(c)P.pl[+c.dataset.p][k]=val;else P[k]=val;saveP();sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));return}
    if(e.target.id==="start"){if(P.pl.some(p=>!p.n)){toast("اكتبوا الاسمين أول");return}start()}};
}

/* ---------- اللعب ---------- */
function start(){
  stage.oninput=stage.onchange=stage.onclick=null;
  G={lv:[1,1],i:[0,0],joker:[1,1],done:[null,null],caught:[false,false],bonus:[0,0],turn:Math.random()<.5?0:1,q:null,used:new Set()};
  $("#safety").hidden=false;$("#track").hidden=false;$("#homeBtn").hidden=true;
  render();
}
const active=k=>G.done[k]===null;
function renderTrack(){
  $("#track").outerHTML=`<div class="duotrack" id="track">${[0,1].map(k=>`<div class="${k===G.turn&&active(k)?"me":""}"><b>${esc(P.pl[k].n)}</b><span class="mini">${[1,2,3,4,5,6].map(l=>`<i class="${(G.done[k]!==null?l<=G.done[k]:l<G.lv[k])?"ok":l===G.lv[k]&&active(k)?"on":""}"></i>`).join("")}</span><small>${nfix("+"+(BANK[G.done[k]!==null?G.done[k]:G.lv[k]-1]+G.bonus[k]))}</small></div>`).join("")}</div>`;
}
function nextTurn(){
  if(!active(0)&&!active(1))return finish();
  const o=1-G.turn;if(active(o))G.turn=o;
  G.q=null;render();window.scrollTo({top:0,behavior:"smooth"});
}
function render(){
  const k=G.turn,s=P.pl[k],o=P.pl[1-k],lv=G.lv[k];
  document.documentElement.style.setProperty("--phase",lv<=2?"var(--said)":lv<=4?"var(--hot)":"var(--bomb)");
  renderTrack();
  if(!G.q)G.q=pickQ(lv,o);
  const raw=G.q,guess=raw.startsWith("🎯"),act=raw.startsWith("⚡"),txt=fmt(raw.replace(/^(🎯|⚡)\s*/,""),s,o);
  const L=LV[lv];
  stage.innerHTML=`<div class="cardwrap"><article class="card lvl${lv}">
      <div class="head"><span class="sticker">${L.f} درجة ${lv}: ${L.n}</span><span>سؤال ${G.i[k]+1} من ${PER}</span></div>
      <div class="to">الدور على <b>${esc(s.n)}</b>${guess?` · <span class="tag">🎯 ${esc(o.n)} ${o.g==="m"?"بيتوقّع":"بتتوقّع"} أول</span>`:act?` · <span class="tag">⚡ تحدي</span>`:""}</div>
      <p class="q">${esc(txt)}</p>
      <p class="howto">${BANK[lv-1]?nfix(`مثبّت معك +${BANK[lv-1]+G.bonus[k]}. إذا انسحبت بتاخدهن.`):"خلّص هالدرجة لتثبّت أول نقطة."}${!active(1-k)?` · ${esc(o.n)} ${o.g==="m"?"وقف":"وقفت"} عند ${nfix("+"+(BANK[G.done[1-k]]+G.bonus[1-k]))}، لازم ${s.g==="m"?"تتخطاه":"تتخطيها"}!`:""}</p>
    </article></div>
    ${guess?`<button class="btn gbonus" id="gb">🎯 ${esc(o.n)} ${o.g==="m"?"توقّع":"توقّعت"} صح · ${nfix("+1")} إله${o.g==="m"?"":"ا"}</button>`:""}
    <div class="cbtns"><button class="btn" id="out">انسحب</button><button class="btn" id="jk" ${G.joker[k]?"":"disabled"}>🃏 جوكر${G.joker[k]?"":" (راح)"}</button><button class="btn main" id="ok">${act?"عملها ✓":"جاوب ✓"}</button></div>
    ${lv>=3?`<p class="note"><button class="linkish" id="liar">${esc(o.n)} ما ${o.g==="m"?"صدّق":"صدّقت"} 🤥</button><br>${G.joker[k]?"بيروح الجوكر وبيطلع سؤال أصعب":"ما في جوكر، يعني بيوقف عند آخر درجة خلصها"}</p>`:""}`;
  if(guess)$("#gb").onclick=e=>{G.bonus[1-k]++;e.target.disabled=true;e.target.textContent="✓ انحسبت";beep(1100,.08);renderTrack()};
  $("#ok").onclick=()=>{beep(900,.05);G.i[k]++;
    if(G.i[k]>=PER){G.i[k]=0;G.lv[k]++;
      if(G.lv[k]>TOP){G.done[k]=TOP;toast(`${s.n} ${s.g==="m"?"وصل":"وصلت"} لآخر السلّم! 😈`);buzz([80,50,200])}
      else{toast(`${s.n} ${s.g==="m"?"ثبّت":"ثبّتت"} ${"+"+BANK[G.lv[k]-1]}! الدرجة الجاية: ${LV[G.lv[k]].n} ${LV[G.lv[k]].f}`);buzz(60)}}
    nextTurn()};
  $("#jk").onclick=()=>{if(!G.joker[k])return;G.joker[k]=0;G.q=null;beep(500,.08);render()};
  $("#out").onclick=()=>{G.done[k]=lv-1;toast(`${s.n} ${s.g==="m"?"انسحب":"انسحبت"} 🐔`);nextTurn()};
  if(lv>=3)$("#liar").onclick=()=>{beep(200,.3);buzz([120]);
    if(G.joker[k]){G.joker[k]=0;G.q=null;toast("ما صدّقنا! راح الجوكر، وهي سؤال أصعب");render()}
    else{G.done[k]=lv-1;G.caught[k]=true;toast(`${s.n} ${s.g==="m"?"انكشف":"انكشفت"} 🤥`);nextTurn()}};
}

/* ---------- بطاقة الأمان: بتوقف السلّم فوراً وبتحسب اللي ثبّتوه ---------- */
$("#safety").onclick=()=>{if(!G)return;[0,1].forEach(k=>{if(active(k))G.done[k]=G.lv[k]-1});toast("وقفنا هون. خذوا نفس 🤍");finish(true)};

/* ---------- النهاية ---------- */
function finish(safe){
  $("#safety").hidden=true;const tr=$("#track");if(tr)tr.outerHTML=`<div class="track" id="track" hidden></div>`;$("#homeBtn").hidden=false;
  const sc=[0,1].map(k=>BANK[G.done[k]]+G.bonus[k]);
  const w=sc[0]===sc[1]?(G.done[0]===G.done[1]?-1:(G.done[0]>G.done[1]?0:1)):(sc[0]>sc[1]?0:1);
  const prizes=shuffle(PRIZES).slice(0,3);
  const row=k=>{const p=P.pl[k];return `<div class="${k===w?"win":""}"><b>${esc(p.n)}</b><span class="mini">${[1,2,3,4,5,6].map(l=>`<i class="${l<=G.done[k]?"ok":""}"></i>`).join("")}</span>
    <small>${(f=>G.done[k]>=TOP?(f?"وصلت":"وصل")+" للآخر 😈":G.done[k]?`${f?"وصلت":"وصل"} لـ«${LV[G.done[k]].n}»`:(f?"انسحبت":"انسحب")+" من أولها 🐔")(p.g==="f")}${G.caught[k]?(p.g==="f"?" · انكشفت 🤥":" · انكشف 🤥"):""}${G.bonus[k]?` · ${G.bonus[k]} توقّع صح`:""}</small><strong>${nfix("+"+sc[k])}</strong></div>`};
  stage.innerHTML=`<section class="end">
    <div class="score"><div class="badge">${svg(w<0?"promise":"crown")}</div>
      <h2>${w<0?"تعادل! كل واحد بيطلب طلب من التاني":`${esc(P.pl[w].n)} ${P.pl[w].g==="m"?"ربح":"ربحت"}!`}</h2>
      <span class="note">${safe?"وقفتوا ببطاقة الأمان، وهاد بالضبط سببها 🤍":"خلص السلّم"}</span></div>
    <div class="finrows">${row(0)}${row(1)}</div>
    <div class="surprise"><h3>${w<0?"اختاروا طلب لكل واحد":`${esc(P.pl[w].n)}، ${P.pl[w].g==="m"?"اختار":"اختاري"} الجائزة`}</h3>
      <div class="prizes">${prizes.map((t,i)=>`<button data-i="${i}">${esc(t)}</button>`).join("")}</div></div>
    <button class="go" id="again">جولة جديدة</button></section>`;
  stage.querySelector(".prizes").onclick=e=>{const b=e.target.closest("button");if(!b)return;stage.querySelectorAll(".prizes button").forEach(x=>x.setAttribute("aria-pressed",x===b));beep(1200,.15);toast("اتفقنا! ما في رجعة 😄")};
  $("#again").onclick=renderSetup;window.scrollTo({top:0});
}

renderSetup();
