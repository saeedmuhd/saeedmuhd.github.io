/* Saeed Muhammad — site script.
   All text, talks, news and publications live in data.json. Edit them at /admin.html. */
{
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const page=document.body.dataset.page;
const PAGES=[['index.html','Home','home'],['research.html','Research','research'],['talks.html','Talks','talks'],['publications.html','Publications','publications'],['cv.html','CV','cv'],['contact.html','Contact','contact']];
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const pd=s=>{const [y,m,d]=String(s||'').split('-').map(Number);return new Date(y||1970,(m||1)-1,d||1)};
const ym=s=>{const [y,m]=String(s||'').split('-');return m?`${MON[+m-1]} ${y}`:(y||'')};
const fmt=(s,e)=>{if(!s)return'';if(/^\d{4}$/.test(s))return s;if(/^\d{4}-\d{2}$/.test(s))return ym(s)+(e?' – '+ym(e):'');const a=pd(s),b=e?pd(e):null;
  if(!b)return `${a.getDate()} ${MON[a.getMonth()]} ${a.getFullYear()}`;
  if(a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear())return `${a.getDate()}–${b.getDate()} ${MON[a.getMonth()]} ${a.getFullYear()}`;
  return `${a.getDate()} ${MON[a.getMonth()]}${a.getFullYear()!==b.getFullYear()?' '+a.getFullYear():''} – ${b.getDate()} ${MON[b.getMonth()]} ${b.getFullYear()}`};
const today=new Date();today.setHours(0,0,0,0);
const upcoming=t=>pd(t.end||t.date)>=today;

/* theme toggle */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
const themeIcon=()=>document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);

