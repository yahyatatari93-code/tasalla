/* ============================================================
   مافيا الحارة — من ألعاب «تسلّى غو»
   ============================================================ */
{
const IN_APP=!!document.querySelector('meta[name="tg-app"]');
/* ============ الأيقونات ============ */
const IC={
  killer:'<path d="M19 3 8.5 13.5M6 16l-2 2 2 2 2-2M8.5 13.5l2 2M5.5 13l5.5 5.5M19 3l2 2-8.5 8.5"/>',
  silencer:'<rect x="3.5" y="8.5" width="17" height="7" rx="3.5"/><path d="M7 12h10M8.5 10.5v3M12 10.5v3M15.5 10.5v3"/>',
  mafia:'<path d="M3 16h18M6 16l1-6.5C7.4 7 9 6 12 6s4.6 1 5 3.5L18 16M7.5 12.5h9"/>',
  sheikh:'<path d="M12 3v2.5M9 21h6M8 8h8l-1 13H9z"/><path d="M10.5 12.5c0-1 .7-1.8 1.5-2.5.8.7 1.5 1.5 1.5 2.5a1.5 1.5 0 0 1-3 0z"/>',
  nurse:'<path d="M12 20.5s-8-4.8-8-10.6A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 8 2.7c0 5.8-8 10.6-8 10.6z"/><path d="M12 10v5.5M9.3 12.7h5.4"/>',
  avenger:'<path d="M12 3c.6 3.5 5 5 5 10a5 5 0 0 1-10 0c0-2.6 1.8-3.6 1.8-5.6 1 1.1 2 1.7 3 1.1C10.8 6.6 11.4 4.8 12 3z"/>',
  hunter:'<circle cx="12" cy="12" r="7"/><path d="M12 2.5V7M12 17v4.5M2.5 12H7M17 12h4.5"/><circle cx="12" cy="12" r="1.2"/>',
  detective:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5M8 10.5a2.5 2.5 0 0 1 2.5-2.5"/>',
  jester:'<path d="M4 7l4 3 4-6 4 6 4-3-2 11H6z"/><circle cx="4" cy="6" r="1.3"/><circle cx="12" cy="3.5" r="1.3"/><circle cx="20" cy="6" r="1.3"/><path d="M9 14.5h6"/>',
  trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5A3.5 3.5 0 0 1 16.5 11M12 14v3.5M8.5 20.5h7M9.5 17.5h5"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  citizen:'<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c1-4 3.9-6.2 7.2-6.2s6.2 2.2 7.2 6.2"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.4 6.4 0 0 0 10.5 10.5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
  skull:'<path d="M12 3a8 8 0 0 0-5 14.2V20h10v-2.8A8 8 0 0 0 12 3z"/><circle cx="9" cy="11.5" r="1.6"/><circle cx="15" cy="11.5" r="1.6"/><path d="M10.5 20v-2M13.5 20v-2"/>',
  vote:'<path d="M4 13h16v7H4zM8 13V5h8v8M10 9l1.5 1.5L14.5 7.5"/>',
  shield:'<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/>'
};
const ic=(k,cls="")=>`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[k]||""}</svg>`;

/* ============ الأدوار ============ */
const R={
  killer:  {n:"القاتل",t:"m",c:"#E5383B",d:"كل ليلة بتختار شخص لتقتله. القرار إلك لحالك."},
  silencer:{n:"المُسكِت",t:"m",c:"#E5383B",d:"كل ليلة بتختار شخص بيتسكّت بالنهار: ما بيحكي ولا بيدافع عن حاله."},
  mafia:   {n:"مافيا",t:"m",c:"#E5383B",d:"إنت من المافيا. ضيّع الصالحين وخلّي الشك يروح لغيرك. إذا مات القاتل، ممكن تصير إنت القاتل."},
  sheikh:  {n:"شيخ الصالحين",t:"g",c:"#FFB72B",d:"من النهار التاني بتقدر تكشف حالك، وبيصير صوتك بـ3 أصوات. أو بتضل متخفّي."},
  nurse:   {n:"الإسعاف",t:"g",c:"#22BFA0",d:"كل ليلة بتسعف شخص وبتحميه من الموت. ما بتسعف نفس الشخص ليلتين ورا بعض، وبتسعف حالك مرة وحدة بس."},
  avenger: {n:"الوالد الصالح",t:"g",c:"#FF8A5B",d:"إذا قتلتك المافيا بالليل، بتاخد معك شخص من اختيارك."},
  hunter:  {n:"قنّاص المافيا",t:"g",c:"#6F8DF0",d:"مرة وحدة باللعبة، بالنهار، بتكشف حالك وبتتهم شخص: إذا طلع مافيا بيموت هو، وإذا لا بتموت إنت."},
  detective:{n:"المحقّق",t:"g",c:"#45C3E3",d:"كل ليلة بتأشّر على شخص، والراوي بيفرجيك عالموبايل إذا مافيا أو لا. انتبه: إذا بيّنت إنك بتعرف كتير، المافيا رح تقتلك."},
  jester:  {n:"المهرّج",t:"n",c:"#F56A8E",d:"إنت لحالك، لا مع المافيا ولا مع الصالحين. بتربح إذا الحارة صوّتت عليك وطلّعتك. خلّيهن يشكّوا فيك!"},
  citizen: {n:"مواطن صالح",t:"g",c:"#9F91F6",d:"ما عندك قدرة خاصة. سلاحك عقلك وصوتك. لاقي المافيا قبل ما يخلصوا عليكم."}
};
const SPECIAL_G=["sheikh","nurse","detective","avenger","hunter"];

/* ============ الحالة ============ */
const KEY="mafia_state_v1",KS="mafia_setup_v1";
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const SETUP_DEF={names:[],mafia:null,silencer:true,roles:{sheikh:true,nurse:true,detective:true,avenger:true,hunter:true,jester:false},revealDead:true,voice:true,music:true,lastWords:true,talk:60,minTurn:5};
let setup=(()=>{const x=ld(KS,{});const o=Object.assign({},SETUP_DEF,x);o.roles=Object.assign({},SETUP_DEF.roles,x.roles||{});return o})();
let G=ld(KEY,null);
let ui={};
const app=document.getElementById("app");
const $=s=>app.querySelector(s),$$=s=>[...app.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const save=()=>sv(KEY,G);
const P=i=>G.players[i];
const alive=()=>G.players.map((p,i)=>i).filter(i=>P(i).alive);
const isM=i=>R[P(i).role].t==="m";
const nm=i=>esc(P(i).n);
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
let timerH=null;function clearT(){if(timerH){clearInterval(timerH);timerH=null}}

/* عدد المافيا الافتراضي حسب عدد اللاعبين */
function autoMafia(n){return n<=5?1:n===6?2:n<=11?3:4}
function maxMafia(n){return Math.max(1,Math.floor((n-1)/2))}
function plan(){
  const n=setup.names.length;let m=setup.mafia||autoMafia(n);m=Math.min(m,maxMafia(n));
  const mafia=["killer"];if(m>=2)mafia.push(setup.silencer?"silencer":"mafia");while(mafia.length<m)mafia.push("mafia");
  const good=[];const j=setup.roles.jester&&n-m>=m+2?1:0;if(j)good.push("jester");
  for(const r of SPECIAL_G)if(setup.roles[r]&&good.length<n-m)good.push(r);while(good.length<n-m)good.push("citizen");
  return{m,mafia,good,n,j};
}

/* ============ العرض ============ */
function render(){
  clearT();
  if(!G||G.phase==="setup")return renderSetup();
  ({deal:renderDeal,day:renderDay,night:renderNight,dawn:renderDawn,vote:renderVote,over:renderOver})[G.phase]();
  window.scrollTo(0,0);
}
const topbar=(r)=>`<div class="top"><div class="brand">${IN_APP?`<a class="menub home" href="index.html" aria-label="الرئيسية">⌂</a>`:""}${ic("killer")}مافيا الحارة</div><div class="tr">${r||""}<button class="menub" data-a="menu" aria-label="القائمة">☰</button></div></div>`;

/* ---------- الإعداد ---------- */
function renderSetup(){
  const pl=plan(),n=setup.names.length,saved=ld(KEY,null);
  const okCount=n>=5,goodOk=pl.n-pl.m-pl.j>=pl.m+1;
  app.innerHTML=`${IN_APP?`<div class="top"><a class="menub home" href="index.html" aria-label="الرئيسية">⌂</a><span class="chip">تسلّى غو</span></div>`:""}
  <section class="hero"><span class="chip red">${ic("moon")} موبايل واحد وراوي</span>
    <h1>مافيا <em>الحارة</em></h1>
    <p>واحد بيكون الراوي وما بيلعب، وبيمسك الموبايل. بالليل الكل بيغمّض، والموبايل بينادي الأدوار بالصوت، وكل واحد بيأشّر بإيده بلا ما يحكي. ما حدا بيلمس الموبايل غير الراوي.</p></section>
  ${saved&&saved.phase&&saved.phase!=="over"&&saved.phase!=="setup"?`<button class="btn main" data-a="resume">كمّلوا اللعبة اللي وقفت (الجولة ${saved.round})</button>`:""}
  <div class="card"><h3>اللاعبين بترتيب القعدة</h3>
    <div class="addrow"><input id="nmIn" placeholder="اسم اللاعب" maxlength="16" autocomplete="off" aria-label="اسم اللاعب"><button data-a="add" aria-label="ضيف">+</button></div>
    <ul class="plist">${setup.names.map((x,i)=>`<li><span>${esc(x)}</span><button data-up="${i}" aria-label="لفوق">↑</button><button data-rm="${i}" aria-label="شيل">×</button></li>`).join("")}</ul>
    <p class="seat">رتّبوا الأسماء متل ما قاعدين، وكل اسم على يمين اللي قبله. الترتيب بيحدد مين بيحكي أول بالنهار.</p></div>
  <div class="card"><h3>الأدوار</h3>
    <div class="step"><span>عدد المافيا</span><div class="ctl"><button data-mf="-1" aria-label="أقل">−</button><output>${pl.m}</output><button data-mf="1" aria-label="أكتر">+</button></div></div>
    <div class="roles" style="margin-top:10px">
      <div class="rtog on fixed" style="--c:${R.killer.c}">${ic("killer")}<div><b>القاتل</b><small>دايماً موجود</small></div></div>
      <button class="rtog ${setup.silencer?"on":""}" style="--c:${R.silencer.c}" data-sil>${ic("silencer")}<div><b>المُسكِت</b><small>${pl.m>=2?"من المافيا":"بدها مافيا 2+"}</small></div></button>
      ${[...SPECIAL_G,"jester"].map(r=>`<button class="rtog ${setup.roles[r]?"on":""}" style="--c:${R[r].c}" data-role="${r}">${ic(r)}<div><b>${R[r].n}</b><small>${R[r].t==="n"?"لحاله":"من الصالحين"}</small></div></button>`).join("")}
    </div>
    <div class="dist">${pl.mafia.map(r=>`<span class="chip red">${R[r].n}</span>`).join("")}${pl.good.map(r=>`<span class="chip ${R[r].t==="n"?"pink":"good"}">${R[r].n}</span>`).join("")}</div>
    ${!okCount?`<p class="warn">لازم 5 لاعبين على الأقل.</p>`:!goodOk?`<p class="warn">الصالحين لازم يكونوا أكتر من المافيا بواحد على الأقل.</p>`:""}
  </div>
  <div class="card"><h3>القواعد</h3>
    <div class="opt"><span>كشف دور الميت</span><button class="sw ${setup.revealDead?"on":""}" data-sw="revealDead" aria-label="كشف دور الميت"></button></div>
    <div class="opt"><span>صوت الراوي من الموبايل <small class="mut">(بيقرا جمل الليل بصوت عالي)</small></span><button class="sw ${setup.voice?"on":""}" data-sw="voice" aria-label="صوت الراوي"></button></div>
    <div class="opt"><span>موسيقى الليل <small class="mut">(بتغطّي صوت الحركة وقت الإشارة)</small></span><button class="sw ${setup.music?"on":""}" data-sw="music" aria-label="موسيقى الليل"></button></div>
    <div class="opt"><span>كلمة أخيرة للميت <small class="mut">(20 ثانية)</small></span><button class="sw ${setup.lastWords?"on":""}" data-sw="lastWords" aria-label="كلمة أخيرة"></button></div>
    <div class="opt"><span>وقت الحكي لكل واحد</span><div class="seg">${[30,45,60,90].map(s=>`<button class="${setup.talk===s?"on":""}" data-talk="${s}">${s}ث</button>`).join("")}</div></div>
  </div>
  <button class="btn red" data-a="start" ${okCount&&goodOk?"":"disabled"}>${ic("killer")} وزّعوا الأدوار</button>
  ${statsCard()}
  `;
  const inp=$("#nmIn");
  const add=()=>{const v=inp.value.trim();if(!v)return;if(setup.names.includes(v)){toast("الاسم موجود");return}if(setup.names.length>=20)return;setup.names.push(v);sv(KS,setup);renderSetup();$("#nmIn").focus()};
  inp.onkeydown=e=>{if(e.key==="Enter")add()};
  $('[data-a="add"]').onclick=add;
  $$("[data-rm]").forEach(b=>b.onclick=()=>{setup.names.splice(+b.dataset.rm,1);sv(KS,setup);renderSetup()});
  $$("[data-up]").forEach(b=>b.onclick=()=>{const i=+b.dataset.up;if(i>0){[setup.names[i-1],setup.names[i]]=[setup.names[i],setup.names[i-1]];sv(KS,setup);renderSetup()}});
  $$("[data-mf]").forEach(b=>b.onclick=()=>{const n=setup.names.length;setup.mafia=Math.max(1,Math.min(maxMafia(Math.max(n,5)),plan().m+ +b.dataset.mf));sv(KS,setup);renderSetup()});
  $("[data-sil]").onclick=()=>{setup.silencer=!setup.silencer;sv(KS,setup);renderSetup()};
  $$("[data-role]").forEach(b=>b.onclick=()=>{setup.roles[b.dataset.role]=!setup.roles[b.dataset.role];sv(KS,setup);renderSetup()});
  $$("[data-sw]").forEach(b=>b.onclick=()=>{setup[b.dataset.sw]=!setup[b.dataset.sw];sv(KS,setup);renderSetup()});
  $$("[data-talk]").forEach(b=>b.onclick=()=>{setup.talk=+b.dataset.talk;sv(KS,setup);renderSetup()});
  const st=$('[data-a="start"]');if(st)st.onclick=startGame;
  const rs=$('[data-a="resume"]');if(rs)rs.onclick=()=>{G=saved;render()};
  bindMenu();
}
function startGame(){
  const pl=plan();const roles=shuffle([...pl.mafia,...pl.good]);
  G={phase:"deal",round:1,firstDay:true,opts:{revealDead:setup.revealDead,voice:setup.voice!==false,music:setup.music!==false,lastWords:setup.lastWords!==false,talk:setup.talk,minTurn:setup.minTurn||5},
     players:setup.names.map((n,i)=>({n,role:roles[i],alive:true,revealed:false,silenced:false,hunterUsed:false,selfProt:false})),
     lastProt:null,deal:{i:0,seen:false,open:false},log:[],night:null,day:null,vote:null,dawn:null,winner:null};
  save();render();
}

/* ---------- توزيع الأدوار: تمرير الموبايل ---------- */
function renderDeal(){
  const D=G.deal,i=D.i,p=P(i),r=R[p.role];
  if(!D.open){
    app.innerHTML=`${topbar()}<div class="pass"><div class="prog">${G.players.map((x,k)=>`<i class="${k<i?"on":""}"></i>`).join("")}</div>
      <div class="ring">${ic("phone")}</div><p>سلّموا الموبايل لـ</p><div class="who">${nm(i)}</div><p>ما حدا يطلّع عالشاشة غيره.</p>
      <button class="btn main" data-a="me">أنا ${nm(i)}، فرجيني دوري</button></div>`;
    $('[data-a="me"]').onclick=()=>{D.open=true;D.seen=false;save();render()};
  } else {
    const mates=r.t==="m"?G.players.map((x,k)=>k).filter(k=>k!==i&&isM(k)).map(nm):[];
    app.innerHTML=`${topbar()}<div class="pass" style="gap:12px">
      <p>اضغط مطوّل على الكرت لتشوف دورك. شيل إصبعك وبيتخبّى.</p>
      <div class="hold" id="hold" style="--c:${r.c}">
        <div class="back">${ic("eye")}<span>اضغط مطوّل</span></div>
        <div class="face">${ic(p.role,"big")}<span class="team">${r.t==="m"?"المافيا":"الصالحين"}</span><h2>${r.n}</h2><p>${r.d}</p>
          ${r.t==="m"?`<p class="mates">${mates.length?"رفقاتك بالمافيا: "+mates.join("، "):"إنت المافيا الوحيد"}</p>`:""}</div></div>
      <button class="btn main" data-a="hid" ${D.seen?"":"disabled"}>شفت دوري، خبّيه وسلّم الموبايل</button></div>`;
    holdBind($("#hold"),()=>{if(!D.seen){D.seen=true;$('[data-a="hid"]').disabled=false}});
    $('[data-a="hid"]').onclick=()=>{D.open=false;D.i++;
      if(D.i>=G.players.length){G.phase="day";startDay()}
      save();render()};
  }
  bindMenu();
}
function holdBind(el,onShow){
  const on=e=>{e.preventDefault();el.classList.add("show");onShow&&onShow()},off=()=>el.classList.remove("show");
  el.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,off));
  el.addEventListener("contextmenu",e=>e.preventDefault());
}

