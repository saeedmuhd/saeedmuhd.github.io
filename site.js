/* Saeed Muhammad — shared script: menu, data, animations, interactive figures.
   To add a talk or a paper, edit the TALKS or PUBS lists below. */
{
const TALKS=[
 {y:2025,k:'Participant',t:'IWTAQD 30',w:'International Workshop on Theory for Attosecond Quantum Dynamics, UEC Tokyo · 25 Oct – 11 Nov 2025'},
 {y:2025,k:'Poster',t:'Tunneling ionization of doubly excited states of helium',w:'IWTAQD 29, University of Toyama · 4 Feb 2025'},
 {y:2024,k:'Poster',t:'Interim poster presentation',w:'Doctoral program interim review, UEC Tokyo · 10 Sep 2024'},
 {y:2024,k:'Participant',t:'IWTAQD 28',w:'UEC Tokyo · 23–31 Jan 2024'},
 {y:2023,k:'Participant',t:'IWTAQD 27',w:'UEC Tokyo · 19–20 Apr 2023'},
 {y:2023,k:'Participant',t:'IWTAQD 26',w:'UEC Tokyo · 28–29 Mar 2023'},
 {y:2022,k:'Milestone',t:'Joined the Morishita group',w:'Institute for Advanced Science, UEC Tokyo · Oct 2022'}
];
/* Placeholders: replace with your papers. Fields: y year, t title, a authors, j journal, u link (optional) */
const PUBS=[
 {y:'Year',t:'Placeholder: doubly excited states of helium in strong fields',a:'S. Muhammad and coauthors',j:'Journal name'},
 {y:'Year',t:'Placeholder: laser-assisted α decay',a:'S. Muhammad and coauthors',j:'Journal name'}
];
const PAGES=[['index.html','Home','home'],['research.html','Research','research'],['talks.html','Talks','talks'],['publications.html','Publications','publications'],['contact.html','Contact','contact']];

const $=s=>document.querySelector(s);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const page=document.body.dataset.page;

/* menu and footer */
const nav=$('#nav');
if(nav){
 nav.innerHTML=`<div class="in"><a class="brand" href="index.html"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.5" fill="none" stroke="#7fe6f7" stroke-width="1.4"/><circle cx="11" cy="11" r="5.5" fill="none" stroke="#8c98ff" stroke-width="1.4"/><circle cx="11" cy="11" r="2" fill="#fff"/></svg>Saeed Muhammad</a>
 <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
 <div class="links">${PAGES.map(p=>`<a href="${p[0]}"${p[2]===page?' aria-current="page"':''}>${p[1]}</a>`).join('')}</div></div>`;
 const b=nav.querySelector('.burger');
 b.addEventListener('click',()=>{const o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
}
const foot=$('#foot');
if(foot)foot.innerHTML=`<div class="wrap"><span>© ${new Date().getFullYear()} Saeed Muhammad · Morishita group, UEC Tokyo</span><span><a href="contact.html">Contact</a></span></div>`;

/* home: rotating topic and latest items */
const rot=$('#rot');
if(rot){
 const topics=['doubly excited helium','resonances in static fields','strong-field ionization','tunnelling theory (WFAT)','laser-assisted α decay'];
 let i=0;const b=rot.querySelector('b');
 if(!reduce)setInterval(()=>{b.style.opacity=0;setTimeout(()=>{i=(i+1)%topics.length;b.textContent=topics[i];b.style.opacity=1},350)},2600);
}
const nTalks=$('#nTalks');if(nTalks)nTalks.textContent=TALKS.filter(t=>t.k!=='Milestone').length;
const latest=$('#latest');if(latest){const t=TALKS.find(t=>t.k==='Poster');latest.textContent=`Latest: “${t.t}”, ${t.w.split(' · ')[0]}`}

/* talks page with filters */
const tl=$('#talks');
if(tl){
 const kinds=['All','Poster','Participant'];let cur='All';
 const f=$('#filters');
 const render=()=>{const r=TALKS.filter(t=>cur==='All'||t.k===cur);
  tl.innerHTML=r.map((t,i)=>`<li style="animation-delay:${i*40}ms"><span class="y">${t.y}</span><div><b>${esc(t.t)}</b><span class="kind${t.k==='Poster'?' p':''}">${t.k}</span><p>${esc(t.w)}</p></div></li>`).join('')};
 f.innerHTML=kinds.map(k=>`<button class="chip" aria-pressed="${k===cur}">${k}</button>`).join('');
 f.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=b.textContent;f.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));render()});
 render();
}

/* publications page with search */
const pl=$('#pubs');
if(pl){
 const s=$('#q');
 const render=()=>{const k=(s.value||'').toLowerCase();const r=PUBS.filter(p=>!k||Object.values(p).join(' ').toLowerCase().includes(k));
  pl.innerHTML=r.length?r.map(p=>`<li><span class="y">${esc(p.y)}</span><div><b>${p.u?`<a href="${esc(p.u)}">${esc(p.t)}</a>`:esc(p.t)}</b><p>${esc(p.a)}. <i>${esc(p.j)}</i></p></div></li>`).join(''):'<li class="empty">No matching entries.</li>'};
 s.addEventListener('input',render);render();
}

/* momentum-map animation, used on the home hero and page headers */
const stops=[[10,15,51],[30,45,170],[39,65,255],[34,211,238],[255,255,255]];
const cmap=v=>{v=Math.max(0,Math.min(1,v))*(stops.length-1);const i=Math.min(stops.length-2,Math.floor(v)),f=v-i,a=stops[i],b=stops[i+1];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]};
document.querySelectorAll('canvas.map').forEach(cv=>{
 const cx=cv.getContext('2d'),off=document.createElement('canvas'),oc=off.getContext('2d');let img=null,ow=0,oh=0;
 const size=()=>{const W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;cv.width=W;cv.height=H;ow=Math.max(80,Math.round(W/3));oh=Math.max(50,Math.round(H/3));off.width=ow;off.height=oh;img=oc.createImageData(ow,oh)};
 const draw=t=>{if(!img)return;const d=img.data,s=Math.min(ow,oh)*.4,c0=ow/2,c1=oh/2;
  for(let y=0;y<oh;y++)for(let x=0;x<ow;x++){const kx=(x-c0)/s,ky=(y-c1)/s,k=Math.hypot(kx,ky),cp=k?kx/k:1;
   let r=0;for(let n=1;n<=5;n++){const kn=.17+.15*n+.006*Math.sin(t*.6+n);r+=Math.exp(-(((k-kn)/.034)**2))*Math.exp(-.35*n)}
   const fr=.55+.45*Math.cos(78*k*(1-cp*cp)-t*.9),core=Math.exp(-(kx*kx/.05+ky*ky/.012));
   const v=Math.pow((r*(.25+.75*cp*cp)*fr*1.1+core*.9)*Math.exp(-k*.9),.7),c=cmap(v),i=(y*ow+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}
  oc.putImageData(img,0,0);cx.drawImage(off,0,0,cv.width,cv.height)};
 const ro=new ResizeObserver(()=>{size();draw(performance.now()/1000)});ro.observe(cv);
 if(!reduce){let last=0;const loop=n=>{if(n-last>45){draw(n/1000);last=n}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
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
 qi.addEventListener('input',draw2);const ro2=new ResizeObserver(draw2);ro2.observe(f2);
 const mo=new MutationObserver(draw2);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
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
 const ro1=new ResizeObserver(()=>draw1(performance.now()/1000));ro1.observe(f1);
 if(!reduce){const lp=n=>{draw1(n/1000);requestAnimationFrame(lp)};requestAnimationFrame(lp)}
}
}
