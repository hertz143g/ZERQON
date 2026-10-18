export type HeroState={progress:number;x:number;y:number};
let state:HeroState={progress:0,x:0,y:0};
const listeners=new Set<(state:HeroState)=>void>();
export const getHeroState=()=>state;
export function setHeroState(next:HeroState){state=next;listeners.forEach(fn=>fn(state));}
export function subscribeHero(fn:(state:HeroState)=>void){listeners.add(fn);fn(state);return()=>listeners.delete(fn);}