/* ---------- النهار ---------- */
function startDay(){
  const al=alive();const n=G.players.length;
  /* بيبلّش الحكي من اللي على يمين المسكّت، وإذا ما في، من يمين المقتول، وإلا بالدور */
  let startSeat=null;const sil=G.players.findIndex(p=>p.silenced&&p.alive);
  if(sil>=0)startSeat=sil;else if(G.dawn&&G.dawn.killed!=null)startSeat=G.dawn.killed;else startSeat=(G.round-1)%n;
  const order=[];for(let k=1;k<=n;k++){const s=(startSeat+k)%n;if(P(s).alive)order.push(s)}
  if(sil<0&&!(G.dawn&&G.dawn.killed!=null)){const s=startSeat;const ix=order.indexOf(s);if(ix>0)order.unshift(...order.splice(ix))}
  G.day={order,idx:0,left:G.opts.talk,running:false};
}
function renderDay(){
  const D=G.day,cur=D.order[D.idx],al=alive();
  const sheikh=G.players.findIndex(p=>p.role==="sheikh");
  const canSheikh=sheikh>=0&&P(sheikh).alive&&!P(sheikh).revealed&&!G.firstDay;
  const hunter=G.players.findIndex(p=>p.role==="hunter");
  const canHunter=hunter>=0&&P(hunter).alive&&!P(hunter).hunterUsed;
  const finished=D.idx>=D.order.length;
  const curMuted=!finished&&P(cur).silenced;
  app.innerHTML=`${topbar(`<span class="chip gold">${ic("sun")} نهار ${G.round}</span>`)}
  <div class="status">${G.players.map((p,i)=>`<span class="chip ${!p.alive?"":p.revealed?"gold":""}" style="${p.alive?"":"text-decoration:line-through;opacity:.5"}">${p.silenced&&p.alive?"🤐 ":""}${p.revealed?"👑 ":""}${esc(p.n)}</span>`).join("")}</div>
  ${G.firstDay?`<div class="card small"><b>أول نهار:</b> كل واحد عرف دوره. حلّلوا، راقبوا مين متوتر ومين عم يتخبّى، ووزّعوا الشكوك. ما في تصويت هالمرة.</div>`:""}
  ${finished?`<div class="card stack" style="text-align:center"><h2>خلص الحكي</h2><p class="mut" style="margin:0">${G.firstDay?"يلّا عالليل.":"وقت التصويت."}</p></div>`:
   `<div class="card speaker stack"><span class="mut small">${curMuted?"مسكّت":"دور الحكي"}</span><h2>${curMuted?"🤐 ":""}${nm(cur)}</h2>
     ${curMuted?`<p class="mut" style="margin:0">المافيا سكّتته. ما بيحقله يحكي ولا يدافع عن حاله اليوم.</p>`:`<div class="timer" id="tm">${D.left}</div>`}
     <div class="row">${curMuted?"":`<button class="btn" data-a="tt">${D.running?"وقّف":"ابدأ الوقت"}</button>`}<button class="btn main" data-a="next">${D.idx===D.order.length-1?"آخر واحد، خلصنا":"اللي بعده"}</button></div></div>`}
  <ol class="order">${D.order.map((i,k)=>`<li class="${k===D.idx?"now":k<D.idx?"done":""} ${P(i).silenced?"mute":""}"><span class="mut small">${k+1}</span><b>${nm(i)}</b>${P(i).silenced?`<span class="chip red">🤐 مسكّت</span>`:""}</li>`).join("")}</ol>
  <div class="powers">
    <button class="power" style="--c:${R.sheikh.c}" data-a="sheikh" ${canSheikh?"":"disabled"}>${ic("sheikh")}<span>الشيخ بدو يكشف حاله${G.firstDay?"<br><small class='mut'>من النهار التاني</small>":""}</span></button>
    <button class="power" style="--c:${R.hunter.c}" data-a="hunter" ${canHunter?"":"disabled"}>${ic("hunter")}<span>القنّاص بدو يتّهم</span></button>
  </div>
  ${finished?`<button class="btn ${G.firstDay?"red":"main"}" data-a="endday">${G.firstDay?ic("moon")+" نامت الحارة، يلّا عالليل":ic("vote")+" للتصويت"}</button>`:`<button class="btn ghost" data-a="skipall">تخطّوا الدور وروحوا ${G.firstDay?"عالليل":"للتصويت"}</button>`}`;
  const tt=$('[data-a="tt"]');
  if(tt)tt.onclick=()=>{D.running=!D.running;save();render()};
  if(D.running&&!finished&&!curMuted){timerH=setInterval(()=>{D.left=Math.max(0,D.left-1);const t=$("#tm");if(t){t.textContent=D.left;t.classList.toggle("hot",D.left<=10)}if(D.left<=0){D.running=false;clearT();beep();save();const b=$('[data-a="tt"]');if(b)b.textContent="ابدأ الوقت"}},1000)}
  const nx=$('[data-a="next"]');if(nx)nx.onclick=()=>{D.idx++;D.left=G.opts.talk;D.running=false;save();render()};
  const sk=$('[data-a="skipall"]');if(sk)sk.onclick=()=>{D.idx=D.order.length;save();render()};
  const ed=$('[data-a="endday"]');if(ed)ed.onclick=endDay;
  $('[data-a="sheikh"]').onclick=sheikhFlow;
  $('[data-a="hunter"]').onclick=hunterFlow;
  bindMenu();
}
function endDay(){
  if(G.firstDay){G.firstDay=false;startNight();return}
  G.vote={round:1,ballots:{},result:null,defenders:null};G.phase="vote";save();render();
}
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=880;g.gain.value=.15;o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.35)}catch(e){}}

