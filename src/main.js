import * as THREE from 'three';
import './style.css';

const app=document.querySelector('#app');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#8d7860');
scene.fog=new THREE.FogExp2('#8d7860',.026);
const camera=new THREE.PerspectiveCamera(39,innerWidth/innerHeight,.1,100);
camera.position.set(7.7,5.3,9.2);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdce5e5,0x55402d,2.1));
const key=new THREE.DirectionalLight(0xffd7a1,3.2);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=12;key.shadow.camera.bottom=-12;scene.add(key);
const fill=new THREE.DirectionalLight(0xa8c4d4,1.1);fill.position.set(7,5,-5);scene.add(fill);
const warm=new THREE.PointLight(0xffad63,35,15);warm.position.set(-5,4,-2);scene.add(warm);

const mat=(color,metalness=0,roughness=.65)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const steel=mat('#b9c0bd',.82,.28),darkSteel=mat('#515d5c',.78,.36),rubber=mat('#343936',.05,.78),copper=mat('#b47746',.72,.3),paint=mat('#d7d0bd',.28,.38),floorMat=mat('#514b40'),beltMat=mat('#292e2b'),yellow=mat('#d4a45e'),cardboard=mat('#b68c5e'),red=mat('#a94e3e'),glass= new THREE.MeshStandardMaterial({color:'#b8d3d5',metalness:.05,roughness:.22,transparent:true,opacity:.22});
const boxGeo=new THREE.BoxGeometry(1,1,1);
function cube(parent,name,pos,scale,material,cast=true){const m=new THREE.Mesh(boxGeo,material);m.name=name;m.position.set(...pos);m.scale.set(...scale);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m}
function cylinder(parent,pos,r1,r2,h,material,rot=[0,0,0],segments=32){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function group(parent,pos=[0,0,0]){const g=new THREE.Group();g.position.set(...pos);parent.add(g);return g}

// Factory floor and architectural shell
cube(scene,'floor',[0,-.16,0],[30,.3,22],floorMat);
for(let x=-12;x<=12;x+=4){cube(scene,'floor seam',[x,.002,0],[.025,.012,22],darkSteel,false)}
cube(scene,'back wall',[0,5,-8],[30,10,.35],mat('#6a6254'));
cube(scene,'left wall',[-13,5,0],[.35,10,16],mat('#59594e'));
for(let x=-10;x<=10;x+=5){cube(scene,'window frame',[x,5.7,-7.78],[.12,4,.15],darkSteel);cube(scene,'window sill',[x,3.7,-7.78],[4,.12,.3],darkSteel)}
// Ceiling beams and lamps
for(let x=-10;x<=10;x+=5){cube(scene,'beam',[x,9,-1],[.22,.25,15],darkSteel);const lamp=cylinder(scene,[x,8.65,-1],.16,.16,.08,paint);lamp.rotation.x=Math.PI/2;const glow=new THREE.PointLight(0xffd29b,16,9);glow.position.set(x,8.1,-1);scene.add(glow)}
// Production line
const belt=group(scene,[0,0,0]);
cube(belt,'conveyor base',[0,.7,0],[12,.55,3.1],darkSteel);
cube(belt,'conveyor belt',[0,1.0,0],[11.8,.12,2.75],beltMat);
for(let x=-5.4;x<=5.4;x+=.6){cylinder(belt,[x,.7,-1.42],.13,.13, .12,steel,[Math.PI/2,0,0]);cylinder(belt,[x,.7,1.42],.13,.13,.12,steel,[Math.PI/2,0,0])}
for(const x of [-5.5,5.5]){cylinder(belt,[x,.7,0],.28,.28,2.95,darkSteel,[Math.PI/2,0,0]);}
for(const x of [-4,4]){cube(scene,'machine legs',[x,.25,0],[.35,.5,2.6],darkSteel);cube(scene,'machine housing',[x,2.15,0],[1.65,2.1,2.7],paint);cube(scene,'machine trim',[x,3.23,0],[1.7,.12,2.75],yellow);cube(scene,'machine dark window',[x,2.3,1.37],[.9,.85,.04],glass)}
// Riveting press, robotic arms
const press=group(scene,[-1.5,0,-.25]);
cube(press,'press column',[0,3.8,-2],[.45,5,.45],darkSteel);cube(press,'press head',[0,5.8,-.6],[2.2,.65,2.5],paint);cube(press,'press ram',[0,4.9,.1],[.38,1.6,.38],steel);
const ramTip=cylinder(press,[0,4.02,.1],.28,.18,.25,copper);
for(let i=0;i<3;i++){const arm=group(scene,[-6+i*1.1,2.5,-2.6]);cylinder(arm,[0,.7,0],.13,.13,1.4,yellow);const joint=cylinder(arm,[0,1.45,0],.22,.22,.22,darkSteel);joint.rotation.z=Math.PI/2;cube(arm,'arm segment',[.35,1.85,0],[.85,.16,.18],yellow);cylinder(arm,[.75,1.67,0],.12,.12,.42,steel,[0,0,Math.PI/2])}
// Background stacked crates
for(let i=0;i<7;i++){const x=-10+(i%4)*1.25,z=-4-Math.floor(i/4)*1.3;cube(scene,'crate',[x,.65,z],[1.05,1.3,1.05],cardboard);for(let y=.15;y<1.3;y+=.38)cube(scene,'crate stripe',[x,y,z+.53],[.9,.035,.025],yellow,false)}
// Hero can opener model, pivot group
const hero=group(scene,[-.2,1.2,0]);
const body=group(hero,[0,.38,0]);
const handleA=cube(body,'upper handle',[-.64,.02,0],[1.55,.22,.34],steel);
const handleB=cube(body,'lower handle',[-.63,-.24,0],[1.52,.2,.32],steel);
const head=cylinder(body,[.25,-.1,0],.38,.38,.42,steel,[Math.PI/2,0,0]);
const gear=cylinder(body,[.28,-.1,.235],.2,.2,.055,copper,[Math.PI/2,0,0],24);
const wheel=cylinder(body,[.5,-.1,0],.24,.24,.12,darkSteel,[Math.PI/2,0,0],32);
const wheelInner=cylinder(body,[.5,-.1,.07],.12,.12,.03,steel,[Math.PI/2,0,0],24);
const rivet=cylinder(body,[.26,-.1,.27],.075,.075,.05,yellow,[Math.PI/2,0,0],20);
for(let i=0;i<5;i++){const groove=cylinder(body,[.28,-.1,.27],.018,.018,.055,darkSteel,[Math.PI/2,0,0],8);groove.rotation.z=i*Math.PI/5}
const handleEnd=cylinder(body,[-1.35,-.11,0],.13,.13,.38,rubber,[Math.PI/2,0,0]);
const handleEnd2=cylinder(body,[-1.34,.02,0],.13,.13,.38,rubber,[Math.PI/2,0,0]);
const parts=[handleA,handleB,head,gear,wheel,wheelInner,rivet,handleEnd,handleEnd2];
const original=parts.map(o=>o.position.clone());
hero.scale.setScalar(.92);
hero.rotation.y=-.18;

// Product card, packaging station at right side of the belt
const packageStation=group(scene,[7.5,0,-.1]);
cube(packageStation,'packing table',[0,1.15,0],[4.1,.3,3.8],darkSteel);
cube(packageStation,'cardboard base',[0,1.36,0],[2.5,.09,2.0],cardboard);
const blister=group(packageStation,[0,1.55,0]);
cube(blister,'blister backing',[0,0,0],[1.75,.08,1.25],red);
const packHero=group(blister,[0,.18,0]);packHero.scale.setScalar(.37);
const packBody=cube(packHero,'packed opener body',[0,0,0],[1.5,.2,.32],steel);packBody.rotation.z=-.15;
const packHead=cylinder(packHero,[.62,-.04,0],.3,.3,.35,steel,[Math.PI/2,0,0]);
cube(blister,'clear blister',[0,.22,.08],[1.95,.38,1.45],glass,false);
cube(blister,'card header',[0,.47,0],[1.95,.12,1.45],red);
const label=cube(blister,'label',[0,.55,.03],[1.45,.02,.28],paint,false);
const carton=group(packageStation,[0,1.7,0]);carton.visible=false;
cube(carton,'box bottom',[0,0,0],[2.2,.18,1.7],cardboard);
cube(carton,'box back',[0,.75,-.76],[2.2,1.5,.16],cardboard);
cube(carton,'box left',[-1.02,.75,0],[.16,1.5,1.5],cardboard);
cube(carton,'box right',[1.02,.75,0],[.16,1.5,1.5],cardboard);
const flap1=cube(carton,'box flap left',[-.52,1.5,0],[1.05,.12,1.55],cardboard);flap1.rotation.z=-.12;
const flap2=cube(carton,'box flap right',[.52,1.5,0],[1.05,.12,1.55],cardboard);flap2.rotation.z=.12;

// small typography as canvas textures
function textTexture(title,sub){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#a64c3c';ctx.fillRect(0,0,512,256);ctx.fillStyle='#f3e9d5';ctx.font='bold 42px Georgia';ctx.textAlign='center';ctx.fillText(title,256,110);ctx.font='22px Arial';ctx.fillText(sub,256,160);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const brandMat=new THREE.MeshBasicMaterial({map:textTexture('MODELO 204','ABRELATAS METÁLICO'),transparent:false});
const brandPlate=new THREE.Mesh(new THREE.PlaneGeometry(1.55,.77),brandMat);brandPlate.position.set(0,.34,.86);carton.add(brandPlate);brandPlate.rotation.x=-.12;

// Animated conveyor rollers, parts trays and steam motes
const rollers=[];for(let i=0;i<24;i++){const r=cylinder(scene,[-5.6+i*.48,.68,1.55],.12,.12,3.1,darkSteel,[Math.PI/2,0,0]);rollers.push(r)}
const dust=[];for(let i=0;i<85;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.025,6,6),new THREE.MeshBasicMaterial({color:0xffd7a0,transparent:true,opacity:.14+Math.random()*.22}));p.position.set((Math.random()-.5)*24,Math.random()*8-1,-6+Math.random()*12);scene.add(p);dust.push({mesh:p,speed:.15+Math.random()*.35,phase:Math.random()*6})}

