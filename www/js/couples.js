// نسخة الثنائي: الإعداد، مراحل الجلسة، الإجابة المخفية، بطاقة الأمان، مقياس التوافق
/* ---------- content ---------- */
// {S} subject name, {O} other name, {m|f} by subject gender, {o:m|f} by other's gender
const PHASES=[
  {id:"warm",name:"إحماء",c:"var(--warm)"},
  {id:"reveal",name:"الكشف",c:"var(--reveal)"},
  {id:"laugh",name:"الضحك",c:"var(--laugh)"},
  {id:"deep",name:"العمق",c:"var(--deep)"},
  {id:"close",name:"الختام",c:"var(--close)"}
];

const TYPE={talk:{label:"احكي"},guess:{label:"توقّع جوابي"},who:{label:"مين فيكم؟"},dare:{label:"تحدّي"},repair:{label:"جولة إصلاح"},promise:{label:"الوعد"}};
const ICMAP={talk:"talk",guess:"guess",who:"pair",dare:"dare",repair:"repair",promise:"promise"};
const svgI=svg;
const HEAT=[null,{n:"دافئ",d:"تعارف ولطافة",c:"var(--warm)"},{n:"حار",d:"صراحة وضحك أكثر",c:"var(--laugh)"},{n:"نار",d:"اعترافات وعمق",c:"var(--deep)"}];
const PLAN={short:{warm:3,reveal:4,laugh:4,deep:3,close:2},normal:{warm:4,reveal:6,laugh:6,deep:5,close:3}};

/* ---------- state ---------- */
let S={players:[{n:"سامر",g:"m"},{n:"ليلى",g:"f"}],heat:2,len:"normal"};
let G=null;
const $=s=>document.querySelector(s);
const stage=$("#stage");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function fmt(t,s,o){
  return t.replace(/\{S\}/g,s.n).replace(/\{O\}/g,o.n)
    .replace(/\{o:([^|}]*)\|([^}]*)\}/g,(_,m,f)=>o.g==="m"?m:f)
    .replace(/\{([^|}]*)\|([^}]*)\}/g,(_,m,f)=>s.g==="m"?m:f);
}
const icon=t=>svgI(ICMAP[t]);
function setPhase(pid){const p=PHASES.find(x=>x.id===pid),r=document.documentElement.style;r.setProperty("--phase",p?p.c:"var(--warm)");r.setProperty("--on",pid==="reveal"?"var(--on-spy)":"var(--on-dark)")}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

/* ---------- setup ---------- */
function renderSetup(){
  G=null;setPhase("deep");$("#safety").hidden=true;$("#track").hidden=true;$("#homeBtn").hidden=false;
  stage.innerHTML=`
  <section class="hero">
    <span class="edition">تسلّى غو · نسخة الثنائي</span>
    <div class="hero-art" aria-hidden="true"><span>${svgI("promise")}</span><span>${svgI("guess")}</span><span>${svgI("talk")}</span></div>
    <h1>جلسة<em>لاثنين</em></h1>
    <p>جلسة لاثنين: تبدأ بضحكة، بتكشف كم بتعرفوا بعض، وبتخلص بكلمة حلوة.</p>
  </section>
  <section class="block">
    <span class="label">مين عم يلعب؟ غيّروا الأسماء</span>
    <div class="duo">
      ${[0,1].map(i=>`<div class="pl">
        <input id="name${i}" type="text" maxlength="14" value="${esc(S.players[i].n)}" aria-label="اسم اللاعب ${i+1}">
        <div class="seg" role="group" aria-label="الجنس">
          <button data-p="${i}" data-g="m" aria-pressed="${S.players[i].g==="m"}">شاب</button>
          <button data-p="${i}" data-g="f" aria-pressed="${S.players[i].g==="f"}">صبية</button>
        </div></div>`).join(`<div class="heart" aria-hidden="true">${svgI("promise")}</div>`)}
    </div>
  </section>
  <section class="block">
    <span class="label">درجة الحرارة: اختاروها سوا، وخذوا الأقل</span>
    <div class="heat">${[1,2,3].map(h=>`<button data-h="${h}" style="--hc:${HEAT[h].c}" aria-pressed="${S.heat===h}">
      <span class="flames">${[1,2,3].map(k=>`<i class="${k<=h?"on":""}"></i>`).join("")}</span>
      <strong>${HEAT[h].n}</strong><small>${HEAT[h].d}</small></button>`).join("")}</div>
  </section>
  <section class="block">
    <span class="label">طول الجلسة</span>
    <div class="len">
      <button data-l="short" aria-pressed="${S.len==="short"}">قصيرة<small>16 بطاقة · ربع ساعة تقريباً</small></button>
      <button data-l="normal" aria-pressed="${S.len==="normal"}">كاملة<small>24 بطاقة · نص ساعة وأكثر</small></button>
    </div>
  </section>
  <button class="go" id="start">يلا نبلّش</button>
  <p class="note">ولا جواب بينحفظ. كل شي بيختفي أول ما تسكّروا الصفحة.</p>`;
  stage.onclick=e=>{
    const b=e.target.closest("button");if(!b)return;
    if(b.dataset.g){S.players[+b.dataset.p].g=b.dataset.g;syncNames();renderSetup()}
    else if(b.dataset.h){S.heat=+b.dataset.h;syncNames();renderSetup()}
    else if(b.dataset.l){S.len=b.dataset.l;syncNames();renderSetup()}
    else if(b.id==="start"){syncNames();if(S.players.every(p=>p.n))start();else toast("اكتبوا الاسمين أول")}
  };
}
function syncNames(){[0,1].forEach(i=>{const el=$("#name"+i);if(el)S.players[i].n=el.value.trim()})}