/* شيخ الصالحين: التحقق بيصير بالموبايل نفسه، فما حدا بيقدر يدّعي */
function sheikhFlow(){
  sheet(`<h3>${ic("sheikh")} كشف شيخ الصالحين</h3><p class="mut" style="margin:0">مين عم يقول إنو هو الشيخ؟ الموبايل بيتأكّد قدام الكل.</p>
    <div class="grid">${alive().map(i=>`<button class="pick" data-p="${i}">${nm(i)}</button>`).join("")}</div><button class="btn ghost" data-x>إلغاء</button>`,
  (m,i)=>{if(P(i).role==="sheikh"){P(i).revealed=true;G.log.push({h:false,t:`👑 ${P(i).n} كشف إنو شيخ الصالحين، وصار صوته بـ3`});save();m.remove();render();toast(`${P(i).n} هو شيخ الصالحين! صوته صار بـ3`)}
    else{m.remove();toast(`لا! ${P(i).n} مو شيخ الصالحين. ادّعاء كاذب 👀`);G.log.push({t:`⚠️ ${P(i).n} ادّعى إنو الشيخ وطلع كذّاب`});save()}});
}
/* قنّاص المافيا: مرة وحدة، بيتّهم شخص */
function hunterFlow(){
  sheet(`<h3>${ic("hunter")} قنّاص المافيا</h3><p class="mut" style="margin:0">مين عم يقول إنو هو القنّاص؟</p>
    <div class="grid">${alive().map(i=>`<button class="pick" data-p="${i}">${nm(i)}</button>`).join("")}</div><button class="btn ghost" data-x>إلغاء</button>`,
  (m,h)=>{
    if(P(h).role!=="hunter"||P(h).hunterUsed){m.remove();toast(`لا! ${P(h).n} مو القنّاص 👀`);G.log.push({t:`⚠️ ${P(h).n} ادّعى إنو القنّاص وطلع كذّاب`});save();return}
    m.remove();
    sheet(`<h3>${ic("hunter")} ${nm(h)}، مين بتتّهم؟</h3><p class="mut" style="margin:0">إذا طلع مافيا بيموت هو. إذا لا، بتموت إنت. مرة وحدة باللعبة.</p>
      <div class="grid">${alive().filter(i=>i!==h).map(i=>`<button class="pick" data-p="${i}">${nm(i)}</button>`).join("")}</div><button class="btn ghost" data-x>تراجع</button>`,
    (m2,t)=>{m2.remove();P(h).hunterUsed=true;P(h).revealed=false;
      const hit=isM(t);const dead=hit?t:h;kill(dead);
      G.log.push({t:hit?`🎯 القنّاص ${P(h).n} صاب: ${P(t).n} طلع ${R[P(t).role].n} ومات`:`💀 القنّاص ${P(h).n} غلط: ${P(t).n} طلع ${R[P(t).role].n}، ومات القنّاص`});
      reveal(hit?`🎯 صابها! ${P(t).n} طلع ${R[P(t).role].n} ومات.`:`💀 غلط! ${P(t).n} طلع ${R[P(t).role].n}. القنّاص ${P(h).n} دفع التمن.`,dead);
    });
  });
}
function kill(i){P(i).alive=false;P(i).silenced=false;if(G.day){const ix=G.day.order.indexOf(i);if(ix>=0){if(ix<G.day.idx)G.day.idx--;G.day.order.splice(ix,1);if(G.day.idx>G.day.order.length)G.day.idx=G.day.order.length}}}
function reveal(msg,dead){
  const p=P(dead),r=R[p.role];
  sheet(`<div style="text-align:center" class="stack"><span style="color:${r.c}">${ic(p.role,"big")}</span><h2>${esc(msg)}</h2>${G.opts.revealDead||true?`<span class="chip" style="align-self:center;color:${r.c}">${esc(p.n)}: ${r.n}</span>`:""}<button class="btn main" data-x>تمام</button></div>`,null,()=>{if(!checkWin()){save();render()}});
}
/* كلمة أخيرة: 20 ثانية للي طالع */
function lastWords(i,then){
  if(!G.opts.lastWords){then&&then();return}
  let left=20;const m=sheet(`<div style="text-align:center" class="stack"><span style="color:var(--gold)">${ic("mic","big")}</span><p class="mut" style="margin:0">كلمة أخيرة لـ</p><h2>${nm(i)}</h2><p class="mut small" style="margin:0">عنده 20 ثانية: يتّهم، يودّع، أو يخرّب على الكل.</p><div class="timer" id="lw">20</div><button class="btn main" data-x>خلص</button></div>`,null,()=>{clearInterval(h);then&&then()});
  const h=setInterval(()=>{left--;const t=m.querySelector("#lw");if(t){t.textContent=Math.max(0,left);t.classList.toggle("hot",left<=5)}if(left<=0){clearInterval(h);beep()}},1000);
}
/* موسيقى الليل: صوت خفيف بيغطّي حركة الإيدين */
let amb=null;
function nightMusic(on){
  if(!on||!G||!G.opts.music){if(amb){try{amb.g.gain.setTargetAtTime(0,amb.c.currentTime,.4);const a=amb;setTimeout(()=>{try{a.c.close()}catch(e){}},1500);clearInterval(a.h)}catch(e){}amb=null}return}
  if(amb)return;
  try{const c=new (window.AudioContext||window.webkitAudioContext)(),g=c.createGain();g.gain.value=0;g.connect(c.destination);g.gain.setTargetAtTime(.5,c.currentTime,1.2);
    [55,55.6,82.4].forEach((f,k)=>{const o=c.createOscillator(),og=c.createGain();o.type=k===2?"triangle":"sine";o.frequency.value=f;og.gain.value=k===2?.025:.06;o.connect(og).connect(g);o.start()});
    const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let k=0;k<len;k++)d[k]=Math.random()*2-1;
    const n=c.createBufferSource();n.buffer=buf;n.loop=true;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=420;const ng=c.createGain();ng.gain.value=.05;n.connect(lp).connect(ng).connect(g);n.start();
    const h=setInterval(()=>{if(Math.random()<.55){const t=c.currentTime;for(let k=0;k<3;k++){const o=c.createOscillator(),og=c.createGain();o.frequency.value=4200+Math.random()*600;og.gain.setValueAtTime(0,t+k*.09);og.gain.linearRampToValueAtTime(.012,t+k*.09+.01);og.gain.linearRampToValueAtTime(0,t+k*.09+.06);o.connect(og).connect(g);o.start(t+k*.09);o.stop(t+k*.09+.07)}}},1300);
    amb={c,g,h};}catch(e){}
}
/* سجل الحارة: إحصائيات اللاعبين على هالجهاز */
const KST="mafia_stats_v1";
function recordStats(){
  if(G.statsDone||!G.winner||G.winner==="none")return;G.statsDone=true;
  const st=ld(KST,{});
  G.players.forEach(p=>{const r=R[p.role],x=st[p.n]||{g:0,w:0,m:0,mw:0};x.g++;
    const won=(G.winner==="m"&&r.t==="m")||(G.winner==="g"&&r.t==="g")||(G.winner==="j"&&p.role==="jester");
    if(won)x.w++;if(r.t==="m"){x.m++;if(won)x.mw++}st[p.n]=x});
  sv(KST,st);save();
}
function statsCard(){
  const st=ld(KST,{}),rows=Object.entries(st).sort((a,b)=>b[1].w-a[1].w||a[1].g-b[1].g).slice(0,6);
  if(!rows.length)return "";
  return `<div class="card"><h3>${ic("trophy")} سجل الحارة</h3><div class="stats"><div class="sh"><span>اللاعب</span><span>لعب</span><span>ربح</span><span>مافيا</span></div>${rows.map(([n,x],k)=>`<div><span>${k===0?"👑 ":""}${esc(n)}</span><span>${x.g}</span><span>${x.w}</span><span>${x.mw}/${x.m}</span></div>`).join("")}</div><p class="mut small" style="margin:8px 0 0">«مافيا» يعني: ربح كمافيا / مرات كان مافيا. السجل محفوظ على هالجهاز بس.</p></div>`;
}
const sig=()=>``;
function checkWin(){
  const al=alive(),m=al.filter(isM).length,g=al.length-m;
  if(m===0)G.winner="g";else if(m>=g)G.winner="m";
  if(G.winner){G.phase="over";save();render();return true}return false;
}

