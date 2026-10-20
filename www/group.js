// نسخة الشلة: الإعداد، الألعاب السبعة، نظام النقاط (الإقصاء أو الكلاسيكي) مع المفاجآت، المبارزات، والنهاية
const CC=["var(--said)","var(--spy)","var(--lie)","var(--hot)","var(--who)","var(--bomb)","var(--dare)"];
const DARK_ON={who:1,said:1,dare:1};

const GAMES={
 spy:{n:"برّا السالفة",s:"واحد ما بيعرف الكلمة",c:"var(--spy)",
  rule:"كلكم بتعرفوا الكلمة السرية إلا واحد. اسألوا بعض بذكاء واكشفوه قبل ما يفهم الكلمة من أسئلتكم.",
  pts:["مسكتوه: كل واحد +1","نجا أو حزر الكلمة: هو +3","اللي انظلم بالاتهام −1"]},
 bomb:{n:"القنبلة",s:"قول ومرّر بسرعة",c:"var(--bomb)",
  rule:"قولوا كلمة من الفئة ومرّروا الموبايل للي جنبكم. ما حدا بيعرف إيمتى بتنفجر.",
  pts:["اللي بتنفجر بإيده −1","كل الباقيين +1"]},
 who:{n:"مين فينا؟",s:"أشّر عالعدّ",c:"var(--who)",
  rule:"منعدّ للثلاثة والكل بيأشّر. اللي بياخد الأغلبية بيختار: يعترف أو يدافع. والأسئلة الجريئة تصويتها سري.",
  pts:["أشّرت متل الأغلبية +1","المتّهم: اعترف +1 · دافع وأقنع +3 · ما أقنع −2","أشّرت على حالك وطلعت انت +3، وما طلعت −1","🔥 سؤال ناري: نقاط المتّهم دبل"]},
 said:{n:"مين قالها؟",s:"أجوبة بدون أسماء",c:"var(--said)",
  rule:"كل واحد بيكتب جوابه بالسر، ومنقرأ الأجوبة مخلوطة. احزروا مين كاتب كل جواب.",
  pts:["أول واحد بيحزر صح +1","ما حدا عرفك: +2"]},
 hot:{n:"الكرسي الساخن",s:"30 ثانية لكل واحد",c:"var(--hot)",
  rule:"كل واحد بياخد 30 ثانية على الكرسي: أسئلة سريعة ورا بعض، وممنوع «ما بعرف».",
  pts:["الأكثر أجوبة +3","الثاني +1","الأقل −1"]},
 lie:{n:"صح ولا كذب",s:"جملة وحدة كذبة",c:"var(--lie)",
  rule:"اللاعب بيحكي ثلاث جمل عن حاله، وحدة منهم كذبة. الكل بيصوّت عالكذبة بالأصابع.",
  pts:["كل واحد بيكشفها +1","ما حدا كشفها: الكذّاب +3"]},
 dare:{n:"تحدّي",s:"مهمة قدام الكل",c:"var(--dare)",
  rule:"مهمة سريعة ومضحكة قدام الكل، والشلة بتقيّم.",
  pts:["أسطوري +3","عادي +1","ما عملها −1"]}
};
const MODES={
 elim:{n:"الإقصاء",s:"كل كم جولة بيطلع الأقل نقاط، لحد ما يضل اثنين بالنهائي",ic:"door"},
 classic:{n:"الكلاسيكي",s:"عدد جولات ثابت، والأعلى نقاط بياخد التاج",ic:"coin"}
};

/* ---------------- state ---------------- */
let S={players:["سامر","ليلى","عمر","ريم","خالد"],mode:"elim",every:0,rounds:12,twists:true,spicy:true};
try{const o=JSON.parse(localStorage.getItem("tg_group_setup")||"null");if(o&&Array.isArray(o.players))S={...S,...o}}catch(e){}
function saveSetup(){try{localStorage.setItem("tg_group_setup",JSON.stringify(S))}catch(e){}}
let G=null, cleanup=null;
const $=s=>document.querySelector(s);
const stage=$("#stage");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function setG(g){const r=document.documentElement.style,k=GAMES[g]?g:(String(g).match(/--(\w+)/)||[])[1];
  r.setProperty("--g",GAMES[g]?GAMES[g].c:g);r.setProperty("--on",k==="spy"?"var(--on-spy)":"var(--on-dark)")}
const num=n=>`<bdi dir="ltr">${n<0?"−"+(-n):n}</bdi>`;
const nfix=s=>String(s).replace(/([+−-]\d+|×\d+)/g,'<bdi dir="ltr">$1</bdi>');
const roundsTxt=n=>n===1?"جولة وحدة":n===2?"جولتين":n<=10?`${n} جولات`:`${n} جولة`;
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}
function stopAll(){if(cleanup){cleanup();cleanup=null}}
const sgn=n=>n>0?`+${n}`:n<0?`−${-n}`:"0";

/* ---- no-repeat card drawing, remembered on this device ---- */
let SEEN={};try{SEEN=JSON.parse(localStorage.getItem("tg_seen")||"{}")||{}}catch(e){SEEN={}}
function saveSeen(){try{localStorage.setItem("tg_seen",JSON.stringify(SEEN))}catch(e){}}
const POOL={};
function draw(key,src){
  if(!POOL[key]||!POOL[key].length){
    const seen=new Set(SEEN[key]||[]);let fresh=src.filter(x=>!seen.has(x));
    if(!fresh.length){SEEN[key]=[];fresh=[...src];toast("خلصت مكتبة هاللعبة كلها! بلّشنا دورة جديدة")}
    POOL[key]=shuffle(fresh);
  }
  const v=POOL[key].pop();(SEEN[key]=SEEN[key]||[]).push(v);saveSeen();return v;
}
// الأسئلة الجريئة بتنضاف لمكتبة اللعبة بس إذا مفعّلة
const pool=(k,base)=>S.spicy&&typeof SPICY!=="undefined"&&SPICY[k]?base.concat(SPICY[k]):base;
function seenCount(){return Object.values(SEEN).reduce((a,b)=>a+(b?b.length:0),0)}