/* ---------- session ---------- */
function start(){
  const cnt=PLAN[S.len],pool=C.filter(c=>c.h<=S.heat);
  // no repeats across sessions on this device: unseen cards first, the bucket refills only when it runs out
  let seen={};try{seen=JSON.parse(localStorage.getItem("tg_seen_couples")||"{}")||{}}catch(e){}
  const pick=(p,t,n)=>{
    const key=p+":"+t.join(",")+":"+S.heat,all=pool.filter(c=>c.p===p&&t.includes(c.t));
    let used=new Set(seen[key]||[]),fresh=shuffle(all.filter(c=>!used.has(c.q)));
    if(fresh.length<n){used=new Set();fresh=fresh.concat(shuffle(all.filter(c=>!fresh.includes(c))))}
    const got=fresh.slice(0,n);seen[key]=[...used,...got.map(c=>c.q)];return got};
  const saveSeen=()=>{try{localStorage.setItem("tg_seen_couples",JSON.stringify(seen))}catch(e){}};
  let plan=[];
  plan.push(...pick("warm",["talk"],cnt.warm));
  plan.push(...pick("reveal",["guess"],cnt.reveal));
  const who=pick("laugh",["who"],Math.ceil(cnt.laugh/2)),dare=pick("laugh",["dare"],Math.floor(cnt.laugh/2));
  for(let i=0;i<cnt.laugh;i++){const x=(i%2?dare:who).shift()||who.shift()||dare.shift();if(x)plan.push(x)}
  const deep=pick("deep",["talk"],cnt.deep);
  if(S.heat===3&&S.len==="normal"){deep.pop();deep.push(C.find(c=>c.t==="repair"))}
  plan.push(...deep);
  plan.push(...pick("close",["talk"],cnt.close),C.find(c=>c.t==="promise"));
  saveSeen();
  stage.onclick=null;
  G={plan,i:0,step:"card",d:{},guess:[],who:[],answered:0,skipped:0,promises:["",""],safety:false};
  $("#safety").hidden=false;$("#track").hidden=false;$("#homeBtn").hidden=true;
  render();
}
const card=()=>G.plan[G.i];
const subj=()=>S.players[G.i%2];
const other=()=>S.players[(G.i+1)%2];

function renderTrack(){
  const cur=PHASES.findIndex(p=>p.id===card().p);
  $("#track").innerHTML=PHASES.map((p,k)=>`<div class="${k<cur?"done":k===cur?"on":""}" style="--c:${p.c}"><b></b>${p.name}</div>`).join("");
}
function next(answered=true){
  if(answered)G.answered++;else G.skipped++;
  G.i++;G.step="card";G.d={};
  if(G.i>=G.plan.length)return finish();
  render();window.scrollTo({top:0,behavior:"smooth"});
}
function render(){
  const c=card();setPhase(c.p);renderTrack();
  const fn={talk:rTalk,dare:rTalk,guess:rGuess,who:rWho,repair:rRepair,promise:rPromise}[c.t];
  fn(c);
}
function cardHTML(c,qText,to,extra=""){
  return `<div class="cardwrap"><article class="card">
    <div class="head"><span class="sticker">${icon(c.t)}${TYPE[c.t].label}</span><span>${G.i+1} / ${G.plan.length}</span></div>
    ${to?`<div class="to">${to}</div>`:""}
    <p class="q">${qText}</p>${extra}
  </article></div>`;
}
function counter(){const left=G.plan.length-G.i-1;return `<div class="counter"><span>${HEAT[S.heat].n}</span><span>${left?`باقي ${left} بطاقة`:"آخر بطاقة"}</span></div>`}
function curtain(name,text,btn,cb){
  stage.innerHTML=`<section class="curtain">
    ${svgI("eye")}
    <h2>${esc(name)}</h2><p>${text}</p>
    <button class="btn" id="ready">${btn}</button></section>`;
  $("#ready").onclick=cb;$("#ready").focus();
}