/* ---------- التصويت والدفاع ---------- */
function renderVote(){
  const V=G.vote,al=alive();
  const cands=V.only||al;
  if(V.stage==="defense"){
    const d=V.defenders,cur=d[V.di];const muted=P(cur).silenced;
    app.innerHTML=`${topbar(`<span class="chip red">${ic("vote")} دفاع</span>`)}
    <div class="card speaker stack"><span class="mut small">${d.length>1?`تعادل: ${d.length} بالدفاع`:"أكتر واحد عليه أصوات"}</span><h2>${muted?"🤐 ":""}${nm(cur)}</h2>
      ${muted?`<p class="mut" style="margin:0">مسكّت، ما بيحقله يدافع عن حاله.</p>`:`<p class="mut" style="margin:0">عندك 45 ثانية تدافع عن حالك.</p><div class="timer" id="tm">${V.left}</div><button class="btn" data-a="tt">${V.running?"وقّف":"ابدأ الدفاع"}</button>`}</div>
    <button class="btn main" data-a="dnext">${V.di<d.length-1?"اللي بعده":"خلص الدفاع، صوّتوا مرة تانية"}</button>`;
    const tt=$('[data-a="tt"]');if(tt)tt.onclick=()=>{V.running=!V.running;save();render()};
    if(V.running&&!muted){timerH=setInterval(()=>{V.left=Math.max(0,V.left-1);const t=$("#tm");if(t){t.textContent=V.left;t.classList.toggle("hot",V.left<=10)}if(V.left<=0){V.running=false;clearT();beep();save()}},1000)}
    $('[data-a="dnext"]').onclick=()=>{V.running=false;V.left=45;if(V.di<d.length-1){V.di++}else{V.stage=null;V.round=2;V.ballots={};V.result=null;V.only=null}save();render()};
    bindMenu();return;
  }
  if(V.result){
    const res=V.result,max=Math.max(1,...Object.values(res.t));
    const rows=Object.entries(res.t).sort((a,b)=>b[1]-a[1]);
    app.innerHTML=`${topbar(`<span class="chip red">${ic("vote")} النتيجة</span>`)}
    <div class="card stack"><h3>${V.round===1?"التصويت الأول":"التصويت النهائي"}</h3>
      <div class="tally">${rows.length?rows.map(([i,c])=>`<div class="tr"><b>${nm(+i)}</b><span class="bar"><i style="width:${c/max*100}%"></i></span><em>${c}</em></div>`).join(""):`<p class="mut">ما حدا صوّت.</p>`}</div>
      ${res.abst?`<p class="mut small" style="margin:0">امتنع: ${res.abst}</p>`:""}</div>
    ${V.round===1?`<p class="mut" style="margin:0;text-align:center">${res.top.length?res.top.map(nm).join(" و ")+" ب"+(res.top.length>1?"يدافعوا":"يدافع")+" عن حاله، وبعدين تصويت نهائي.":"ما في حدا عليه أصوات."}</p>
      <button class="btn main" data-a="todef" ${res.top.length?"":"disabled"}>للدفاع</button>${res.top.length?"":`<button class="btn red" data-a="sleep">ما حدا طلع، يلّا عالليل</button>`}`
     :res.top.length===1?`<button class="btn red" data-a="out">${ic("skull")} ${nm(res.top[0])} طالع من الحارة</button>`
     :`<p class="mut" style="margin:0;text-align:center">${res.top.length?"تعادل بالتصويت النهائي، ما حدا طلع.":"ما حدا عليه أصوات."}</p><button class="btn red" data-a="sleep">${ic("moon")} يلّا عالليل</button>`}`;
    const td=$('[data-a="todef"]');if(td)td.onclick=()=>{V.stage="defense";V.defenders=res.top;V.di=0;V.left=45;V.running=false;save();render()};
    const ou=$('[data-a="out"]');if(ou)ou.onclick=()=>lastWords(res.top[0],()=>{const t=res.top[0];kill(t);G.log.push({t:`🗳️ الحارة طلّعت ${P(t).n}، وطلع ${R[P(t).role].n}`});
      if(P(t).role==="jester"){G.winner="j";G.jester=t;sheet(`<div style="text-align:center" class="stack"><span style="color:${R.jester.c}">${ic("jester","big")}</span><p class="mut" style="margin:0">قلبوا كرت ${nm(t)}…</p><h2 style="color:${R.jester.c}">المهرّج!</h2><p style="margin:0">ضحك عليكم كلكم. هو كان بدو تطلّعوه، وربح لحاله 🤡</p><button class="btn main" data-x>يا ويلنا</button></div>`,null,()=>{G.phase="over";save();render()});return}
      sheet(`<div style="text-align:center" class="stack"><span style="color:${R[P(t).role].c}">${ic(P(t).role,"big")}</span><p class="mut" style="margin:0">قلبوا كرت ${nm(t)}…</p><h2 style="color:${R[P(t).role].c}">${R[P(t).role].n}</h2><p style="margin:0">${isM(t)?"صابت الحارة! واحد من المافيا طلع.":"يا خسارة… طلع من الصالحين."}</p><button class="btn main" data-x>تمام</button></div>`,null,()=>{if(!checkWin())startNight()})});
    const sl=$('[data-a="sleep"]');if(sl)sl.onclick=()=>{G.log.push({t:"🗳️ ما حدا طلع بالتصويت"});startNight()};
    bindMenu();return;
  }
  /* ورقة التصويت: كل واحد بيقول مين قدام الكل، والمقدّم بيسجّل */
  app.innerHTML=`${topbar(`<span class="chip red">${ic("vote")} ${V.round===1?"تصويت":"تصويت نهائي"}</span>`)}
  <div class="card small mut">كل واحد بيقول بصوت عالي مين بدو يطلع، وواحد بيسجّل هون. ${G.players.some(p=>p.revealed&&p.alive)?"صوت الشيخ بـ3.":""}${V.round===2?" هاد التصويت النهائي، وممكن تغيّروا رأيكم بعد الدفاع.":""}</div>
  <div class="ballot">${al.map(v=>`<div class="bl"><b>${nm(v)}${P(v).revealed?"<small>×3</small>":""}${P(v).silenced?" 🤐":""}</b>
    <select data-v="${v}" aria-label="صوت ${nm(v)}"><option value="">—</option><option value="-1" ${V.ballots[v]===-1?"selected":""}>امتناع</option>${cands.filter(c=>c!==v).map(c=>`<option value="${c}" ${V.ballots[v]===c?"selected":""}>${nm(c)}</option>`).join("")}</select></div>`).join("")}</div>
  <button class="btn main" data-a="count">احسبوا الأصوات</button>`;
  $$("[data-v]").forEach(s=>s.onchange=()=>{const v=+s.dataset.v;if(s.value==="")delete V.ballots[v];else V.ballots[v]=+s.value;save()});
  $('[data-a="count"]').onclick=()=>{
    const t={};let abst=0;for(const v of al){const b=V.ballots[v];if(b==null||b===-1){abst++;continue}t[b]=(t[b]||0)+(P(v).revealed?3:1)}
    const mx=Math.max(0,...Object.values(t));const top=mx?Object.keys(t).filter(k=>t[k]===mx).map(Number):[];
    V.result={t,top,abst};save();render()};
  bindMenu();
}