/* menu and footer (drawn before data loads) */
const nav=$('#nav');
let NAVL={};
const drawNav=name=>{if(!nav)return;
 nav.innerHTML=`<div class="in"><a class="brand" href="index.html"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.5" fill="none" stroke="#7fe6f7" stroke-width="1.4"/><circle cx="11" cy="11" r="5.5" fill="none" stroke="#8c98ff" stroke-width="1.4"/><circle cx="11" cy="11" r="2" fill="#fff"/></svg>${esc(name)}</a>
 <button class="tbtn" id="theme" aria-label="Switch light or dark theme" title="Light / dark">${themeIcon()?'☀':'☾'}</button>
 <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
 <div class="links">${PAGES.map(p=>`<a href="${p[0]}"${p[2]===page?' aria-current="page"':''}>${esc(NAVL[p[2]]||p[1])}</a>`).join('')}</div></div>`;
 const b=nav.querySelector('.burger');b.addEventListener('click',()=>{const o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 const t=$('#theme');t.addEventListener('click',()=>{setTheme(themeIcon()?'light':'dark');t.textContent=themeIcon()?'☀':'☾';redraw.forEach(f=>f())});
};
drawNav('Saeed Muhammad');
const redraw=[];

/* icons for research cards */
const IC={
 cs:'<svg class="ic" viewBox="0 0 64 64"><line x1="6" y1="32" x2="58" y2="32" stroke="var(--rule)" stroke-width="2"/><line x1="18" y1="32" x2="56" y2="12" stroke="var(--acc)" stroke-width="2.5"/><circle cx="44" cy="18.5" r="4" fill="var(--acc2)"/><circle cx="18" cy="32" r="3" fill="var(--ink)"/></svg>',
 pe:'<svg class="ic" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--cy)" stroke-width="2"/><circle cx="32" cy="32" r="17" fill="none" stroke="var(--acc)" stroke-width="2.5"/><circle cx="32" cy="32" r="8" fill="none" stroke="var(--acc)" stroke-width="2"/></svg>',
 fa:'<svg class="ic" viewBox="0 0 64 64"><path d="M4 44 C20 44 24 42 28 50 C31 56 34 8 38 10 C42 12 44 40 60 40" fill="none" stroke="var(--acc)" stroke-width="2.6"/><line x1="4" y1="56" x2="60" y2="56" stroke="var(--rule)" stroke-width="2"/></svg>',
 wf:'<svg class="ic" viewBox="0 0 64 64"><path d="M6 54 C14 54 16 10 24 10 C30 10 32 30 40 40 C46 47 52 50 58 51" fill="none" stroke="var(--acc)" stroke-width="2.6"/><path d="M40 40 q3 -4 6 0 t6 0 t6 0" fill="none" stroke="var(--acc2)" stroke-width="2"/></svg>',
 al:'<svg class="ic" viewBox="0 0 64 64"><path d="M4 50 H18 V10 C30 18 40 30 60 36" fill="none" stroke="var(--ink)" stroke-width="2.4"/><line x1="4" y1="38" x2="60" y2="38" stroke="var(--mut)" stroke-dasharray="3 3"/><circle cx="11" cy="38" r="4" fill="var(--acc2)"/></svg>',
 at:'<svg class="ic" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="var(--acc)" stroke-width="2"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="var(--cy)" stroke-width="2" transform="rotate(60 32 32)"/><circle cx="32" cy="32" r="4" fill="var(--acc2)"/></svg>'
};
const kindCls=k=>({Talk:' tk','Invited talk':' tk',Poster:' p',Milestone:' ms',Attended:' ms'}[k]||'');

function applySite(S){
 if(!S)return;
 const C=S.colors||{},r=document.documentElement.style;
 if(C.accent)r.setProperty('--acc',`light-dark(${C.accent},${C.accentDark||C.accent})`);
 if(C.highlight)r.setProperty('--acc2',C.highlight);
 if(C.header)r.setProperty('--deep',C.header);
 NAVL=S.nav||{};
 const pg=(S.pages||{})[page];
 if(pg){const h=$('.ph h1'),p=$('.ph p');if(h&&pg.title&&page!=='cv')h.textContent=pg.title;if(p&&page!=='cv'){if(pg.subtitle)p.textContent=pg.subtitle;else p.remove()}document.title=`${pg.title||document.title.split(' — ')[0]} — ${document.title.split(' — ').pop()}`}
 const H=S.hero||{},b1=$('.hero .btn.p'),b2=$('.hero .btn.s'),cap=$('.hero .cap');
 if(b1&&H.button1)b1.textContent=H.button1;if(b2&&H.button2)b2.textContent=H.button2;if(cap&&H.caption!==undefined){cap.textContent=H.caption;cap.hidden=!H.caption}
 const sh=S.show||{};
 if(sh.demos===false){const d=$('#demos');if(d)d.remove()}
 if(sh.news===false){const d=$('#newsBox');if(d)d.remove()}
 if(sh.countdown===false){const d=$('#next');if(d)d.remove()}
 if(sh.heroMap===false){const f=$('.hero .fig');if(f)f.remove();const h=$('.hero');if(h)h.style.gridTemplateColumns='minmax(0,1fr)'}
 if(S.description){const m=document.querySelector('meta[name=description]');if(m&&page==='home')m.content=S.description}
}
function render(D){
 applySite(D.site);
 const P=D.profile||{},T=(D.talks||[]).slice().sort((a,b)=>pd(b.date)-pd(a.date)),N=(D.news||[]).slice().sort((a,b)=>pd(b.date)-pd(a.date));
 drawNav(P.name||'Saeed Muhammad');
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.innerHTML=v};
 const foot=$('#foot');
 if(foot)foot.innerHTML=`<div class="wrap"><span>© ${new Date().getFullYear()} ${esc(P.name)} · ${esc((D.site&&D.site.footer)||P.group)}</span><span><a href="contact.html">Contact</a> · <a href="https://github.com/saeedmuhd/saeedmuhd.github.io">Source</a></span></div>`;

 /* home */
 if(page==='home'){
  set('hName',esc(P.name).replace(' ','<br>'));
  set('hRole',esc(P.role));
  set('hAff',`${esc(P.position)} · <a href="${esc(P.groupUrl)}">${esc(P.group)}</a><br>${esc(P.university)}`);
  const f=(P.focus||[]).length?P.focus:['physics'];
  set('rot',`${esc(P.intro)} Current focus: <b>${esc(f[0])}</b>`);
  const rb=$('#rot b');let i=0;
  if(rb&&!reduce&&f.length>1)setInterval(()=>{rb.style.opacity=0;setTimeout(()=>{i=(i+1)%f.length;rb.textContent=f[i];rb.style.opacity=1},350)},2600);
  if(P.cv)set('cvBtn',`<a class="btn s" href="${esc(P.cv)}">Download CV</a>`);
  if(P.photo){const ph=$('#photo');if(ph){ph.innerHTML=`<img src="${esc(P.photo)}" alt="Portrait of ${esc(P.name)}">`;ph.hidden=false}}
  /* Next/latest card: an upcoming talk shows a countdown; once its last day has passed
     it turns into "Latest talk" automatically. Talks and posters are preferred over
     workshop attendance. */
  const PRES=['Talk','Invited talk','Poster'];
  const rank=t=>PRES.includes(t.kind)?0:t.kind==='Milestone'?2:1;
  const fut=T.filter(upcoming).sort((a,b)=>rank(a)-rank(b)||pd(a.date)-pd(b.date));
  const up=fut.find(t=>rank(t)===0)||fut.find(t=>rank(t)===1);
  const lname=k=>k==='Participant'||k==='Attended'?'workshop':k.toLowerCase();
  const ago=d=>{const n=Math.round((today-d)/864e5);return n<=0?'Today':n===1?'Yesterday':n<14?`${n} days ago`:n<60?`${Math.round(n/7)} weeks ago`:n<730?`${Math.round(n/30.4)} months ago`:`${Math.round(n/365)} years ago`};
  const card=(lbl,big,t,link)=>`<span class="lbl">${lbl}</span>${big?`<span class="count">${big}</span>`:''}<h3>${esc(t.title)}</h3><p>${esc(t.event.split(' — ')[0])} · ${fmt(t.date,t.end)}<br>${esc(t.place)}</p>${link}`;
  if(up){const start=pd(up.date),end=pd(up.end||up.date),days=Math.round((start-today)/864e5);
   const big=today>=start&&today<=end?(up.end&&up.end!==up.date?'Happening now':'Today'):days===1?'Tomorrow':`in ${days} days`;
   set('next',card(`Next ${esc(lname(up.kind))}`,big,up,up.url?`<a class="go" href="${esc(up.url)}">Event page →</a>`:`<a class="go" href="talks.html">All talks →</a>`));
  }else{const past=T.filter(t=>!upcoming(t)&&t.kind!=='Milestone').sort((a,b)=>rank(a)-rank(b)||pd(b.end||b.date)-pd(a.end||a.date));
   const l=past[0];if(l)set('next',card(`Latest ${esc(lname(l.kind))}`,ago(pd(l.end||l.date)),l,`<a class="go" href="talks.html">All talks →</a>`))}
  set('news',N.slice(0,4).map(n=>`<li><time>${MON[pd(n.date).getMonth()]} ${pd(n.date).getFullYear()}</time><span>${n.link?`<a href="${esc(n.link)}">${esc(n.text)}</a>`:esc(n.text)}</span></li>`).join(''));
  set('nTalks',T.filter(t=>t.kind!=='Milestone').length);
  set('nProj',(D.projects||[]).length);
  set('nPubs',(D.pubs||[]).length);
  set('about',(P.about||[]).map(p=>`<p>${esc(p)}</p>`).join(''));
  set('facts',(P.facts||[]).map(x=>`<div><dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd></div>`).join(''));
 }

 /* research */
 if(page==='research')set('cards',(D.projects||[]).map(c=>`<article class="card">${IC[c.icon]||IC.at}<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><div class="tags">${(c.tags||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></article>`).join(''));

 /* talks */
 if(page==='talks'){
  const kinds=['All',...new Set(T.map(t=>t.kind))];let cur='All';const fl=$('#filters');
  const draw=()=>{const r=T.filter(t=>cur==='All'||t.kind===cur);let lastY=null;
   set('talks',r.length?r.map((t,i)=>{const y=pd(t.date).getFullYear(),head=y!==lastY;lastY=y;
    return `<li style="animation-delay:${i*35}ms"><span class="y">${head?y:''}</span><div><b>${t.url?`<a href="${esc(t.url)}">${esc(t.title)}</a>`:esc(t.title)}</b><span class="kind${kindCls(t.kind)}">${esc(t.kind)}</span>${upcoming(t)?'<span class="kind up">Upcoming</span>':''}<p>${esc(t.event)}<br>${esc(t.place)} · ${fmt(t.date,t.end)}</p></div></li>`}).join(''):'<li class="empty">Nothing here yet.</li>')};
  fl.innerHTML=kinds.map(k=>`<button class="chip" aria-pressed="${k===cur}">${esc(k)}</button>`).join('');
  fl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=b.textContent;fl.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});
  draw();
 }

 /* publications */
 if(page==='publications'){
  const pubs=(D.pubs||[]).slice().sort((a,b)=>(b.year||0)-(a.year||0)),s=$('#q');
  const bib=p=>`@article{${(p.authors||'author').split(/[ ,]/).filter(Boolean).pop()}${p.year||''},\n  title={${p.title}},\n  author={${p.authors}},\n  journal={${p.journal}},\n  year={${p.year}}${p.doi?`,\n  doi={${p.doi}}`:''}\n}`;
  const draw=()=>{const k=(s.value||'').toLowerCase();const r=pubs.filter(p=>!k||Object.values(p).join(' ').toLowerCase().includes(k));
   set('pubs',r.length?r.map((p,i)=>`<li><span class="y">${esc(p.year)}</span><div><b>${p.url||p.doi?`<a href="${esc(p.url||'https://doi.org/'+p.doi)}">${esc(p.title)}</a>`:esc(p.title)}</b>${p.status?`<span class="kind">${esc(p.status)}</span>`:''}<p>${esc(p.authors)}. <i>${esc(p.journal)}</i></p><button class="mini" data-i="${pubs.indexOf(p)}">Copy BibTeX</button></div></li>`).join(''):`<li class="empty">${pubs.length?'No matching entries.':'Publications will appear here as they are published.'}</li>`)};
  s.addEventListener('input',draw);draw();
  $('#pubs').addEventListener('click',async e=>{const b=e.target.closest('.mini');if(!b)return;try{await navigator.clipboard.writeText(bib(pubs[+b.dataset.i]));b.textContent='Copied'}catch(_){b.textContent='Copy failed'}setTimeout(()=>b.textContent='Copy BibTeX',1600)});
  const prof=(P.links||[]).filter(l=>l.url&&/orcid|scholar|arxiv/i.test(l.url));
  if(prof.length)set('profiles','Also on '+prof.map(l=>`<a href="${esc(l.url)}">${esc(l.label)}</a>`).join(' · '));
 }

 /* contact */
 if(page==='contact'){
  set('clinks',`<a href="mailto:${esc(P.email)}">Email<span>${esc(P.email)}</span></a>`+(P.links||[]).filter(l=>l.url).map(l=>`<a href="${esc(l.url)}">${esc(l.label)}<span>${esc(l.text||l.url)}</span></a>`).join(''));
  set('addr',`${esc(P.department)}<br>${esc(P.address)}`);
  const cb=$('#copyEmail');if(cb)cb.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(P.email);cb.textContent='Email copied'}catch(_){cb.textContent=P.email}setTimeout(()=>cb.textContent='Copy email',1800)});
 }

 /* CV page */
 if(page==='cv'){
  const per=(a,b)=>`${ym(a)} – ${b?ym(b):'present'}`;
  set('cvHead',`<h1>${esc(P.name)}</h1><p>${esc(P.position)}, ${esc(P.group)}<br>${esc(P.department)}<br>${esc(P.email)} · saeedmuhd.github.io</p>`);
  if(P.cv)set('cvDl',`<a class="btn p" href="${esc(P.cv)}" download>Download PDF</a>`);
  const sec=(t,h)=>h?`<section class="cvs"><h2>${t}</h2>${h}</section>`:'';
  const row=(l,b,d)=>`<div class="cvr"><span class="cvl">${l}</span><div>${b}${d?`<p>${d}</p>`:''}</div></div>`;
  const talks=T.filter(t=>['Talk','Invited talk','Poster'].includes(t.kind)),att=T.filter(t=>t.kind==='Attended'||(t.kind==='Participant'));
  set('cvBody',
   sec('Research interests',`<p class="cvp">${esc((P.focus||[]).join(' · '))}</p>`)+
   sec('Education',(D.education||[]).map(e=>row(per(e.from,e.to),`<b>${esc(e.degree)}</b>, ${esc(e.place)}<br><span class="cvf">${esc(e.field)}</span>`,esc(e.detail))).join(''))+
   sec('Research and teaching experience',(D.experience||[]).map(e=>row(per(e.from,e.to),`<b>${esc(e.role)}</b>, ${esc(e.org)}`,esc(e.detail))).join(''))+
   sec('Publications',(D.pubs||[]).map(p=>row(esc(p.year),`<b>${esc(p.title)}</b>`,`${esc(p.authors)}. <i>${esc(p.journal)}</i>${p.status?` (${esc(p.status)})`:''}`)).join(''))+
   sec('Talks and posters',talks.map(t=>row(fmt(t.date,t.end),`<b>${esc(t.title)}</b> <span class="kind${kindCls(t.kind)}">${esc(t.kind)}</span>`,`${esc(t.event.split(' — ')[0])}, ${esc(t.place.split(' · ')[0])}`)).join(''))+
   sec('Workshops and conferences attended',att.map(t=>row(fmt(t.date,t.end),esc(t.title),`${esc(t.place.split(' · ')[0])}`)).join(''))+
   sec('Honors and awards',(D.honors||[]).map(h=>row(esc(h.year),esc(h.text))).join(''))+
   sec('Skills',`<p class="cvp">${esc((D.skills||[]).join(' · '))}</p>`)+
   sec('Languages',`<p class="cvp">${(D.languages||[]).map(l=>`${esc(l.k)} (${esc(l.v.toLowerCase())})`).join(' · ')}</p>`));
 }
}

