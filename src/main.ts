import '@fontsource-variable/manrope';
import './objects.css';
import './design.css';
import {renderPage} from './render';
import {initMotion} from './motion';
import {initHeader} from './header';
import {initContactForm,initLabTabs} from './interactions';
const path=location.pathname.replace(/\/$/,'')||'/';
const page=renderPage(path);
document.title=`${page.title} — ZERQON`;
document.body.id='top';
// Static production content is retained; dev and unknown routes render on the client.
if(document.querySelector('#main')?.getAttribute('data-route')!==path)document.querySelector('#app')!.innerHTML=page.html;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||new URLSearchParams(location.search).get('motion')==='off';
if(reduced)document.documentElement.classList.add('reduced-motion');
initMotion(reduced);
initHeader(reduced);
// Resolve initial hashes after the page exists, including on a direct mobile-menu entry.
if(location.hash){let anchor='';try{anchor=decodeURIComponent(location.hash.slice(1));}catch{anchor=location.hash.slice(1);}requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({behavior:'instant'}));}
initContactForm();
initLabTabs();
const saveData=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;
const viewport=matchMedia('(min-width:1001px)');
let sceneLoaded=false;
const tryScene=()=>{if(sceneLoaded||saveData||reduced||!viewport.matches||path!=='/'||new URLSearchParams(location.search).get('webgl')==='off')return;const container=document.querySelector('.hero .sculpture');if(container){sceneLoaded=true;const load=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){load.disconnect();import('./scene').then(m=>m.initScene(container)).catch(()=>{});}});load.observe(container);}};
tryScene();viewport.addEventListener('change',tryScene);

if(!saveData&&!reduced&&new URLSearchParams(location.search).get('webgl')!=='off'){
 const loadedProducts=new WeakSet<Element>();
 const defer=(work:()=>void)=>{if('requestIdleCallback' in window)window.requestIdleCallback(work,{timeout:2000});else setTimeout(work,120);};
 const products=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&viewport.matches&&!loadedProducts.has(entry.target)){loadedProducts.add(entry.target);products.unobserve(entry.target);defer(()=>{if(viewport.matches)import('./product-scene').then(m=>m.initProductScene(entry.target as HTMLElement)).catch(()=>{});else{loadedProducts.delete(entry.target);products.observe(entry.target);}});}}),{rootMargin:'900px'});
 const observeProducts=()=>document.querySelectorAll('.chain-composition,.assembly-visual').forEach(el=>{if(!loadedProducts.has(el))products.observe(el);});observeProducts();viewport.addEventListener('change',observeProducts);
}