/* talk + dare */
function rTalk(c){
  const s=subj(),o=other();
  const how=c.t==="dare"?"ما بدك؟ {قدّم|قدّمي} بطاقة تجاوز، وما حدا بيسأل ليش.":"{جاوب|جاوبي} بصوت عالي. و{O} {o:بيقدر|بتقدر} يسأل سؤال واحد بعدها.";
  stage.innerHTML=cardHTML(c,esc(fmt(c.q,s,o)),`الدور على <b>${esc(s.n)}</b>`,`<p class="howto">${esc(fmt(how,s,o))}</p>`)+
   `<div class="actions"><button class="btn" id="skip">تجاوز</button><button class="btn main" id="ok">${c.t==="dare"?"نفّذ، التالي":"جاوب، التالي"}</button></div>`+counter();
  $("#skip").onclick=()=>next(false);$("#ok").onclick=()=>next(true);
}

/* guess: subject writes privately, other guesses with a bet */
function rGuess(c){
  const s=subj(),o=other(),q=esc(fmt(c.q,s,o));
  const st=G.step;
  if(st==="card"){
    stage.innerHTML=cardHTML(c,q,`السؤال عن <b>${esc(s.n)}</b>`,`<p class="howto">${esc(s.n)} ${s.g==="m"?"بيكتب":"بتكتب"} جوابه بالسر، و${esc(o.n)} ${o.g==="m"?"بيحاول يتوقعه ويراهن":"بتحاول تتوقعه وتراهن"} على ثقته.</p>`)+
     `<div class="actions"><button class="btn" id="skip">تجاوز</button><button class="btn main" id="go">يلا نلعب</button></div>`+counter();
    $("#skip").onclick=()=>next(false);$("#go").onclick=()=>{G.step="passA";render()};
  }else if(st==="passA"){
    curtain(`الموبايل لـ${s.n}`,`و${esc(o.n)} ${o.g==="m"?"يغمّض عيونه":"تغمّض عيونها"} أو ${o.g==="m"?"يدير":"تدير"} وجهه.`,`أنا ${esc(s.n)}، جاهز`,()=>{G.step="inA";render()});
  }else if(st==="inA"){
    stage.innerHTML=`<section class="private"><span class="sticker">${icon("guess")}جوابك بالسر</span><p class="q">${q}</p>
      <textarea id="a" placeholder="اكتب الجواب الحقيقي…" aria-label="جوابك"></textarea>
      <p class="privnote">ما حدا رح يشوفه قبل الكشف.</p>
      <button class="btn main" id="done">خبّي جوابي وكمّل</button></section>`;
    $("#a").focus();
    $("#done").onclick=()=>{const v=$("#a").value.trim();if(!v){toast("اكتب شي أول");return}G.d.a=v;G.step="passB";render()};
  }else if(st==="passB"){
    curtain(`الموبايل لـ${o.n}`,`دورك ${o.g==="m"?"تتوقع":"تتوقعي"} شو كتب ${esc(s.n)}.`,`أنا ${esc(o.n)}، جاهز`,()=>{G.step="inB";G.d.bet=2;render()});
  }else if(st==="inB"){
    stage.innerHTML=`<section class="private"><span class="sticker">${icon("guess")}توقّعك</span>
      <p class="q">${esc(fmt(c.q,s,o))}</p><p class="privnote">شو ${s.g==="m"?"كتب":"كتبت"} ${esc(s.n)} برأيك؟</p>
      <textarea id="b" placeholder="توقّعك…" aria-label="توقعك"></textarea>
      <span class="label" style="color:var(--paper-muted)">قديش ${o.g==="m"?"متأكد":"متأكدة"}؟ (الرهان)</span>
      <div class="bet">${[[1,"يمكن"],[2,"أكيد تقريباً"],[3,"مية بالمية"]].map(([v,t])=>`<button data-b="${v}" aria-pressed="${G.d.bet===v}"><b>${v}</b>${t}</button>`).join("")}</div>
      <button class="btn main" id="done">اكشفوا الجوابين</button></section>`;
    stage.querySelector(".bet").onclick=e=>{const b=e.target.closest("button");if(!b)return;G.d.bet=+b.dataset.b;stage.querySelectorAll(".bet button").forEach(x=>x.setAttribute("aria-pressed",x===b))};
    $("#b").focus();
    $("#done").onclick=()=>{const v=$("#b").value.trim();if(!v){toast("اكتب توقّعك أول");return}G.d.b=v;G.step="reveal";render()};
  }else if(st==="reveal"){
    stage.innerHTML=cardHTML(c,q,`السؤال عن <b>${esc(s.n)}</b>`)+
      `<div class="reveal">
        <div class="ans"><small>جواب ${esc(s.n)}</small><p>${esc(G.d.a)}</p></div>
        <div class="ans"><small>توقّع ${esc(o.n)}</small><p>${esc(G.d.b)}</p><span class="betmark">الرهان: ${G.d.bet} من 3</span></div>
      </div>
      <span class="label" style="text-align:center">${esc(s.n)} ${s.g==="m"?"يحكم":"تحكم"}: قديش قريب؟</span>
      <div class="judge"><button data-j="2">نفس الشي!</button><button data-j="1">قريب</button><button data-j="0">بعيد</button></div>`;
    stage.querySelector(".judge").onclick=e=>{const b=e.target.closest("button");if(!b)return;
      const j=+b.dataset.j;G.guess.push({q:fmt(c.q,s,o),a:G.d.a,b:G.d.b,bet:G.d.bet,j,who:s.n,guesser:o.n});
      const msg=j===2?["تطابق!",`${esc(o.n)} ${o.g==="m"?"كسب":"كسبت"} ${G.d.bet} نقاط`]:j===1?["مش بعيد","نقطة وحدة"]:G.d.bet===3?["مية بالمية؟ أكيد؟","الرهان الكبير خسر"]:["مفاجأة!","هي فرصة تسألوا ليش"];
      stage.querySelector(".judge").outerHTML=`<p class="verdict">${msg[0]}<small>${msg[1]}</small></p><div class="actions one"><button class="btn main" id="nx">التالي</button></div>`;
      $("#nx").onclick=()=>next(true);$("#nx").focus();
    };
  }
}