/* ---------- الليل: الراوي ماسك الموبايل والكل مغمّض ----------
   الراوي ما بيلعب. الموبايل بيقرا الجمل بصوت عالي (أو الراوي بيقراها)،
   اللي إجا دوره بيفتح عيونه وبيأشّر بإيده بلا صوت، والراوي بيكبس الاسم.
   كل خطوة إلها نفس المدة، حتى لو صاحب الدور ميت، كرمال ما حدا يعرف مين مات. */
function say(t){
  if(!G.opts.voice||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/[«»]/g,""));u.lang="ar-SA";u.rate=.92;
    const v=speechSynthesis.getVoices().find(x=>/^ar/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}
}
function holderOf(role){return G.players.findIndex(p=>p.alive&&p.role===role)}
function existed(role){return G.players.some(p=>p.role===role||(role==="killer"&&isM(G.players.indexOf(p))))}
function startNight(){
  /* إذا مات القاتل، أول مافيا عايش بيصير القاتل (والراوي بيخبّره بالإشارة) */
  let promoted=null;
  if(holderOf("killer")<0){const c=holderOf("mafia"),c2=holderOf("silencer");const k=c>=0?c:c2;if(k>=0){P(k).role="killer";promoted=k;G.log.push({t:`🔪 ${P(k).n} ورث السكين وصار القاتل`})}}
  G.players.forEach(p=>p.silenced=false);
  const steps=[{k:"sleep"}];
  steps.push({k:"kill"});
  if(G.players.some(p=>p.role==="silencer")||G.hadSilencer)steps.push({k:"sil"});
  if(G.players.some(p=>p.role==="nurse"))steps.push({k:"prot"});
  if(G.players.some(p=>p.role==="detective"))steps.push({k:"inv"});
  steps.push({k:"wake"});
  if(G.players.some(p=>p.role==="silencer"))G.hadSilencer=true;
  G.night={steps,i:0,kill:null,sil:null,prot:null,nurse:null,promoted,pick:null,t0:Date.now()};
  G.phase="night";G.log.push({h:true,t:`🌙 الليلة ${G.round}`});nightMusic(true);save();render();
}
const NIGHT_LINES={
  sleep:{open:"نامت الحارة. الكل يغمّض عيونه… وما حدا يفتح لحتى نقول.",btn:"الكل غمّض"},
  kill:{role:"killer",open:"القاتل يفتح عيونه… ويأشّر بإيده على اللي بدو يقتله الليلة.",close:"القاتل يغمّض.",q:"مين أشّر عليه القاتل؟"},
  sil:{role:"silencer",open:"المُسكِت يفتح عيونه… ويأشّر على اللي بدو يسكّته بكرا.",close:"المُسكِت يغمّض.",q:"مين أشّر عليه المُسكِت؟"},
  inv:{role:"detective",open:"المحقّق يفتح عيونه… ويأشّر على اللي بدو يعرف حقيقته.",close:"المحقّق يغمّض.",q:"مين أشّر عليه المحقّق؟"},
  prot:{role:"nurse",open:"الإسعاف تفتح عيونها… وتأشّر على اللي بدها تسعفه الليلة.",close:"الإسعاف تغمّض.",q:"مين أشّرت عليه الإسعاف؟"},
  wake:{open:"طلع الضو. الكل يفتح عيونه.",btn:"☀️ شوفوا شو صار"}
};
function renderNight(){
  const N=G.night,st=N.steps[N.i],L=NIGHT_LINES[st.k];
  if(G.opts.music&&!amb)nightMusic(true);
  if(N.invShow){
    const t=N.inv,bad=isM(t);
    app.innerHTML=`${topbar(`<span class="chip">${ic("moon")} ليلة ${G.round}</span>`)}<div class="night">
      <div class="card small" style="color:var(--gold)">للراوي: اقلب الموبايل باتجاه المحقّق بس، بلا صوت.</div>
      <div class="hold show" style="--c:${bad?"var(--red)":"var(--good)"};cursor:default"><div class="face">${ic(bad?"killer":"shield","big")}<p style="margin:0;font-size:1.1rem">${nm(t)}</p><h2 style="font-size:2.6rem">${bad?"👎 مافيا":"👍 مو مافيا"}</h2></div></div>
      <button class="btn main" data-a="seen">المحقّق شاف</button></div>`;
    $('[data-a="seen"]').onclick=()=>{N.invShow=false;G.log.push({t:`🔍 المحقّق سأل عن ${P(t).n}: ${bad?"مافيا":"مو مافيا"}`});say(L.close);N.i++;N.spoken=false;N.pick=null;N.t0=Date.now()+1500;save();setTimeout(render,1500);$('[data-a="seen"]').disabled=true};
    bindMenu();return;
  }
  if(!N.spoken){N.spoken=true;say(L.open)}
  const head=`${topbar(`<span class="chip">${ic("moon")} ليلة ${G.round}</span>`)}<div class="prog">${N.steps.map((x,k)=>`<i class="${k<=N.i?"on":""}"></i>`).join("")}</div>`;
  const line=`<div class="card stack" style="text-align:center"><span class="mut small">${G.opts.voice?"🔊 الموبايل عم يقرا، أو اقراها إنت:":"📣 الراوي يقرا بصوت عالي:"}</span><h2 style="font-size:1.45rem">${L.open}</h2>${G.opts.voice?`<button class="btn ghost" data-a="again">🔁 عيد الجملة</button>`:""}</div>`;
  if(st.k==="sleep"||st.k==="wake"){
    app.innerHTML=`${head}<div class="night"><div class="pass" style="padding:8px 0;flex:none"><div class="ring">${ic(st.k==="sleep"?"moon":"sun")}</div></div>${line}
      ${st.k==="sleep"&&N.promoted!=null?`<div class="card small" style="color:#FFB3B5">للراوي بس: القاتل مات، والسكين صارت مع <b>${nm(N.promoted)}</b>. لما تنادي القاتل، دقّ على كتفه بهدوء ليعرف إنو صار دوره.</div>`:""}
      <button class="btn main" data-a="nx">${L.btn}</button></div>`;
    $('[data-a="nx"]').onclick=()=>{if(st.k==="wake"){resolveNight();return}N.i++;N.spoken=false;N.pick=null;N.t0=Date.now();save();render()};
  } else {
    const h=holderOf(L.role),dead=h<0;
    const dis=j=>st.k==="inv"?j===h:st.k==="kill"?isM(j):st.k==="prot"?(j===G.lastProt||(j===h&&P(h).selfProt)):j===h;
    const note=st.k==="prot"&&!dead?`${G.lastProt!=null?`ما بتقدر تسعف ${nm(G.lastProt)} لأنها سعفته مبارح. `:""}${P(h).selfProt?"استعملت إسعاف حالها.":"بتقدر تسعف حالها مرة وحدة."}`:"";
    app.innerHTML=`${head}<div class="night">${line}
      <div class="card small" style="color:var(--gold)">للراوي بس: ${dead?`${R[L.role].n} مات. استنّى شوي متل كأنو عم يأشّر، وبعدين كمّل، كرمال ما حدا يعرف.`:`${R[L.role].n} هو <b>${nm(h)}</b>. اكبس الاسم اللي أشّر عليه.`}</div>
      ${dead?`<div class="pass" style="flex:none;padding:10px 0"><div class="ring">${ic("moon")}</div><p>عم نستنّى…</p></div>`:
        `<p class="prompt">${L.q}</p>${note?`<p class="mut small" style="margin:0">${note}</p>`:""}
        <div class="grid">${alive().map(j=>`<button class="pick ${N.pick===j?"sel":""}" data-p="${j}" ${dis(j)?"disabled":""}>${nm(j)}${j===h?"<small>هو نفسه</small>":""}</button>`).join("")}</div>`}
      <button class="btn main" data-a="ok" id="okb" disabled>تمام</button>
      <p class="mut small" style="text-align:center;margin:0">كل دور بياخد ${G.opts.minTurn} ثواني على الأقل، حتى لو صاحبه ميت.</p></div>`;
    const okb=$("#okb");
    const upd=()=>{const left=Math.ceil((G.opts.minTurn*1000-(Date.now()-N.t0))/1000);okb.disabled=(!dead&&N.pick==null)||left>0;okb.textContent=left>0?`تمام (${left})`:"تمام"};
    upd();timerH=setInterval(upd,250);
    $$("[data-p]").forEach(b=>b.onclick=()=>{N.pick=+b.dataset.p;$$("[data-p]").forEach(x=>x.classList.toggle("sel",x===b));upd()});
    okb.onclick=()=>{
      if(!dead&&st.k==="inv"){N.inv=N.pick;N.invShow=true;N.pick=null;save();render();return}
      if(!dead){const j=N.pick;if(st.k==="kill")N.kill=j;else if(st.k==="sil")N.sil=j;else{N.prot=j;N.nurse=h}}
      say(L.close);N.i++;N.spoken=false;N.pick=null;N.t0=Date.now()+1500;save();setTimeout(render,1500);
      okb.disabled=true;okb.textContent=L.close};
  }
  const ag=$('[data-a="again"]');if(ag)ag.onclick=()=>say(L.open);
  bindMenu();
}
function resolveNight(){
  nightMusic(false);
  const N=G.night,ev=[];let killed=null;
  if(N.nurse!=null){G.lastProt=N.prot;if(N.prot===N.nurse)P(N.nurse).selfProt=true}else G.lastProt=null;
  if(N.kill!=null){
    if(N.kill===N.prot){ev.push({k:"save",i:N.kill});G.log.push({t:`🚑 المافيا حاولت تقتل ${P(N.kill).n}، والإسعاف لحقته`})}
    else{killed=N.kill;P(killed).alive=false;ev.push({k:"dead",i:killed});G.log.push({t:`🔪 المافيا قتلت ${P(killed).n} (${R[P(killed).role].n})`})}
  }
  if(N.sil!=null&&P(N.sil).alive){P(N.sil).silenced=true;ev.push({k:"sil",i:N.sil});G.log.push({t:`🤐 المُسكِت سكّت ${P(N.sil).n}`})}
  if(N.prot!=null&&N.kill!==N.prot)G.log.push({t:`🚑 الإسعاف سعفت ${P(N.prot).n} (ما حدا حاول يقتله)`});
  G.dawn={ev,killed,poll:null,avenge:killed!=null&&P(killed).role==="avenger"};
  G.phase="dawn";save();render();
}

