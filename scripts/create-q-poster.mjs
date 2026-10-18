import * as THREE from 'three';
import {writeFile} from 'node:fs/promises';
import {qSegments,qOffsets,qRest} from '../src/hero-geometry.ts';
// Project the same five engineered components; the fallback never changes the Q's identity.
const camera=new THREE.PerspectiveCamera(34,1,.1,60);camera.position.set(...qRest.camera);camera.lookAt(0,.12,0);camera.updateMatrixWorld();
const matrix=new THREE.Matrix4().compose(new THREE.Vector3(0,.24,0),new THREE.Quaternion().setFromEuler(new THREE.Euler(...qRest.rotation)),new THREE.Vector3().setScalar(qRest.scale));
const faces=[];
const project=point=>new THREE.Vector3(...point).applyMatrix4(matrix).project(camera);
function addSolid(points,offset,rotation=0,tail=false){
 const local=point=>{const v=new THREE.Vector3(...point);v.applyAxisAngle(new THREE.Vector3(0,0,1),rotation);return v.add(new THREE.Vector3(...offset)).toArray();};
 const front=points.map(([x,y])=>local([x,y,.34]));const back=points.map(([x,y])=>local([x,y,-.34]));
 const add=(vertices,type)=>{const projected=vertices.map(project);faces.push({points:projected.map(v=>`${((v.x*.5+.5)*800).toFixed(2)},${((-.5*v.y+.5)*800).toFixed(2)}`).join(' '),depth:projected.reduce((sum,v)=>sum+v.z,0)/projected.length,type});};
 add(back,'side');for(let i=0;i<points.length;i++)add([back[i],back[(i+1)%points.length],front[(i+1)%points.length],front[i]],'side');add(front,tail?'tail':'front');
 if(tail)add([local([-.395,-.99,.36]),local([.395,-.99,.36]),local([.395,-.965,.36]),local([-.395,-.965,.36])],'blue');
}
qSegments.forEach((points,i)=>addSolid(points,qOffsets[i]));
addSolid([[-.39,-.975],[.39,-.975],[.39,.975],[-.39,.975]],[1.25,-1.43,.05],.66,true);
faces.sort((a,b)=>b.depth-a.depth);
const fasteners=[[1.52,1.52],[-1.52,1.52],[-1.52,-1.52],[1.52,-1.52]].map(([x,y],i)=>{const point=project([x+qOffsets[i][0],y+qOffsets[i][1],.387]);return `<circle cx="${((point.x*.5+.5)*800).toFixed(2)}" cy="${((-.5*point.y+.5)*800).toFixed(2)}" r="1.9" fill="#a3b0c3" stroke="#5c7291" stroke-width=".7"/>`;}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="front" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e6e9ef"/><stop offset=".42" stop-color="#a1afc5"/><stop offset="1" stop-color="#6c7d99"/></linearGradient><linearGradient id="side"><stop stop-color="#35445b"/><stop offset="1" stop-color="#aab9d2"/></linearGradient><linearGradient id="tail"><stop stop-color="#c8d0e0"/><stop offset="1" stop-color="#7589a9"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter></defs><ellipse cx="435" cy="655" rx="170" ry="24" fill="#0d1016" opacity=".25" filter="url(#shadow)"/>${faces.map(face=>`<polygon points="${face.points}" fill="${face.type==='blue'?'#4169ff':`url(#${face.type})`}" stroke="${face.type==='blue'?'#4169ff':'#bdc9d4'}" stroke-width=".65" stroke-opacity=".4" stroke-linejoin="round"/>`).join('')}${fasteners}</svg>`;
await writeFile('public/q-poster.svg',svg);