// Camera orbit: constrained, protagonist stays framed
let yaw=.66,pitch=.27,distance=7.2,target=new THREE.Vector3(-3.2,1.55,.15),drag=false,lastX=0,lastY=0;
function updateCamera(){const p=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);camera.position.copy(target).add(p);camera.lookAt(target)}
updateCamera();
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.005;pitch=Math.max(-.05,Math.min(.9,pitch+dy*.004));updateCamera()});
renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
renderer.domElement.addEventListener('wheel',e=>{distance=Math.max(5.8,Math.min(13,distance+e.deltaY*.009));updateCamera()},{passive:true});
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());

// Story timeline
const captions=[
{at:0,k:'PLANTA DE PRODUCCIÓN · 06:42 AM',t:'Todo comienza<br/>con una pequeña pieza.',p:'Todavía no sabe para qué existe.',label:'EL PRIMER DÍA'},
{at:5,k:'ESTACIÓN DE MOLDEADO',t:'El metal encuentra<br/>su forma.',p:'Calor, presión y precisión. Una pieza a la vez.',label:'TOMANDO FORMA'},
{at:12,k:'LÍNEA DE ENSAMBLAJE',t:'Poco a poco,<br/>se convierte en alguien.',p:'Un mecanismo. Dos manijas. Una pequeña rueda dentada.',label:'EL ENSAMBLAJE'},
{at:21,k:'CONTROL DE CALIDAD',t:'Su primer trabajo.',p:'Una lata de prueba. Un giro. Y funciona.',label:'LA PRIMERA LATA'},
{at:30,k:'ÁREA DE EMPAQUETADO',t:'Listo para conocer<br/>el mundo.',p:'Lo colocan en un blíster. Ya tiene un nombre y un modelo.',label:'EL EMPAQUETADO'},
{at:40,k:'DEPÓSITO · 08:16 AM',t:'Entre muchos, espera<br/>su momento.',p:'La caja se cierra. Afuera, el mundo sigue.',label:'EN CAMINO'},
{at:49,k:'FIN DEL PRÓLOGO',t:'Una vida entera<br/>está por comenzar.',p:'Próxima parada: el supermercado.',label:'EL VIAJE COMIENZA'}
];
const title=document.querySelector('#caption-title'),copy=document.querySelector('#caption-copy'),kicker=document.querySelector('#caption-kicker'),progress=document.querySelector('#timeline-progress'),timelineLabel=document.querySelector('#timeline-label');
let start=performance.now(),duration=57,completed=false;
function setCaption(time){let c=captions[0];for(const item of captions)if(time>=item.at)c=item;const idx=captions.indexOf(c);if(setCaption.last!==idx){setCaption.last=idx;kicker.textContent=c.k;title.innerHTML=c.t;copy.textContent=c.p;timelineLabel.textContent=c.label}}
setCaption.last=-1;
function smooth(a,b,t){const x=THREE.MathUtils.clamp((t-a)/(b-a),0,1);return x*x*(3-2*x)}
function animate(now){requestAnimationFrame(animate);const elapsed=(now-start)/1000;const t=Math.min(elapsed,duration);const s=Math.min(t/duration,1);
setCaption(t);progress.style.width=(s*100)+'%';
const intro=smooth(0,7,t),assemble=smooth(11,21,t),test=smooth(21,29,t),pack=smooth(29,39,t),close=smooth(40,47,t);
// La cámara acompaña al abrelatas y revela cada estación sin perderlo de vista.
const focusFactory=new THREE.Vector3(-1.15,1.85,.05);
const focusPacking=new THREE.Vector3(7.15,1.9,.05);
const focusEnd=new THREE.Vector3(7.5,1.45,-.1);
let desiredFocus;
if(t<11){desiredFocus=new THREE.Vector3(-3.2,1.55,.15).lerp(focusFactory,smooth(3,11,t));distance=THREE.MathUtils.lerp(7.2,9.1,smooth(3,11,t))}
else if(t<29){desiredFocus=focusFactory.clone();distance=9.1}
else if(t<40){desiredFocus=focusFactory.clone().lerp(focusPacking,pack);distance=THREE.MathUtils.lerp(9.1,7.6,pack)}
else{desiredFocus=focusPacking.clone().lerp(focusEnd,close);distance=7.6}
target.lerp(desiredFocus,.075);updateCamera();
hero.position.x=-.2+Math.min(t/25,1)*.5;hero.position.y=1.2+Math.sin(now*.0015)*.025;
body.rotation.z=Math.sin(now*.0012)*.012;
if(t<12){hero.position.x=-3.8+intro*3.6;hero.position.z=.15;hero.scale.setScalar(.001+intro*.92)}
else if(t<21){hero.scale.setScalar(.92);hero.position.x=-.2;for(let i=0;i<parts.length;i++){const p=parts[i];const targetPos=original[i];const spread=new THREE.Vector3((i%3-1)*.45,1.2+Math.floor(i/3)*.22,(i%2?1:-1)*.55);p.position.lerpVectors(spread,targetPos,assemble)}}
else if(t<29){hero.position.set(-.1,1.2,.1);body.rotation.z=Math.sin((t-21)*5)*.045;gear.rotation.z=t*2;wheel.rotation.z=t*3}
else if(t<40){hero.position.set(7.5,2.05,.1);hero.scale.setScalar(.92);body.rotation.z=0;blister.visible=true;packHero.rotation.y=0;const f=smooth(29,35,t);blister.scale.setScalar(.01+f*.95);blister.rotation.y=Math.sin(t*1.4)*.04}
else{blister.visible=false;carton.visible=true;const f=smooth(40,46,t);carton.scale.setScalar(.1+f*.9);flap1.rotation.x=-f*1.45;flap2.rotation.x=f*1.45;hero.visible=false;const fade=smooth(48,54,t);scene.fog.density=.026+fade*.07;scene.background.lerpColors(new THREE.Color('#8d7860'),new THREE.Color('#171916'),fade);renderer.domElement.style.opacity=String(1-fade*.9)}
for(const d of dust){d.mesh.position.y+=Math.sin(now*.0003+d.phase)*.0007;d.mesh.position.x+=Math.sin(now*.0002+d.phase)*.0004}
if(t>=duration&&!completed){completed=true;document.querySelector('#end-card').classList.remove('hidden')}
renderer.render(scene,camera)}
requestAnimationFrame(animate);
document.querySelector('#skip').addEventListener('click',()=>{start=performance.now()-(duration-1)*1000});
document.querySelector('#skip').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){start=performance.now()-(duration-1)*1000}});
document.querySelector('#restart').addEventListener('click',()=>{start=performance.now();completed=false;document.querySelector('#end-card').classList.add('hidden');hero.visible=true;blister.visible=true;carton.visible=false;scene.fog.density=.026;scene.background.set('#8d7860');renderer.domElement.style.opacity='1'});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
setTimeout(()=>document.querySelector('#loading').classList.add('done'),700);