/* ---------- الصباح ---------- */
function renderDawn(){
  const D=G.dawn;
  const rows=D.ev.map((e,k)=>{const p=P(e.i),r=R[p.role];
    if(e.k==="dead")return `<div class="event" style="--c:var(--red);--d:${k*.5+.4}s">${ic("skull")}<div><b>انقتل ${esc(p.n)}</b><span>${G.opts.revealDead?`طلع <b style="display:inline;color:${r.c};font-size:inherit">${r.n}</b>`:"دوره بيضل سر"}</span></div></div>`;
    if(e.k==="save")return `<div class="event" style="--c:var(--good);--d:${k*.5+.4}s">${ic("nurse")}<div><b>محاولة قتل فاشلة!</b><span>المافيا حاولت تقتل حدا، بس الإسعاف لحقته. ما حدا مات.</span></div></div>`;
    if(e.k==="sil")return `<div class="event" style="--c:#FFB3B5;--d:${k*.5+.4}s">${ic("silencer")}<div><b>${esc(p.n)} مسكّت 🤐</b><span>ما بيحقله يحكي ولا يدافع عن حاله اليوم. الحكي بيبلّش من اللي على يمينه.</span></div></div>`;
  }).join("");
  app.innerHTML=`${topbar()}<div class="dawn"><div class="sunrise">${ic("sun")}<h1>صباح الخير يا حارة</h1><p class="mut" style="margin:4px 0 0">اللي صار بالليل:</p></div>
    ${rows||`<div class="event" style="--c:var(--gold)">${ic("moon")}<div><b>ليلة هادية</b><span>ما صار شي.</span></div></div>`}
    ${D.poll?`<div class="event" style="--c:#9F91F6;--d:${D.ev.length*.5+.4}s">${ic("eye")}<div><b>استطلاع الشك</b><span>أكتر واحد انشكّ فيه بالليل: <b style="display:inline;font-size:inherit">${nm(D.poll.i)}</b> (${D.poll.c} شكوك). بلا أسماء مين شك.</span></div></div>`:""}
    ${D.killed!=null&&G.opts.lastWords&&!D.lwDone?`<button class="btn" data-a="lw">${ic("mic")} كلمة أخيرة لـ${nm(D.killed)} (20 ثانية)</button>`:""}
    ${D.avenge&&!D.avengeDone?`<div class="card stack" style="box-shadow:inset 0 0 0 2px ${R.avenger.c}"><h3 style="color:${R.avenger.c}">${ic("avenger")} ${nm(D.killed)} هو الوالد الصالح!</h3><p class="mut" style="margin:0">قبل ما يروح، بيختار مين ياخد معه:</p>
      <div class="grid">${alive().map(i=>`<button class="pick" data-av="${i}">${nm(i)}</button>`).join("")}</div></div>`:
     `<button class="btn main" data-a="day">${ic("sun")} يلّا عالنهار</button>`}</div>`;
  $$("[data-av]").forEach(b=>b.onclick=()=>{const t=+b.dataset.av;P(t).alive=false;D.avengeDone=true;G.log.push({t:`🔥 الوالد الصالح ${P(D.killed).n} أخد معه ${P(t).n} (${R[P(t).role].n})`});
    sheet(`<div style="text-align:center" class="stack"><span style="color:${R[P(t).role].c}">${ic(P(t).role,"big")}</span><h2>${nm(D.killed)} أخد معه ${nm(t)}</h2><span class="chip" style="align-self:center;color:${R[P(t).role].c}">${R[P(t).role].n}</span><button class="btn main" data-x>تمام</button></div>`,null,()=>{if(!checkWin()){save();render()}})});
  const lwb=$('[data-a="lw"]');if(lwb)lwb.onclick=()=>lastWords(D.killed,()=>{D.lwDone=true;save();render()});
  const d=$('[data-a="day"]');if(d)d.onclick=()=>{if(checkWin())return;G.round++;G.phase="day";startDay();save();render()};
  bindMenu();
}