/* who: both pick secretly */
function rWho(c){
  const [A,B]=S.players,st=G.step,q=esc(c.q);
  const pickUI=(p)=>`<section class="private"><span class="sticker">${icon("who")}اختيار سري</span><p class="q">${q}</p>
    <div class="picks"><button data-v="0">${esc(A.n)}</button><button data-v="1">${esc(B.n)}</button></div>
    <p class="privnote">${esc(p.n)}، ${p.g==="m"?"اختار":"اختاري"} بدون ما ${p.g==="m"?"يشوف":"تشوف"} التاني.</p></section>`;
  if(st==="card"){
    stage.innerHTML=cardHTML(c,q,"",`<p class="howto">كل واحد بيختار بالسر، وبعدين منشوف إذا اتفقتوا.</p>`)+
      `<div class="actions"><button class="btn" id="skip">تجاوز</button><button class="btn main" id="go">نختار بالسر</button></div>`+counter();
    $("#skip").onclick=()=>next(false);$("#go").onclick=()=>{G.step="passA";render()};
  }else if(st==="passA"){curtain(`الموبايل لـ${A.n}`,`${esc(B.n)} ${B.g==="m"?"ما يطلّع":"ما تطلّع"}!`,`أنا ${esc(A.n)}`,()=>{G.step="pickA";render()})}
  else if(st==="pickA"){stage.innerHTML=pickUI(A);stage.querySelector(".picks").onclick=e=>{const b=e.target.closest("button");if(!b)return;G.d.a=+b.dataset.v;G.step="passB";render()}}
  else if(st==="passB"){curtain(`الموبايل لـ${B.n}`,`${esc(A.n)} ${A.g==="m"?"اختار، وهلق دورك":"اختارت، وهلق دورك"}.`,`أنا ${esc(B.n)}`,()=>{G.step="pickB";render()})}
  else if(st==="pickB"){stage.innerHTML=pickUI(B);stage.querySelector(".picks").onclick=e=>{const b=e.target.closest("button");if(!b)return;G.d.b=+b.dataset.v;G.step="reveal";render()}}
  else{
    const agree=G.d.a===G.d.b;G.who.push(agree);
    const verdict=agree?`اتفقتوا: ${esc(S.players[G.d.a].n)}!`:"مختلفين!";
    const sub=agree?(G.d.a===0?`${esc(A.n)}، ${A.g==="m"?"شو بتقول عن حالك؟":"شو بتقولي عن حالك؟"}`:`${esc(B.n)}، ${B.g==="m"?"شو بتقول عن حالك؟":"شو بتقولي عن حالك؟"}`):"كل واحد يدافع عن اختياره بقصة وحدة.";
    stage.innerHTML=cardHTML(c,q,"")+`<div class="reveal">
      <div class="ans"><small>اختيار ${esc(A.n)}</small><p>${esc(S.players[G.d.a].n)}</p></div>
      <div class="ans"><small>اختيار ${esc(B.n)}</small><p>${esc(S.players[G.d.b].n)}</p></div></div>
      <p class="verdict">${verdict}<small>${sub}</small></p>
      <div class="actions one"><button class="btn main" id="nx">التالي</button></div>`;
    $("#nx").onclick=()=>next(true);
  }
}

