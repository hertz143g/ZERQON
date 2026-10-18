import {setHeroState} from './scene-state';
/** One passive controller publishes targets. Only the sculpture interpolates them. */
export function initMotion(reduced:boolean){
 document.querySelectorAll<HTMLElement>('.assembly-visual').forEach(el=>el.style.setProperty('--assembly-p','1'));
 document.querySelectorAll<HTMLElement>('.capital-network,.lab-visual,.division-art,.labs-section').forEach(el=>{el.style.setProperty('--network-p','1');el.style.setProperty('--lab-p','1');});
 if(reduced)return;
 document.documentElement.classList.add('motion-ready');
 const hero=document.querySelector<HTMLElement>('.hero');
 if(hero){let frame=0,x=0,y=0;const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:1001px)');
  const update=()=>{frame=0;const rect=hero.getBoundingClientRect(),progress=Math.max(0,Math.min(1,-rect.top/(rect.height*.85)));hero.style.setProperty('--hero-p',progress.toFixed(4));setHeroState({progress,x,y});};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const pointer=(event:PointerEvent)=>{if(!fine.matches||event.pointerType==='touch')return;const r=hero.getBoundingClientRect();x=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));y=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));schedule();};
  hero.addEventListener('pointermove',pointer,{passive:true});hero.addEventListener('pointerleave',()=>{x=0;y=0;schedule();});
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('pageshow',schedule);schedule();
 }
 const divisions=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('division-visible');divisions.unobserve(entry.target);}}),{threshold:.2});document.querySelectorAll('.division-card').forEach(el=>divisions.observe(el));
}
