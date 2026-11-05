window.addEventListener('load',()=>{const loader=document.querySelector('.loader');if(loader)loader.classList.add('hide')});

// Existing custom pointer (disabled on touch devices).
const cursor=document.querySelector('.cursor');
if(cursor){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});if(window.matchMedia('(pointer: coarse)').matches)cursor.hidden=true;}

// Existing scroll reveals.
const reveals=document.querySelectorAll('.reveal');
const revealIO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('active');revealIO.unobserve(e.target)}})},{threshold:.12});
reveals.forEach(r=>revealIO.observe(r));

// Existing count-up statistics.
const counters=document.querySelectorAll('[data-count]');
const countIO=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,end=Number(el.dataset.count);let current=0;const step=Math.max(1,Math.ceil(end/60));const timer=setInterval(()=>{current+=step;if(current>=end){current=end;clearInterval(timer)}el.textContent=current},25);countIO.unobserve(el)})});
counters.forEach(c=>countIO.observe(c));

// Existing project-card tilt interaction.
document.querySelectorAll('.card,.project').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();card.style.transform=`perspective(800px) rotateX(${-(e.clientY-r.top-r.height/2)/18}deg) rotateY(${(e.clientX-r.left-r.width/2)/18}deg) translateY(-10px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});

// Original Swarm-inspired cursor choreography: animate the hero on entry,
// then trigger a short cursor-build sequence when each section scrolls into view.
(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const layer=document.createElement('div');layer.className='swarm-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
  const labels=['SEO','KEYWORDS','CONTENT','ANALYTICS','STRATEGY','WEB','GROWTH','DESIGN','SEARCH','DIGITAL'];
  const colors=['#38bdf8','#a78bfa','#34d399','#fbbf24','#fb7185','#60a5fa'];
  let sequence=0;
  function build(section,initial=false){
    if(!section||document.hidden)return;
    const rect=section.getBoundingClientRect();
    const count=window.innerWidth<700?5:9;
    const visibleHeight=Math.min(rect.height,window.innerHeight);
    const batch=++sequence;
    for(let i=0;i<count;i++){
      const x=Math.max(18,Math.min(window.innerWidth-100,rect.left+Math.random()*Math.max(120,rect.width-100)));
      const y=Math.max(28,Math.min(window.innerHeight-38,rect.top+Math.random()*Math.max(80,visibleHeight-60)));
      const node=document.createElement('span');node.className='swarm-cursor';node.dataset.label=labels[(batch+i)%labels.length];
      node.style.setProperty('--swarm-color',colors[(batch+i)%colors.length]);
      node.style.setProperty('--sx',(Math.random()*window.innerWidth)+'px');node.style.setProperty('--sy',(Math.random()*window.innerHeight)+'px');
      node.style.setProperty('--tx',x+'px');node.style.setProperty('--ty',y+'px');
      node.style.setProperty('--travel',(initial?780:620+Math.random()*260)+'ms');
      node.style.transitionDelay=(i*34)+'ms';layer.appendChild(node);
      requestAnimationFrame(()=>requestAnimationFrame(()=>node.classList.add('is-moving')));
      window.setTimeout(()=>{node.classList.add('is-done');window.setTimeout(()=>node.remove(),480)},initial?1450:1250);
    }
    const scan=document.createElement('span');scan.className='swarm-scan';
    scan.style.top=Math.max(30,Math.min(window.innerHeight-30,rect.top+visibleHeight*.48))+'px';scan.style.left='50%';layer.appendChild(scan);
    requestAnimationFrame(()=>scan.classList.add('is-active'));
    window.setTimeout(()=>{scan.classList.remove('is-active');window.setTimeout(()=>scan.remove(),300)},initial?1050:900);
  }
  const hero=document.querySelector('.hero');
  if(hero)window.addEventListener('load',()=>window.setTimeout(()=>build(hero,true),420),{once:true});
  const sections=[...document.querySelectorAll('main > .section')].filter(section=>section!==hero);
  const seen=new WeakSet();
  const swarmIO=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!seen.has(entry.target)){seen.add(entry.target);build(entry.target,false)}})},{threshold:.28});
  sections.forEach(section=>swarmIO.observe(section));
})();