/* repair round with timer */
let timerId=null;
function rRepair(c){
  const s=subj(),o=other();
  stage.innerHTML=cardHTML(c,esc(fmt(c.q,s,o)),`${esc(s.n)} ${s.g==="m"?"بيبدأ":"بتبدأ"}`,`
    <ol class="steps">
      <li>${esc(s.n)} ${s.g==="m"?"بيحكي":"بتحكي"} دقيقتين عن شعوره، بدون لوم.</li>
      <li>${esc(o.n)} ${o.g==="m"?"بيعيد":"بتعيد"} اللي سمعه بكلماته: «يعني انت حاسس إنو…».</li>
      <li>بس بعدها ${o.g==="m"?"بيرد":"بترد"}. وبعدين بتبدلوا.</li>
    </ol>
    <div class="timer"><output id="t">2:00</output><button class="tbtn" id="tb">ابدأ المؤقت</button></div>
    <p class="howto">صار الجو تقيل؟ بطاقة الأمان فوق بتاخدكم للختام فوراً.</p>`)+
    `<div class="actions"><button class="btn" id="skip">تجاوز</button><button class="btn main" id="ok">خلصنا، التالي</button></div>`+counter();
  let left=120;
  $("#tb").onclick=()=>{clearInterval(timerId);left=120;$("#tb").textContent="من جديد";
    timerId=setInterval(()=>{left--;const t=$("#t");if(!t){clearInterval(timerId);return}
      t.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(timerId);t.textContent="بدّلوا!"}},1000)};
  $("#skip").onclick=()=>{clearInterval(timerId);next(false)};$("#ok").onclick=()=>{clearInterval(timerId);next(true)};
}

/* promise: both write privately */
function rPromise(c){
  const [A,B]=S.players,st=G.step;
  const form=(p,k)=>`<section class="private"><span class="sticker">${icon("promise")}وعدك الصغير</span>
    <p class="q">شو الشي الصغير اللي ${p.g==="m"?"رح تعمله":"رح تعمليه"} هالأسبوع لـ${esc(S.players[1-k].n)}؟</p>
    <textarea id="pr" placeholder="مثلاً: بسألك كل يوم كيف كان يومك" aria-label="الوعد"></textarea>
    <p class="privnote">بينكشف الوعدين سوا بالنهاية.</p>
    <button class="btn main" id="done">${k?"اكشفوا الوعود":"خبّي وكمّل"}</button></section>`;
  if(st==="card"){
    stage.innerHTML=cardHTML(c,"الوعد الصغير","",`<p class="howto">كل واحد بيكتب وعد صغير وملموس لهالأسبوع. مش وعد كبير، شي بتقدروا تعملوه فعلاً.</p>`)+
      `<div class="actions one"><button class="btn main" id="go">نكتب الوعود</button></div>`;
    $("#go").onclick=()=>{G.step="passA";render()};
  }else if(st==="passA")curtain(`الموبايل لـ${A.n}`,"وعد واحد، صغير وصادق.",`أنا ${esc(A.n)}`,()=>{G.step="inA";render()});
  else if(st==="inA"){stage.innerHTML=form(A,0);$("#pr").focus();$("#done").onclick=()=>{G.promises[0]=$("#pr").value.trim();G.step="passB";render()}}
  else if(st==="passB")curtain(`الموبايل لـ${B.n}`,"دورك. وعد واحد بس.",`أنا ${esc(B.n)}`,()=>{G.step="inB";render()});
  else if(st==="inB"){stage.innerHTML=form(B,1);$("#pr").focus();$("#done").onclick=()=>{G.promises[1]=$("#pr").value.trim();next(true)}}
}