fetch('data.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(render).catch(()=>{
 const m=$('main');if(m)m.insertAdjacentHTML('afterbegin','<div class="band"><div class="wrap note">Content could not be loaded. If you opened this file directly from your computer, use VS Code Live Server or view the site online.</div></div>');
});

/* momentum-map animation (home hero and page headers) */
const stops=[[10,15,51],[30,45,170],[39,65,255],[34,211,238],[255,255,255]];
const cmap=v=>{v=Math.max(0,Math.min(1,v))*(stops.length-1);const i=Math.min(stops.length-2,Math.floor(v)),f=v-i,a=stops[i],b=stops[i+1];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]};
document.querySelectorAll('canvas.map').forEach(cv=>{
 const cx=cv.getContext('2d'),off=document.createElement('canvas'),oc=off.getContext('2d');let img=null,ow=0,oh=0,vis=true;
 const size=()=>{const W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;cv.width=W;cv.height=H;ow=Math.max(80,Math.round(W/3));oh=Math.max(50,Math.round(H/3));off.width=ow;off.height=oh;img=oc.createImageData(ow,oh)};
 const draw=t=>{if(!img)return;const d=img.data,s=Math.min(ow,oh)*.4,c0=ow/2,c1=oh/2;
  for(let y=0;y<oh;y++)for(let x=0;x<ow;x++){const kx=(x-c0)/s,ky=(y-c1)/s,k=Math.hypot(kx,ky),cp=k?kx/k:1;
   let r=0;for(let n=1;n<=5;n++){const kn=.17+.15*n+.006*Math.sin(t*.6+n);r+=Math.exp(-(((k-kn)/.034)**2))*Math.exp(-.35*n)}
   const fr=.55+.45*Math.cos(78*k*(1-cp*cp)-t*.9),core=Math.exp(-(kx*kx/.05+ky*ky/.012));
   const v=Math.pow((r*(.25+.75*cp*cp)*fr*1.1+core*.9)*Math.exp(-k*.9),.7),c=cmap(v),i=(y*ow+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}
  oc.putImageData(img,0,0);cx.drawImage(off,0,0,cv.width,cv.height)};
 const ro=new ResizeObserver(()=>{size();draw(performance.now()/1000)});ro.observe(cv);
 const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(cv);
 if(!reduce){let last=0;const loop=n=>{if(vis&&!document.hidden&&n-last>45){draw(n/1000);last=n}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
});

/* Fano profile demo */
const f2=$('#f2');
if(f2){
 const qi=$('#q2'),qv=$('#qv');
 const draw2=()=>{const q=+qi.value;qv.textContent=q.toFixed(1);const W=f2.clientWidth,H=f2.clientHeight;if(!W||!H)return;
  const L=40,Rm=14,T=18,B=40,e0=-10,e1=10,ymax=Math.max(2,1+q*q)*1.1,X=e=>L+(e-e0)/(e1-e0)*(W-L-Rm),Y=v=>T+(1-v/ymax)*(H-T-B);
  let p='',lz='';for(let i=0;i<=400;i++){const e=e0+(e1-e0)*i/400,sv=(q+e)**2/(1+e*e),l=(1+q*q)/(1+(e-1/(q||1e-9))**2);
   p+=(i?'L':'M')+X(e).toFixed(1)+' '+Y(sv).toFixed(1);lz+=(i?'L':'M')+X(e).toFixed(1)+' '+Y(Math.min(l,ymax)).toFixed(1)}
  const step=ymax>20?10:ymax>8?5:ymax>4?2:1;let tk='';
  for(let v=0;v<=ymax;v+=step)tk+=`<line x1="${L}" y1="${Y(v)}" x2="${W-Rm}" y2="${Y(v)}" stroke="${css('--rule')}"/><text x="${L-8}" y="${Y(v)+5}" text-anchor="end">${v}</text>`;
  (W<420?[-10,0,10]:[-10,-5,0,5,10]).forEach(e=>tk+=`<text x="${X(e)}" y="${H-B+22}" text-anchor="middle">${e}</text>`);
  const mx=q?1/q:null;
  f2.innerHTML=`${tk}<line x1="${L}" y1="${H-B}" x2="${W-Rm}" y2="${H-B}" stroke="${css('--mut')}"/>${q?`<path d="${lz}" fill="none" stroke="${css('--mut')}" stroke-dasharray="5 5" stroke-width="1.4"/>`:''}<path d="${p}" fill="none" stroke="${css('--acc')}" stroke-width="2.6"/>${-q>=e0&&-q<=e1?`<circle cx="${X(-q)}" cy="${Y(0)}" r="4.5" fill="${css('--acc2')}"/>`:''}${mx!==null&&mx>=e0&&mx<=e1?`<circle cx="${X(mx)}" cy="${Y(1+q*q)}" r="4.5" fill="${css('--acc')}"/>`:''}<text class="math" x="${W-Rm}" y="${H-6}" text-anchor="end">ε</text><text class="math" x="${L+8}" y="${T+16}">σ</text>`};
 qi.addEventListener('input',draw2);const ro2=new ResizeObserver(draw2);ro2.observe(f2);redraw.push(draw2);
}

/* alpha-decay tunnelling demo */
const f1=$('#f1');
if(f1){
 const lb=$('#laser');let laser=false;
 const R=.2,C=.75,Q=1,rt=C/Q,V0=-1.3,vmax=3.4,vmin=-1.6;
 const draw1=t=>{const W=f1.clientWidth,H=f1.clientHeight;if(!W||!H)return;const L=36,Rm=14,T=18,B=36,small=W<440;
  const X=r=>L+r*(W-L-Rm),Y=v=>T+(vmax-v)/(vmax-vmin)*(H-T-B),F=laser?.55*Math.cos(t*2.2):0,V=r=>(r<R?V0:C/r)+F*(r-R);
  let pv='';for(let i=0;i<=400;i++){const r=i/400;pv+=(i?'L':'M')+X(r).toFixed(1)+' '+Y(Math.min(V(r),vmax)).toFixed(1)}
  const k=Math.PI*2.5/R,ks=Math.sin(k*R),amp=.7,w=t*3;let pw='';
  for(let i=0;i<=500;i++){const r=i/500;let y;if(r<R)y=amp*Math.sin(k*r)*Math.cos(w);else if(r<rt)y=amp*ks*Math.cos(w)*Math.exp(-9*(r-R));else y=amp*ks*Math.exp(-9*(rt-R))*Math.sin(30*(r-rt)-w)*1.4*(laser?1.6:1);pw+=(i?'L':'M')+X(r).toFixed(1)+' '+Y(Q+y).toFixed(1)}
  const acc=css('--acc'),mut=css('--mut'),xt=X(rt),xR=X(R);
  f1.innerHTML=`<line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="${mut}"/><line x1="${L}" y1="${H-B}" x2="${W-Rm}" y2="${H-B}" stroke="${mut}"/><rect x="${xR}" y="${Y(vmax)}" width="${Math.max(0,xt-xR)}" height="${Y(Q)-Y(vmax)}" fill="${acc}" opacity=".08"/><line x1="${L}" y1="${Y(Q)}" x2="${W-Rm}" y2="${Y(Q)}" stroke="${mut}" stroke-dasharray="4 5"/><path d="${pv}" fill="none" stroke="${css('--ink')}" stroke-width="2.4" stroke-linejoin="round"/><path d="${pw}" fill="none" stroke="${css('--acc2')}" stroke-width="2.2"/><text class="math" x="${xR}" y="${H-B+22}" text-anchor="middle">R</text><text class="math" x="${xt}" y="${H-B+22}" text-anchor="middle">r<tspan dy="4" font-size="12">t</tspan></text><text class="math" x="${W-Rm-2}" y="${H-B+22}" text-anchor="end">r</text><text class="math" x="${L-8}" y="${Y(Q)+5}" text-anchor="end">Q</text>${small?'':`<text x="${(xR+xt)/2}" y="${Y(vmax)+18}" text-anchor="middle">Coulomb barrier</text><text x="${X((rt+1)/2)}" y="${Y(Q)-40}" text-anchor="middle">escaping α</text>`}${laser?`<text x="${W-Rm-4}" y="${T+14}" text-anchor="end" fill="${acc}">laser on</text>`:''}`};
 lb.addEventListener('click',()=>{laser=!laser;lb.setAttribute('aria-pressed',laser);lb.textContent='Laser field: '+(laser?'on':'off');if(reduce)draw1(0)});
 const ro1=new ResizeObserver(()=>draw1(performance.now()/1000));ro1.observe(f1);redraw.push(()=>draw1(performance.now()/1000));
 if(!reduce){const lp=n=>{draw1(n/1000);requestAnimationFrame(lp)};requestAnimationFrame(lp)}
}
}
