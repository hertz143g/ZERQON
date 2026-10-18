export function initHeader(_reduced:boolean){
 const header=document.querySelector<HTMLElement>('.site-header')!;
 const nav=header.querySelector<HTMLElement>('.primary-nav')!;
 const marker=nav.querySelector<HTMLElement>('.nav-indicator')!;
 const links=Array.from(nav.querySelectorAll<HTMLAnchorElement>('.nav-item'));
 const path=location.pathname.replace(/\/$/,'')||'/';
 let active:HTMLAnchorElement|undefined;
 const routeKey=path==='/about'?'company':path.startsWith('/companies')?'companies':['/labs','/ventures','/technologies'].includes(path)?'directions':path==='/contact'?'contact':undefined;
 let markerKey='';
 const place=(link?:HTMLAnchorElement)=>{
  if(!link||nav.getBoundingClientRect().width===0){marker.style.opacity='0';markerKey='';return;}
  const rect=link.getBoundingClientRect(),parent=nav.getBoundingClientRect();
  const key=`${link.dataset.nav}:${Math.round(rect.left-parent.left)}:${Math.round(rect.width)}`;
  if(key===markerKey)return;markerKey=key;
  marker.style.opacity='1';marker.style.left=`${rect.left-parent.left}px`;marker.style.width=`${rect.width}px`;
 };
 const setActive=(key?:string)=>{
  const next=links.find(link=>link.dataset.nav===key);
  if(active===next)return;active=next;
  links.forEach(link=>{if(link===next)link.setAttribute('aria-current',path==='/'?'location':'page');else link.removeAttribute('aria-current');});place(active);
 };
 setActive(routeKey);
 links.forEach(link=>{link.addEventListener('pointerenter',()=>place(link));link.addEventListener('focus',()=>place(link));});nav.addEventListener('pointerleave',()=>place(active));nav.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!nav.contains(document.activeElement))place(active);}));
 let frame=0;const update=()=>{frame=0;header.classList.toggle('scrolled',scrollY>24);if(path==='/'){let key: string|undefined;for(const [id,value] of [['about','company'],['ecosystem','companies'],['directions','directions'],['founders','founders'],['conversation','contact']]){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.36)key=value;}setActive(key);}place(active);};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('pageshow',schedule);document.fonts.ready.then(schedule);schedule();
 const group=header.querySelector<HTMLElement>('.nav-division-group')!;
 const toggle=group.querySelector<HTMLButtonElement>('.division-toggle')!;
 const dropdown=group.querySelector<HTMLElement>('.division-dropdown')!;
 const setDropdown=(open:boolean)=>{dropdown.hidden=!open;toggle.setAttribute('aria-expanded',String(open));};
 toggle.onclick=()=>setDropdown(dropdown.hidden);
 group.querySelector('.nav-item')!.addEventListener('pointerenter',event=>{if((event as PointerEvent).pointerType!=='touch')setDropdown(true);});
 group.addEventListener('pointerleave',()=>{if(!group.contains(document.activeElement))setDropdown(false);});
 group.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!group.contains(document.activeElement))setDropdown(false);}));
 group.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dropdown.hidden){event.preventDefault();setDropdown(false);toggle.focus();}});
 document.addEventListener('pointerdown',event=>{if(!group.contains(event.target as Node))setDropdown(false);});
 const menu=document.querySelector<HTMLDialogElement>('#mobile-menu')!;
 const menuToggle=header.querySelector<HTMLButtonElement>('.menu-toggle')!;
 let previousOverflow='';
 const restore=()=>{menuToggle.setAttribute('aria-expanded','false');document.body.style.overflow=previousOverflow;menuToggle.focus({preventScroll:true});};
 const close=()=>{if(menu.open)menu.close();};
 menuToggle.onclick=()=>{if(menu.open)return;previousOverflow=document.body.style.overflow;menu.showModal();menuToggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';};
 menu.querySelector<HTMLButtonElement>('.close-menu')!.onclick=close;
 menu.addEventListener('cancel',event=>{event.preventDefault();close();});menu.addEventListener('close',restore);
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
}