/* ---------- النهاية ---------- */
function renderOver(){
  nightMusic(false);recordStats();
  const W=G.winner,c=W==="m"?"var(--red)":W==="g"?"var(--good)":W==="j"?R.jester.c:"var(--gold)";
  app.innerHTML=`${topbar()}<div class="over stack"><div style="text-align:center;padding-top:8px"><span style="color:${c}">${ic(W==="m"?"killer":W==="j"?"jester":"shield","big")}</span></div>
    <h1 style="color:${c}">${W==="m"?"ربحت المافيا":W==="g"?"ربحوا الصالحين":W==="j"?"ربح المهرّج":"انتهت اللعبة"}</h1>
    <p class="mut" style="text-align:center;margin:0">${W==="m"?"المافيا صاروا قد الصالحين أو أكتر. الحارة صارت إلهن.":W==="g"?"آخر واحد من المافيا طلع. الحارة نضفت.":W==="j"?`${G.jester!=null?nm(G.jester):"المهرّج"} خلّى الحارة كلها تصوّت عليه، وربح لحاله.`:"وقّفتوا اللعبة. هي كل الكروت."}</p>
    <div class="card"><h3>الكروت كلها</h3><div class="cards">${G.players.map((p,i)=>`<div class="mini ${p.alive?"":"dead"}" style="--c:${R[p.role].c}">${ic(p.role)}<div><b>${esc(p.n)}</b><small>${R[p.role].n}${p.alive?"":" · مات"}</small></div></div>`).join("")}</div></div>
    <div class="card"><h3>شو صار بالعتمة</h3><ul class="log">${G.log.map(l=>`<li class="${l.h?"h":""}">${esc(l.t)}</li>`).join("")}</ul></div>
    <div class="row"><button class="btn main" data-a="again">لعبة جديدة بنفس الناس</button><button class="btn ghost" data-a="home">الإعداد</button></div>
    ${statsCard()}</div>`;
  $('[data-a="again"]').onclick=()=>{startGame()};
  $('[data-a="home"]').onclick=()=>{G=null;sv(KEY,null);render()};
  bindMenu();
}