/* safety: jump straight to the closing phase */
$("#safety").onclick=()=>{
  if(!G)return;clearInterval(timerId);
  const firstClose=G.plan.findIndex(c=>c.p==="close");
  if(G.i>=firstClose){toast("أنتم بالختام أصلاً");return}
  G.plan=G.plan.slice(0,G.i).concat(G.plan.slice(firstClose));G.step="card";G.d={};G.safety=true;
  toast("انتقلنا للختام. خذوا نفس");render();window.scrollTo({top:0,behavior:"smooth"});
};

/* end */
function finish(){
  $("#safety").hidden=true;$("#track").hidden=true;$("#homeBtn").hidden=false;setPhase("close");
  const [A,B]=S.players;
  const gs=G.guess,pts=gs.reduce((s,g)=>s+(g.j===2?1:g.j===1?.5:0),0);
  const pct=gs.length?Math.round(pts/gs.length*100):null;
  const agree=G.who.filter(Boolean).length;
  const title=pct===null?"جلسة حلوة":pct>=80?"بتعرفوا بعض متل الكف":pct>=55?"قراب كتير، وفي لسا شي تكتشفوه":pct>=30?"في قصص لسا ما انحكت":"كأنكم لسا عم تتعرفوا، وهاد حلو";
  const sur=gs.filter(g=>g.j===0).sort((x,y)=>y.bet-x.bet)[0];
  const R=78,L=2*Math.PI*R,off=pct===null?L:L*(1-pct/100);
  stage.innerHTML=`<section class="end">
    <div class="score">
      <div class="ring"><svg viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r="${R}" fill="none" stroke="color-mix(in srgb,var(--paper-muted) 22%,transparent)" stroke-width="14"/>
        <circle id="arc" cx="90" cy="90" r="${R}" fill="none" stroke="var(--deep)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L}" style="transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)"/></svg>
        <div><strong>${pct===null?"–":pct+"٪"}</strong><span>مقياس التوافق</span></div></div>
      <h2>${title}</h2>
      <span style="color:var(--paper-muted);font-size:.9rem">${esc(A.n)} و${esc(B.n)}${G.safety?" · استخدمتوا بطاقة الأمان، وهاد بالضبط سببها":""}</span>
    </div>
    <div class="facts">
      <div><b>${G.answered}</b><span>بطاقة انفتحت</span></div>
      <div><b>${gs.filter(g=>g.j===2).length}/${gs.length}</b><span>توقّع صحيح</span></div>
      <div><b>${agree}/${G.who.length}</b><span>اتفقتوا بمين فيكم</span></div>
    </div>
    ${sur?`<div class="surprise"><h3>أكبر مفاجأة بالجلسة</h3><p>${esc(sur.q)}</p>
      <p><b>${esc(sur.who)}:</b> ${esc(sur.a)}<br><b>توقّع ${esc(sur.guesser)}:</b> ${esc(sur.b)}${sur.bet===3?" (ورهن عليها مية بالمية)":""}</p></div>`:""}
    ${G.promises.some(Boolean)?`<div class="promises"><h3>وعودكم لهالأسبوع</h3>
      ${[0,1].filter(k=>G.promises[k]).map(k=>`<div class="promise"><small>${esc(S.players[k].n)} لـ${esc(S.players[1-k].n)}</small>${esc(G.promises[k])}</div>`).join("")}
      <p class="note" style="text-align:start">صوّروا هالشاشة إذا بدكم تتذكروها. ما في شي محفوظ.</p></div>`:""}
    <button class="go" id="again">جلسة جديدة</button>
  </section>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const a=$("#arc");if(a)a.style.strokeDashoffset=off}));
  $("#again").onclick=renderSetup;window.scrollTo({top:0});
}

renderSetup();
