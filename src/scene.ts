import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {getHeroState,subscribeHero} from './scene-state';
import {qSegments,qOffsets,qRest} from './hero-geometry';
/** Original five-part Q. Bounded product-film lighting and camera motion; demand rendering. */
export function initScene(container:Element){
 let renderer:THREE.WebGLRenderer;
 const lowPower=navigator.hardwareConcurrency<=4;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!lowPower&&devicePixelRatio<2,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,lowPower?1:1.25));
 renderer.setClearColor(0x25292f,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,60);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();
 // Large photographic strip panels produce shaped reflections rather than flat ambient metal.
 const panels:Array<THREE.Mesh>=[];
 const panel=(color:number,intensity:number,w:number,h:number,x:number,y:number,z:number)=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:color}).clone());(mesh.material as THREE.MeshBasicMaterial).color.multiplyScalar(intensity);mesh.position.set(x,y,z);mesh.lookAt(0,0,0);room.add(mesh);panels.push(mesh);};
 panel(0xeaf1ff,5,2,8,-4,3,4);panel(0x547dff,3,1.5,7,4,1,1);panel(0xffd6b5,1.7,4,1,0,5,-2);
 const environment=pmrem.fromScene(room,.035);scene.environment=environment.texture;room.dispose();panels.forEach(mesh=>{mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});pmrem.dispose();
 // A tiny, deterministic roughness texture provides directional satin grain, not a decorative overlay.
 const grainData=new Uint8Array(128*64*4);let seed=29;
 for(let x=0;x<128;x++){seed=(seed*16807)%2147483647;const line=232+(seed%8);for(let y=0;y<64;y++){const index=(y*128+x)*4;grainData[index]=grainData[index+1]=grainData[index+2]=line+(y%3);grainData[index+3]=255;}}
 const grain=new THREE.DataTexture(grainData,128,64);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(1,1);grain.needsUpdate=true;
 const material=new THREE.MeshPhysicalMaterial({color:0x9aa8bc,metalness:.94,roughness:.24,roughnessMap:grain,envMapIntensity:1.45,clearcoat:.23,clearcoatRoughness:.32});
 const sideMaterial=new THREE.MeshStandardMaterial({color:0x454f5e,metalness:.9,roughness:.27,envMapIntensity:1.3});
 const group=new THREE.Group();scene.add(group);group.position.set(0,.24,0);
 const polygons=qSegments;const offsets=qOffsets;const pieces:THREE.Mesh[]=[];
 polygons.forEach((points,i)=>{const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(([x,y])=>shape.lineTo(x,y));shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth:.68,bevelEnabled:true,bevelSize:.045,bevelThickness:.045,bevelSegments:5,steps:1});geometry.translate(0,0,-.34);const mesh=new THREE.Mesh(geometry,[material,sideMaterial]);mesh.position.set(...offsets[i] as [number,number,number]);mesh.castShadow=true;mesh.receiveShadow=true;
 const positions=[[1.52,1.52],[-1.52,1.52],[-1.52,-1.52],[1.52,-1.52]];const [fx,fy]=positions[i];
 const recess=new THREE.Mesh(new THREE.RingGeometry(.026,.043,24),sideMaterial);recess.position.set(fx,fy,.386);mesh.add(recess);
 const head=new THREE.Mesh(new THREE.CircleGeometry(.025,24),material);head.position.set(fx,fy,.387);mesh.add(head);
 group.add(mesh);pieces.push(mesh);});
 const tailShape=new THREE.Shape();tailShape.moveTo(-.39,-.975);tailShape.lineTo(.39,-.975);tailShape.lineTo(.39,.975);tailShape.lineTo(-.39,.975);tailShape.closePath();
 const tailGeometry=new THREE.ExtrudeGeometry(tailShape,{depth:.68,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1});tailGeometry.translate(0,0,-.34);
 const tail=new THREE.Mesh(tailGeometry,[material,sideMaterial]);tail.position.set(1.25,-1.43,.05);tail.rotation.z=.66;tail.castShadow=true;tail.receiveShadow=true;group.add(tail);
 const blueMaterial=new THREE.MeshStandardMaterial({color:0x4169ff,metalness:.5,roughness:.35});const blueTip=new THREE.Mesh(new THREE.BoxGeometry(.79,.025,.7),blueMaterial);blueTip.position.y=-.988;tail.add(blueTip);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({color:0x0b0d11,opacity:.055}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.66;floor.receiveShadow=true;scene.add(floor);
 const shadowData=new Uint8Array(128*128*4);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;const r=((x-64)/47)**2+((y-64)/38)**2;shadowData[i]=12;shadowData[i+1]=15;shadowData[i+2]=21;shadowData[i+3]=Math.round(Math.exp(-r*2.7)*65);}
 const contactTexture=new THREE.DataTexture(shadowData,128,128);contactTexture.needsUpdate=true;
 const contactMaterial=new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false});const contactShadow=new THREE.Mesh(new THREE.PlaneGeometry(8,5),contactMaterial);contactShadow.rotation.x=-Math.PI/2;contactShadow.position.set(.1,-2.65,0);scene.add(contactShadow);
 const key=new THREE.DirectionalLight(0xf3f5ff,2.6);key.position.set(-4.5,7,4);key.castShadow=true;key.shadow.mapSize.set(512,512);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.028;key.shadow.bias=-.00008;key.shadow.radius=9;scene.add(key);
 const fill=new THREE.DirectionalLight(0x7894ff,2.2);fill.position.set(5,1,-3);scene.add(fill);const warm=new THREE.DirectionalLight(0xffcb9c,.65);warm.position.set(-4,0,-2);scene.add(warm);scene.add(new THREE.HemisphereLight(0xe3ecff,0x303740,.7));
 group.rotation.set(...qRest.rotation as [number,number,number]);group.scale.setScalar(qRest.scale);
 camera.position.set(...qRest.camera as [number,number,number]);camera.lookAt(0,.12,0);
 const state=getHeroState();let target=state,p=state.progress,rx=qRest.rotation[0],ry=qRest.rotation[1];
 let frame=0,visible=true,eligible=innerWidth>1000,disposed=false,contextHealthy=true,last=performance.now(),arrival=0;
 const smooth=(value:number)=>THREE.MathUtils.smootherstep(value,0,1);
 const draw=(now:number)=>{frame=0;if(!visible||!eligible||!contextHealthy||document.hidden||disposed)return;
  const dt=Math.min(.04,Math.max(.001,(now-last)/1000));last=now;arrival=Math.min(1,arrival+dt/1.8);
  p=THREE.MathUtils.damp(p,target.progress,5,dt);rx=THREE.MathUtils.damp(rx,qRest.rotation[0]+target.y*.015,6,dt);ry=THREE.MathUtils.damp(ry,qRest.rotation[1]+target.x*.025,6,dt);
  const opening=smooth(arrival),release=THREE.MathUtils.smootherstep(p,.12,.84);
  group.rotation.set(rx,ry+release*.1,qRest.rotation[2]);
  pieces.forEach((piece,i)=>{const direction=[[1,1],[-1,1],[-1,-1],[1,-1]][i];const travel=THREE.MathUtils.smootherstep(p,.13+i*.035,.76+i*.035);piece.position.set(offsets[i][0]+direction[0]*travel*.5,offsets[i][1]+direction[1]*travel*.5,travel*(i%2?.14:-.07));});
  tail.position.set(1.25+release*.42,-1.43-release*.18,.05+release*.2);
  camera.position.set(-.13*Math.sin(release*Math.PI),.36+release*.12,12.2+(1-opening)*.28-smooth(p)*10.6);camera.lookAt(0,.12,-release*.4);
  key.position.x=-4.9+opening*.4+release*.6;key.intensity=2.1+opening*.5;fill.intensity=1.8+opening*.4;warm.intensity=.65+release*.18;
  renderer.render(scene,camera);container.classList.add('webgl-ready');
  if(arrival<1||Math.abs(p-target.progress)+Math.abs(rx-qRest.rotation[0]-target.y*.015)+Math.abs(ry-qRest.rotation[1]-target.x*.025)>.0003)frame=requestAnimationFrame(draw);
 };
 const schedule=()=>{if(!frame&&visible&&eligible&&contextHealthy&&!document.hidden&&!disposed){frame=requestAnimationFrame(draw);}};
 const unsubscribe=subscribeHero(value=>{target=value;schedule();});
 const resize=()=>{eligible=innerWidth>1000;if(!eligible){cancelAnimationFrame(frame);frame=0;container.classList.remove('webgl-ready');return;}const rect=container.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();schedule();};
 const observer=new ResizeObserver(resize);observer.observe(container);const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});intersection.observe(container);
 const visibility=()=>schedule();document.addEventListener('visibilitychange',visibility);resize();schedule();
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextHealthy=false;cancelAnimationFrame(frame);frame=0;container.classList.remove('webgl-ready');});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{contextHealthy=true;schedule();});
 const dispose=()=>{disposed=true;cancelAnimationFrame(frame);unsubscribe();observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);scene.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.dispose();});contactTexture.dispose();contactMaterial.dispose();material.dispose();sideMaterial.dispose();blueMaterial.dispose();grain.dispose();(floor.material as THREE.Material).dispose();environment.dispose();key.shadow.dispose();renderer.dispose();};
 addEventListener('pagehide',event=>{if(!event.persisted)dispose();});addEventListener('pageshow',schedule);
}