/* ---------- نوافذ ---------- */
function sheet(html,onPick,onClose){
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="sheet">${html}</div>`;document.body.appendChild(m);
  m.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>onPick&&onPick(m,+b.dataset.p));
  m.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{m.remove();onClose&&onClose()});
  return m;
}
function bindMenu(){
  const b=app.querySelector('[data-a="menu"]');if(!b)return;
  b.onclick=()=>{
    const m=sheet(`<h3>القائمة</h3>
      ${G&&G.phase!=="setup"?`<button class="btn" data-m="rules">القواعد والأدوار</button><button class="btn ghost" data-m="quit">إنهاء اللعبة وكشف الكروت</button><button class="btn ghost" data-m="setup">رجوع للإعداد (اللعبة بتنحفظ)</button>`:`<button class="btn" data-m="rules">القواعد والأدوار</button>`}
      <button class="btn ghost" data-x>إغلاق</button>`);
    m.querySelectorAll("[data-m]").forEach(x=>x.onclick=()=>{const k=x.dataset.m;m.remove();
      if(k==="rules")sheet(`<h3>الأدوار</h3>${Object.keys(R).map(r=>`<div class="mini" style="--c:${R[r].c}">${ic(r)}<div><b>${R[r].n} <small class="mut">${R[r].t==="m"?"مافيا":"صالحين"}</small></b><small style="color:var(--ink)">${R[r].d}</small></div></div>`).join("")}<button class="btn main" data-x>تمام</button>`);
      if(k==="quit"){G.winner=G.winner||"none";G.phase="over";save();render()}
      if(k==="setup"){save();const g=G;G=null;renderSetup();G=null}
    });
  };
}
render();
}
