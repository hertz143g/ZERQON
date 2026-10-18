import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

function rounded(w:number,h:number,r:number){const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
function frame(w:number,h:number,r:number,band:number,depth:number){const shape=rounded(w,h,r);shape.holes.push(new T.Path(rounded(w-band*2,h-band*2,Math.max(.06,r-band)).getPoints(32)));return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:4,steps:1,curveSegments:20});}
/** Original conceptual objects. No product specifications or manufactured device claims. */
export function initProductScene(container:HTMLElement){
 let renderer:T.WebGLRenderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 renderer.domElement.className='product-canvas';container.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50),group=new T.Group();scene.add(group);camera.position.set(0,0,10);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();
 // Broad photographic cards produce coherent highlights across every machined edge.
 for(const [x,y,z,w,h,color] of [[-4,3,2,2,7,0xffffff],[4,2,1,2,6,0xe4e8db],[0,5,-2,7,2,0xffffff]] as number[][]){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);room.add(panel);}
 const environment=pmrem.fromScene(room,.03);scene.environment=environment.texture;room.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose();}});room.dispose();
 scene.add(new T.HemisphereLight(0xdce6ff,0x24262a,2));const key=new T.DirectionalLight(0xffffff,3);key.position.set(-3,5,7);scene.add(key);const rim=new T.DirectionalLight(0x96b1ff,2);rim.position.set(5,-1,3);scene.add(rim);
 const silver=new T.MeshPhysicalMaterial({color:0xbec7d2,metalness:.96,roughness:.23,clearcoat:.25,envMapIntensity:1.7});
 const dark=new T.MeshStandardMaterial({color:0x232a32,metalness:.72,roughness:.32});
 const blue=new T.MeshPhysicalMaterial({color:0x4169ff,metalness:.8,roughness:.21,clearcoat:.45});
 const orange=new T.MeshStandardMaterial({color:0xf16c32,metalness:.45,roughness:.28});
 const layers:T.Group[]=[];const hospitality=container.classList.contains('assembly-visual');
 function mesh(geometry:T.BufferGeometry,material:T.Material,parent:T.Object3D=group,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;}
 if(hospitality){
  for(let i=0;i<4;i++){const layer=new T.Group();group.add(layer);layers.push(layer);}
  mesh(new RoundedBoxGeometry(2.45,3.05,.21,5,.14),silver,layers[0]);
  for(const x of [-.95,.95])for(const y of [-1.22,1.22]){mesh(new T.CylinderGeometry(.045,.045,.035,16).rotateX(Math.PI/2),dark,layers[0],x,y,.125);}
  mesh(new RoundedBoxGeometry(2.17,2.75,.07,4,.08),dark,layers[1]);
  for(let i=0;i<9;i++){const x=(i%3-1)*.57,y=(Math.floor(i/3)-1)*.68;mesh(new RoundedBoxGeometry(.26,.34,.065,2,.025),i===4?orange:silver,layers[1],x,y,.07);mesh(new T.BoxGeometry(.012,.46,.012),silver,layers[1],x+.19,y,.05);}
  mesh(frame(2.4,3,.18,.15,.12),silver,layers[2],0,0,-.06);
  const glass=new T.MeshPhysicalMaterial({color:0x344151,metalness:.12,roughness:.19,transparent:true,opacity:.46,clearcoat:1,side:T.DoubleSide});
  mesh(new RoundedBoxGeometry(2.14,2.74,.055,4,.11),glass,layers[3]);
  mesh(new T.TorusGeometry(.47,.035,16,80),silver,layers[3],0,.2,.065);mesh(new T.CircleGeometry(.39,64),dark,layers[3],0,.2,.067);mesh(new T.BoxGeometry(.028,.14,.025),orange,layers[3],0,.63,.1);
  // An engraved geometric mark rather than a fabricated product interface.
  for(let i=0;i<5;i++)mesh(new T.BoxGeometry(.045,.09+(i%2)*.05,.01),silver,layers[3],-.15+i*.075,-.93,.042);
  group.rotation.set(-.46,.3,-.42);group.scale.setScalar(container.closest('.detail-hero')?.86:1.15);group.position.y=container.closest('.detail-hero')?-.3:0;
 }else{
  const placements=[[-.85,.45,-.1,.05,-.45,-.48],[.65,-.25,.23,.55,.58,.52],[-1.9,-.95,-.35,.1,-.3,-.45]];
  placements.forEach((v,i)=>{const link=mesh(frame(i===2?1.05:1.8,i===2?1.4:2.45,.38,i===2?.21:.29,.3),i===1?blue:silver);link.position.set(v[0],v[1],v[2]);link.rotation.set(v[3],v[4],v[5]);});
  group.scale.setScalar(1.02);
 }
 // Each object has one bounded inspection sequence, independent of scroll velocity.
 const viewport=matchMedia('(min-width:1001px)');let visible=false,raf=0,disposed=false,healthy=true,elapsed=0,last=performance.now(),replaying=false,finished=false;
 const smooth=(x:number)=>T.MathUtils.smootherstep(x,0,1);
 const button=container.closest('.project')?.querySelector<HTMLButtonElement>('.replay-motion');
 const buttonState=(busy:boolean)=>{if(!button)return;button.disabled=busy;button.setAttribute('aria-busy',String(busy));button.innerHTML=busy?'Сборка устройства…':'Повторить сборку <span aria-hidden="true">↻</span>';};buttonState(true);
 function draw(now:number){raf=0;if(disposed||!healthy||!visible||document.hidden||!viewport.matches)return;
  const dt=Math.min(.04,Math.max(.001,(now-last)/1000));last=now;const duration=hospitality?(replaying?3.6:3):1.5;elapsed=Math.min(duration,elapsed+dt);
  let p=1;if(hospitality)p=replaying?(elapsed<1?1-smooth(elapsed):elapsed<1.35?0:smooth((elapsed-1.35)/2.25)):smooth((elapsed-.4)/2.6);
  const arc=Math.sin(elapsed/duration*Math.PI);
  if(hospitality){layers.forEach((layer,i)=>layer.position.z=i*.13+(1-p)*i*.5);group.rotation.set(-.46,.375-arc*.12,-.42);camera.position.set(.08-arc*.13,.15,10.25+arc*.2);}
  else{group.rotation.set(0,.125-(1-smooth(elapsed/duration))*.2,0);camera.position.set(0,0,10.15+(1-smooth(elapsed/duration))*.2);}
  const phase=p<.2?'exploded':p>.995?'assembled':'assembling';if(container.dataset.phase!==phase)container.dataset.phase=phase;
  camera.lookAt(0,0,hospitality?.45:0);renderer.render(scene,camera);container.classList.add('product-webgl-ready');finished=elapsed>=duration;if(finished)buttonState(false);else request();
 }
 function request(){if(!raf&&!disposed){raf=requestAnimationFrame(draw);}}
 const replay=()=>{if(!finished)return;elapsed=0;last=performance.now();replaying=true;finished=false;buttonState(true);request();};button?.addEventListener('click',replay);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=performance.now();request();}else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'80px'});observer.observe(container);
 const resize=new ResizeObserver(()=>{const r=container.getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();request();}});resize.observe(container);
 document.addEventListener('visibilitychange',request);viewport.addEventListener('change',request);addEventListener('pageshow',request);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();healthy=false;container.classList.remove('product-webgl-ready');cancelAnimationFrame(raf);});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{healthy=true;request();});
 addEventListener('pagehide',e=>{if(e.persisted)return;disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();button?.removeEventListener('click',replay);document.removeEventListener('visibilitychange',request);viewport.removeEventListener('change',request);removeEventListener('pageshow',request);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();},{once:true});
}