/* ---------------- setup ---------------- */
function autoEvery(n){return n<=4?3:n<=6?2:1}
function renderSetup(){
  stopAll();G=null;setG("var(--said)");$("#tools").hidden=true;$("#homeBtn").hidden=false;$("#roundBar").hidden=true;
  const n=S.players.length,ev=S.every||autoEvery(n);
  const est=S.mode==="elim"?Math.max(1,(n-2))*ev:S.rounds;
  stage.innerHTML=`
  <section class="hero"><span class="edition">تسلّى غو · الشلة · 3 إلى 12 لاعب</span>
    <div class="hero-art live" aria-hidden="true"><span>${svg("bomb")}</span><span>${svg("said")}</span><span>${svg("hot")}</span><span>${svg("spy")}</span></div>
    <h1>سهرة<em>الشلة</em></h1>
    <p>موبايل واحد بيلفّ عالقاعدة، وسبع ألعاب بتتناوب، ونقاط بتقلب السهرة.</p></section>
  <section class="block"><span class="label">اللاعبين (${n})</span>
    <div class="players">${S.players.map((p,i)=>`<span class="chip" data-i="${esc(p.slice(0,1))}" style="--cc:${CC[i%7]}">${esc(p)}<button data-del="${i}" aria-label="احذف ${esc(p)}">×</button></span>`).join("")}</div>
    <form class="addrow" id="addForm"><input id="newName" type="text" maxlength="14" placeholder="اسم لاعب جديد" autocomplete="off" aria-label="اسم لاعب جديد"><button type="submit">أضف</button></form></section>
  <section class="block"><div class="lblrow"><span class="label">طريقة الحساب</span><button class="linkish" id="rulesBtn">كيف بتنحسب النقاط؟</button></div>
    <div class="modes">${Object.entries(MODES).map(([k,m])=>`<button class="mbtn" data-m="${k}" aria-pressed="${S.mode===k}"><span class="ico">${svg(m.ic)}</span><span><b>${m.n}</b><small>${m.s}</small></span></button>`).join("")}</div>
    ${S.mode==="elim"?`<span class="label">واحد بيطلع كل:</span>
      <div class="seg4">${[[0,"تلقائي"],[1,"جولة"],[2,"جولتين"],[3,"3 جولات"]].map(([v,t])=>`<button data-ev="${v}" aria-pressed="${S.every===v}">${t}</button>`).join("")}</div>
      <p class="hint">مع ${n} لاعبين: حوالي ${roundsTxt(est)}، وبعدين النهائي.</p>`
    :`<span class="label">عدد الجولات</span>
      <div class="seg4">${[8,12,16,20].map(v=>`<button data-r="${v}" aria-pressed="${S.rounds===v}">${v}</button>`).join("")}</div>`}
    <label class="switch"><input type="checkbox" id="twists" ${S.twists?"checked":""}><span class="sw" aria-hidden="true"></span>
      <span><b>المفاجآت</b><small>جولات ذهبية، حرامي، سلسلة نار${S.mode==="elim"?"، دروع ولعنات الأشباح":""}</small></span></label></section>
  <section class="block"><span class="label">اكبس على لعبة لتلعبها لحالها، أو اختار السهرة المخلوطة</span>
    <div class="games">${Object.entries(GAMES).map(([k,g])=>`<button class="gbtn" data-g="${k}" style="--gc:${g.c}" aria-label="العب ${g.n}"><span class="ico">${svg(k)}</span><span class="gtxt"><b>${g.n}</b><small>${g.s}</small></span><span class="play" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M11 3.5v9L4 8z" fill="currentColor"/></svg></span></button>`).join("")}</div>
    <label class="switch"><input type="checkbox" id="spicy" ${S.spicy?"checked":""}><span class="sw" aria-hidden="true"></span>
      <span><b>أسئلة جريئة</b><small>«مين ما بتأمنه على سر؟»، «مين بيصب الزيت عالنار؟»… للقعدات اللي بتتحمّل الصراحة</small></span></label></section>
  <button class="go" id="start">سهرة مخلوطة<small>${MODES[S.mode].n} · كل الألعاب ورا بعض</small></button>
  <p class="note">${LIBRARY.toLocaleString("en")} بطاقة وكلمة · ما بيتكرر شي لحد ما تخلص المكتبة كلها${seenCount()?` · لعبتوا ${Math.min(seenCount(),LIBRARY).toLocaleString("en")} لهلق <button class="linkish" id="resetSeen">صفّر</button>`:""}</p>
  <p class="note">الأجوبة المكتوبة ما بتنحفظ أبداً.</p>`;
  $("#addForm").onsubmit=e=>{e.preventDefault();const v=$("#newName").value.trim();
    if(!v)return;if(S.players.length>=12){toast("الحد الأقصى 12 لاعب");return}
    if(S.players.includes(v)){toast("الاسم موجود");return}
    S.players.push(v);saveSetup();renderSetup();$("#newName").focus()};
  $("#twists").onchange=e=>{S.twists=e.target.checked;saveSetup()};
  $("#spicy").onchange=e=>{S.spicy=e.target.checked;saveSetup();for(const k of["who","said","dare"])delete POOL[k]};
  stage.onclick=e=>{const b=e.target.closest("button");if(!b||b.closest("form"))return;
    if(b.dataset.del!==undefined){S.players.splice(+b.dataset.del,1);saveSetup();renderSetup()}
    else if(b.dataset.m){S.mode=b.dataset.m;saveSetup();renderSetup()}
    else if(b.dataset.ev!==undefined){S.every=+b.dataset.ev;saveSetup();renderSetup()}
    else if(b.dataset.r){S.rounds=+b.dataset.r;saveSetup();renderSetup()}
    else if(b.dataset.g){start([b.dataset.g])}
    else if(b.id==="rulesBtn")rulesSheet();
    else if(b.id==="resetSeen"){SEEN={};saveSeen();for(const k in POOL)delete POOL[k];toast("رجعت كل البطاقات جديدة");renderSetup()}
    else if(b.id==="start")start(Object.keys(GAMES))};
}

function sheet(title,html){
  const sh=document.createElement("div");sh.className="sheet";
  sh.innerHTML=`<div class="inner" role="dialog" aria-label="${esc(title)}"><div class="sheet-head"><strong>${title}</strong><button class="pill" id="cl">سكّر</button></div>${html}</div>`;
  document.body.appendChild(sh);sh.onclick=e=>{if(e.target===sh||e.target.id==="cl")sh.remove()};sh.querySelector("#cl").focus();
  return sh;
}
function rulesSheet(){
  sheet("كيف بتنحسب النقاط؟",`
   <div class="rules">
    <h4>${svg("door")}الإقصاء</h4>
    <p>كل كم جولة منفتح «منطقة الخطر»: الأقل نقاط بيطلع وبيصير <b>شبح</b>. إذا في تعادل، المتعادلين بيتبارزوا. لما يضل اثنين: <b>النهائي</b>، أحسن من 3 مبارزات، واللي نقاطه أكثر بيختار الفئة.</p>
    <h4>${svg("shield")}الدرع</h4><p>كل لاعب عنده درع واحد بالسهرة. إذا طلع اسمه للإقصاء، فيه يستعمله وينجو، وبيطلع اللي بعده.</p>
    <h4>${svg("ghost")}الأشباح</h4><p>اللي بيطلع بيضل معنا: بيأشّر وبيحزر وبيحكم، وعنده <b>لعنة وحدة</b> بياخد فيها نقطتين من أي لاعب لسا باللعبة.</p>
    <h4>${svg("coin")}الجولة الذهبية</h4><p>كل النقاط بالجولة دبل، الربح والخسارة.</p>
    <h4>${svg("bag")}جولة الحرامي</h4><p>أكثر واحد ربح بالجولة بيسرق نقطتين من اللي بيختاره.</p>
    <h4>${svg("hot")}سلسلة نار</h4><p>إذا ربحت نقاط بثلاث جولات ورا بعض: +2 بونص.</p>
    <h4>${svg("dare")}جولة الصاعقة</h4><p>بتطلع أحياناً بدل «مين فينا»: خمس أسئلة ورا بعض بدون دفاع، كل أغلبية بتاخد تاج، وصاحب أكتر تيجان +3.</p>
    <h4>${svg("who")}مين فينا</h4><p>اللي أشّر متل الأغلبية +1. المتّهم بيختار: يعترف (+1) أو يدافع (+3 أو −2)، وبعدها فيه «يقلب الطاولة» ويسأل واحد أشّر عليه «ليش أنا؟». الأسئلة الجريئة (🌶 و🔥) تصويتها سري، وبالـ🔥 نقاط المتّهم دبل.</p>
    <h4>${svg("swords")}المبارزة</h4><p>فئة وحدة، وكل واحد بدوره عنده 5 ثواني يقول كلمة منها. اللي بيعلق أو بيكرر بيخسر.</p>
    <h4>نقاط الألعاب</h4>
    <ul class="ptsl">${Object.entries(GAMES).map(([k,g])=>`<li style="--gc:${g.c}"><span class="ico">${svg(k)}</span><b>${g.n}</b><span>${nfix(g.pts.join(" · "))}</span></li>`).join("")}</ul>
   </div>`);
}

/* ---------------- session ---------------- */
function start(chosen){
  if(S.players.length<3){toast("بدكم 3 لاعبين على الأقل");return}
  stage.onclick=null;saveSetup();
  const z={};S.players.forEach(p=>z[p]=0);
  G={mode:S.mode,list:chosen&&chosen.length?chosen:Object.keys(GAMES),every:S.every||autoEvery(S.players.length),
     total:S.mode==="classic"?S.rounds:null,twists:S.twists,
     r:-1,q:[],tws:[],turn:Math.floor(Math.random()*S.players.length),pts:{...z},alive:new Set(S.players),out:[],
     shield:{},curse:{},streak:{...z},log:[],prevRank:{},phase:"intro",step:"",d:{},
     st:{who:{...z},bombs:{...z},detect:{...z},spyWins:{...z},hotBest:{...z},legend:{...z},fires:{...z},steals:{...z},read:{...z}}};
  S.players.forEach(p=>{G.shield[p]=S.mode==="elim"&&S.twists});
  $("#tools").hidden=false;$("#homeBtn").hidden=true;$("#roundBar").hidden=false;nextRound();
}
const alive=()=>S.players.filter(p=>G.alive.has(p));
const ghosts=()=>G.out.map(o=>o.p);
const game=()=>G.q[G.r];
const tw=()=>G.tws[G.r]||{};
function P(){const a=alive();return a[G.turn%a.length]}
function rotate(){G.turn=(G.turn+1)%alive().length}
function pickGame(){
  const last=G.q[G.q.length-1],prev=G.q[G.q.length-2];
  let opts=G.list.filter(g=>g!==last&&g!==prev);if(!opts.length)opts=G.list.filter(g=>g!==last);if(!opts.length)opts=G.list;
  return rnd(opts);
}
function nextRound(){
  stopAll();G.r++;G.q[G.r]=pickGame();
  let t={};if(G.twists&&G.r>=1){const x=Math.random();if(x<.2)t.golden=1;else if(x<.34)t.thief=1}
  if(G.twists&&G.r>=1&&G.q[G.r]==="who"&&Math.random()<.35)t={blitz:1};
  G.tws[G.r]=t;G.log=[];G.d={};G.step="";G.phase="intro";
  G.prevRank=rankMap();
  render();window.scrollTo({top:0,behavior:"smooth"});
}
function go(step){G.step=step;G.phase="play";render()}
function award(p,delta,why){
  if(!G.alive.has(p)||!delta)return;
  const m=tw().golden&&!/سلسلة|سرقة|لعنة/.test(why)?2:1;const v=delta*m;
  G.pts[p]+=v;G.log.push({p,v,why:why+(m>1?" ×2":"")});
}
function rankMap(){const m={};alive().sort((a,b)=>G.pts[b]-G.pts[a]).forEach((p,i)=>m[p]=i+1);return m}
function endRound(){
  stopAll();
  if(G.twists){
    const net={};G.log.forEach(e=>net[e.p]=(net[e.p]||0)+e.v);
    alive().forEach(p=>{
      if((net[p]||0)>0){G.streak[p]++;if(G.streak[p]>=3){G.streak[p]=0;G.st.fires[p]++;G.pts[p]+=2;G.log.push({p,v:2,why:"سلسلة نار"})}}
      else G.streak[p]=0;
    });
  }
  G.d.thiefDone=false;G.d.thief=null;
  if(tw().thief){const net={};G.log.forEach(e=>{if(G.alive.has(e.p))net[e.p]=(net[e.p]||0)+e.v});
    const pos=Object.entries(net).filter(([,v])=>v>0);if(pos.length){const mx=Math.max(...pos.map(x=>x[1]));G.d.thief=rnd(pos.filter(x=>x[1]===mx))[0]}}
  G.phase="recap";render();window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------------- render ---------------- */
function renderBar(){
  const t=tw(),chips=`${t.golden?`<span class="twc gold">${svg("coin")}ذهبية ×2</span>`:""}${t.thief?`<span class="twc thief">${svg("bag")}حرامي</span>`:""}${t.blitz?`<span class="twc blitz">${svg("dare")}صاعقة</span>`:""}`;
  if(G.mode==="elim"){
    $("#roundBar").innerHTML=`<span class="rb-l">جولة ${G.r+1} · باقي ${alive().length}${chips}</span><span class="avs">${S.players.map((p,i)=>`<i class="${G.alive.has(p)?"":"gh"}" style="--cc:${CC[i%7]}" title="${esc(p)}">${esc(p.slice(0,1))}</i>`).join("")}</span>`;
  }else{
    $("#roundBar").innerHTML=`<span class="rb-l">جولة ${Math.min(G.r+1,G.total)} من ${G.total}${chips}</span><span class="dots">${Array.from({length:G.total},(_,i)=>`<i class="${i<G.r?"done":i===G.r?"on":""}"></i>`).join("")}</span>`;
  }
}
function render(){
  stopAll();renderBar();
  if(G.phase==="intro"){setG(game());return intro(game())}
  if(G.phase==="play"){setG(game());return ({spy:rSpy,bomb:rBomb,who:rWho,said:rSaid,hot:rHot,lie:rLie,dare:rDare})[game()]()}
  if(G.phase==="recap")return recap();
  if(G.phase==="danger")return danger();
  if(G.phase==="duel")return duel();
  if(G.phase==="out")return outScreen();
  if(G.phase==="final")return finalScreen();
}
function intro(g){
  const gm=GAMES[g],t=tw();
  const focus=["lie","dare"].includes(g)?`<span class="seat">على الكرسي: ${esc(P())}</span>`:"";
  stage.innerHTML=`<section class="splash${t.golden?" golden":""}"><span class="num">الجولة ${G.r+1}${G.total?` من ${G.total}`:""}</span>
    ${t.golden?`<span class="twbanner gold">${svg("coin")}جولة ذهبية: كل النقاط دبل</span>`:""}
    ${t.thief?`<span class="twbanner thief">${svg("bag")}جولة الحرامي: الأكثر ربحاً بيسرق نقطتين</span>`:""}
    ${t.blitz?`<span class="twbanner blitz">${svg("dare")}جولة الصاعقة: 5 أسئلة ورا بعض</span>`:""}
    <div class="badge draw live">${svg(g)}</div>
    <h2>${gm.n}</h2><p>${t.blitz?"خمس أسئلة بسرعة بدون دفاع. كل سؤال بيعطي تاج للي بياخد الأغلبية، وصاحب أكتر تيجان بياخد +3.":gm.rule}</p>${focus}
    <ul class="ptsrow">${(t.blitz?["كل سؤال: تاج للأغلبية","أكتر تيجان +3"]:gm.pts).map(x=>`<li>${nfix(x)}</li>`).join("")}</ul>
    <button class="btn main" id="ok">يلا</button></section>`;
  $("#ok").onclick=()=>go("play");$("#ok").focus();
}
function cardHTML(g,top,q,extra=""){
  return `<div class="cardwrap"><article class="card"><div class="head"><span class="sticker">${svg(g)}${GAMES[g].n}</span><span>جولة ${G.r+1}</span></div>
    ${top?`<div class="to">${top}</div>`:""}<p class="q">${q}</p>${extra}</article></div>`;
}
function curtain(name,text,btn,cb){
  stage.innerHTML=`<section class="curtain live">${svg("eye")}<h2>الموبايل لـ${esc(name)}</h2><p>${text}</p><button class="btn main" id="ready">${btn}</button></section>`;
  $("#ready").onclick=cb;$("#ready").focus();
}
function namePicker(title,sub,list,multi,cb,btnText,extra){
  const sel=new Set();
  stage.innerHTML=`<p class="verdict">${title}<small>${sub}</small></p>
    <div class="names">${list.map((p,i)=>`<button data-i="${i}" aria-pressed="false">${esc(p)}</button>`).join("")}</div>
    ${multi||extra?`<div class="actions ${multi&&extra?"":"one"}">${extra?`<button class="btn" id="xtra">${extra[0]}</button>`:""}${multi?`<button class="btn main" id="conf">${btnText}</button>`:""}</div>`:""}`;
  stage.querySelector(".names").onclick=e=>{const b=e.target.closest("button");if(!b)return;const p=list[+b.dataset.i];
    if(!multi)return cb(p);
    sel.has(p)?sel.delete(p):sel.add(p);b.setAttribute("aria-pressed",sel.has(p))};
  if(multi)$("#conf").onclick=()=>cb([...sel]);
  if(extra)$("#xtra").onclick=extra[1];
}
function timer(sec,onTick,onEnd){
  let left=sec;onTick(left);
  const id=setInterval(()=>{left--;onTick(left);if(left<=0){clearInterval(id);onEnd()}},1000);
  cleanup=()=>clearInterval(id);
}
const mmss=s=>`${Math.floor(s/60)}:${String(Math.max(0,s)%60).padStart(2,"0")}`;

/* ---- spy ---- */
function rSpy(){
  const d=G.d,ps=alive();
  if(G.step==="play"){
    const it=draw("spy",SPYFLAT).split("|");d.cat=it[0];d.word=it[1];d.spy=rnd(ps);d.k=0;d.start=rnd(ps);go("pass");
  }else if(G.step==="pass"){
    const p=ps[d.k];curtain(p,"شوف كلمتك لحالك وخبّيها منيح.",`أنا ${esc(p)}، ورجيني`,()=>go("see"));
  }else if(G.step==="see"){
    const p=ps[d.k],isSpy=p===d.spy;
    stage.innerHTML=`<section class="private"><span class="sticker">${svg("spy")}الفئة: ${esc(d.cat)}</span>
      ${isSpy?`<p class="secret spy">انت برّا السالفة!</p><p class="small">ما حدا لازم يعرف. اسمع أسئلتهم وحاول تعرف الكلمة.</p>`
             :`<p class="small">الكلمة السرية</p><p class="secret">${esc(d.word)}</p><p class="small">في واحد بينكم ما بيعرفها.</p>`}
      <button class="btn dark" id="hide">${d.k<ps.length-1?"خبّي ومرّر":"خبّي، وكلنا شفنا"}</button></section>`;
    $("#hide").onclick=()=>{d.k++;go(d.k<ps.length?"pass":"talk")};
  }else if(G.step==="talk"){
    stage.innerHTML=cardHTML("spy",`الفئة: <b>${esc(d.cat)}</b>`,"اسألوا بعض!",`
      <p class="howto">${esc(d.start)} بيبلّش: بيسأل أي حدا سؤال عن الكلمة. الجواب لازم يثبت إنك بتعرفها بدون ما يفضحها. واللي جاوب بيسأل غيره.</p>
      <div class="timerrow"><output id="t">3:00</output><span class="small">وقت الأسئلة</span></div>
      <div class="timerbar"><div id="bar" style="width:100%"></div></div>`)+
      `<div class="actions one"><button class="btn main" id="vote">جاهزين نصوّت</button></div>`;
    timer(180,l=>{const t=$("#t"),b=$("#bar");if(t)t.textContent=mmss(l);if(b)b.style.width=(l/180*100)+"%"},()=>toast("خلص الوقت! صوّتوا"));
    $("#vote").onclick=()=>go("vote");
  }else if(G.step==="vote"){
    namePicker("مين برّا السالفة؟","اتفقوا على شخص واحد واكبسوا اسمه",ps,false,p=>{d.acc=p;go("res")});
  }else if(G.step==="res"){
    if(d.acc===d.spy){
      stage.innerHTML=`<p class="verdict">مسكتوه!<small>${esc(d.spy)} كان برّا السالفة. عنده فرصة أخيرة: يحزر الكلمة.</small></p>
        <div class="answer"><p>${esc(d.word)}</p><div class="by">الكلمة كانت</div></div>
        <div class="actions"><button class="btn" id="got">حزرها!</button><button class="btn main" id="miss">ما حزرها</button></div>`;
      $("#got").onclick=()=>{award(d.spy,3,"جاسوس حزر الكلمة");G.st.spyWins[d.spy]++;endRound()};
      $("#miss").onclick=()=>{ps.forEach(p=>{if(p!==d.spy){award(p,1,"مسكنا الجاسوس");G.st.detect[p]++}});endRound()};
    }else{
      award(d.spy,3,"جاسوس نجا");award(d.acc,-1,"اتّهام ظالم");G.st.spyWins[d.spy]++;
      stage.innerHTML=`<p class="verdict">غلطتوا!<small>${esc(d.acc)} بريء. الجاسوس كان <b>${esc(d.spy)}</b>.</small></p>
        <div class="answer"><p>${esc(d.word)}</p><div class="by">الكلمة كانت</div></div>
        <div class="actions one"><button class="btn main" id="nx">حصيلة الجولة</button></div>`;
      $("#nx").onclick=endRound;
    }
  }
}

/* ---- sound ---- */
let AC=null;
function beep(f=880,dur=.06,vol=.15){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=vol;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+dur);o.stop(AC.currentTime+dur)}catch(e){}}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}

/* ---- bomb ---- */
function rBomb(){
  const d=G.d;
  if(G.step==="play"){
    d.cat=draw("bomb",BOMB);d.first=P();
    stage.innerHTML=cardHTML("bomb",`الفئة`,esc(d.cat),`<p class="howto">الموبايل بيبلّش مع <b>${esc(d.first)}</b>. قول كلمة ومرّر للي عن يمينك. ممنوع تكرار كلمة انقالت.</p>`)+
      `<div class="actions one"><button class="btn main" id="arm">شغّلوا القنبلة</button></div>`;
    $("#arm").onclick=()=>{beep(440,.1);go("tick")};
  }else if(G.step==="tick"){
    stage.innerHTML=`<section class="bombzone"><h3>${esc(d.cat)}</h3>
      <div class="bombbig live"><i></i><i></i>${svg("bomb")}</div>
      <p class="note">قول كلمة ومرّر!</p></section>`;
    const total=15000+Math.random()*30000,t0=Date.now();let on=true,tid;
    const loop=()=>{if(!on)return;const frac=(Date.now()-t0)/total;
      if(frac>=1){on=false;return go("boom")}
      const gap=Math.max(140,800-frac*660);beep(frac>.8?1200:900);
      const sv=stage.querySelector(".bombbig");if(sv)sv.style.setProperty("--beat",(gap/1000*2)+"s");
      tid=setTimeout(loop,gap)};
    loop();cleanup=()=>{on=false;clearTimeout(tid)};
  }else if(G.step==="boom"){
    beep(90,.6,.35);beep(60,.8,.3);buzz([200,80,300]);
    stage.innerHTML=`<div class="shake"><p class="boom">بووووم!</p></div>`;
    const id=setTimeout(()=>namePicker("بإيد مين انفجرت؟","هو بيخسر، والباقيين بيربحوا",alive(),false,p=>{
      award(p,-1,"انفجرت بإيده");alive().forEach(x=>{if(x!==p)award(x,1,"نجا من القنبلة")});G.st.bombs[p]++;G.turn=alive().indexOf(p);endRound()}),900);
    cleanup=()=>clearTimeout(id);
  }
}

/* ---- who: اقرأ الشلة · اعترف ولا دافع · قلب الطاولة · تصويت سري · أشّر على حالك · صاعقة · حرارة ---- */
const HEATS=[null,{i:"🙂",n:"خفيف"},{i:"🌶",n:"حار"},{i:"🔥",n:"نار"}];
const FIRE_WORDS=/سر|وجه تاني|من وراك|مصلحت|يتكبّر|الزيت|بغيابك|ملاك|ديكتاتور|قليل ذوق/;
function whoHeat(q){if(typeof SPICY!=="undefined"&&SPICY.who.includes(q))return FIRE_WORDS.test(q)?3:2;return 1}
const heatTag=h=>`<span class="heatb h${h}">${HEATS[h].i} ${HEATS[h].n}${h>1?" · تصويت سري":""}${h===3?" · نقاط المتّهم دبل":""}</span>`;
function countdown(q,after){
  stage.innerHTML=`<p class="big" id="n">3</p><p class="note">${esc(q)}</p>`;
  let n=3;beep(600);
  const id=setInterval(()=>{n--;const el=$("#n");if(!el)return;
    if(n>0){el.textContent=n;beep(600)}else{clearInterval(id);el.textContent="أشّروا!";beep(1000,.25);const t=setTimeout(after,1400);cleanup=()=>clearTimeout(t)}},800);
  cleanup=()=>clearInterval(id);
}
function rWho(){
  if(tw().blitz)return rBlitz();
  const d=G.d,st=G.step;
  const m=()=>d.h===3?2:1;
  if(st==="play"){
    if(!d.q){d.q=draw("who",pool("who",WHO));d.h=whoHeat(d.q);d.secret=d.h>1;d.ptr=[]}
    stage.innerHTML=cardHTML("who",heatTag(d.h),esc(d.q),`<p class="howto">${d.secret
      ?"سؤال جريء: كل واحد بيصوّت بالسر على الموبايل، حتى الأشباح. بتطلع النتيجة بدون ما حدا يعرف مين صوّت لمين."
      :"لما يخلص العدّ، الكل بيأشّر بنفس اللحظة، حتى الأشباح. ممنوع التأخير ولا التغيير!"}</p>`)+
      `<div class="actions one"><button class="btn main" id="cd">${d.secret?"نصوّت بالسر":"عدّولنا"}</button></div>`;
    $("#cd").onclick=()=>{if(d.secret){d.voters=alive().concat(ghosts());d.k=0;d.votes={};go("vpass")}else go("count")};
  }else if(st==="count"){
    countdown(d.q,()=>{if(G&&G.step==="count")go("pick")});
  }else if(st==="pick"){
    namePicker("مين أخد أكثر إشارات؟","اكبسوا اسمه",alive(),false,p=>{d.target=p;go("readers")},"",["تعادل؟ قرعة",()=>go("tie")]);
  }else if(st==="tie"){
    namePicker("مين المتعادلين؟","اكبسوا أسماءهم، والقرعة بتختار واحد",alive(),true,arr=>{
      if(arr.length<2){toast("اختاروا اثنين على الأقل");return}
      d.target=rnd(arr);d.lot=true;toast(`القرعة اختارت ${d.target}`);go("readers")},"اسحب القرعة");
  }else if(st==="readers"){
    namePicker(`مين أشّر على ${esc(d.target)}؟`,"اكبسوا على كل واحد أشّر عليه، حتى لو هو نفسه",alive(),true,arr=>{
      d.ptr=arr;
      arr.forEach(x=>{if(x===d.target)award(x,3,"أشّر على حاله وطلع هو");else{award(x,1,"قرأ الشلة");G.st.read[x]++}});
      const rest=alive().filter(x=>x!==d.target&&!arr.includes(x));
      go(rest.length?"selfmiss":"choose")},"تمام");
  }else if(st==="selfmiss"){
    namePicker("حدا أشّر على حاله؟","وما طلع هو؟ كل واحد منهم −1. إذا ما حدا، اكبسوا كمّل",alive().filter(x=>x!==d.target&&!d.ptr.includes(x)),true,arr=>{
      arr.forEach(x=>award(x,-1,"أشّر على حاله لحاله"));go("choose")},"كمّل");
  }else if(st==="vpass"){
    const v=d.voters[d.k];
    curtain(v,"صوّت بالسر وما حدا يتطلّع على الشاشة.",`أنا ${esc(v)}`,()=>go("vote"));
  }else if(st==="vote"){
    const v=d.voters[d.k];
    namePicker(esc(d.q),`${esc(v)}، صوّت بالسر. فيك تختار حالك`,alive(),false,p=>{
      d.votes[v]=p;d.k++;beep(900,.04);go(d.k<d.voters.length?"vpass":"bars")});
  }else if(st==="bars"){
    const cnt={};alive().forEach(p=>cnt[p]=0);Object.values(d.votes).forEach(p=>cnt[p]++);
    const rows=Object.entries(cnt).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
    const mx=rows[0][1],top=rows.filter(r=>r[1]===mx).map(r=>r[0]);
    if(!d.target){d.target=rnd(top);d.lot=top.length>1;
      Object.entries(d.votes).forEach(([v,p])=>{if(v===p&&G.alive.has(v)){if(v===d.target)award(v,3,"صوّت لحاله وطلع هو");else award(v,-1,"صوّت لحاله لحاله")}})}
    const tot=Object.keys(d.votes).length;
    stage.innerHTML=`<p class="verdict sm">${esc(d.q)}<small>${tot} صوت · ما حدا بيعرف مين صوّت لمين</small></p>
      <ol class="bars">${rows.map(([p,n],i)=>`<li class="${p===d.target?"top":""}"><span class="bn">${esc(p)}</span><span class="bt"><i style="--w:${n/mx*100}%;--d:${i*.12}s"></i></span><b>${n}</b></li>`).join("")}</ol>
      <p class="verdict">${esc(d.target)}!<small>${d.lot?"تعادل، والقرعة اختارته":"أخد الأغلبية"}</small></p>
      <div class="actions one"><button class="btn main" id="nx">كمّل</button></div>`;
    $("#nx").onclick=()=>go("choose");
  }else if(st==="choose"){
    if(!d.counted){G.st.who[d.target]++;d.counted=true}
    const k=m();
    stage.innerHTML=`<section class="duelscr"><div class="badge draw live">${svg("who")}</div>
      <h2>${esc(d.target)}، الشلة اختارتك!</h2><p>${esc(d.q)}</p>${d.h>1?heatTag(d.h):""}
      <div class="choice">
        <button class="btn" id="adm">معهم حق<small>اعتراف بصراحة · ${nfix(sgn(k))}</small></button>
        <button class="btn main" id="def">بدافع عن حالي<small>20 ثانية · ${nfix(`+${3*k} أو ${sgn(-2*k)}`)}</small></button>
      </div></section>`;
    $("#adm").onclick=()=>{award(d.target,k,"اعترف بصراحة");d.res="admit";go("after")};
    $("#def").onclick=()=>go("defend");
  }else if(st==="defend"){
    const k=m();
    stage.innerHTML=cardHTML("who",`<b>${esc(d.target)}</b> عم يدافع`,"20 ثانية دفاع عن النفس!",`<p class="big" id="t">20</p>`)+
      `<div class="actions"><button class="btn" id="no">مش مقنع ${nfix(sgn(-2*k))}</button><button class="btn main" id="yes">مقنع ${nfix("+"+3*k)}</button></div>`;
    timer(20,l=>{const t=$("#t");if(t)t.textContent=l>0?l:"خلص!"},()=>beep(1000,.2));
    $("#yes").onclick=()=>{award(d.target,3*k,"دفاع مقنع");d.res="won";go("after")};
    $("#no").onclick=()=>{award(d.target,-2*k,"دفاع ضعيف");d.res="lost";go("after")};
  }else if(st==="after"){
    const k=m(),flippers=d.secret?[]:d.ptr.filter(x=>x!==d.target);
    const txt={admit:["صراحة بتستاهل!",`${esc(d.target)} ${nfix(sgn(k))}`],won:["أقنعهم!",`${esc(d.target)} ${nfix("+"+3*k)}`],lost:["ما مشي الحال",`${esc(d.target)} ${nfix(sgn(-2*k))}`]}[d.res];
    stage.innerHTML=`<p class="verdict">${txt[0]}<small>${txt[1]}</small></p>
      ${flippers.length?`<div class="twbox flip"><span class="ico">${svg("swords")}</span><div><b>قلب الطاولة</b><small>${esc(d.target)} بيسأل واحد أشّر عليه: «ليش أنا؟». إذا جوابه ظالم بيخسر نقطة.</small></div><button class="btn" id="flip">ليش أنا؟</button></div>`:""}
      <div class="actions one"><button class="btn main" id="nx">حصيلة الجولة</button></div>`;
    if(flippers.length)$("#flip").onclick=()=>namePicker(`${esc(d.target)} بيسأل…`,"اختار واحد أشّر عليك",flippers,false,v=>{d.flipV=v;go("flipans")});
    $("#nx").onclick=endRound;
  }else if(st==="flipans"){
    const v=d.flipV;
    stage.innerHTML=cardHTML("who",`قلب الطاولة`,`${esc(v)}، ليش ${esc(d.target)}؟`,`<p class="howto">جملة وحدة قدام الكل، والشلة بتحكم.</p>`)+
      `<div class="actions"><button class="btn" id="bad">ظالم ${nfix("−1")}</button><button class="btn main" id="fair">جواب منطقي</button></div>`;
    $("#bad").onclick=()=>{award(v,-1,"اتّهام ظالم");endRound()};
    $("#fair").onclick=endRound;
  }
}
/* جولة الصاعقة: 5 أسئلة، تاج لكل أغلبية، الأكثر تيجان +3 */
function rBlitz(){
  const d=G.d,st=G.step;
  if(!d.bq){d.bq=[];for(let i=0;i<5;i++)d.bq.push(draw("who",WHO));d.bi=0;d.crowns={}}
  if(st==="play"){
    if(d.bi>=5)return go("bres");
    stage.innerHTML=cardHTML("who",`<span class="heatb blitzb">⚡ صاعقة · سؤال ${d.bi+1} من 5</span>`,esc(d.bq[d.bi]))+
      `<div class="actions one"><button class="btn main" id="cd">عدّولنا</button></div>`;
    $("#cd").onclick=()=>go("bcount");
  }else if(st==="bcount"){
    countdown(d.bq[d.bi],()=>{if(G&&G.step==="bcount")go("bpick")});
  }else if(st==="bpick"){
    namePicker("مين أخد الأغلبية؟",`سؤال ${d.bi+1} من 5 · تاج إله`,alive(),false,p=>{d.crowns[p]=(d.crowns[p]||0)+1;d.bi++;beep(950,.05);go("play")},"",["تعادل، ولا تاج",()=>{d.bi++;go("play")}]);
  }else if(st==="bres"){
    const rows=Object.entries(d.crowns).sort((a,b)=>b[1]-a[1]),mx=rows.length?rows[0][1]:0,top=rows.filter(r=>r[1]===mx).map(r=>r[0]);
    if(!d.paid){d.paid=true;top.forEach(p=>award(p,3,"نجم الصاعقة"))}
    stage.innerHTML=`<p class="verdict">${top.length?`${top.map(esc).join(" و")} نجم الصاعقة!`:"ولا تاج!"}<small>${top.length?nfix("+3 "+(top.length>1?"لكل واحد":"")):"كلها تعادلات"}</small></p>
      ${rows.length?`<ol class="board">${rows.map(([p,n],i)=>`<li><span class="rank">${i+1}</span><span class="nm">${esc(p)}</span><span class="crwn">${"👑".repeat(n)}</span><b>${n}</b></li>`).join("")}</ol>`:""}
      <div class="actions one"><button class="btn main" id="nx">حصيلة الجولة</button></div>`;
    $("#nx").onclick=endRound;
  }
}

/* ---- who said it ---- */
function rSaid(){
  const d=G.d,ps=alive();
  if(G.step==="play"){
    d.q=draw("said",pool("said",SAID));d.k=0;d.ans=[];
    stage.innerHTML=cardHTML("said","السؤال لكل اللي باللعبة",esc(d.q),`<p class="howto">كل واحد بيكتب جوابه بالسر. اكتبوا بطريقة ما بتفضحكم!</p>`)+
      `<div class="actions one"><button class="btn main" id="ok">نبلّش نكتب</button></div>`;
    $("#ok").onclick=()=>go("pass");
  }else if(G.step==="pass"){
    curtain(ps[d.k],"اكتب جوابك وما حدا يتطلّع.",`أنا ${esc(ps[d.k])}`,()=>go("write"));
  }else if(G.step==="write"){
    stage.innerHTML=`<section class="private"><span class="sticker">${svg("said")}جوابك بالسر</span><p class="q">${esc(d.q)}</p>
      <textarea id="a" placeholder="اكتب هون…" aria-label="جوابك"></textarea>
      <button class="btn dark" id="done">${d.k<ps.length-1?"خبّي ومرّر":"خلصنا كلنا"}</button></section>`;
    $("#a").focus();
    $("#done").onclick=()=>{const v=$("#a").value.trim();if(!v){toast("اكتب شي أول");return}
      d.ans.push({p:ps[d.k],a:v});d.k++;if(d.k<ps.length)go("pass");else{d.ans=shuffle(d.ans);d.j=0;go("read")}};
  }else if(G.step==="read"){
    const x=d.ans[d.j];
    stage.innerHTML=`<p class="verdict sm">${esc(d.q)}<small>جواب ${d.j+1} من ${d.ans.length} · مين كتب هاد؟ كل واحد يقول تخمينه بصوت عالي</small></p>
      <div class="answer"><p>${esc(x.a)}</p></div>
      <div class="actions one"><button class="btn main" id="rev">اكشف الكاتب</button></div>`;
    $("#rev").onclick=()=>{beep(800,.12);go("who")};
  }else if(G.step==="who"){
    const x=d.ans[d.j],guessers=S.players.filter(p=>p!==x.p);
    const nextAns=()=>{d.j++;if(d.j<d.ans.length)go("read");else endRound()};
    namePicker(`كتبه ${esc(x.p)}!`,"مين أول واحد حزر صح؟",guessers,false,p=>{award(p,1,"حزر الكاتب");G.st.detect[p]=(G.st.detect[p]||0)+1;nextAns()},"",["ما حدا عرفه",()=>{award(x.p,2,"ما حدا عرفه");nextAns()}]);
  }
}

/* ---- hot seat: everyone gets 30 seconds ---- */
function rHot(){
  const d=G.d;
  if(!d.order){const a=alive(),s=a.indexOf(P());d.order=a.slice(s).concat(a.slice(0,s));d.k=0;d.sc={}}
  const p=d.order[d.k];
  if(G.step==="play"){
    stage.innerHTML=cardHTML("hot",`الدور ${d.k+1} من ${d.order.length}: <b>${esc(p)}</b>`,"30 ثانية. جاهز؟",`<p class="howto">واحد تاني بيمسك الموبايل وبيقرأ الأسئلة بسرعة، وبيكبس «جاوب» بعد كل جواب. ممنوع «ما بعرف»!</p>
      ${Object.keys(d.sc).length?`<ul class="minisc">${Object.entries(d.sc).map(([n,v])=>`<li><span>${esc(n)}</span><b>${v}</b></li>`).join("")}</ul>`:""}`)+
      `<div class="actions one"><button class="btn main" id="ok">ابدأ الـ30 ثانية</button></div>`;
    $("#ok").onclick=()=>{d.n=0;go("run")};
  }else if(G.step==="run"){
    stage.innerHTML=`<div class="timerrow"><output id="t">0:30</output><span class="sticker">${svg("hot")}${esc(p)} · <span id="c">0</span></span></div>
      <div class="timerbar"><div id="bar" style="width:100%"></div></div>
      <div class="cardwrap"><article class="card" id="qc" style="min-height:220px"><p class="q" id="q">${esc(draw("hot",HOT))}</p></article></div>
      <div class="actions"><button class="btn" id="sk">تخطّي</button><button class="btn main" id="nx">جاوب!</button></div>`;
    const nq=()=>{$("#q").textContent=draw("hot",HOT);const c=$("#qc");c.style.animation="none";c.offsetHeight;c.style.animation=""};
    $("#nx").onclick=()=>{d.n++;$("#c").textContent=d.n;beep(950,.05);nq()};
    $("#sk").onclick=()=>{beep(300,.05);nq()};
    timer(30,l=>{const t=$("#t"),b=$("#bar");if(t)t.textContent=mmss(l);if(b)b.style.width=(l/30*100)+"%";if(l<=5&&l>0)beep(700,.05)},()=>{beep(300,.4);
      d.sc[p]=d.n;G.st.hotBest[p]=Math.max(G.st.hotBest[p]||0,d.n);d.k++;if(d.k<d.order.length)go("play");else go("res")});
  }else if(G.step==="res"){
    const vals=[...new Set(Object.values(d.sc))].sort((a,b)=>b-a);
    const top=vals[0],second=vals[1],low=vals[vals.length-1];
    Object.entries(d.sc).forEach(([n,v])=>{
      if(vals.length<2)return;
      if(v===top)award(n,3,"الأسرع بالكرسي");else if(v===second&&vals.length>2)award(n,1,"تاني أسرع");
      if(v===low&&v!==top)award(n,-1,"الأبطأ بالكرسي");
    });
    stage.innerHTML=`<p class="verdict">نتيجة الكرسي الساخن<small>${vals.length<2?"تعادل كامل! ما حدا ربح ولا خسر":"مين أسرع واحد؟"}</small></p>
      <ol class="board">${Object.entries(d.sc).sort((a,b)=>b[1]-a[1]).map(([n,v],i)=>`<li><span class="rank">${i+1}</span><span>${esc(n)}</span><b>${v}</b></li>`).join("")}</ol>
      <div class="actions one"><button class="btn main" id="nx">حصيلة الجولة</button></div>`;
    $("#nx").onclick=()=>{rotate();endRound()};
  }
}

/* ---- two truths and a lie ---- */
function rLie(){
  const p=P();
  if(G.step==="play"){
    stage.innerHTML=cardHTML("lie",`الدور على <b>${esc(p)}</b>`,esc(draw("lie",LIE_TOPICS)),
      `<p class="howto">احكي ثلاث جمل عن هالموضوع، وحدة منهم كذبة. احكيهم بنفس الثقة، وبعدين الكل بيصوّت بالأصابع: 1 أو 2 أو 3.</p>`)+
      `<div class="actions one"><button class="btn main" id="ok">حكيت، صوّتوا!</button></div>`;
    $("#ok").onclick=()=>go("score");
  }else{
    namePicker(`${esc(p)} يكشف الكذبة`,"اكبسوا على كل واحد حزرها صح",S.players.filter(x=>x!==p),true,arr=>{
      if(!arr.length)award(p,3,"كذبة ما انكشفت");
      else arr.forEach(x=>{award(x,1,"كشف الكذبة");G.st.detect[x]=(G.st.detect[x]||0)+1});
      rotate();endRound()},"تمام، احسب");
  }
}

/* ---- dare ---- */
function rDare(){
  const p=P(),t=draw("dare",pool("dare",DARE));
  stage.innerHTML=cardHTML("dare",`المهمة لـ<b>${esc(p)}</b>`,esc(t),`<p class="howto">نفّذ، والشلة بتقيّم.</p>`)+
    `<div class="rate"><button class="btn" data-v="-1">ما عملها<b>−1</b></button><button class="btn" data-v="1">عادي<b>+1</b></button><button class="btn main" data-v="3">أسطوري<b>+3</b></button></div>`;
  stage.querySelector(".rate").onclick=e=>{const b=e.target.closest("button");if(!b)return;const v=+b.dataset.v;
    award(p,v,v===3?"تحدّي أسطوري":v>0?"نفّذ التحدي":"هرب من التحدي");if(v===3)G.st.legend[p]++;rotate();endRound()};
}

/* ---------------- recap ---------------- */
function recap(){
  setG(game());
  const t=tw(),byP={};G.log.forEach(e=>{(byP[e.p]=byP[e.p]||{v:0,why:[]});byP[e.p].v+=e.v;byP[e.p].why.push(e.why)});
  const rows=Object.entries(byP).sort((a,b)=>b[1].v-a[1].v);
  const now=rankMap();
  const thief=t.thief&&!G.d.thiefDone?G.d.thief:null;
  const curseOwners=G.mode==="elim"?ghosts().filter(p=>G.curse[p]):[];
  const nxt=nextLabel();
  stage.innerHTML=`<section class="recap">
    <div class="rc-head"><h2>حصيلة الجولة ${G.r+1}</h2>${t.golden?`<span class="twc gold">${svg("coin")}ذهبية ×2</span>`:""}</div>
    ${rows.length?`<ul class="deltas">${rows.map(([p,x],i)=>`<li style="--d:${i*.07}s"><span class="av" style="--cc:${CC[S.players.indexOf(p)%7]}">${esc(p.slice(0,1))}</span>
      <span class="who"><b>${esc(p)}${G.streak[p]===2?`<i class="fire" title="سلسلة">${svg("hot")}</i>`:""}</b><small>${nfix(x.why.map(esc).join(" · "))}</small></span>
      <b class="dv ${x.v>0?"up":x.v<0?"dn":""}"><bdi dir="ltr">${sgn(x.v)}</bdi></b></li>`).join("")}</ul>`:`<p class="note">ما حدا ربح ولا خسر بهالجولة.</p>`}
    ${thief?`<div class="twbox thief"><span class="ico">${svg("bag")}</span><div><b>${esc(thief)} هو الحرامي!</b><small>بيسرق نقطتين من مين بدو.</small></div><button class="btn main" id="steal">اسرق</button></div>`:""}
    ${curseOwners.length?`<div class="twbox ghostb"><span class="ico">${svg("ghost")}</span><div><b>لعنة الأشباح</b><small>${curseOwners.map(esc).join("، ")} ${curseOwners.length>1?"عندهم":"عنده"} لعنة: نقطتين من أي لاعب.</small></div><button class="btn" id="curse">العن حدا</button></div>`:""}
    <span class="label">الترتيب</span>${boardHTML(now)}
    <div class="actions one"><button class="btn main" id="cont">${nxt}</button></div></section>`;
  if(thief)$("#steal").onclick=()=>namePicker(`${esc(thief)} بيسرق من…`,"اختار الضحية",alive().filter(x=>x!==thief),false,v=>{
    G.pts[v]-=2;G.pts[thief]+=2;G.log.push({p:thief,v:2,why:"سرقة"},{p:v,v:-2,why:"انسرق"});G.st.steals[thief]++;G.d.thiefDone=true;buzz(80);render()});
  if(curseOwners.length)$("#curse").onclick=()=>{
    const pickT=g=>namePicker(`لعنة ${esc(g)}`,"مين الضحية؟",alive(),false,v=>{G.pts[v]-=2;G.curse[g]=false;G.log.push({p:v,v:-2,why:`لعنة ${g}`});buzz([60,40,60]);render()});
    if(curseOwners.length===1)pickT(curseOwners[0]);else namePicker("مين الشبح اللي بدو يلعن؟","",curseOwners,false,pickT);
  };
  $("#cont").onclick=afterRecap;
}
function isCheckpoint(){return G.mode==="elim"&&alive().length>2&&(G.r+1)%G.every===0}
function nextLabel(){
  if(G.mode==="elim")return alive().length<=2?"على النهائي!":isCheckpoint()?"منطقة الخطر":"الجولة الجاية";
  return G.r+1>=G.total?"مين أخذ التاج؟":"الجولة الجاية";
}
function afterRecap(){
  if(G.mode==="elim"){
    if(alive().length<=2)return startFinal();
    if(isCheckpoint()){G.immune=[];G.phase="danger";G.d={};return render()}
    return nextRound();
  }
  if(G.r+1>=G.total){
    const r=alive().sort((a,b)=>G.pts[b]-G.pts[a]);const top=r.filter(p=>G.pts[p]===G.pts[r[0]]);
    if(top.length>1){G.duelCfg={players:top,title:"مبارزة التاج",sub:`${top.map(esc).join(" و")} متعادلين على المركز الأول`,onLose:l=>{
      const rest=G.duelCfg.players.filter(x=>x!==l);if(rest.length>1){G.duelCfg.players=rest;G.duelCfg.st=null;G.phase="duel";render()}else{G.crown=rest[0];finish()}}};
      G.phase="duel";return render()}
    G.crown=r[0];return finish();
  }
  nextRound();
}
function boardHTML(now){
  now=now||rankMap();
  const a=alive().sort((x,y)=>G.pts[y]-G.pts[x]);
  const rows=a.map(p=>{const was=G.prevRank[p],is=now[p],mv=was&&is?was-is:0;
    return `<li class="${G.shield[p]?"sh":""}"><span class="rank">${is}</span><span class="nm">${esc(p)}${G.shield[p]?`<i class="mini" title="عنده درع">${svg("shield")}</i>`:""}</span>${mv?`<span class="mv ${mv>0?"up":"dn"}">${mv>0?"▲":"▼"}${Math.abs(mv)}</span>`:"<span></span>"}<b>${num(G.pts[p])}</b></li>`});
  const gh=[...G.out].reverse().map(o=>`<li class="gh"><span class="rank"><i class="mini">${svg("ghost")}</i></span><span class="nm">${esc(o.p)}<small>طلع بالجولة ${o.round}</small></span><span></span><b>${num(o.pts)}</b></li>`);
  return `<ol class="board">${rows.join("")}${gh.join("")}</ol>`;
}

/* ---------------- elimination ---------------- */
function lowest(){
  const a=alive().filter(p=>!G.immune.includes(p));const mn=Math.min(...a.map(p=>G.pts[p]));
  return a.filter(p=>G.pts[p]===mn);
}
function danger(){
  setG("var(--bomb)");
  const a=alive().filter(p=>!G.immune.includes(p)).sort((x,y)=>G.pts[x]-G.pts[y]).slice(0,3);
  stage.innerHTML=`<section class="danger">
    <span class="dz-tag">${svg("door")}منطقة الخطر</span>
    <h2>${G.immune.length?"الدرع غيّر كل شي…":"واحد رح يطلع هلق"}</h2>
    <p>${G.immune.length?`${G.immune.map(esc).join(" و")} نجا بالدرع. مين اللي بعده؟`:"الأقل نقاط بيصير شبح. إذا في تعادل، مبارزة."}</p>
    <div class="dz-cards">${a.map((p,i)=>`<div class="dz" style="--d:${i*.12}s"><span class="av" style="--cc:${CC[S.players.indexOf(p)%7]}">${esc(p.slice(0,1))}</span><b>${esc(p)}</b><span>${num(G.pts[p])} نقطة</span></div>`).join("")}</div>
    <button class="btn main" id="rev">اكشف</button></section>`;
  $("#rev").onclick=()=>{
    beep(220,.3);const lo=lowest();
    if(lo.length>1){G.duelCfg={players:lo,title:"مبارزة الإقصاء",sub:`${lo.map(esc).join(" و")} متعادلين بالأقل. اللي بيعلق بيطلع.`,onLose:l=>shieldCheck(l)};G.phase="duel";return render()}
    shieldCheck(lo[0]);
  };
}
function shieldCheck(p){
  if(G.shield[p]){
    setG("var(--spy)");
    stage.innerHTML=`<section class="danger shieldq"><div class="badge draw live">${svg("shield")}</div>
      <h2>${esc(p)}… عندك درع!</h2><p>الأقل نقاط هلق انت. إذا استعملت الدرع بتنجو، وبيطلع اللي بعدك. الدرع بينستعمل مرة وحدة بس.</p>
      <div class="actions"><button class="btn" id="no">خليه، بطلع بشرف</button><button class="btn main" id="yes">استعمل الدرع</button></div></section>`;
    $("#yes").onclick=()=>{G.shield[p]=false;G.immune.push(p);buzz(120);
      if(alive().filter(x=>!G.immune.includes(x)).length<1)return eliminate(p);
      G.phase="danger";render()};
    $("#no").onclick=()=>{G.shield[p]=false;eliminate(p)};
    return;
  }
  eliminate(p);
}
function eliminate(p){
  G.alive.delete(p);G.out.push({p,round:G.r+1,pts:G.pts[p]});G.curse[p]=G.twists;G.lastOut=p;
  if(G.turn>=alive().length)G.turn=0;
  G.phase="out";render();
}
function outScreen(){
  setG("var(--lie)");beep(160,.5,.25);buzz([300]);
  const p=G.lastOut;
  stage.innerHTML=`<section class="outscr"><div class="ghostbig live">${svg("ghost")}</div>
    <h2>${esc(p)} طلع!</h2>
    <p>صار شبح. بيضل معنا: بيأشّر، بيحزر، بيحكم.${G.curse[p]?" وعنده لعنة وحدة يستعملها بأي حصيلة جولة.":""}</p>
    <span class="left">باقي ${alive().length} باللعبة</span>
    <button class="btn main" id="nx">${alive().length<=2?"على النهائي!":"كمّلوا"}</button></section>`;
  $("#nx").onclick=()=>alive().length<=2?startFinal():nextRound();
}

/* ---------------- duel ---------------- */
function duel(){
  setG("var(--bomb)");
  const c=G.duelCfg;if(!c.st)c.st={cat:c.cat||draw("bomb",BOMB),i:0,n:0,started:false};
  const st=c.st,cur=c.players[st.i];
  if(!st.started){
    stage.innerHTML=`<section class="duelscr"><div class="badge draw live">${svg("swords")}</div>
      <h2>${c.title}</h2><p>${c.sub}</p>
      <div class="dcat"><small>الفئة</small><b>${esc(st.cat)}</b></div>
      <p class="hint">كل واحد بدوره عنده 5 ثواني يقول كلمة من الفئة. اللي بيعلق أو بيكرر كلمة انقالت بيخسر. الشلة بتحكم.</p>
      <div class="vs">${c.players.map(p=>`<span>${esc(p)}</span>`).join(`<i>×</i>`)}</div>
      <button class="btn main" id="go">ابدأ المبارزة</button></section>`;
    $("#go").onclick=()=>{st.started=true;render()};return;
  }
  stage.innerHTML=`<section class="duelscr live-duel">
    <div class="dcat"><small>الفئة</small><b>${esc(st.cat)}</b></div>
    <div class="ring5"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="r-bg"/><circle cx="60" cy="60" r="52" class="r-fg" id="rf"/></svg><output id="t">5</output></div>
    <div class="turn"><small>الدور على</small><b>${esc(cur)}</b></div>
    <div class="vs">${c.players.map((p,i)=>`<span class="${i===st.i?"on":""}">${esc(p)}</span>`).join(`<i>×</i>`)}</div>
    <p class="hint">${st.n} كلمة انقالت</p>
    <div class="actions"><button class="btn" id="fail">علق ✗</button><button class="btn main" id="ok">قال ✓</button></div></section>`;
  const rf=$("#rf"),L=2*Math.PI*52;rf.style.strokeDasharray=L;rf.style.strokeDashoffset=0;
  requestAnimationFrame(()=>{rf.style.transition="stroke-dashoffset 5s linear";rf.style.strokeDashoffset=L});
  timer(5,l=>{const t=$("#t");if(t)t.textContent=Math.max(0,l);if(l>0&&l<=3)beep(700,.05)},()=>lose(cur));
  $("#ok").onclick=()=>{st.n++;st.i=(st.i+1)%c.players.length;beep(950,.05);render()};
  $("#fail").onclick=()=>lose(cur);
  function lose(p){stopAll();beep(150,.4,.25);buzz([200]);
    stage.innerHTML=`<section class="duelscr"><div class="shake"><p class="boom sm">علق!</p></div><h2>${esc(p)} خسر المبارزة</h2>
      <button class="btn main" id="nx">كمّلوا</button></section>`;
    $("#nx").onclick=()=>{const cb=c.onLose;cb(p)};
  }
}

/* ---------------- final ---------------- */
function startFinal(){
  const [a,b]=alive();const lead=G.pts[a]===G.pts[b]?rnd([a,b]):(G.pts[a]>G.pts[b]?a:b);
  G.fin={players:[a,b],stars:{[a]:0,[b]:0},lead,n:0};G.phase="final";G.fin.step="intro";render();
}
function finalScreen(){
  setG("var(--who)");const f=G.fin,[a,b]=f.players;
  const stars=p=>`<span class="stars">${[0,1].map(i=>`<i class="${i<f.stars[p]?"on":""}">${svg("crownsm")}</i>`).join("")}</span>`;
  const head=`<div class="finvs"><div><b>${esc(a)}</b>${stars(a)}<small>${num(G.pts[a])} نقطة</small></div><i>×</i><div><b>${esc(b)}</b>${stars(b)}<small>${num(G.pts[b])} نقطة</small></div></div>`;
  if(f.step==="intro"){
    stage.innerHTML=`<section class="finalscr"><div class="badge draw live">${svg("crown")}</div><h2>النهائي!</h2>${head}
      <p>أحسن من 3 مبارزات: أول واحد بيربح مبارزتين بياخد التاج. <b>${esc(f.lead)}</b> نقاطه أكثر، فهو بيختار الفئة كل مرة.</p>
      ${ghosts().length?`<p class="hint">لجنة الأشباح (${ghosts().map(esc).join("، ")}) بتحكم إذا الكلمة صح.</p>`:""}
      <button class="btn main" id="nx">يلا</button></section>`;
    $("#nx").onclick=()=>{f.step="pick";render()};
  }else if(f.step==="pick"){
    if(!f.opts)f.opts=[draw("bomb",BOMB),draw("bomb",BOMB),draw("bomb",BOMB)];
    stage.innerHTML=`<section class="finalscr">${head}<h2 class="sm">المبارزة ${f.n+1}</h2><p><b>${esc(f.lead)}</b>، اختار الفئة:</p>
      <div class="catpick">${f.opts.map((o,i)=>`<button class="btn" data-i="${i}">${esc(o)}</button>`).join("")}</div></section>`;
    stage.querySelector(".catpick").onclick=e=>{const btn=e.target.closest("button");if(!btn)return;
      const cat=f.opts[+btn.dataset.i];f.opts=null;
      const first=f.n%2===0?(f.lead===a?b:a):f.lead;
      G.duelCfg={players:first===a?[a,b]:[b,a],cat,title:`المبارزة ${f.n+1}`,sub:"اللي بيعلق بيعطي نجمة للتاني",onLose:l=>{
        const w=l===a?b:a;f.stars[w]++;f.n++;
        if(f.stars[w]>=2){G.crown=w;G.runner=l;return finish()}
        f.step="pick";G.phase="final";render()}};
      G.phase="duel";render()};
  }
}

/* ---------------- scores & end ---------------- */
$("#scoresBtn").onclick=()=>{if(G)sheet("النقاط",boardHTML())};
$("#endBtn").onclick=()=>{if(!G)return;
  const sh=sheet("إنهاء السهرة؟",`<p class="note" style="text-align:start">بتنتهي السهرة هلق وبتطلع النتيجة حسب النقاط.</p><div class="actions"><button class="btn" id="cn">لا، كمّلوا</button><button class="btn main" id="ys">أنهوا</button></div>`);
  sh.querySelector("#cn").onclick=()=>sh.remove();sh.querySelector("#ys").onclick=()=>{sh.remove();finish()}};
function topOf(obj){const e=Object.entries(obj).sort((a,b)=>b[1]-a[1]);return e.length&&e[0][1]>0?e[0]:null}
function finalRanking(){
  const a=alive().sort((x,y)=>G.pts[y]-G.pts[x]);
  if(G.crown){const i=a.indexOf(G.crown);if(i>0){a.splice(i,1);a.unshift(G.crown)}}
  return a.map(p=>({p,pts:G.pts[p]})).concat([...G.out].reverse().map(o=>({p:o.p,pts:o.pts,out:o.round})));
}
function finish(){
  stopAll();$("#tools").hidden=true;$("#homeBtn").hidden=false;$("#roundBar").hidden=true;setG("var(--who)");setTimeout(confetti,700);
  const r=finalRanking(),pod=[r[1],r[0],r[2]];
  const aw=[
    [topOf(G.st.who),"who","نجم «مين فينا»",n=>`${n} مرة اختاروه`],
    [topOf(G.st.bombs),"bomb","ضحية القنبلة",n=>`انفجرت بإيده ${n} مرة`],
    [topOf(G.st.read),"eye","بيقرا الشلة",n=>`أشّر متل الأغلبية ${n} مرة`],
    [topOf(G.st.detect),"lie","أشطر محقّق",n=>`كشف ${n} مرة`],
    [topOf(G.st.spyWins),"spy","الجاسوس الماكر",n=>`نجا ${n} مرة`],
    [topOf(G.st.hotBest),"hot","ملك الكرسي الساخن",n=>`${n} جواب بـ30 ثانية`],
    [topOf(G.st.legend),"dare","أسطورة التحديات",n=>`${n} تحدي أسطوري`],
    [topOf(G.st.fires),"hot","ولّعها",n=>`${n} سلسلة نار`],
    [topOf(G.st.steals),"bag","الحرامي الظريف",n=>`سرق ${n} مرة`]
  ].filter(a=>a[0]);
  stage.innerHTML=`<section class="stage">
    <p class="verdict">${r[0]?`${esc(r[0].p)} أخذ التاج!`:"خلصت السهرة!"}<small>${roundsTxt(G.r+1)} مع ${S.players.length} لاعبين · ${MODES[G.mode].n}</small></p>
    <div class="podium">${pod.map((x,i)=>x?`<div class="${["p2","p1","p3"][i]}">${i===1?`<span class="crown draw live">${svg("crown")}</span>`:""}<span>${["الثاني","البطل","الثالث"][i]}</span><strong>${esc(x.p)}</strong><b>${num(x.pts)}</b></div>`:"<div style='visibility:hidden'></div>").join("")}</div>
    ${aw.length?`<span class="label">ألقاب الليلة</span><div class="awards">${aw.map(([[p,n],k,t,f])=>`<div class="award" style="--ac:${GAMES[k]?GAMES[k].c:"var(--who)"}"><span class="ico">${svg(k)}</span><small>${t}</small><strong>${esc(p)}</strong><small>${f(n)}</small></div>`).join("")}</div>`:""}
    <span class="label">الترتيب الكامل</span>
    <ol class="board">${r.map((x,i)=>`<li class="${x.out?"gh":""}"><span class="rank">${i+1}</span><span class="nm">${esc(x.p)}${x.out?`<small>طلع بالجولة ${x.out}</small>`:""}</span><span></span><b>${num(x.pts)}</b></li>`).join("")}</ol>
    <button class="go" id="again">سهرة جديدة بنفس الشلة</button></section>`;
  $("#again").onclick=renderSetup;window.scrollTo({top:0});
}

function confetti(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const cv=document.createElement("canvas");cv.id="confetti";document.body.appendChild(cv);
  const ctx=cv.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1);
  const W=cv.width=innerWidth*dpr,H=cv.height=innerHeight*dpr;cv.style.width=innerWidth+"px";cv.style.height=innerHeight+"px";
  const cs=getComputedStyle(document.documentElement),cols=["--coral","--saffron","--mint","--lie","--spy"].map(v=>cs.getPropertyValue(v).trim()||"#999");
  const ps=Array.from({length:150},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*14*dpr,vy:(-Math.random()*14-6)*dpr,r:(4+Math.random()*5)*dpr,a:Math.random()*6,va:(Math.random()-.5)*.3,c:cols[Math.floor(Math.random()*cols.length)],s:Math.random()<.4}));
  let t=0;(function f(){t++;ctx.clearRect(0,0,W,H);
    ps.forEach(p=>{p.vy+=.35*dpr;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.globalAlpha=Math.max(0,1-t/170);ctx.fillStyle=p.c;
      if(p.s)ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);else{ctx.beginPath();ctx.arc(0,0,p.r*.75,0,7);ctx.fill()}ctx.restore()});
    if(t<170)requestAnimationFrame(f);else cv.remove()})();
}
renderSetup();
