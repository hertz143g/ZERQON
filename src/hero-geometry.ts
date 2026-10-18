/** Original machined Q: four rounded corner modules and a removable diagonal bridge. */
const corner:number[][]=[[.025,1.95],[1.25,1.95]];
for(let i=1;i<=32;i++){const angle=Math.PI/2-i*Math.PI/64;corner.push([1.25+.7*Math.cos(angle),1.25+.7*Math.sin(angle)]);}
corner.push([1.95,.025],[1.2,.025],[1.2,.85]);
for(let i=1;i<=24;i++){const angle=i*Math.PI/48;corner.push([.85+.35*Math.cos(angle),.85+.35*Math.sin(angle)]);}
corner.push([.025,1.2]);
export const qSegments=Array.from({length:4},(_,i)=>corner.map(([x,y])=>{const a=i*Math.PI/2;return [x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];}));
export const qOffsets=[[.009,.009,0],[-.009,.009,0],[-.009,-.009,0],[.009,-.009,0]];
export const qRest={rotation:[.12,-.48,-.22],scale:.92,camera:[0,.36,12.2]};
