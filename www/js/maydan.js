/* لوحة الميدان — من ألعاب «تسلّى غو» */
/* ============================================================
   ميدان: «لوحة الميدان»
   لوحة مربعات مقلوبة: كل عمود لعبة مختلفة، وكل صف أصعب.
   الفريق الأقل نقاط بيختار. في مربعات مخفية: كنز، قنبلة، سرقة، تجميد.
   كل فريق إلو «مرآة» وحدة بترجّع القنبلة أو السرقة على اللي بعتها.
   جهاز واحد (لابتوب على التلفزيون أو موبايل)، مع شاشة تانية اختيارية (#screen).
   ============================================================ */
(()=>{
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const MIRROR=location.hash==="#screen";
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- إيقونات إضافية ---------- */
Object.assign(IC,{
  pencil:'<path class="i-soft" d="M8 40l4-12 22-22a4 4 0 0 1 6 0l2 2a4 4 0 0 1 0 6L20 36z"/><path class="i-main" d="M30 10l8 8-18 18-8-8z"/><path class="i-deep" d="M12 28l8 8-12 4z"/>',
  gift:'<rect class="i-soft" x="7" y="20" width="34" height="22" rx="4"/><rect class="i-main" x="5" y="13" width="38" height="10" rx="3"/><rect class="i-deep" x="21" y="13" width="6" height="29"/><path class="i-main" d="M24 13c-4-8-14-8-12-2 1 3 7 3 12 2zm0 0c4-8 14-8 12-2-1 3-7 3-12 2z"/>',
  mask:'<path class="i-main" d="M4 18c6-4 14-4 20 0 6-4 14-4 20 0-1 10-6 15-12 15-4 0-6-3-8-5-2 2-4 5-8 5-6 0-11-5-12-15z"/><ellipse class="i-deep" cx="15" cy="22" rx="4" ry="3"/><ellipse class="i-deep" cx="33" cy="22" rx="4" ry="3"/>',
  mirror:'<ellipse class="i-soft" cx="24" cy="20" rx="13" ry="16"/><ellipse class="i-main" cx="24" cy="20" rx="9" ry="12"/><path class="i-deep" d="M21 36h6v8h-6z"/><path class="i-white" d="M19 13l4-4M18 19l8-8" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'
});
const ico=(k,c)=>`<svg class="icn ic-${k}" viewBox="0 0 48 48" aria-hidden="true" style="--ic:${c||"currentColor"}">${IC[k]||""}</svg>`;

/* ---------- الفرق ---------- */
const TEAM_DEF=[
  {n:"الصقور",c:"#FF6B57",sh:"M12 2l10 10-10 10L2 12z"},
  {n:"النمور",c:"#6F8DF0",sh:"M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"},
  {n:"الذئاب",c:"#3CCFAE",sh:"M12 2l10 19H2z"},
  {n:"النسور",c:"#9F91F6",sh:"M3 3h18v18H3z"}];
const crest=(i,sz=18)=>`<svg class="crest" width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true"><path d="${TEAM_DEF[i].sh}" fill="${TEAM_DEF[i].c}"/></svg>`;
const tname=i=>`<b class="tn" style="--tc:${S.teams[i].c}">${crest(i,16)}${esc(S.teams[i].n)}</b>`;

/* ---------- الصوت ---------- */
let AC=null,muted=LS.get("maydan_mute",false);
function tone(f,d=.12,type="sine",v=.18,when=0){if(muted||MIRROR)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const SFX={
  flip(){tone(520,.08,"triangle");tone(780,.12,"triangle",.15,.07)},
  buzz(){tone(180,.25,"square",.16)},
  good(){[660,880,1100].forEach((f,i)=>tone(f,.16,"triangle",.18,i*.09))},
  bad(){tone(220,.18,"sawtooth",.14);tone(160,.3,"sawtooth",.14,.15)},
  tick(){tone(1200,.04,"square",.06)},
  boom(){tone(90,.6,"sawtooth",.3);tone(60,.8,"square",.2,.05)},
  magic(){[523,659,784,1046,1318].forEach((f,i)=>tone(f,.2,"sine",.14,i*.07))},
  fanfare(){[523,523,523,659,784,659,784,1046].forEach((f,i)=>tone(f,.22,"triangle",.17,i*.13))}
};

/* ---------- المحتوى بدون تكرار ---------- */
const seen=LS.get("maydan_seen",{});
function pick(key,list,lv,keyOf){
  const used=new Set(seen[key]||[]);
  let pool=list.filter(x=>x[0]===lv&&!used.has(keyOf(x)));
  if(!pool.length){seen[key]=(seen[key]||[]).filter(k=>!list.some(x=>x[0]===lv&&keyOf(x)===k));pool=list.filter(x=>x[0]===lv)}
  const it=rnd(pool);(seen[key]=seen[key]||[]).push(keyOf(it));LS.set("maydan_seen",seen);return it;
}
function makeData(g,lv,topic){
  if(g==="quiz"){
    /* كل سؤال من موضوع مختلف: منختار الموضوع اللي أقل شي انلعب منه */
    if(!topic||!QUIZ[topic]){const ks=shuffle(Object.keys(QUIZ));ks.sort((a,b)=>(seen["quiz:"+a]||[]).length-(seen["quiz:"+b]||[]).length);
      const recent=(S&&S.recentTopics)||[];topic=ks.find(k=>!recent.includes(k))||ks[0];if(S){S.recentTopics=[topic,...recent].slice(0,4)}}
    const q=pick("quiz:"+topic,QUIZ[topic],lv,x=>x[1]);const order=shuffle([0,1,2,3]);return{topic,q:q[1],opts:order.map(i=>q[2][i]),a:order.indexOf(q[3])}}
  if(g==="reveal"){const r=pick("reveal",REVEAL,lv,x=>x[2]);return{cat:r[1],ans:r[2],clues:r[3]}}
  if(g==="emoji"){const e=pick("emoji",EMOJI,lv,x=>x[3]);return{cat:e[1],emo:e[2],ans:e[3]}}
  if(g==="closest"){const n=pick("closest",NUM,lv,x=>x[1]);return{q:n[1],ans:n[2],unit:n[3]}}
  if(g==="chain"){const c=pick("chain",CHAIN,lv,x=>x[1]);return{topic:c[1],target:CHAIN_TARGET[lv]}}
  if(g==="act"){const w=pick("act",ACT,lv,x=>x[1]);return{word:w[1]}}
  if(g==="hum"){const w=pick("hum",HUM,lv,x=>x[1]);return{word:w[1],sub:w[2]}}
  if(g==="draw"){const w=pick("draw",DRAW,lv,x=>x[1]);return{word:w[1]}}
}

/* ---------- الحالة ---------- */
let S=LS.get("maydan_state",null);
const DUR={emoji:30,closest:30,chain:40,act:60,hum:45,draw:60,quiz:20,clue:10,steal:10,final:30};
const SIZES={quick:{n:"سريعة",cols:4,vals:[100,200,300,500],lvs:[1,2,3,5],sp:["kanz","bomb","steal"],min:"≈ 25 دقيقة"},
             full:{n:"كاملة",cols:5,vals:[100,200,300,400,500],lvs:[1,2,3,4,5],sp:["kanz","bomb","steal","freeze","kanz"],min:"≈ 50 دقيقة"}};
let setup=LS.get("maydan_setup",{teams:[TEAM_DEF[0].n,TEAM_DEF[1].n],size:"quick"});

function save(){if(MIRROR)return;if(S&&S.lab){try{bc&&bc.postMessage(S)}catch(e){}return}LS.set("maydan_state",S);try{bc&&bc.postMessage(S)}catch(e){}}
let bc=null;try{bc=new BroadcastChannel("maydan")}catch(e){}
if(MIRROR){
  document.body.classList.add("mirror");
  if(bc)bc.onmessage=e=>{S=e.data;render()};
  window.addEventListener("storage",e=>{if(e.key==="maydan_state"){S=JSON.parse(e.newValue);render()}});
}

function newGame(){
  const sz=SIZES[setup.size];
  const games=sz.cols>=GAME_ORDER.length?GAME_ORDER.slice():shuffle(GAME_ORDER).slice(0,sz.cols);
  const topics=shuffle(Object.keys(QUIZ));
  const cols=games.map(g=>({g,topic:g==="quiz"?"منوّع":null}));
  const tiles=[];
  sz.vals.forEach((v,r)=>cols.forEach((c,ci)=>tiles.push({ci,r,v,lv:sz.lvs[r],used:false,by:-1,sp:null})));
  /* المربعات المخفية: ما بتكون بالصف الأول */
  const slots=shuffle(tiles.filter(t=>t.r>0));
  sz.sp.forEach((k,i)=>{if(slots[i])slots[i].sp=k});
  const teams=setup.teams.map((n,i)=>({n:n.trim()||TEAM_DEF[i].n,c:TEAM_DEF[i].c,score:0,mirror:true,frozen:false,picks:0,won:0}));
  S={v:2,phase:"open",size:setup.size,cols,tiles,teams,turn:Math.floor(Math.random()*teams.length),T:null,F:null,log:[],finalTopic:topics[1]};
  save();render();
}

/* ---------- الدور: الأقل نقاط بيختار ---------- */
function nextTurn(){
  const n=S.teams.length;let cand=S.teams.map((t,i)=>i).filter(i=>!S.teams[i].frozen);
  S.teams.forEach(t=>t.frozen=false);
  if(!cand.length)cand=S.teams.map((t,i)=>i);
  cand.sort((a,b)=>S.teams[a].score-S.teams[b].score||S.teams[a].picks-S.teams[b].picks||((a-S.turn+n)%n)-((b-S.turn+n)%n));
  S.turn=cand[0];
}
function award(i,pts,why){
  S.teams[i].score+=pts;
  S.T&&(S.T.res=S.T.res||[]).push({i,pts,why});
  S.log.push({i,pts,why});
}

/* ---------- المؤقّت ---------- */
let tickH=null,lastSec=-1;
function setTimer(sec){S.T.until=Date.now()+sec*1000;S.T.dur=sec;S.T.left=null}
function stopTimer(){if(S.T){S.T.until=0;S.T.left=null}}
function pauseTimer(){if(S.T&&S.T.until){S.T.left=Math.max(0,S.T.until-Date.now());S.T.until=0}}
function resumeTimer(){if(S.T&&S.T.left!=null){S.T.until=Date.now()+S.T.left;S.T.left=null}}
function remaining(){const T=S&&S.T;if(!T)return 0;if(T.left!=null)return T.left;return T.until?Math.max(0,T.until-Date.now()):0}
let nextTick=0;
function loop(){
  const T=S&&(S.T||S.F);const ring=$("#ring");
  if(T&&T.step==="tbomb"&&T.until){
    const ms=remaining(),now=Date.now();
    if(now>=nextTick){SFX.tick();nextTick=now+Math.max(120,Math.min(900,ms/12))}
    const f=$("#fuse");if(f)f.style.setProperty("--burn",(Date.now()%600)/600);
    if(!MIRROR&&ms<=0){T.until=0;onTimeout()}
  }
  else if(T&&!ring&&!MIRROR&&T.until&&remaining()<=0&&S.phase!=="final"){T.until=0;onTimeout()}
  if(T&&ring){
    const ms=S.phase==="final"?finalRemaining():remaining(),sec=Math.ceil(ms/1000),dur=(T.dur||30)*1000;
    ring.style.setProperty("--p",T.until||T.left!=null?Math.max(0,ms/dur):0);
    ring.querySelector("b").textContent=T.until||T.left!=null?sec:"";
    ring.classList.toggle("hot",!!T.until&&sec<=5);
    if(T.until&&sec!==lastSec&&sec<=5&&sec>0)SFX.tick();
    lastSec=sec;
    if(!MIRROR&&T.until&&ms<=0){T.until=0;onTimeout()}
  }
  requestAnimationFrame(loop);
}

/* ---------- الإجراءات ---------- */
function openTile(idx){
  const t=S.tiles[idx];if(t.used)return;
  const col=S.cols[t.ci];
  S.teams[S.turn].picks++;
  S.T={idx,g:col.g,v:t.v,lv:t.lv,sp:t.sp,team:S.turn,step:t.sp?"special":"intro",data:makeData(col.g,t.lv,col.topic),locked:[],clue:0,count:0,until:0,left:null,res:[],target:null,pickedOpt:null,stealer:null};
  if(t.sp==="kanz")S.T.v=t.v*2;
  S.phase="tile";SFX.flip();if(t.sp)setTimeout(()=>t.sp==="bomb"?SFX.boom():SFX.magic(),350);
  save();render();
}
function startGame(){
  const T=S.T;
  if(T.g==="quiz"){T.step="ask";setTimer(DUR.quiz)}
  else if(T.g==="reveal"){T.step="play";T.clue=1;setTimer(DUR.clue)}
  else if(T.g==="chain"){T.step="ready"}
  else if(T.g==="emoji"){T.step="play";setTimer(DUR.emoji)}
  else if(T.g==="closest"){T.step="guess";T.guesses=S.teams.map(()=>"");setTimer(DUR.closest)}
  else {T.step="secret"}
  save();render();
}
function finishTile(){
  const T=S.T,t=S.tiles[T.idx];
  stopTimer();T.step="done";
  const win=(T.res||[]).filter(r=>r.pts>0).sort((a,b)=>b.pts-a.pts)[0];
  t.used=true;t.by=win?win.i:-1;if(win)S.teams[win.i].won++;
  save();render();
}
/* ---------- مختبر الألعاب: جرّب أي لعبة لحالها وقيّمها ---------- */
let labLv=LS.get("maydan_lablv",2);
function startLab(g,sp){
  const topic=rnd(Object.keys(QUIZ));
  const names=setup.teams.length>=2?setup.teams:[TEAM_DEF[0].n,TEAM_DEF[1].n];
  const teams=names.map((n,i)=>({n:(n||"").trim()||TEAM_DEF[i].n,c:TEAM_DEF[i].c,score:sp?500:0,mirror:true,frozen:false,picks:0,won:0}));
  S={v:2,lab:{g,sp:sp||null,lv:labLv},phase:"tile",size:"quick",cols:[{g,topic:g==="quiz"?"منوّع":null}],
     tiles:[{ci:0,r:0,v:labLv*100,lv:labLv,used:false,by:-1,sp:sp||null}],teams,turn:0,T:null,F:null,log:[],finalTopic:topic};
  openTile(0);
}
function ratings(){return LS.get("maydan_ratings",[])}
function ratingsText(){
  const r=ratings();if(!r.length)return "";
  return "تقييم ألعاب ميدان:\n"+r.map(x=>`${x.ok?"👍":"👎"} ${GAMES[x.g].n}${x.sp?" + "+SPECIALS[x.sp].n:""} (مستوى ${x.lv})${x.note?": "+x.note:""}`).join("\n");
}
function renderRate(){
  const L=S.lab,G=GAMES[L.g];
  app.innerHTML=`<div class="stage rate-st" style="--gc:${G.c}">${topbar("مختبر الألعاب")}
   <div class="play"><div class="ratex">
     ${ico(L.sp?SPECIALS[L.sp].i:G.i,L.sp?SPECIALS[L.sp].c:G.c)}
     <span class="lbl">جرّبت</span><h2>${G.n}${L.sp?` <small>مع ${SPECIALS[L.sp].n}</small>`:""}</h2>
     <p>شو رأيك؟ كانت حلوة وحماسية ولا بدها شغل؟</p>
     <div class="row2 thumbs"><button class="btn thumb${S.lab.ok===true?" on":""}" data-rate="1">👍 حلوة</button><button class="btn thumb no${S.lab.ok===false?" on":""}" data-rate="0">👎 بدها شغل</button></div>
     <label class="notex" for="labnote">ملاحظة (شو عجبك أو شو بدك يتغيّر)</label>
     <textarea id="labnote" rows="3" placeholder="مثلاً: الوقت قصير، الأسئلة سهلة، بدي عقوبة أقوى…">${esc(S.lab.note||"")}</textarea>
   </div></div>
   ${ctl(`<button class="btn go" data-a="labsave" ${S.lab.ok==null?"disabled":""}>احفظ التقييم</button><div class="row2"><button class="btn" data-a="labagain">جرّبها كمان مرة</button><button class="btn ghost" data-a="labhome">رجوع للمختبر</button></div>`)}
   </div>`;
  bind();
  $$("[data-rate]").forEach(b=>b.onclick=()=>{S.lab.ok=b.dataset.rate==="1";$$("[data-rate]").forEach(x=>x.classList.toggle("on",x===b));const sv=$('[data-a="labsave"]');if(sv)sv.disabled=false;(S.lab.ok?SFX.good:SFX.bad)()});
  $("#labnote").oninput=e=>{S.lab.note=e.target.value};
}
function backToBoard(){
  if(S.lab){S.T=null;S.phase="rate";render();return}
  S.T=null;
  if(S.tiles.every(t=>t.used)){startFinal();return}
  nextTurn();S.phase="board";save();render();
}
function onTimeout(){
  const T=S.T;
  if(S.phase==="final"){S.F.until=0;S.F.step="judge";SFX.bad();save();render();return}
  if(!T)return;
  if(T.g==="quiz"&&T.step==="ask"){SFX.bad();award(T.team,-Math.round(T.v/2),"خلص الوقت");T.step="steal";T.stealer=null;save();render();return}
  if(T.g==="quiz"&&T.step==="steal"){SFX.bad();T.step="reveal";finishTile();return}
  if(T.step==="tbomb"){SFX.boom();award(T.holder,-T.v,"انفجرت القنبلة بإيدهم 💥");T.exploded=true;finishTile();return}
  if(T.g==="emoji"&&T.step==="play"){SFX.bad();T.reveal=true;finishTile();return}
  if(T.g==="closest"&&T.step==="guess"){SFX.bad();save();render();return}
  if(T.g==="reveal"&&T.step==="play"){
    if(T.clue<T.data.clues.length){T.clue++;SFX.flip();setTimer(DUR.clue);save();render()}
    else{T.reveal=true;SFX.bad();finishTile()}
    return}
  if(T.g==="chain"&&T.step==="run"){SFX.bad();T.reveal=true;finishTile();return}
  if(["act","hum","draw"].includes(T.g)&&T.step==="run"){SFX.bad();T.step="steal";T.stealer=null;save();render();return}
  if(["act","hum","draw"].includes(T.g)&&T.step==="stealjudge"){SFX.bad();T.reveal=true;finishTile();return}
}
function buzz(i){
  const T=S.T;if(!T||S.phase!=="tile")return;
  if(T.g==="emoji"&&T.step==="play"&&!T.locked.includes(i)){pauseTimer();T.step="judge";T.buzzer=i;SFX.buzz();save();render();return}
  if(T.g==="reveal"&&T.step==="play"&&!T.locked.includes(i)){pauseTimer();T.step="judge";T.buzzer=i;SFX.buzz();save();render();return}
  if(T.step==="steal"&&i!==T.team&&T.stealer==null){T.stealer=i;SFX.buzz();
    if(T.g==="quiz"){setTimer(DUR.steal)}else{T.step="stealjudge";setTimer(DUR.steal)}
    save();render();}
}
function revealValue(T){const n=T.data.clues.length;return Math.round(T.v*(n+1-T.clue)/n/10)*10}

/* المربعات الخاصة: اختيار الهدف ومرآة */
function chooseTarget(i){
  const T=S.T;T.target=i;
  if(S.teams[i].mirror&&(T.sp==="bomb"||T.sp==="steal")){T.step="mirror";save();render();return}
  applySpecial(false);
}
function applySpecial(reflect){
  const T=S.T,from=T.team;let to=T.target;
  if(reflect){S.teams[to].mirror=false;T.reflected=true;SFX.magic();[to]=[from]}
  if(T.sp==="bomb"){award(to,-T.v,reflect?"القنبلة رجعت عليهم 🪞":"انرمت عليهم القنبلة 💣");SFX.boom();if(reflect)award(T.target,0,"استخدموا المرآة");finishTile();return}
  if(T.sp==="steal"){
    if(reflect){award(from,-T.v,"المرآة قلبت السرقة عليهم 🪞");award(T.target,T.v,"رجعت السرقة لإلهم")}
    else{award(to,-T.v,"انسرقوا 🦹");award(from,T.v,"سرقة")}
    SFX.good();finishTile();return}
  if(T.sp==="freeze"){S.teams[to].frozen=true;T.step="intro";save();render();return}
}

/* ---------- الجولة الأخيرة: الرهان ---------- */
function startFinal(){
  const topic=rnd(Object.keys(QUIZ));const q=QUIZ[topic].filter(x=>x[0]===5);const it=rnd(q);const order=shuffle([0,1,2,3]);
  S.phase="final";S.F={step:"bet",bets:S.teams.map(()=>0),ok:S.teams.map(()=>null),topic,q:it[1],opts:order.map(i=>it[2][i]),a:order.indexOf(it[3]),until:0,dur:DUR.final};
  SFX.fanfare();save();render();
}
function finalRemaining(){const F=S.F;return F&&F.until?Math.max(0,F.until-Date.now()):0}

/* ============================================================
   العرض
   ============================================================ */
function scoreboard(){
  const max=Math.max(...S.teams.map(t=>t.score));
  return `<div class="sb">${S.teams.map((t,i)=>`<div class="sbt${S.phase==="board"&&S.turn===i?" turn":""}${t.frozen?" frozen":""}${t.score===max&&max>0?" lead":""}" style="--tc:${t.c}" data-buzz="${i}">
    <span class="sbn">${crest(i,18)}${esc(t.n)}</span>
    <span class="sbs"><bdi>${t.score}</bdi></span>
    <span class="sbx">${t.mirror?`<i title="المرآة جاهزة">${ico("mirror","#C9C4FF")}</i>`:""}${t.frozen?`<i title="مجمّد">${ico("snow","#45C3E3")}</i>`:""}<kbd>${i+1}</kbd></span>
  </div>`).join("")}</div>`;
}
function ringHTML(){return `<div class="ring" id="ring"><b></b></div>`}

function render(){
  if(!S||S.phase==="setup"){MIRROR?renderWaiting():renderSetup();return}
  document.body.classList.add("md-full");const top=$(".top");if(top)top.hidden=true;
  if(S.phase==="open")renderOpen();
  else if(S.phase==="board")renderBoard();
  else if(S.phase==="tile")renderTile();
  else if(S.phase==="final")renderFinal();
  else if(S.phase==="end")renderEnd();
  else if(S.phase==="rate")renderRate();
}
function renderWaiting(){app.innerHTML=`<div class="stage wait"><div class="logo-x">${ico("crown","#FFB72B")}<h1>ميدان</h1><p>شاشة العرض جاهزة. ابدؤوا اللعبة من الجهاز التاني.</p></div></div>`}

/* الإعداد */
function renderSetup(){
  document.body.classList.remove("md-full");const top=$(".top");if(top)top.hidden=false;
  const saved=LS.get("maydan_state",null),canResume=saved&&!saved.lab&&saved.phase&&saved.phase!=="end"&&saved.phase!=="setup";
  app.innerHTML=`<section class="setup">
  <header class="hero">
    <span class="kick">${ico("crown","#FFB72B")} نسخة الفرق</span>
    <h1>لوحة <em>الميدان</em></h1>
    <p>لوحة مربعات مقلوبة: كل عمود لعبة مختلفة، وكل صف أصعب. الفريق الأخسر بيختار أول، وبين المربعات في كنز، وقنبلة، وسرقة.</p>
  </header>
  <div class="blockx lab"><h3>${ico("eye","#3CCFAE")} مختبر الألعاب <small>جرّب أي لعبة لحالها وقيّمها</small></h3>
    <div class="lvsel"><span>المستوى:</span>${[1,2,3,4,5].map(l=>`<button class="lv${labLv===l?" on":""}" data-lv="${l}">${l*100}<small>${LVN[l]}</small></button>`).join("")}</div>
    <div class="labgrid">${GAME_ORDER.map(g=>{const r=ratings().filter(x=>x.g===g&&!x.sp);const last=r[r.length-1];
      return `<button class="labbtn" data-lab="${g}" style="--gc:${GAMES[g].c}">${ico(GAMES[g].i,GAMES[g].c)}<b>${GAMES[g].n}</b>${last?`<em>${last.ok?"👍":"👎"}</em>`:""}</button>`}).join("")}</div>
    <p class="labsub">المربعات المخفية (بتنفتح على لعبة عشوائية):</p>
    <div class="labgrid sp">${Object.keys(SPECIALS).map(k=>{const r=ratings().filter(x=>x.sp===k);const last=r[r.length-1];
      return `<button class="labbtn" data-labsp="${k}" style="--gc:${SPECIALS[k].c}">${ico(SPECIALS[k].i,SPECIALS[k].c)}<b>${SPECIALS[k].n}</b>${last?`<em>${last.ok?"👍":"👎"}</em>`:""}</button>`}).join("")}</div>
    ${ratings().length?`<div class="ratesum"><pre id="rtxt">${esc(ratingsText())}</pre><div class="row2"><button class="btn" id="copyR">انسخ التقييمات وابعتلي ياها</button><button class="btn ghost" id="clrR">امسح التقييمات</button></div></div>`:""}
  </div>
  ${canResume?`<button class="btn resume" id="resume">${ico("swords","#1A1030")} كمّلوا السهرة اللي وقفت <small>${saved.teams.map(t=>esc(t.n)+" "+t.score).join(" · ")}</small></button>`:""}
  <div class="blockx"><h3>الفرق</h3>
    <div class="teamsin">${setup.teams.map((n,i)=>`<label class="tin" style="--tc:${TEAM_DEF[i].c}">${crest(i,22)}<input data-t="${i}" value="${esc(n)}" maxlength="16" aria-label="اسم الفريق ${i+1}">${setup.teams.length>2?`<button class="x" data-rm="${i}" aria-label="شيل الفريق">×</button>`:""}</label>`).join("")}
    ${setup.teams.length<4?`<button class="tin add" id="addT">+ فريق</button>`:""}</div></div>
  <div class="blockx"><h3>حجم اللوحة</h3>
    <div class="sizes">${Object.entries(SIZES).map(([k,z])=>`<button class="size${setup.size===k?" on":""}" data-size="${k}"><b>${z.n}</b><span>${z.cols} ألعاب × ${z.vals.length} صفوف</span><small>${z.min} · ${z.sp.length} مربعات مخفية</small></button>`).join("")}</div></div>
  <div class="blockx"><h3>الألعاب باللوحة</h3>
    <div class="glist">${GAME_ORDER.map(g=>`<div class="gi" style="--gc:${GAMES[g].c}">${ico(GAMES[g].i,GAMES[g].c)}<b>${GAMES[g].n}</b><span>${GAMES[g].short}</span></div>`).join("")}</div>
    <div class="splist">${Object.entries(SPECIALS).map(([k,s])=>`<div class="spi" style="--gc:${s.c}">${ico(s.i,s.c)}<b>${s.n}</b><span>${s.t}</span></div>`).join("")}
      <div class="spi" style="--gc:#C9C4FF">${ico("mirror","#C9C4FF")}<b>المرآة</b><span>مع كل فريق مرآة وحدة: بترجّع القنبلة أو السرقة على اللي بعتها</span></div></div></div>
  <div class="blockx tips"><h3>الكبس</h3><p>كل فريق بيكبس على لونه بالشاشة، أو على رقمه بالكيبورد <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> (أو أزرار أركيد USB). بدكن تلفزيون؟ وصّلوا اللابتوب، أو افتحوا <a href="#screen" target="_blank" rel="noopener">شاشة عرض تانية</a> بنفس المتصفح.</p></div>
  <button class="btn go" id="start">${ico("swords","#1A1030")} افتحوا اللوحة</button>
  </section>`;
  $$("[data-t]").forEach(el=>el.oninput=()=>{setup.teams[+el.dataset.t]=el.value;LS.set("maydan_setup",setup)});
  $$("[data-rm]").forEach(el=>el.onclick=()=>{setup.teams.splice(+el.dataset.rm,1);LS.set("maydan_setup",setup);renderSetup()});
  const add=$("#addT");if(add)add.onclick=()=>{setup.teams.push(TEAM_DEF[setup.teams.length].n);LS.set("maydan_setup",setup);renderSetup()};
  $$("[data-size]").forEach(el=>el.onclick=()=>{setup.size=el.dataset.size;LS.set("maydan_setup",setup);renderSetup()});
  $("#start").onclick=()=>{tone(1,.01);newGame()};
  const r=$("#resume");if(r)r.onclick=()=>{S=saved;render()};
  $$("[data-lv]").forEach(b=>b.onclick=()=>{labLv=+b.dataset.lv;LS.set("maydan_lablv",labLv);renderSetup()});
  $$("[data-lab]").forEach(b=>b.onclick=()=>{tone(1,.01);startLab(b.dataset.lab)});
  $$("[data-labsp]").forEach(b=>b.onclick=()=>{tone(1,.01);startLab(rnd(GAME_ORDER),b.dataset.labsp)});
  const cp=$("#copyR");if(cp)cp.onclick=()=>{const t=ratingsText();const done=()=>{cp.textContent="✓ انتسخت، الصقها بالمحادثة"};
    try{navigator.clipboard.writeText(t).then(done,()=>{selectPre();done()})}catch(e){selectPre();done()}};
  const cl=$("#clrR");if(cl)cl.onclick=()=>{if(cl.dataset.sure){LS.set("maydan_ratings",[]);renderSetup()}else{cl.dataset.sure=1;cl.textContent="متأكد؟ اكبس كمان مرة"}};
}
function selectPre(){const el=$("#rtxt");if(!el)return;const r=document.createRange();r.selectNodeContents(el);const sel=getSelection();sel.removeAllRanges();sel.addRange(r)}

/* افتتاح */
function renderOpen(){
  app.innerHTML=`<div class="stage open">${topbar("")}
   <div class="openx">
     <span class="onair"><i></i>على الهوا</span>
     <h1>لوحة الميدان</h1>
     <div class="vs">${S.teams.map((t,i)=>`<div class="vt" style="--tc:${t.c};--d:${i*.12}s">${crest(i,40)}<b>${esc(t.n)}</b></div>`).join(`<span class="vsx">ضد</span>`)}</div>
     <ul class="rules"><li>الفريق الأخسر بيختار المربع الجاي</li><li>${SIZES[S.size].sp.length} مربعات مخفية بين المربعات</li><li>كل فريق معه مرآة وحدة 🪞</li></ul>
     ${ctl(`<button class="btn go" data-a="toboard">يلّا نبلّش</button>`)}
   </div>${scoreboard()}</div>`;
  bind();
}
function topbar(title){
  return `<div class="tbar"><div class="tl">${ico("crown","#FFB72B")}<b>ميدان</b>${title?`<span class="sep"></span><span class="tt">${title}</span>`:""}</div>
  <div class="tr">${MIRROR?"":`<button class="ib" data-a="mute" aria-label="الصوت">${muted?"🔇":"🔊"}</button><button class="ib" data-a="menu" aria-label="القائمة">☰</button>`}</div></div>`;
}
const ctl=h=>MIRROR?"":`<div class="ctl">${h}</div>`;

/* اللوحة */
function renderBoard(){
  const sz=SIZES[S.size],t=S.teams[S.turn];
  app.innerHTML=`<div class="stage board-st" style="--tc:${t.c}">${topbar("اللوحة")}
  <div class="turnbar"><span class="pulse" style="--tc:${t.c}"></span>دور ${tname(S.turn)} يختاروا مربع</div>
  <div class="board" style="--cols:${S.cols.length};--rows:${sz.vals.length}">
    ${S.cols.map(c=>`<div class="bh" style="--gc:${GAMES[c.g].c}">${ico(GAMES[c.g].i,GAMES[c.g].c)}<b>${GAMES[c.g].n}</b>${c.topic?`<small>${esc(c.topic)}</small>`:""}</div>`).join("")}
    ${S.tiles.map((x,i)=>`<button class="tile${x.used?" used":""}" data-tile="${i}" style="--gc:${GAMES[S.cols[x.ci].g].c};${x.by>=0?`--wc:${S.teams[x.by].c}`:""}" ${x.used||MIRROR?"disabled":""} aria-label="${GAMES[S.cols[x.ci].g].n} ${x.v}">
      ${x.used?(x.by>=0?crest(x.by,26):`<span class="nobody">—</span>`):`<b>${x.v}</b>`}</button>`).join("")}
  </div>
  ${scoreboard()}</div>`;
  bind();
}

/* المربع */
function renderTile(){
  const T=S.T,G=GAMES[T.g],tm=S.teams[T.team];
  const bombHead=T.sp==="bomb";
  const head=bombHead?`<div class="th" style="--gc:#FF4D5E">${ico("bomb","#FF4D5E")}<div><b>قنبلة موقوتة</b><small>${LVN[T.lv]} · الوقت مخفي</small></div><span class="val">${T.v}</span></div>`:`<div class="th" style="--gc:${G.c}">${ico(G.i,G.c)}<div><b>${G.n}</b><small>${T.data&&T.data.topic?esc(T.data.topic)+" · ":T.data&&T.data.cat?esc(T.data.cat)+" · ":""}${LVN[T.lv]} · للفريق ${esc(tm.n)}</small></div><span class="val${T.sp==="kanz"?" x2":""}">${T.v}${T.sp==="kanz"?" <i>×2</i>":""}</span>${ringHTML()}</div>`;
  let body="",c="";
  if(T.step==="special"){
    const sp=SPECIALS[T.sp];
    body=`<div class="special sp-${T.sp}" style="--gc:${sp.c}"><div class="spbig">${ico(sp.i,sp.c)}</div><h2>${sp.n}</h2><p>${sp.t}</p></div>`;
    if(T.sp==="kanz")c=`<button class="btn go" data-a="intro">حلو! شو اللعبة؟</button>`;
    else if(T.sp==="bomb")c=`<p class="hint">القنبلة بتبلّش بإيد ${tname(T.team)}. ترتيب التمرير: ${S.teams.map(x=>esc(x.n)).join(" ← ")}</p><button class="btn go bombgo" data-a="tbstart">💣 ولّعوا الفتيل</button>`;
    else c=`<p class="hint">${tname(T.team)} اختاروا الفريق:</p><div class="tpick">${S.teams.map((x,i)=>i===T.team?"":`<button class="tb" style="--tc:${x.c}" data-target="${i}">${crest(i,20)}${esc(x.n)} <small>${x.score}</small>${x.mirror?" 🪞":""}</button>`).join("")}</div>`;
  }
  else if(T.step==="tbomb"){
    const q=T.qq,h=S.teams[T.holder];
    body=`<div class="tbomb" style="--tc:${h.c}"><div class="bombx"><div class="fuse" id="fuse"></div>${ico("bomb","#FF4D5E")}</div>
      <p class="holder">القنبلة بإيد ${tname(T.holder)}</p><p class="lbl">${esc(q.topic)}</p><h2 class="q">${esc(q.q)}</h2>
      <div class="opts">${q.opts.map((o,i)=>`<button class="opt${T.wrongOpt===i?" wrong":""}" data-tbo="${i}" ${MIRROR?"disabled":""}><i>${LET[i]}</i>${esc(o)}</button>`).join("")}</div>
      <p class="hint">جواب صح = القنبلة بتروح للفريق الجاي. غلط = بتضل معكن وسؤال جديد</p></div>`;
  }
  else if(T.step==="mirror"){
    const v=S.teams[T.target];
    body=`<div class="special" style="--gc:#C9C4FF"><div class="spbig">${ico("mirror","#C9C4FF")}</div><h2>${esc(v.n)} معهم مرآة!</h2><p>بيستخدموها هلّق؟ إذا استخدموها ${T.sp==="bomb"?"القنبلة بترجع على":"السرقة بتنقلب على"} ${esc(tm.n)}. المرآة بتنستعمل مرة وحدة بس.</p></div>`;
    c=`<div class="row2"><button class="btn mir" data-a="mirroryes">🪞 استخدموا المرآة</button><button class="btn" data-a="mirrorno">لا، خلّوها لبعدين</button></div>`;
  }
  else if(T.step==="intro"){
    body=`<div class="intro" style="--gc:${G.c}"><div class="ibig">${ico(G.i,G.c)}</div><h2>${G.n}</h2><ol>${G.how.map(h=>`<li>${h}</li>`).join("")}</ol>${T.sp==="freeze"?`<p class="note">❄️ ${esc(S.teams[T.target].n)} مجمّدين وبيضيع دورهم الجاي.</p>`:""}</div>`;
    c=`<button class="btn go" data-a="start">ابدؤوا ${ico("swords","#1A1030")}</button>`;
  }
  else if(T.step==="done"){body=doneHTML(T);c=`<button class="btn go" data-a="back">رجوع للوحة</button>`}
  else ({quiz:quizView,reveal:revealView,chain:chainView,emoji:emojiView,closest:closestView,act:secretView,hum:secretView,draw:secretView})[T.g](T,o=>{body=o.body;c=o.c});
  app.innerHTML=`<div class="stage tile-st" style="--gc:${G.c};--tc:${tm.c}">${topbar(G.n)}${head}<div class="play">${body}</div>${ctl(c)}${scoreboard()}</div>`;
  bind();
  if(T.g==="draw"&&T.step==="run"&&!MIRROR)initCanvas();
}
function doneHTML(T){
  const res=(T.res||[]).filter(r=>r.pts!==0);
  let ans="";
  if(T.g==="quiz")ans=`${LET[T.data.a]}) ${esc(T.data.opts[T.data.a])}`;
  else if(T.g==="reveal"||T.g==="emoji")ans=esc(T.data.ans)+(T.g==="emoji"?` <small dir="ltr">${T.data.emo}</small>`:"");
  else if(T.g==="closest")ans=`${T.data.ans.toLocaleString("en")} <small>${esc(T.data.unit)}</small>`;
  else if(T.g==="chain")ans=`${T.count} من ${T.data.target}`;
  else if(T.data.word)ans=esc(T.data.word)+(T.data.sub?` <small>(${esc(T.data.sub)})</small>`:"");
  const isSp=T.sp==="steal"||(T.sp==="bomb"&&T.exploded);
  const gl=T.g==="closest"&&T.guesses&&!isSp?`<ul class="glist2">${S.teams.map((t,i)=>{const g=toNum(T.guesses[i]),df=Math.abs(g-T.data.ans);return `<li style="--tc:${t.c}">${crest(i,16)}<b>${esc(t.n)}</b><span>${isNaN(g)?"—":g.toLocaleString("en")}</span><em>${isNaN(g)?"":df===0?"بالضبط!":"فرق "+df.toLocaleString("en")}</em></li>`}).join("")}</ul>`:"";
  return `<div class="done">${isSp?"":`<span class="lbl">${T.g==="chain"?"الحصيلة":"الجواب"}</span><h2>${ans}</h2>`}
    ${gl}${T.exploded?`<p class="note boom">💥 بوووم! انفجرت بإيد ${esc(S.teams[T.holder].n)}</p>`:""}
    ${T.reflected?`<p class="note">🪞 المرآة قلبت الطاولة!</p>`:""}
    <ul class="deltas">${res.length?res.map(r=>`<li style="--tc:${S.teams[r.i].c}">${crest(r.i,18)}<b>${esc(S.teams[r.i].n)}</b><span>${esc(r.why)}</span><em class="${r.pts>0?"up":"dn"}"><bdi dir="ltr">${r.pts>0?"+":""}${r.pts}</bdi></em></li>`).join(""):`<li class="none">ما حدا أخد نقاط من هالمربع</li>`}</ul></div>`;
}
const LET=["أ","ب","ج","د"];
function quizView(T,out){
  const d=T.data,showAns=T.step==="steal"&&T.stealer!=null&&T.pickedOpt2!=null;
  const opt=(i)=>{let cls="opt";if(T.pickedOpt===i)cls+=" wrong";if(T.pickedOpt2===i)cls+=i===d.a?" right":" wrong";return `<button class="${cls}" data-opt="${i}" ${T.pickedOpt===i||MIRROR?"disabled":""}><i>${LET[i]}</i>${esc(d.opts[i])}</button>`};
  let hint="";
  if(T.step==="ask")hint=`${tname(T.team)} جاوبوا: المقدّم بيكبس الخيار اللي قالوه`;
  else if(T.step==="steal")hint=T.stealer==null?`<span class="steal">🦹 سرقة!</span> أول فريق بيكبس على لونه بيجاوب`:`${tname(T.stealer)} عم يسرقوا: شو جوابكن؟`;
  out({body:`<h2 class="q">${esc(d.q)}</h2><div class="opts">${[0,1,2,3].map(opt).join("")}</div><p class="hint">${hint}</p>`,
       c:T.step==="steal"&&T.stealer==null?`${buzzRow(T,[T.team])}<button class="btn ghost" data-a="nosteal">ما حدا بيسرق</button>`:""});
}
function revealView(T,out){
  const d=T.data,val=revealValue(T);
  const clues=d.clues.map((x,i)=>`<li class="${i<T.clue?"on":""}" style="--d:${i}"><i>${i+1}</i><span>${i<T.clue?esc(x):"؟؟؟"}</span>${i<T.clue?"":`<em>${Math.round(T.v*(d.clues.length-i)/d.clues.length/10)*10}</em>`}</li>`).join("");
  let hint,c;
  if(T.step==="play"){hint=`مين عرفها؟ اكبسوا هلّق والجواب بـ<b>${val}</b> نقطة`;c=buzzRow(T,T.locked)+`<button class="btn ghost" data-a="nextclue">التلميح الجاي ←</button>`}
  else{hint=`${tname(T.buzzer)} كبسوا! شو الجواب؟`;c=`<div class="peek" data-hold><span>المقدّم: اضغط مطوّل لتشوف الجواب</span><b>${esc(d.ans)}</b></div><div class="row2"><button class="btn ok" data-a="right">✓ صح (+${val})</button><button class="btn no" data-a="wrong">✗ غلط</button></div>`}
  out({body:`<p class="lbl revcat"><span>الفئة</span><b>${esc(d.cat||"")}</b></p><ol class="clues">${clues}</ol><p class="hint">${hint}</p>${T.locked.length?`<p class="locked">مقفول عليهم: ${T.locked.map(i=>esc(S.teams[i].n)).join("، ")}</p>`:""}`,c});
}
function chainView(T,out){
  const d=T.data;
  const dots=Array.from({length:d.target},(_,i)=>`<i class="${i<T.count?"on":""}"></i>`).join("");
  let c="";
  if(T.step==="ready")c=`<button class="btn go" data-a="chaingo">ابدأ الـ40 ثانية 🔥</button>`;
  else c=`<button class="btn plus" data-a="plus">+1 ✓</button><button class="btn ghost" data-a="minus">تراجع</button>`;
  out({body:`<p class="lbl">${tname(T.team)}: بالدور، كل واحد جواب</p><h2 class="q big">${esc(d.topic)}</h2><div class="chain"><div class="dots">${dots}</div><div class="cnt"><b>${T.count}</b><span>من ${d.target}</span></div></div><p class="hint">ممنوع التكرار، وممنوع حدا يقول جوابين ورا بعض</p>`,c});
}
function secretView(T,out){
  const G=GAMES[T.g],d=T.data;
  const verb=T.g==="act"?"مثّل":T.g==="hum"?"دندن":"ارسم";
  if(T.step==="secret"){
    out({body:`<div class="secret"><p class="lbl">${tname(T.team)}: مين رح ${T.g==="act"?"يمثّل":T.g==="hum"?"يدندن":"يرسم"}؟ يجي لعند الجهاز لحاله</p>
      ${MIRROR?`<div class="hidden-card">🤫 الكلمة سرّية</div>`:`<div class="peek big" data-hold><span>اضغط مطوّل لتشوف ${T.g==="hum"?"الأغنية":"الكلمة"} (لا تخلّي حدا يشوف)</span><b>${esc(d.word)}${d.sub?`<small>${esc(d.sub)}</small>`:""}</b></div>`}</div>`,
      c:`<button class="btn go" data-a="secretgo">جاهز، ابدأ الوقت ⏱</button>`});return}
  if(T.step==="run"){
    out({body:T.g==="draw"?(MIRROR?`<div class="hidden-card">✏️ الرسم عالجهاز الأساسي</div>`:`<div class="canvas-wrap"><canvas id="cv"></canvas><div class="pens">${["#F5F3FF","#FFB72B","#FF6B57","#3CCFAE","#6F8DF0"].map((p,i)=>`<button class="pen${i?"":" on"}" data-pen="${p}" style="background:${p}" aria-label="لون"></button>`).join("")}<button class="pen clear" data-a="clear" aria-label="امسح">🧽</button></div></div>`)
      :`<div class="perform"><div class="pbig">${ico(G.i,G.c)}</div><h2>${verb} لفريقك!</h2><p>${T.g==="act"?"بلا حكي، بلا أصوات، بلا إشارات للحروف":"«ممم» بس، بلا ولا كلمة"}</p></div>`,
      c:`<button class="btn ok" data-a="gotit">✓ حزروها! (+${T.v})</button>`});return}
  if(T.step==="steal"){
    out({body:`<div class="perform"><h2><span class="steal">🦹 فرصة سرقة!</span></h2><p>${tname(T.team)} ما لحقوا. أول فريق تاني بيكبس عنده جواب واحد بـ<b>${Math.round(T.v/2)}</b> نقطة.</p></div>`,
      c:buzzRow(T,[T.team])+`<button class="btn ghost" data-a="nosteal">ما حدا بيسرق</button>`});return}
  if(T.step==="stealjudge"){
    out({body:`<div class="perform"><h2>${tname(T.stealer)} شو جوابكن؟</h2></div>`,
      c:`<div class="peek" data-hold><span>المقدّم: اضغط مطوّل لتشوف الجواب</span><b>${esc(d.word)}</b></div><div class="row2"><button class="btn ok" data-a="stealok">✓ صح (+${Math.round(T.v/2)})</button><button class="btn no" data-a="stealno">✗ غلط</button></div>`});return}
}
function emojiView(T,out){
  const d=T.data;let hint,c;
  if(T.step==="play"){hint=`مين عرفها؟ اكبسوا هلّق والجواب بـ<b>${T.v}</b> نقطة`;c=buzzRow(T,T.locked)+`<button class="btn ghost" data-a="nosteal">ما حدا عرفها، اكشفوا</button>`}
  else{hint=`${tname(T.buzzer)} كبسوا! شو الجواب؟`;c=`<div class="peek" data-hold><span>المقدّم: اضغط مطوّل لتشوف الجواب</span><b>${esc(d.ans)}</b></div><div class="row2"><button class="btn ok" data-a="eok">✓ صح (+${T.v})</button><button class="btn no" data-a="eno">✗ غلط</button></div>`}
  out({body:`<p class="lbl revcat"><span>الفئة</span><b>${esc(d.cat)}</b></p><div class="emo" dir="ltr">${emoSegs(d.emo).map((x,i)=>`<span style="--d:${i*.15}s">${x}</span>`).join("")}</div><p class="hint">${hint}</p>${T.locked.length?`<p class="locked">مقفول عليهم: ${T.locked.map(i=>esc(S.teams[i].n)).join("، ")}</p>`:""}`,c});
}
function emoSegs(t){try{if(window.Intl&&Intl.Segmenter)return [...new Intl.Segmenter().segment(t)].map(x=>x.segment)}catch(e){}return [t]}
function closestView(T,out){
  const d=T.data;
  const filled=T.guesses.every(g=>String(g).trim()!==""&&!isNaN(toNum(g)));
  out({body:`<p class="lbl">كل فريق يكتب تخمينه على ورقة</p><h2 class="q">${esc(d.q)}</h2>
    <div class="guesses">${S.teams.map((t,i)=>`<label class="gs" style="--tc:${t.c}">${crest(i,20)}<b>${esc(t.n)}</b>${MIRROR?`<span>✍️</span>`:`<input id="g${i}" data-g="${i}" inputmode="decimal" placeholder="التخمين" value="${esc(T.guesses[i])}">`}</label>`).join("")}</div>
    <p class="hint">${d.unit?`الجواب بـ«${esc(d.unit)}» · `:""}الأقرب بياخد ${T.v}، والجواب بالضبط بياخد ${T.v*2}</p>`,
    c:`<button class="btn go" data-a="closest" ${filled?"":"disabled"}>اكشف الجواب</button>`});
}
const toNum=v=>parseFloat(String(v).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[٬,\s]/g,"").replace("٫","."));
function quickQ(){
  const ks=Object.keys(QUIZ),topic=rnd(ks),pool=QUIZ[topic].filter(x=>x[0]<=2),q=rnd(pool),order=shuffle([0,1,2,3]);
  return{topic,q:q[1],opts:order.map(i=>q[2][i]),a:order.indexOf(q[3])};
}
function buzzRow(T,locked){
  return `<div class="buzzrow">${S.teams.map((x,i)=>locked.includes(i)?"":`<button class="bz" style="--tc:${x.c}" data-bz="${i}">${crest(i,22)}<b>${esc(x.n)}</b><kbd>${i+1}</kbd></button>`).join("")}</div>`;
}

/* الجولة الأخيرة */
function renderFinal(){
  const F=S.F;let body="",c="";
  if(F.step==="bet"){
    body=`<div class="finalx"><span class="onair"><i></i>الجولة الأخيرة</span><h1>الرهان الأخير</h1><p>كل فريق بيراهن على قد ما بدو من نقاطه على سؤال واحد صعب من <b>${esc(F.topic)}</b>. صح = بتنضاف. غلط = بتنخصم.</p>
     <div class="bets">${S.teams.map((t,i)=>`<div class="bet" style="--tc:${t.c}">${crest(i,22)}<b>${esc(t.n)}</b><small>معهم ${t.score}</small>
       <div class="adj">${MIRROR?"":`<button data-bet="${i}" data-d="-100">−</button>`}<output>${F.bets[i]}</output>${MIRROR?"":`<button data-bet="${i}" data-d="100">+</button><button class="all" data-bet="${i}" data-d="all">كل شي</button>`}</div></div>`).join("")}</div></div>`;
    c=`<button class="btn go" data-a="finalq">اقفلوا الرهانات واعرضوا السؤال</button>`;
  } else if(F.step==="q"||F.step==="judge"){
    const judging=F.step==="judge";
    body=`<div class="finalx"><p class="lbl">${esc(F.topic)} · كل فريق يكتب جوابه على ورقة</p><h2 class="q">${esc(F.q)}</h2>
      <div class="opts">${F.opts.map((o,i)=>`<div class="opt${judging&&i===F.a?" right":""}"><i>${LET[i]}</i>${esc(o)}</div>`).join("")}</div>
      ${judging?`<div class="bets">${S.teams.map((t,i)=>`<div class="bet j" style="--tc:${t.c}">${crest(i,22)}<b>${esc(t.n)}</b><small>رهان ${F.bets[i]}</small>${MIRROR?(F.ok[i]==null?"":F.ok[i]?"✓":"✗"):`<div class="row2"><button class="mini ok${F.ok[i]===true?" on":""}" data-fok="${i}">✓</button><button class="mini no${F.ok[i]===false?" on":""}" data-fno="${i}">✗</button></div>`}</div>`).join("")}</div>`:""}</div>`;
    c=judging?`<button class="btn go" data-a="finalend" ${F.ok.some(x=>x==null)?"disabled":""}>توّجوا البطل 👑</button>`:`<button class="btn ghost" data-a="finalreveal">اكشف الجواب</button>`;
  }
  app.innerHTML=`<div class="stage final-st">${topbar("الرهان الأخير")}${F.step!=="bet"?`<div class="th" style="--gc:#FFB72B">${ico("dice","#FFB72B")}<div><b>الرهان الأخير</b><small>30 ثانية للكتابة</small></div>${ringHTML()}</div>`:""}<div class="play">${body}</div>${ctl(c)}${scoreboard()}</div>`;
  bind();
}
function renderEnd(){
  const order=S.teams.map((t,i)=>i).sort((a,b)=>S.teams[b].score-S.teams[a].score);
  const w=order[0],W=S.teams[w];
  const stealer=S.teams.map((t,i)=>({i,s:S.log.filter(l=>l.i===i&&/سرقة|رجعت/.test(l.why)&&l.pts>0).length})).sort((a,b)=>b.s-a.s)[0];
  const victim=S.teams.map((t,i)=>({i,s:S.log.filter(l=>l.i===i&&l.pts<0).reduce((a,l)=>a+l.pts,0)})).sort((a,b)=>a.s-b.s)[0];
  const tiles=S.teams.map((t,i)=>({i,s:t.won})).sort((a,b)=>b.s-a.s)[0];
  app.innerHTML=`<div class="stage end-st" style="--tc:${W.c}">${topbar("النهاية")}
   <div class="endx"><div class="trophy">${ico("trophy","#FFB72B")}</div><span class="lbl">بطل الميدان</span><h1 style="color:${W.c}">${crest(w,46)} ${esc(W.n)}</h1><p><bdi>${W.score}</bdi> نقطة</p>
   <div class="awards">
     <div><b>👑 ملوك اللوحة</b><span>${esc(S.teams[tiles.i].n)}: ${tiles.s} مربعات</span></div>
     ${stealer.s?`<div><b>🦹 أكبر حرامية</b><span>${esc(S.teams[stealer.i].n)}</span></div>`:""}
     ${victim.s<0?`<div><b>💣 أكتر فريق انضرب</b><span>${esc(S.teams[victim.i].n)}: <bdi dir="ltr">${victim.s}</bdi></span></div>`:""}
   </div>
   <ol class="final-order">${order.map((i,k)=>`<li style="--tc:${S.teams[i].c}"><span>${k+1}</span>${crest(i,18)}<b>${esc(S.teams[i].n)}</b><em><bdi>${S.teams[i].score}</bdi></em></li>`).join("")}</ol>
   ${ctl(`<div class="row2"><button class="btn go" data-a="again">لوحة جديدة بنفس الفرق</button><button class="btn" data-a="home">الإعداد</button></div>`)}</div></div>`;
  bind();
}

/* ---------- ربط الأزرار ---------- */
function bind(){
  if(MIRROR)return;
  $$("[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a,b));
  $$("[data-tile]").forEach(b=>b.onclick=()=>openTile(+b.dataset.tile));
  $$("[data-target]").forEach(b=>b.onclick=()=>chooseTarget(+b.dataset.target));
  $$("[data-bz]").forEach(b=>b.onclick=()=>buzz(+b.dataset.bz));
  $$(".sbt").forEach(b=>b.onclick=()=>buzz(+b.dataset.buzz));
  $$("[data-opt]").forEach(b=>b.onclick=()=>answerOpt(+b.dataset.opt));
  $$("[data-tbo]").forEach(b=>b.onclick=()=>{const T=S.T,i=+b.dataset.tbo;
    if(i===T.qq.a){SFX.good();T.passes=(T.passes||0)+1;T.holder=(T.holder+1)%S.teams.length;T.wrongOpt=null;T.qq=quickQ()}
    else{SFX.bad();T.wrongOpt=null;T.qq=quickQ()}
    save();render()});
  $$("[data-g]").forEach(el=>el.oninput=()=>{S.T.guesses[+el.dataset.g]=el.value;const btn=$('[data-a="closest"]');if(btn)btn.disabled=!S.T.guesses.every(g=>String(g).trim()!==""&&!isNaN(toNum(g)))});
  $$("[data-bet]").forEach(b=>b.onclick=()=>{const i=+b.dataset.bet,F=S.F,max=Math.max(0,S.teams[i].score);F.bets[i]=b.dataset.d==="all"?max:Math.max(0,Math.min(max,F.bets[i]+ +b.dataset.d));save();render()});
  $$("[data-fok]").forEach(b=>b.onclick=()=>{S.F.ok[+b.dataset.fok]=true;save();render()});
  $$("[data-fno]").forEach(b=>b.onclick=()=>{S.F.ok[+b.dataset.fno]=false;save();render()});
  $$("[data-hold]").forEach(el=>{
    const on=e=>{e.preventDefault();el.classList.add("show")},off=()=>el.classList.remove("show");
    el.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,off));
  });
}
function answerOpt(i){
  const T=S.T;if(!T||T.g!=="quiz")return;
  if(T.step==="ask"){
    stopTimer();
    if(i===T.data.a){SFX.good();award(T.team,T.v,"جاوبوا صح");T.pickedOpt2=i;finishTile()}
    else{SFX.bad();T.pickedOpt=i;award(T.team,-Math.round(T.v/2),"جواب غلط");T.step="steal";T.stealer=null;save();render()}
  } else if(T.step==="steal"&&T.stealer!=null&&i!==T.pickedOpt){
    stopTimer();T.pickedOpt2=i;
    if(i===T.data.a){SFX.good();award(T.stealer,T.v,"سرقوا السؤال 🦹")}else{SFX.bad();award(T.stealer,0,"حاولوا يسرقوا")}
    finishTile();
  }
}
function act(a){
  const T=S.T;
  switch(a){
    case "toboard":nextTurn();S.phase="board";break;
    case "intro":T.step="intro";break;
    case "start":startGame();return;
    case "back":backToBoard();return;
    case "mirroryes":applySpecial(true);return;
    case "mirrorno":applySpecial(false);return;
    case "nosteal":T.reveal=true;finishTile();return;
    case "nextclue":if(T.clue<T.data.clues.length){T.clue++;SFX.flip();setTimer(DUR.clue)}else{finishTile();return}break;
    case "right":{const v=revealValue(T);SFX.good();award(T.buzzer,v,`عرفوها من التلميح ${T.clue}`);finishTile();return}
    case "wrong":SFX.bad();T.locked.push(T.buzzer);T.buzzer=null;T.step="play";
      if(T.locked.length>=S.teams.length){finishTile();return}
      if(T.clue<T.data.clues.length){T.clue++;setTimer(DUR.clue)}else resumeTimer();break;
    case "tbstart":T.step="tbomb";T.holder=T.team;T.qq=quickQ();setTimer(25+Math.floor(Math.random()*26));T.dur=0;SFX.boom();break;
    case "eok":SFX.good();award(T.buzzer,T.v,"عرفوها بالإيموجي");finishTile();return;
    case "eno":SFX.bad();T.locked.push(T.buzzer);T.buzzer=null;T.step="play";if(T.locked.length>=S.teams.length){T.reveal=true;finishTile();return}resumeTimer();break;
    case "closest":{stopTimer();const ds=T.guesses.map(g=>Math.abs(toNum(g)-T.data.ans));const m=Math.min(...ds);
      ds.forEach((d,i)=>{if(d===m)award(i,d===0?T.v*2:T.v,d===0?"جابوها بالضبط! 🎯":"الأقرب")});SFX.good();finishTile();return}
    case "chaingo":T.step="run";setTimer(DUR.chain);break;
    case "plus":if(T.step!=="run")return;T.count++;tone(600+T.count*80,.1,"triangle");
      if(T.count>=T.data.target){SFX.good();award(T.team,T.v,"كمّلوا السلسلة 🔥");finishTile();return}break;
    case "minus":T.count=Math.max(0,T.count-1);break;
    case "secretgo":T.step="run";setTimer(DUR[T.g]);break;
    case "gotit":{SFX.good();const left=Math.ceil(remaining()/1000);award(T.team,T.v,`حزروها وباقي ${left} ثانية`);finishTile();return}
    case "stealok":SFX.good();award(T.stealer,Math.round(T.v/2),"سرقوها 🦹");finishTile();return;
    case "stealno":SFX.bad();T.reveal=true;finishTile();return;
    case "clear":{const cv=$("#cv");if(cv)cv.getContext("2d").clearRect(0,0,cv.width,cv.height);return}
    case "finalq":S.F.step="q";S.F.until=Date.now()+DUR.final*1000;break;
    case "finalreveal":S.F.until=0;S.F.step="judge";break;
    case "finalend":S.teams.forEach((t,i)=>{const b=S.F.bets[i];t.score+=S.F.ok[i]?b:-b;S.log.push({i,pts:S.F.ok[i]?b:-b,why:"الرهان الأخير"})});S.phase="end";SFX.fanfare();break;
    case "again":setup.teams=S.teams.map(t=>t.n);newGame();return;
    case "labsave":{const L=S.lab;const n=$("#labnote");if(n)L.note=n.value;const r=ratings();r.push({g:L.g,sp:L.sp,lv:L.lv,ok:L.ok,note:(L.note||"").trim(),t:Date.now()});LS.set("maydan_ratings",r);S=null;document.body.classList.remove("md-full");renderSetup();window.scrollTo(0,0);return}
    case "labagain":{const L=S.lab;startLab(L.g,L.sp);return}
    case "labhome":S=null;document.body.classList.remove("md-full");renderSetup();window.scrollTo(0,0);return;
    case "home":S=null;LS.set("maydan_state",null);document.body.classList.remove("md-full");renderSetup();return;
    case "mute":muted=!muted;LS.set("maydan_mute",muted);break;
    case "menu":if(confirmMenu())return;break;
  }
  save();render();
}
function confirmMenu(){
  const m=document.createElement("div");m.className="menu";
  m.innerHTML=`<div class="mbox"><h3>القائمة</h3><button class="btn" data-m="skip" ${S.phase==="tile"?"":"disabled"}>سكّر هالمربع بلا نقاط</button><button class="btn" data-m="final" ${S.phase==="board"?"":"disabled"}>روحوا عالرهان الأخير هلّق</button><button class="btn" data-m="setup">رجوع للإعداد (السهرة بتنحفظ)</button><button class="btn ghost" data-m="x">إغلاق</button></div>`;
  document.body.appendChild(m);
  m.onclick=e=>{const k=e.target.dataset&&e.target.dataset.m;if(!k&&e.target!==m)return;m.remove();
    if(k==="skip"&&S.T){finishTile()}
    else if(k==="final"){S.tiles.forEach(t=>t.used=true);startFinal()}
    else if(k==="setup"){save();S=null;renderSetup()}};
  return true;
}

/* لوحة الرسم */
function initCanvas(){
  const cv=$("#cv");if(!cv)return;const box=cv.parentElement.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  cv.width=box.width*dpr;cv.height=Math.max(260,box.height-56)*dpr;cv.style.height=(cv.height/dpr)+"px";
  const g=cv.getContext("2d");g.scale(dpr,dpr);g.lineCap="round";g.lineJoin="round";g.lineWidth=6;g.strokeStyle="#F5F3FF";
  let down=false;const pt=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  cv.onpointerdown=e=>{down=true;cv.setPointerCapture(e.pointerId);const[x,y]=pt(e);g.beginPath();g.moveTo(x,y)};
  cv.onpointermove=e=>{if(!down)return;const[x,y]=pt(e);g.lineTo(x,y);g.stroke()};
  cv.onpointerup=cv.onpointercancel=()=>down=false;
  $$("[data-pen]").forEach(p=>p.onclick=()=>{g.strokeStyle=p.dataset.pen;$$(".pen").forEach(x=>x.classList.remove("on"));p.classList.add("on")});
}

/* الكيبورد وأزرار الأركيد */
document.addEventListener("keydown",e=>{
  if(MIRROR||!S||e.target.tagName==="INPUT")return;
  const n=+e.key;if(n>=1&&n<=S.teams.length){buzz(n-1);return}
  if(e.key===" "&&S.T&&S.T.g==="chain"&&S.T.step==="run"){e.preventDefault();act("plus")}
});

if(!MIRROR)S=null;
render();
requestAnimationFrame(loop);
})();
