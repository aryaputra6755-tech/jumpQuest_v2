
const V=document.getElementById('c'),VX=V.getContext('2d'),C=document.createElement('canvas'),X=C.getContext('2d'),BL=document.createElement('canvas'),TX=BL.getContext('2d'),W=800,H=450,T=32,G=11,N=130,SOL=[0,1,1,1,1,0,1,1];
const TH=[['Green Grassland','#5ec4ff','#c9f0ff','#4caf2e','#8a5a2b','#3f9a3a'],['Desert','#ffb347','#ffe6a8','#e8c26a','#c2933f','#d9a94e'],['Snow World','#8cc8f0','#eaf6ff','#f4fbff','#9cc3e0','#bcd9f0'],['Lava Cave','#2a0a0a','#7a1d0a','#6a4a4a','#2b1a1a','#a02a10'],['Forest','#4aa96c','#c8f0b0','#3a8a2a','#6b4423','#2d7a3a'],['Sky Islands','#6ab8ff','#e6f6ff','#6ccf4a','#9a6a3a','#ffffff'],['Underwater','#0a4a8a','#2fb4c8','#d8c88a','#7a6a4a','#1a7a9a'],['Haunted','#120a2a','#3a2a6a','#4a3a6a','#241a3a','#2a1f4a'],['Candy Land','#ffb0d8','#fff0f8','#ff8fc0','#c0508a','#ffd0ea'],['Space','#05031a','#2a1a5a','#6a6a9a','#33335a','#4a3a8a']];
const CH=[{n:'Red',cap:'#e53935',sh:'#e53935',ov:'#2f5fd0'},{n:'Pink',cap:'#e060c8',sh:'#e060c8',ov:'#7a4ad0',g:1},{n:'Blue',cap:'#2f7fe0',sh:'#2f7fe0',ov:'#c83a3a'},{n:'Green',cap:'#2faa3a',sh:'#2faa3a',ov:'#2f5fd0'}];
let S=null;try{S=JSON.parse(localStorage.getItem('jq1'))}catch(e){}
if(!S||typeof S!='object'||Array.isArray(S))S={u:1,st:{},coins:5620,gems:180,ch:0,d:''};
S.own=S.own||[1,0,0,0];S.xl=S.xl||0;
// ---------- v5: mission, daily reward, settings (tersimpan di S -> localStorage 'jq1')
const MIS=[
{n:'Kumpulkan Koin',d:'Kumpulkan # koin',k:'coin',g:[50,200,500,1000],r:[[50,0],[100,5],[200,10],[400,20]]},
{n:'Injak Musuh',d:'Injak # musuh',k:'goomba',g:[10,40,100],r:[[60,0],[150,5],[300,15]]},
{n:'Ambil Bintang',d:'Ambil # bintang',k:'star',g:[3,10,25],r:[[80,0],[200,10],[400,25]]},
{n:'Tamatkan Level',d:'Tamatkan # level',k:'flag_red',g:[1,3,6,10],r:[[100,0],[200,5],[300,10],[500,25]]},
{n:'Kalahkan Bos',d:'Kalahkan bos # kali',k:'boss',g:[1,2,4],r:[[200,10],[400,20],[800,40]]}];
const DAILY=[[100,0],[150,0],[200,5],[300,0],[400,10],[500,0],[800,30]];
const dkey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
if(!S.st||typeof S.st!='object')S.st={};
if(!S.opt||typeof S.opt!='object')S.opt={mu:S.mute?0:1,sf:S.mute?0:1,vb:1};
delete S.mute;for(const k of['mu','sf','vb'])S.opt[k]=S.opt[k]===0||S.opt[k]===false?0:1;
const OPT=S.opt;
{const q=S.mq&&typeof S.mq=='object'?S.mq:{},a=(v,i)=>Math.max(0,Math.floor(+(v&&v[i])||0));S.mq={p:MIS.map((m,i)=>a(q.p,i)),t:MIS.map((m,i)=>Math.min(m.g.length,a(q.t,i)))}}
{const o=S.dr&&typeof S.dr=='object'?S.dr:null;let l=o&&/^\d{4}-\d{2}-\d{2}$/.test(o.l)?o.l:'',n=o?Math.max(0,Math.floor(+o.n||0)):0;
if(!o&&S.d){const q=new Date(S.d);if(!isNaN(q)){l=dkey(q);n=1}}if(!l)n=0;S.dr={l,n}}
let mqD=0;
const mqSave=()=>{if(mqD){mqD=0;sv()}};
function mq(i,n){const m=MIS[i],q=S.mq,t=q.t[i];if(t>=m.g.length)return;const b=q.p[i];q.p[i]=b+n;mqD=1;if(b<m.g[t]&&q.p[i]>=m.g[t]){toast('Misi selesai: '+m.n+'! Ambil di Mission');vib(40)}}
const vib=p=>{try{if(OPT.vb&&navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.hasBeenActive))navigator.vibrate(p)}catch(e){}};
function dInfo(){const n=new Date(),a=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),l=S.dr.l;let df=1e9;if(l){const q=l.split('-');df=Math.round((a-Date.UTC(+q[0],+q[1]-1,+q[2]))/864e5)}
const cur=S.dr.n;if(!l)return{can:true,next:1,cur:0,reset:false};if(df<=0)return{can:false,next:cur+1,cur,reset:false};if(df==1)return{can:true,next:cur+1,cur,reset:false};return{can:true,next:1,cur,reset:true}}
function claimDaily(){const f=dInfo();if(!f.can){toast('Hadiah hari ini sudah diambil');return}const r=DAILY[(f.next-1)%DAILY.length];S.coins+=r[0];S.gems+=r[1];S.dr={l:dkey(),n:f.next};sv();SFX.win();vib([40,30,60]);toast('Hari '+f.next+': +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''))}
function claimMis(i){const m=MIS[i],q=S.mq,t=q.t[i];if(t>=m.g.length||q.p[i]<m.g[t])return;const r=m.r[t];S.coins+=r[0];S.gems+=r[1];q.t[i]=t+1;mqD=0;sv();SFX.star();vib(40);toast('Hadiah: +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''))}
function setOpt(k){OPT[k]=OPT[k]?0:1;sv();if(OPT[k]){if(k=='sf')SFX.coin();else if(k=='vb')vib(40)}}
const sv=()=>{try{localStorage.setItem('jq1',JSON.stringify(S))}catch(e){}};
let scr='menu',wi=0,g=null,fr=0,tm=0,tmsg='';
const toast=s=>{tmsg=s;tm=120},hit=(x,y,a,b,w,h)=>x>=a&&x<=a+w&&y>=b&&y<=b+h,ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function rnd(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// ---------- input
const IM={},SRC={"arrow_blue": "assets/arrow_blue.png", "barrel": "assets/barrel.png", "bg0": "assets/bg0.jpg", "bg1": "assets/bg1.jpg", "bg2": "assets/bg2.jpg", "bg3": "assets/bg3.jpg", "bg4": "assets/bg4.jpg", "bg5": "assets/bg5.jpg", "bg6": "assets/bg6.jpg", "bg7": "assets/bg7.jpg", "bg8": "assets/bg8.jpg", "bg9": "assets/bg9.jpg", "blue_slime": "assets/blue_slime.png", "boo": "assets/boo.png", "boots": "assets/boots.png", "boss": "assets/boss.png", "brick_block": "assets/brick_block.png", "brick_platform": "assets/brick_platform.png", "bush": "assets/bush.png", "bush_flowers": "assets/bush_flowers.png", "buzzy_beetle": "assets/buzzy_beetle.png", "ch0": "assets/ch0.png", "ch1": "assets/ch1.png", "ch2": "assets/ch2.png", "ch3": "assets/ch3.png", "clock": "assets/clock.png", "cloud": "assets/cloud.png", "coin": "assets/coin.png", "crown": "assets/crown.png", "diamond": "assets/diamond.png", "dirt_platform": "assets/dirt_platform.png", "energy_ring": "assets/energy_ring.png", "explosion_orange": "assets/explosion_orange.png", "fence": "assets/fence.png", "fire_orb": "assets/fire_orb.png", "flag_blue": "assets/flag_blue.png", "flag_red": "assets/flag_red.png", "flower_bush": "assets/flower_bush.png", "flower_yellow": "assets/flower_yellow.png", "flying_koopa": "assets/flying_koopa.png", "frog_npc": "assets/frog_npc.png", "g0b": "assets/g0b.png", "g0t": "assets/g0t.png", "g1b": "assets/g1b.png", "g1t": "assets/g1t.png", "g2b": "assets/g2b.png", "g2t": "assets/g2t.png", "g3b": "assets/g3b.png", "g3t": "assets/g3t.png", "g4b": "assets/g4b.png", "g4t": "assets/g4t.png", "g5b": "assets/g5b.png", "g5t": "assets/g5t.png", "g6b": "assets/g6b.png", "g6t": "assets/g6t.png", "g7b": "assets/g7b.png", "g7t": "assets/g7t.png", "g8b": "assets/g8b.png", "g8t": "assets/g8t.png", "g9b": "assets/g9b.png", "g9t": "assets/g9t.png", "goomba": "assets/goomba.png", "grass_platform": "assets/grass_platform.png", "grass_platform_long": "assets/grass_platform_long.png", "green_pipe": "assets/green_pipe.png", "hammer_bro": "assets/hammer_bro.png", "heart": "assets/heart.png", "heart_large": "assets/heart_large.png", "hero0": "assets/hero0.png", "hero1": "assets/hero1.png", "hero2": "assets/hero2.png", "hero3": "assets/hero3.png", "ice": "assets/ice.png", "key": "assets/key.png", "key_item": "assets/key_item.png", "koopa": "assets/koopa.png", "ladder": "assets/ladder.png", "lakitu": "assets/lakitu.png", "lava": "assets/lava.png", "magic_blue": "assets/magic_blue.png", "magic_gold": "assets/magic_gold.png", "magic_white": "assets/magic_white.png", "magnet": "assets/magnet.png", "metal_trap": "assets/metal_trap.png", "mushroom": "assets/mushroom.png", "npc_player": "assets/npc_player.png", "penguin_npc": "assets/penguin_npc.png", "plant": "assets/plant.png", "princess": "assets/princess.png", "quest_board": "assets/quest_board.png", "question_block": "assets/question_block.png", "red_slime": "assets/red_slime.png", "save_block": "assets/save_block.png", "saw_gray": "assets/saw_gray.png", "saw_red": "assets/saw_red.png", "shield": "assets/shield.png", "shopkeeper": "assets/shopkeeper.png", "signpost": "assets/signpost.png", "sparkle_gold": "assets/sparkle_gold.png", "sparkle_white": "assets/sparkle_white.png", "spikes": "assets/spikes.png", "spiky": "assets/spiky.png", "spring": "assets/spring.png", "star": "assets/star.png", "star_large": "assets/star_large.png", "stone_blocks": "assets/stone_blocks.png", "stone_pillar": "assets/stone_pillar.png", "stone_wall": "assets/stone_wall.png", "street_lamp": "assets/street_lamp.png", "tree_1": "assets/tree_1.png", "tree_2": "assets/tree_2.png", "tree_3": "assets/tree_3.png", "water": "assets/water.png", "wing": "assets/wing.png", "wood_beam": "assets/wood_beam.png", "wood_crate": "assets/wood_crate.png", "wood_platform": "assets/wood_platform.png", "chest": "assets/chest.png"};for(const k in SRC){const i=new Image();i.src=SRC[k];IM[k]=i}
const im=k=>IM[k]&&IM[k].complete&&IM[k].naturalWidth?IM[k]:null;
const K={},P={};
addEventListener('keydown',e=>{resumeAudio();K[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code=='Escape'||e.code=='KeyP'){if(scr=='game')scr='pause';else if(scr=='pause')scr='game';else if(scr=='mis'||scr=='daily'||scr=='set')scr='menu'}});
addEventListener('keyup',e=>K[e.code]=0);
let ROT=false,FS=0;const pos=e=>{const r=V.getBoundingClientRect(),a=ROT?r.height:r.width,b=ROT?r.width:r.height,nx=ROT?(e.clientY-r.top)/r.height:(e.clientX-r.left)/r.width,ny=ROT?(r.right-e.clientX)/r.width:(e.clientY-r.top)/r.height,vx=nx*a,vy=ny*b,sc=Math.min(a/W,b/H);return[(vx-(a-W*sc)/2)/sc,(vy-(b-H*sc)/2)/sc]};
function goFS(){if(FS||!matchMedia('(pointer:coarse)').matches)return;FS=1;try{const d=document.documentElement;if(d.requestFullscreen)d.requestFullscreen().then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}}
V.addEventListener('pointerdown',e=>{e.preventDefault();goFS();resumeAudio();const p=pos(e);P[e.pointerId]=p;tap(p[0],p[1])});
V.addEventListener('pointermove',e=>{if(P[e.pointerId])P[e.pointerId]=pos(e)});
['pointerup','pointercancel','pointerleave'].forEach(n=>V.addEventListener(n,e=>{delete P[e.pointerId]}));
function ctl(){let l=K.ArrowLeft||K.KeyA,r=K.ArrowRight||K.KeyD,j=K.ArrowUp||K.KeyW||K.Space;
for(const k in P){const[x,y]=P[k];if(y>300){if(Math.hypot(x-60,y-390)<50)l=1;if(Math.hypot(x-150,y-390)<50)r=1;if(Math.hypot(x-740,y-390)<58)j=1}}return[l,r,j]}
function tap(x,y){
if(scr=='menu'){if(hit(x,y,20,190,160,46)||hit(x,y,620,190,160,60))scr='lev';else if(hit(x,y,20,246,150,34))scr='char';
else if(hit(x,y,20,286,150,34))scr='shop';else if(hit(x,y,20,326,150,34))scr='mis';
else if(hit(x,y,20,366,150,34)||hit(x,y,560,8,40,40))scr='set';
else if(hit(x,y,650,270,100,90))scr='daily'}
else if(scr=='mis'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<MIS.length;i++)if(hit(x,y,655,111+i*67,92,34))claimMis(i)}
else if(scr=='daily'){if(hit(x,y,690,12,90,34))scr='menu';else if(hit(x,y,300,308,200,46))claimDaily()}
else if(scr=='set'){if(hit(x,y,690,12,90,34))scr='menu';['mu','sf','vb'].forEach((k,i)=>{if(hit(x,y,180,140+i*80,440,66))setOpt(k)})}
else if(scr=='lev'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<10;i++)if(hit(x,y,40+i%5*150,100+(i/5|0)*170,130,150)){if(i<S.u)start(i);else toast('Selesaikan world sebelumnya dulu')}}
else if(scr=='char'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<4;i++)if(hit(x,y,70+i*180,110,150,230)){if(S.own[i]){S.ch=i;sv()}else toast('Beli di Shop dulu')}}
else if(scr=='shop'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<5;i++)if(hit(x,y,40+i*150,130,130,250)){if(i<4){if(S.own[i])S.ch=i;else if(S.coins>=PR[i]){S.coins-=PR[i];S.own[i]=1;S.ch=i;toast('Dibeli!')}else toast('Koin tidak cukup')}else if(S.xl<2){if(S.coins>=300){S.coins-=300;S.xl++;toast('Nyawa awal +1!')}else toast('Koin tidak cukup')}else toast('Sudah maksimal');sv()}}
else if(scr=='game'){if(hit(x,y,745,8,46,36))scr='pause'}
else if(scr=='pause'){if(hit(x,y,300,190,200,44))scr='game';else if(hit(x,y,300,250,200,44))scr='lev'}
else if(scr=='win'){if(hit(x,y,170,320,140,44))scr='lev';else if(hit(x,y,330,320,140,44))start(wi);else if(hit(x,y,490,320,140,44)&&wi<9)start(wi+1)}
else if(scr=='over'){if(hit(x,y,230,320,160,44))scr='lev';else if(hit(x,y,410,320,160,44))start(wi)}}
// ---------- level
function start(w){FX.length=0;wi=w;g=build(w);scr='game'}
const HZP=[.35,.5,.5,.55,.5,.5,.5,.55,.5,.6],
HZL=[['sp','mp'],['sp','sw','mp'],['sp','mp','fk'],['sw','mp','bro'],['sp','pool','fk'],['mp','fk','sp'],['pool','fk','bro'],['sw','bo','sp','mp'],['sp','mp','fk','bro'],['sw','mp','bo','fk','bro']],
ITM=[[['mushroom',.3],['magnet',.55]],[['boots',.3],['shield',.6]],[['key',.3],['clock',.45],['mushroom',.7]],[['shield',.3],['wing',.55]],[['magnet',.25],['shield',.45],['clock',.65]],[['key',.28],['wing',.45]],[['boots',.3],['mushroom',.5],['magnet',.7]],[['key',.3],['shield',.5],['clock',.75]],[['wing',.3],['magnet',.5],['mushroom',.7]],[['key',.25],['shield',.4],['wing',.55],['clock',.75]]],
GATE={2:.62,5:.6,7:.62,9:.6};
function build(w){const r=rnd(w*977+13),r2=rnd(w*313+5),m=[];for(let y=0;y<14;y++)m.push(new Array(N).fill(0));const en=[],co=[],st=[],hz=[],mpl=[],wp=[],it=[],gt=[],oc=new Array(N+40).fill(0),mk=(a,b)=>{for(let i=Math.max(0,a);i<=b;i++)oc[i]=1};
for(let x=0;x<N;x++)m[G][x]=m[12][x]=m[13][x]=1;
const BW=w%5==4;
const E=(t,x,y)=>en.push({t,x:x*T,y:y*T,w:26,h:26,vy:0,d:-1,s:.6+w*.06,o:r()*90|0,dead:0,dt:0}),
cn=(x,y,n)=>{for(let i=0;i<n;i++)co.push({x:(x+i)*T+16,y:y*T+16,g:0})};
const FT={
sp:x=>{const k=2+(w>4&&r2()<.5?1:0);hz.push({k:'sp',x:x*T,y:G*T-14,w:k*T,h:14});cn(x-1,G-4,k+2);mk(x-1,x+k);return x+k+6},
sw:x=>{hz.push({k:'sw',x:(x+2)*T,y:G*T-28,w:28,h:28,x0:x*T,x1:(x+4)*T,d:1,s:1.3,ph:0,c:w==3?'saw_red':'saw_gray'});cn(x,G-4,5);mk(x-1,x+5);return x+9},
mp:x=>{const kk=7;for(let i=0;i<kk;i++)m[G][x+i]=m[12][x+i]=m[13][x+i]=0;const xa=x*T-32;mpl.push({x:xa,y:G*T,w:96,h:14,x0:xa,x1:(x+kk)*T+32-96,s:1.2,off:r2()*100|0,dx:0,dy:0});cn(x+2,G-4,kk-3);mk(x-1,x+kk);return x+kk+4},
pool:x=>{const kk=w==6?6+(r2()*3|0):4;for(let i=0;i<kk;i++)m[G][x+i]=m[12][x+i]=0;wp.push({c0:x,c1:x+kk-1});cn(x,G-4,kk);mk(x-1,x+kk);return x+kk+4},
fk:x=>{en.push({t:5,x:(x+1)*T,y:G*T-26,w:28,h:26,x0:x*T,x1:(x+7)*T,d:1,s:1.1,ph:r2()*6,vy:0,dead:0,dt:0});cn(x+1,G-5,5);return x+10},
bro:x=>{en.push({t:6,x:(x+3)*T,y:(G-1)*T,w:28,h:30,x0:(x+3)*T,d:-1,s:.5,tm:r2()*60|0,vy:0,dead:0,dt:0});cn(x,G-3,3);mk(x+1,x+6);return x+10},
bo:x=>{en.push({t:8,x:(x+3)*T,y:G*T-75,by:G*T-75,w:28,h:28,ph:r2()*6,vy:0,dead:0,dt:0,sh:0});return x+9}};
let x=10;
while(x<N-(BW?34:16)){
if(r2()<HZP[w]){const l=HZL[w];x=FT[l[r2()*l.length|0]](x);continue}
const f=r()*7|0;
if(f==0){if(w==6){x=FT.pool(x);continue}const k=2+(r()*2|0);for(let i=0;i<k;i++)m[G][x+i]=m[12][x+i]=m[13][x+i]=0;cn(x,G-4,k);if(w==3&&k==3)hz.push({k:'fo',x:(x+1)*T+16,y0:12*T,ph:0,off:r2()*150|0});mk(x-1,x+k);x+=k+4}
else if(f==1){const h=1+(r()*2|0);for(let i=0;i<h;i++)m[G-1-i][x]=6;en.push({t:3,x:x*T,by:(G-h)*T,w:24,h:26,ph:r()*6,h2:0,dead:0,dt:0});mk(x-1,x+1);x+=5}
else if(f==2){const k=3+(r()*3|0);for(let i=0;i<k;i++)m[G-4][x+i]=i%2?3:2;cn(x,G-6,k);x+=k+3}
else if(f==3){for(let i=0;i<4;i++)for(let j=0;j<=i;j++)m[G-1-j][x+i]=1;mk(x-1,x+4);x+=7}
else if(f==4){E(r()<.5?0:1,x+2,G-1);if(w>1)E(2,x+6,G-1);if(w>3)E(0,x+9,G-1);cn(x+1,G-3,3);x+=12}
else if(f==5){E(w>2?2:0,x+1,G-1);cn(x,G-3,4);x+=6}
else{cn(x,G-3,5);x+=6}}
if(BW)en.push({t:4,x:(N-18)*T,y:(G-3)*T,w:50,h:52,vy:0,d:-1,s:1.4,o:30,dead:0,dt:0,hp:3+(w==9?2:0),mh:3+(w==9?2:0),bi:0,x0:(N-24)*T,x1:(N-11)*T,cd:100,tel:0,pi:0});
if([5,8,9].includes(w)){const a=Math.floor(N*.45)*T;en.push({t:7,x:a,y:G*T-150,w:30,h:34,x0:a,x1:(N-(BW?40:14))*T,d:1,ph:0,vy:0,dead:0,dt:0,cd:0})}
const LIM=N-(BW?36:14);
const fc=(f,lim)=>{const c=Math.floor(N*f);for(const sg of[1,0])for(let k=0;k<90;k++)for(const d of[k,-k]){const q=c+d;if(q>8&&q<lim&&!oc[q]&&(!sg||!oc[q-1]&&!oc[q+1])&&m[G][q-1]==1&&m[G][q]==1&&m[G][q+1]==1&&!m[G-1][q-1]&&!m[G-1][q]&&!m[G-1][q+1]&&!m[G-2][q]&&!m[G-3][q])return q}return -1};
let gl=LIM;
if(GATE[w]){const c=fc(GATE[w],LIM);if(c>0){for(let rr=0;rr<G;rr++)m[rr][c]=7;gt.push(c);mk(c-2,c+2);gl=c-3}}
let keyOk=!gt.length;
for(const[k,f]of ITM[w]){const c=fc(f,k=='key'?gl:LIM);if(c>0){it.push({k,x:c*T+16,y:(G-3)*T+16,g:0});mk(c-1,c+1);if(k=='key')keyOk=true}}
if(!keyOk){for(const c of gt)for(let rr=0;rr<G;rr++)m[rr][c]=0;gt.length=0}
[.25,.5,.78].forEach(f=>{let c=Math.floor(N*f);while(m[G-3][c]||m[G-2][c])c++;st.push({x:c*T+16,y:(G-3)*T+16,g:0})});
const dr=rnd(w*131+7),dec=[];for(let c=3;c<N-3;c++){const q=dr();if(q<.16&&!(c>=5&&c<=9)&&!(c>=N-10&&c<=N-6)&&m[G][c]==1&&m[G][c-1]==1&&m[G][c+1]==1&&!m[G-1][c]&&!m[G-1][c-1]&&!m[G-1][c+1]&&!oc[c-1]&&!oc[c]&&!oc[c+1])dec.push({k:DEC[w][dr()*DEC[w].length|0],x:c*T+16})}
return{dec,m,en,co,st,hz,mp:mpl,wp,it,gt,key:0,mag:0,bts:0,wng:0,clk:0,sh:0,big:0,pj:[],lost:0,p:{x:2*T,y:G*T-30,vx:0,vy:0,w:22,h:30,gr:0,f:1,an:0,jh:0,on:null},cam:0,coins:0,stars:0,lives:3+(S.xl||0),parts:[],inv:0,t:0,ck:2*T}}
const sol=(c,r)=>c<0||c>=N?true:(r<0||r>=14?false:!!SOL[g.m[r][c]]);
function mv(o,dx,dy,bump){o.x+=dx;let hx=0,hy=0;
if(dx){const c=dx>0?Math.floor((o.x+o.w)/T):Math.floor(o.x/T);for(let r=Math.floor(o.y/T);r<=Math.floor((o.y+o.h-1)/T);r++)if(sol(c,r)){o.x=dx>0?c*T-o.w:(c+1)*T;hx=1;break}}
o.y+=dy;
if(dy){const r=dy>0?Math.floor((o.y+o.h)/T):Math.floor(o.y/T);for(let c=Math.floor(o.x/T);c<=Math.floor((o.x+o.w-1)/T);c++)if(sol(c,r)){if(dy<0&&bump)bump(c,r);o.y=dy>0?r*T-o.h:(r+1)*T;hy=dy>0?1:2;break}}
return[hx,hy]}
function burst(x,y,n,c){if(c=='#fff')fxAdd('explosion_orange',x,y,44);else if(c=='#ffd23a')fxAdd('sparkle_gold',x,y,48);else if(c=='#ffc21a')fxAdd('sparkle_gold',x,y,30);for(let i=0;i<n;i++)g.parts.push({x,y,vx:Math.random()*6-3,vy:-Math.random()*6,l:30,c})}
function bump(c,r){const t=g.m[r][c];if(t==3){g.m[r][c]=4;g.coins++;mq(0,1);SFX.coin();burst(c*T+16,r*T,6,'#ffc21a')}else if(t==2){SFX.bump();g.m[r][c]=0;burst(c*T+16,r*T+16,10,'#c8642a')}}
function hurt(){if(g.inv>0)return;const p=g.p;vib(90);
if(g.sh){g.sh=0;g.inv=80;p.vy=-6;SFX.boss();burst(p.x+11,p.y+12,8,'#fff');toast('Perisai pecah!');return}
if(g.big){g.big=0;g.inv=90;p.vy=-7;SFX.hurt();toast('Jamur hilang');return}
g.lives--;g.lost++;SFX.hurt();g.inv=100;p.vy=-7;if(g.lives<=0)scr='over'}
function die(){g.lives--;g.lost++;SFX.hurt();vib([60,40,100]);if(g.lives<=0){scr='over';return}const p=g.p;p.x=g.ck;p.y=G*T-30;p.vx=p.vy=0;p.on=null;g.pj.length=0;g.inv=90}
function inWat(p){if(!g.wp.length||p.y+p.h<=G*T+6)return false;const c=Math.floor((p.x+p.w/2)/T);return g.wp.some(q=>c>=q.c0&&c<=q.c1)}
function mpUpd(q){const R=q.x1-q.x0,P=40,L=R/q.s,cy=2*(L+P),u=((g.t+q.off)%cy+cy)%cy;let f;if(u<P)f=0;else if(u<P+L)f=(u-P)/L;else if(u<2*P+L)f=1;else f=1-(u-2*P-L)/L;const nx=q.x0+R*f;q.dx=nx-q.x;q.x=nx}
function hzRect(h){if(h.k=='sp')return{x:h.x+3,y:h.y+4,w:h.w-6,h:h.h-4};if(h.k=='sw')return{x:h.x+3,y:h.y+3,w:22,h:22};const u=(h.ph+h.off)%150;if(u>=50)return null;const yy=h.y0-Math.sin(Math.PI*u/50)*64-10;return{x:h.x-9,y:yy-9,w:18,h:18}}
function okCk(p){for(const h of g.hz){const a=h.k=='sw'?h.x0-70:h.k=='fo'?h.x-80:h.x-60,b=h.k=='sw'?h.x1+100:h.k=='fo'?h.x+80:h.x+h.w+60;if(p.x+p.w>a&&p.x<b)return false}return true}
const ITN={magnet:'Magnet aktif!',boots:'Boots: lompat tinggi!',wing:'Sayap: tahan lompat untuk terbang',shield:'Perisai aktif!',key:'Kunci didapat!',clock:'Waktu berhenti!',mushroom:'Jamur: kuat 1 pukulan'};
function pick(i){i.g=1;SFX.star();toast(ITN[i.k]);burst(i.x,i.y,8,'#ffd23a');
if(i.k=='magnet')g.mag=900;else if(i.k=='boots')g.bts=900;else if(i.k=='wing')g.wng=420;else if(i.k=='shield')g.sh=1;else if(i.k=='key')g.key=1;else if(i.k=='clock')g.clk=360;else if(i.k=='mushroom'){if(g.big)g.coins+=10;g.big=1}}
function bossFire(e,p){const k=e.pi++,dir=p.x>e.x?1:-1;e.d=dir;
if(!(wi==9&&k%2==1))g.pj.push({k:'fb',x:e.x+25,y:G*T-14,vx:dir*(wi==9?3.8:3),vy:0,w:20,h:20,a:0});
else g.pj.push({k:'lob',x:e.x+25,y:e.y,vx:Math.max(-4.5,Math.min(4.5,(p.x-e.x)/55)),vy:-9,w:18,h:18,a:0});
e.cd=(wi==9?85:120)-(e.mh-e.hp)*8;SFX.boss()}
function stomp(e,p,pts){e.dead=1;e.dt=20;p.vy=-8;g.coins+=pts;SFX.stomp();mq(1,1);vib(25);burst(e.x+13,e.y,6,'#fff')}
function upEn(e,p,fz){const t=e.t;
if(t==3){if(!fz){e.ph+=.03;e.h2=Math.max(0,Math.sin(e.ph))*40}if(e.h2>10&&ov(p,{x:e.x+4,y:e.by+1-e.h2,w:e.w,h:e.h}))hurt();return}
if(e.bi>0)e.bi--;
if(t==5){if(!fz){e.x+=e.d*e.s;if(e.x<e.x0)e.d=1;if(e.x>e.x1)e.d=-1;e.ph+=.045;e.y=G*T-26-(1-Math.cos(e.ph))*45}}
else if(t==7){if(!fz){const tx=Math.max(e.x0,Math.min(e.x1,p.x+(p.f>0?140:-140)));e.x+=Math.max(-2.4,Math.min(2.4,(tx-e.x)*.05));e.d=tx>e.x?1:-1;e.ph+=.05;e.y=G*T-150+Math.sin(e.ph)*14;e.cd++;
if(e.cd>=170&&Math.abs(p.x-e.x)<420&&g.en.filter(q=>q.sp&&!q.dead).length<2){e.cd=0;g.en.push({t:2,x:e.x,y:e.y+30,w:26,h:26,vy:0,d:p.x>e.x?1:-1,s:.9,o:0,dead:0,dt:0,sp:1})}}}
else if(t==8){if(!fz){e.ph+=.05;const dx=p.x-e.x,dy=p.y-e.y,near=Math.abs(dx)<330;e.sh=near&&p.f*(e.x-p.x)>0?1:0;
if(near&&!e.sh){e.x+=Math.sign(dx)*.9;e.y+=Math.max(-.5,Math.min(.5,dy*.02));e.d=dx>0?1:-1}else if(!near)e.y+=(e.by+Math.sin(e.ph)*10-e.y)*.05}}
else if(!fz){e.vy+=.5;if(mv(e,e.d*e.s,0)[0])e.d*=-1;
if(t==4){if(e.x<e.x0)e.d=1;if(e.x>e.x1)e.d=-1}
if(t==6){if(e.x<e.x0-40)e.d=1;if(e.x>e.x0+40)e.d=-1;e.tm++;if(e.tm%110==0&&Math.abs(p.x-e.x)<380){const dir=p.x>e.x?1:-1,ds=Math.min(260,Math.abs(p.x-e.x))*.8;e.d=dir;g.pj.push({k:'hm',x:e.x+14,y:e.y,vx:dir*Math.max(1.2,ds/46),vy:-8,w:14,h:14,a:0})}}
const h2=mv(e,0,e.vy)[1];
if(h2==1){e.vy=0;if(t==1&&g.t%90==e.o)e.vy=-8;if(t==4&&g.t%100==e.o)e.vy=-11}else if(h2==2)e.vy=0;
if(t==4&&!e.bi&&Math.abs(p.x-e.x)<560){if(e.tel>0){e.tel--;if(e.tel==0)bossFire(e,p)}else{e.cd--;if(e.cd<=0)e.tel=34}}}
if(e.y>H+100){e.dead=1;e.dt=0}
if(ov(p,e)){if(t==4){if(p.vy>0&&p.y+p.h-e.y<26&&!e.bi){e.hp--;e.bi=70;e.tel=0;p.vy=-10;SFX.boss();vib(70);burst(e.x+25,e.y,10,'#fff');if(e.hp<=0){e.dead=1;e.dt=60;g.coins+=20;g.pj.length=0;mq(4,1)}}else if(!e.bi)hurt()}
else if(t!=2&&t!=8&&p.vy>0&&p.y+p.h-e.y<20)stomp(e,p,1);else hurt()}}
function upd(){const p=g.p,[l,r,j]=ctl();g.t++;const fz=g.clk>0;
if(g.mag>0)g.mag--;if(g.bts>0)g.bts--;if(g.wng>0)g.wng--;if(g.clk>0)g.clk--;
for(const q of g.mp)mpUpd(q);
if(p.on){mv(p,p.on.dx,0)}
p.on=null;const wt=inWat(p);
const tx=((r?3.4:0)-(l?3.4:0))*(wt?.65:1);p.vx+=(tx-p.vx)*(tx?.25:.2);if(tx)p.f=tx>0?1:-1;
if(j&&p.gr&&!p.jh){p.vy=g.bts>0?-13.4:-11.2;p.gr=0;SFX.jump()}p.jh=j;if(!j&&p.vy<-4)p.vy=-4;
if(g.wng>0&&j&&!p.gr&&p.vy>-3.6)p.vy=Math.max(-3.6,p.vy-1.15);
p.vy=Math.min(wt?2.4:12,p.vy+(wt?.25:.55));if(wt&&j)p.vy=-4.5;
mv(p,p.vx,0);const hy=mv(p,0,p.vy,bump)[1];
if(hy==1){p.gr=1;p.vy=0}else{p.gr=0;if(hy==2)p.vy=0}
if(p.vy>=0){const pb=p.y+p.h;for(const q of g.mp)if(p.x+p.w>q.x+2&&p.x<q.x+q.w-2&&pb>=q.y&&pb-p.vy<=q.y+6){p.y=q.y-p.h;p.vy=0;p.gr=1;p.on=q;break}}
if(p.y<0){p.y=0;if(p.vy<0)p.vy=0}
p.an+=Math.abs(p.vx);if(p.gr&&g.t%30==0&&g.m[G][Math.floor(p.x/T)]==1&&g.m[G][Math.floor((p.x+p.w)/T)]==1&&okCk(p))g.ck=p.x;
if(g.inv>0)g.inv--;
if(wi==3&&p.y+p.h>12*T+6){burst(p.x+11,12*T,10,'#ff7a1a');die();return}
if(p.y>H+80)die();
for(const q of g.hz){if(!fz){if(q.k=='sw'){q.x+=q.d*q.s;if(q.x<q.x0)q.d=1;if(q.x>q.x1)q.d=-1;q.ph+=.3}else if(q.k=='fo')q.ph++}const R=hzRect(q);if(R&&ov(p,R))hurt()}
for(const e of g.en){if(e.dead){e.dt--;continue}if(Math.abs(p.x-e.x)>700)continue;upEn(e,p,fz)}
for(const q of g.pj){if(!fz){q.a++;q.x+=q.vx;if(q.k!='fb'){q.vy+=.35;q.y+=q.vy}}
if(ov(p,{x:q.x-q.w/2,y:q.y-q.h/2,w:q.w,h:q.h})){hurt();q.d=1}
const c=Math.floor(q.x/T);if(q.k=='fb'?sol(c,Math.floor(q.y/T)):q.vy>0&&sol(c,Math.floor((q.y+q.h/2)/T)))q.d=1;if(q.y>H||Math.abs(q.x-p.x)>800)q.d=1}
g.pj=g.pj.filter(q=>!q.d);
for(const c of g.gt)if(g.m[0][c]==7&&p.y+p.h>0&&Math.abs(p.x+11-(c*T+16))<34){if(g.key){g.key=0;for(let rr=0;rr<G;rr++)g.m[rr][c]=0;SFX.win();burst(c*T+16,G*T-60,14,'#ffd23a');toast('Gerbang terbuka!')}else if(g.t%90==0)toast('Butuh kunci!')}
if(g.mag>0)for(const c of g.co)if(!c.g){const dx=p.x+11-c.x,dy=p.y+15-c.y,d=Math.hypot(dx,dy);if(d<150&&d>1){c.x+=dx/d*7;c.y+=dy/d*7}}
for(const c of g.co)if(!c.g&&Math.abs(p.x+11-c.x)<22&&Math.abs(p.y+15-c.y)<26){c.g=1;g.coins++;mq(0,1);SFX.coin();fxAdd('sparkle_gold',c.x,c.y,28)}
for(const i of g.it)if(!i.g&&Math.abs(p.x+11-i.x)<24&&Math.abs(p.y+15-i.y)<28)pick(i);
for(const s of g.st)if(!s.g&&Math.abs(p.x+11-s.x)<24&&Math.abs(p.y+15-s.y)<28){s.g=1;g.stars++;mq(2,1);SFX.star();burst(s.x,s.y,10,'#ffd23a')}
for(const q of g.parts){q.x+=q.vx;q.y+=q.vy;q.vy+=.4;q.l--}g.parts=g.parts.filter(q=>q.l>0);
g.cam=Math.max(0,Math.min(N*T-W,p.x-W*.4));
if(p.x>(N-8)*T&&g.en.some(e=>e.t==4&&!e.dead)){p.x=(N-8)*T-2;if(g.t%60==0)toast('Kalahkan bos dulu!')}else if(p.x>(N-8)*T){S.st[wi]=Math.max(S.st[wi]||0,g.stars);S.u=Math.max(S.u,Math.min(10,wi+2));S.coins+=g.coins;mq(3,1);mqD=0;sv();scr='win';SFX.win();vib([50,40,50,40,90])}}

// ---------- drawing helpers
function rr(x,y,w,h,r){X.beginPath();X.roundRect(x,y,w,h,r)}
function txt(s,x,y,sz,col,al,sk){X.font='bold '+sz+'px system-ui,sans-serif';X.textAlign=al||'left';X.textBaseline='alphabetic';if(sk){X.lineWidth=Math.max(3,sz/6);X.strokeStyle=sk;X.lineJoin='round';X.strokeText(s,x,y)}X.fillStyle=col;X.fillText(s,x,y)}
function pill(x,y,w,h,c){X.fillStyle=c||'rgba(8,24,56,.85)';X.strokeStyle='#3a6ab0';X.lineWidth=2;rr(x,y,w,h,Math.min(14,h/2));X.fill();X.stroke()}
function star(x,y,r,c){const I=c=='#ffd23a'&&im('star');if(I){const s=r*2.4,w=s*I.width/I.height;X.drawImage(I,x-w/2,y-s/2,w,s);return}X.fillStyle=c;X.strokeStyle='#a56a00';X.lineWidth=1.5;X.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r*.45:r;X.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d)}X.closePath();X.fill();X.stroke()}
function coin(x,y,r){const I=im('coin');if(I){const s=r?r*2.3:26,w=s*I.width/I.height;X.drawImage(I,x-w/2,y-s/2,w,s);return}const w=r?r:Math.abs(Math.cos(fr/8))*9+2;X.fillStyle='#ffc21a';X.beginPath();X.ellipse(x,y,w,r||10,0,0,7);X.fill();X.strokeStyle='#b57a00';X.lineWidth=2;X.stroke()}
const HF={idle:0,jump:5,fall:6,hurt:7,die:8};
function heroA(x,y,f,c,st,k,sc){const I=im('hero'+c);if(!I)return false;const cw=I.width/9,i=st=='run'?1+(k%4):HF[st];if(i===undefined)return false;const dh=112*sc*.5681,dw=dh*cw/I.height;X.save();X.translate(x,y);X.scale(f,1);X.drawImage(I,i*cw,0,cw,I.height,-dw/2,-dh,dw,dh);X.restore();return true}
function hero(x,y,f,c,an,air,sc,st,fk){if(st&&heroA(x,y,f,c,st,fk,sc))return;const I=im('ch'+c);if(I){const h=38*sc*1.15,w=h*I.width/I.height,run=an>0,ph=an*.09,bob=!air&&run?Math.abs(Math.sin(ph))*3*sc:0,tilt=!air&&run?Math.sin(ph)*.09:0,sy=air?1.07:run?1+Math.sin(ph*2)*.04:1+Math.sin(fr/14)*.025,sx=air?.94:run?1-Math.sin(ph*2)*.03:1;X.save();X.translate(x,y-bob);X.scale(f,1);X.rotate(tilt);X.scale(sx,sy);X.drawImage(I,-w/2,-h,w,h);X.restore();return}const k=CH[c];X.save();X.translate(x,y);X.scale(f*sc,sc);const sw=air?0:Math.sin(an*.25)*4;
X.fillStyle='#4a2a14';X.beginPath();X.ellipse(-4+sw,-3,6,4,0,0,7);X.fill();X.beginPath();X.ellipse(5-sw,-3,6,4,0,0,7);X.fill();
X.fillStyle=k.ov;rr(-8,-19,16,13,3);X.fill();X.fillStyle=k.sh;X.fillRect(-10,-21,20,7);
X.beginPath();X.arc(-11,-14+(air?-5:sw/2),4,0,7);X.arc(11,-14+(air?-5:-sw/2),4,0,7);X.fill();
if(k.g){X.fillStyle='#6a3a2a';X.beginPath();X.arc(-11,-24,5,0,7);X.fill()}
X.fillStyle='#ffd2a0';X.beginPath();X.arc(0,-27,10,0,7);X.fill();
X.fillStyle=k.cap;X.beginPath();X.arc(0,-29,10.5,Math.PI,0);X.fill();X.beginPath();X.ellipse(8,-29,8,3,0,0,7);X.fill();
X.fillStyle='#fff';X.beginPath();X.arc(0,-34,3,0,7);X.fill();X.fillStyle='#222';X.beginPath();X.ellipse(4,-26,1.8,2.6,0,0,7);X.fill();X.restore()}
function avatar(x,y,r,c){X.save();X.fillStyle='#16396e';X.beginPath();X.arc(x,y,r,0,7);X.fill();X.clip();hero(x,y+r*2.25,1,c,0,1,r/12);X.restore();X.strokeStyle='#eef4ff';X.lineWidth=2;X.beginPath();X.arc(x,y,r,0,7);X.stroke()}
function castle(x,y,s){X.fillStyle='#e8e0f4';X.fillRect(x-30*s,y-50*s,60*s,50*s);X.fillRect(x-48*s,y-72*s,20*s,72*s);X.fillRect(x+28*s,y-72*s,20*s,72*s);X.fillRect(x-10*s,y-80*s,20*s,30*s);
X.fillStyle='#d94a4a';[[x-38*s,y-72*s,14],[x+38*s,y-72*s,14],[x,y-80*s,14]].forEach(([a,b,w])=>{X.beginPath();X.moveTo(a-w*s,b);X.lineTo(a,b-26*s);X.lineTo(a+w*s,b);X.fill()});
X.fillStyle='#5a3a8a';rr(x-7*s,y-22*s,14*s,22*s,6*s);X.fill()}
function bg(w,cam){const B=im('bg'+w);if(B){const s=H/B.height,bw=B.width*s,off=(cam*.1)%(bw*2);X.imageSmoothingEnabled=true;for(let i=-1;i<Math.ceil(W/bw)+2;i++){const x=i*bw-off;X.save();if(i%2){X.translate(x+bw,0);X.scale(-1,1);X.drawImage(B,0,0,bw,H)}else X.drawImage(B,x,0,bw,H);X.restore()}return}const th=TH[w],gr=X.createLinearGradient(0,0,0,H);gr.addColorStop(0,th[1]);gr.addColorStop(1,th[2]);X.fillStyle=gr;X.fillRect(0,0,W,H);
if(w==7||w==9){X.fillStyle='#fff';for(let i=0;i<40;i++){X.globalAlpha=.4+(i%3)*.2;X.fillRect((i*97)%W,(i*53)%240,2,2)}X.globalAlpha=1}
else if(w!=3&&w!=6){X.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++){const x=((i*190-cam*.15)%1140+1140)%1140-150,y=40+(i*37)%90;X.beginPath();X.ellipse(x,y,40,14,0,0,7);X.fill();X.beginPath();X.ellipse(x+25,y-8,28,14,0,0,7);X.fill()}}
const tri=[1,2,3,7].includes(w),b=cam*.35,k0=Math.floor(b/200);X.fillStyle=th[5];
for(let i=0;i<6;i++){const x=i*200-(b%200),hh=90+((i+k0)*47)%60;X.beginPath();if(tri){X.moveTo(x-110,G*T);X.lineTo(x,G*T-hh-30);X.lineTo(x+110,G*T)}else X.ellipse(x,G*T,120,hh,0,Math.PI,2*Math.PI);X.fill()}
if(w==0)castle(560-cam*.2,G*T-20,1.4)}
function gtile(r,c,x,y){const I=im('g'+wi+((r>0&&SOL[g.m[r-1][c]])?'b':'t'));if(!I)return false;X.drawImage(I,Math.floor(x),y,T+1,T);return true}
function pitfill(c0,c1){if(wi==3){const I=im('lava');if(I)for(let c=c0;c<=c1;c++)if(!g.m[12][c])for(let r=12;r<14;r++)X.drawImage(I,Math.floor(c*T-g.cam),r*T,T+1,T)}
const Wi=im('water');for(const q of g.wp)for(let c=Math.max(q.c0,c0);c<=Math.min(q.c1,c1);c++)for(let r=G;r<13;r++){if(Wi)X.drawImage(Wi,Math.floor(c*T-g.cam),r*T,T+1,T);else{X.fillStyle='#2a7acc';X.fillRect(c*T-g.cam,r*T,T+1,T)}}}
function tiles(){pitfill(Math.max(0,Math.floor(g.cam/T)),Math.min(N-1,Math.floor(g.cam/T)+26));const c0=Math.floor(g.cam/T),c1=Math.min(N-1,c0+26),th=TH[wi];
for(let r=0;r<14;r++)for(let c=c0;c<=c1;c++){const t=g.m[r][c];if(!t)continue;const x=c*T-g.cam,y=r*T;
if(t==7){gateDraw(x,y,r)}else if(t==1&&gtile(r,c,x,y)){}else if(t==1){X.fillStyle=th[4];X.fillRect(x,y,T,T);X.fillStyle='rgba(0,0,0,.15)';X.fillRect(x+6,y+14,5,5);X.fillRect(x+20,y+8,4,4);
if(!(r>0&&SOL[g.m[r-1][c]])){X.fillStyle=th[3];X.fillRect(x,y,T,10);X.fillStyle='rgba(255,255,255,.25)';X.fillRect(x,y,T,3)}}
else if(t==2&&im('brick_block')){X.drawImage(IM.brick_block,x,y,T,T)}else if(t==2){X.fillStyle='#c8642a';X.fillRect(x,y,T,T);X.strokeStyle='#6a2e10';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2);X.beginPath();X.moveTo(x,y+16);X.lineTo(x+T,y+16);X.moveTo(x+16,y);X.lineTo(x+16,y+16);X.moveTo(x+8,y+16);X.lineTo(x+8,y+T);X.moveTo(x+24,y+16);X.lineTo(x+24,y+T);X.stroke()}
else if(t==3&&im('question_block')){X.drawImage(IM.question_block,x,y,T,T)}else if(t==3||t==4){X.fillStyle=t==3?'#f5b21a':'#7a5a3a';X.fillRect(x,y,T,T);X.strokeStyle=t==3?'#8a5a00':'#3a2a1a';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2);if(t==3)txt('?',x+16,y+24,22,'#fff','center','#8a5a00')}
else if(t==6&&im('green_pipe')){if(!(r>0&&g.m[r-1][c]==6)){let h=1;while(r+h<14&&g.m[r+h][c]==6)h++;X.drawImage(IM.green_pipe,x-4,y,T+8,h*T)}}else if(t==6){const top=!(r>0&&g.m[r-1][c]==6);X.fillStyle='#2fae3a';X.fillRect(x+2,y,T-4,T);X.fillStyle='#7be07f';X.fillRect(x+6,y,4,T);if(top){X.fillStyle='#2fae3a';X.fillRect(x-2,y,T+4,12);X.fillStyle='#7be07f';X.fillRect(x+2,y,4,12);X.strokeStyle='#14662a';X.lineWidth=2;X.strokeRect(x-2,y,T+4,12)}}}}
function plant(e){const cx=e.x+16-g.cam,cy=e.by+14-e.h2;X.fillStyle='#2fae3a';X.fillRect(cx-3,cy,6,e.h2+20);{const I=im('plant');if(I){const w=34,h=w*I.height/I.width;X.drawImage(I,cx-w/2,cy-h*.62,w,h);return}}X.fillStyle='#e8352f';X.beginPath();X.arc(cx,cy,13,0,7);X.fill();
X.fillStyle='#fff';X.beginPath();X.arc(cx-6,cy-7,3,0,7);X.arc(cx+6,cy-7,3,0,7);X.fill();X.beginPath();X.arc(cx,cy+1,8,0,Math.PI);X.fill();X.fillStyle='#222';X.fillRect(cx-8,cy,16,2)}
function enemy0(e){const I=im(eImg(e));if(I){const h=EH[e.t]||34,w=h*I.width/I.height;X.save();X.translate(e.x-g.cam+e.w/2,e.y+e.h-(e.dead?0:Math.abs(Math.sin(g.t/6))*2));if(e.dead)X.scale(1,.25);X.scale(e.d>0?-1:1,1);X.drawImage(I,-w/2,-h,w,h);X.restore();return}X.save();X.translate(e.x-g.cam+13,e.y+26);if(e.dead)X.scale(1,.25);const ft=(g.t>>3)&1;
if(e.t==0){X.fillStyle='#8a4a22';X.beginPath();X.ellipse(0,-12,14,14,0,Math.PI,2*Math.PI);X.fill();X.fillStyle='#f0c898';X.fillRect(-9,-12,18,8);X.fillStyle='#3a1f10';X.beginPath();X.ellipse(-6+ft*2,-3,6,3,0,0,7);X.ellipse(6-ft*2,-3,6,3,0,0,7);X.fill();
X.fillStyle='#fff';X.fillRect(-8,-18,6,7);X.fillRect(2,-18,6,7);X.fillStyle='#222';X.fillRect(-5,-15,3,4);X.fillRect(2,-15,3,4)}
else if(e.t==1){X.fillStyle='#3a8aff';X.beginPath();X.moveTo(-13,0);X.quadraticCurveTo(-14,-26,0,-27);X.quadraticCurveTo(14,-26,13,0);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(-5,-13,4,0,7);X.arc(5,-13,4,0,7);X.fill();X.fillStyle='#123';X.beginPath();X.arc(-4,-12,2,0,7);X.arc(6,-12,2,0,7);X.fill()}
else{X.fillStyle='#d92a2a';X.beginPath();X.arc(0,-8,13,Math.PI,2*Math.PI);X.fill();X.fillStyle='#fff';for(let i=0;i<5;i++){const a=Math.PI+(i+.5)*Math.PI/5;X.beginPath();X.moveTo(Math.cos(a-.2)*12,-8+Math.sin(a-.2)*12);X.lineTo(Math.cos(a)*20,-8+Math.sin(a)*20);X.lineTo(Math.cos(a+.2)*12,-8+Math.sin(a+.2)*12);X.fill()}
X.fillStyle='#ffd34a';X.beginPath();X.ellipse(0,-5,10,6,0,0,7);X.fill();X.fillStyle='#222';X.fillRect(-5,-8,3,4);X.fillRect(3,-8,3,4)}X.restore()}
// ---------- screens
function uiIcon(k,cx,cy,sz){X.save();X.translate(cx,cy);X.scale(sz/20,sz/20);X.fillStyle=X.strokeStyle='#e8f4ff';X.lineWidth=2.2;X.lineJoin=X.lineCap='round';
if(k=='cart'){X.beginPath();X.moveTo(-10,-8);X.lineTo(-6,-8);X.lineTo(-3,5);X.lineTo(8,5);X.lineTo(10,-4);X.lineTo(-5,-4);X.stroke();X.beginPath();X.arc(-2,9,2,0,7);X.arc(7,9,2,0,7);X.fill()}
else if(k=='user'){X.beginPath();X.arc(0,-5,5.5,0,7);X.fill();X.beginPath();X.moveTo(-10,11);X.quadraticCurveTo(0,-3,10,11);X.closePath();X.fill()}
else if(k=='shop'){X.fillRect(-9,-2,18,11);X.beginPath();X.moveTo(-11,-2);X.lineTo(-8,-9);X.lineTo(8,-9);X.lineTo(11,-2);X.closePath();X.fill();X.fillStyle='#0f3a78';X.fillRect(-2.5,3,5,6)}
else if(k=='target'){X.beginPath();X.arc(0,0,9,0,7);X.stroke();X.beginPath();X.arc(0,0,4.5,0,7);X.stroke();X.beginPath();X.arc(0,0,1.5,0,7);X.fill()}
else if(k=='gear'){for(let i=0;i<8;i++){X.save();X.rotate(i*Math.PI/4);X.fillRect(-2.5,-11,5,5);X.restore()}X.lineWidth=3.5;X.beginPath();X.arc(0,0,7,0,7);X.stroke();X.beginPath();X.arc(0,0,2.5,0,7);X.fill()}
else if(k=='left'||k=='right'||k=='up'){X.rotate(k=='right'?Math.PI:k=='up'?Math.PI/2:0);X.beginPath();X.moveTo(-10,0);X.lineTo(0,-10);X.lineTo(0,-4.5);X.lineTo(10,-4.5);X.lineTo(10,4.5);X.lineTo(0,4.5);X.lineTo(0,10);X.closePath();X.fill()}
X.restore()}
function uiCard(x,y,w,h,on){const gr=X.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,on?'#1d4a8c':'#112c58');gr.addColorStop(1,on?'#12326a':'#0a1c3c');X.fillStyle=gr;X.strokeStyle=on?'#ffd23a':'#2f5ea0';X.lineWidth=on?3:2;rr(x,y,w,h,12);X.fill();X.stroke()}
function uiFrame(x,y,w,h){X.fillStyle='rgba(6,18,44,.88)';X.strokeStyle='#2a5aa0';X.lineWidth=2;rr(x,y,w,h,14);X.fill();X.stroke()}
function uiLock(cx,cy){const gr=X.createLinearGradient(0,cy-6,0,cy+26);gr.addColorStop(0,'#b2a8f0');gr.addColorStop(1,'#7a6fd0');X.strokeStyle='#9a8fe0';X.lineWidth=7;X.beginPath();X.arc(cx,cy-6,12,Math.PI,2*Math.PI);X.stroke();X.fillStyle=gr;rr(cx-19,cy-4,38,30,7);X.fill();X.fillStyle='#4a3f9a';X.beginPath();X.arc(cx,cy+8,4.5,0,7);X.fill();X.fillRect(cx-2,cy+8,4,9)}
function dimBg(){X.fillStyle='rgba(6,16,40,.78)';X.fillRect(0,0,W,H)}
function topBar(){pill(28,12,134,36);avatar(34,30,19,S.ch);txt('Player',62,28,13,'#fff');txt('Lv. 12',62,43,11,'#8fc4ff');X.fillStyle='rgba(120,200,255,.25)';rr(104,36,52,5,2);X.fill();X.fillStyle='#4ad8ff';rr(104,36,17,5,2);X.fill();
pill(300,12,120,34);coin(318,29,9);txt(''+S.coins,334,35,17,'#fff');pill(436,12,100,34);{const D=im('diamond');if(D){const h=24,w=h*D.width/D.height;X.drawImage(D,454-w/2,17,w,h)}else{X.fillStyle='#4ab8ff';X.beginPath();X.moveTo(446,28);X.lineTo(454,20);X.lineTo(462,28);X.lineTo(454,40);X.fill()}}txt(''+S.gems,472,35,17,'#fff');
const gg=X.createLinearGradient(0,9,0,47);gg.addColorStop(0,'#3a86e8');gg.addColorStop(1,'#1a4aa8');X.fillStyle=gg;X.strokeStyle='#8fc4ff';X.lineWidth=2;X.beginPath();X.arc(580,28,19,0,7);X.fill();X.stroke();uiIcon('gear',580,28,24)}
function btn(x,y,w,h,t,v,ic){const V={gold:['#ffd54a','#f08a10','#fff2a0','#a85a00'],blue:['#3aa0ff','#1a62d8','#a8dcff','#0a3a8a'],green:['#4fd86a','#1fa045','#b6ffc4','#0a5a22'],dark:['#1f4f93','#0c2a5c','#4a8ad8',null]},k=v===1?'gold':(v||'dark'),c=V[k],col=k!='dark';
const gr=X.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,c[0]);gr.addColorStop(1,c[1]);X.fillStyle=gr;X.strokeStyle=c[2];X.lineWidth=2;rr(x,y,w,h,col?Math.min(14,h/2):h/2);X.fill();X.stroke();
if(col){X.fillStyle='rgba(255,255,255,.28)';rr(x+4,y+3,w-8,h*.38,8);X.fill()}
let tx=x+w/2;if(ic){const b=h-10;X.fillStyle='#143a78';rr(x+5,y+5,b,b,9);X.fill();X.strokeStyle='#4a8ad8';X.lineWidth=1.5;X.stroke();uiIcon(ic,x+5+b/2,y+5+b/2,b*.62);tx=x+5+b+(w-5-b)/2}
txt(t,tx,y+h/2+6,col?(h>40?22:(h>30?17:15)):16,'#fff','center',c[3])}
function dMenu(){bg(0,fr*.5);if(!im('bg0'))castle(520,350,1.5);
X.fillStyle='#565a4e';X.beginPath();X.ellipse(270,394,100,22,0,0,7);X.fill();X.fillStyle='#6d7264';X.fillRect(170,368,200,26);X.strokeStyle='rgba(0,0,0,.18)';X.lineWidth=2;for(let i=0;i<8;i++){X.beginPath();X.moveTo(170+i*28.6,368);X.lineTo(170+i*28.6,394);X.stroke()}
X.fillStyle='#9aa08a';X.beginPath();X.ellipse(270,368,100,22,0,0,7);X.fill();X.strokeStyle='#5fb04a';X.lineWidth=5;X.stroke();X.fillStyle='#b9c0a4';X.beginPath();X.ellipse(270,368,84,17,0,0,7);X.fill();
hero(270,372,1,S.ch,0,0,4.2);topBar();
txt('JUMP',273,116,64,'rgba(0,0,0,.35)','center');txt('QUEST',273,170,58,'rgba(0,0,0,.35)','center');
txt('JUMP',270,112,64,'#ffc82a','center','#7a3a00');txt('QUEST',270,166,58,'#2f8bff','center','#0a2a6a');
{const Cr=im('crown');if(Cr){const h=32,w=h*Cr.width/Cr.height;X.drawImage(Cr,270-w/2,30,w,h)}}
btn(20,190,160,46,'Play',1,'cart');['Character','Shop','Mission','Settings'].forEach((t,i)=>btn(20,246+i*40,150,34,t,'dark',['user','shop','target','gear'][i]));if(mqReady())bdg(166,331);
let ts=0;for(const k in S.st)ts+=S.st[k];uiCard(620,190,160,60);txt('World 1',634,210,14,'#fff');txt('Green Grassland',634,225,11,'#9cc8ff');X.fillStyle='rgba(0,0,0,.35)';rr(630,230,140,17,8);X.fill();star(644,238.5,7,'#ffd23a');txt(ts+'/30',660,243,12,'#fff');
uiCard(650,270,100,90);{const I=im('chest');if(I){const h=52,w=h*I.width/I.height;X.drawImage(I,700-w/2,278,w,h)}else{X.fillStyle='#c8782a';rr(666,282,68,40,6);X.fill()}}txt('Daily Reward',700,350,11,'#fff','center');if(dInfo().can)bdg(742,277)}
function dLev(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Map / Level Select',40,88,18,'#fff');
for(let i=0;i<10;i++){const x=40+i%5*150,y=100+(i/5|0)*170,th=TH[i],un=i<S.u;uiCard(x,y,130,150);
if(un){const B=im('bg'+i);X.save();rr(x+6,y+6,118,84,9);X.clip();if(B){const sc=Math.max(118/B.width,84/B.height);X.drawImage(B,x+6+(118-B.width*sc)/2,y+6+(84-B.height*sc)/2,B.width*sc,B.height*sc)}else{const gr=X.createLinearGradient(0,y,0,y+90);gr.addColorStop(0,th[1]);gr.addColorStop(1,th[2]);X.fillStyle=gr;X.fillRect(x+6,y+6,118,84)}X.restore();
txt('World '+(i+1),x+65,y+108,14,'#fff','center');txt(th[0],x+65,y+122,10,'#6ad8ff','center');const n=S.st[i]||0;X.fillStyle='rgba(0,0,0,.35)';rr(x+25,y+128,80,16,8);X.fill();star(x+39,y+136,7,n>0?'#ffd23a':'#8a94a8');txt(n+'/3',x+54,y+141,11,'#fff')}
else{txt('World '+(i+1),x+65,y+24,13,'#fff','center');uiLock(x+65,y+84)}}}
function dChar(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Karakter',40,88,18,'#fff');
for(let i=0;i<4;i++){const x=70+i*180;uiCard(x,110,150,230,S.ch==i);if(!S.own[i])X.globalAlpha=.5;hero(x+75,270+Math.sin(fr/12+i)*3,1,i,fr*.6,0,3.8);X.globalAlpha=1;txt(CH[i].n,x+75,320,16,'#fff','center')}}
function hud(){fxHud();const B=g.en.find(e=>e.t==4&&!e.dead);if(B&&Math.abs(g.p.x-B.x)<650){pill(300,50,200,16,'rgba(60,0,0,.85)');X.fillStyle='#ff4a3a';X.fillRect(304,54,192*B.hp/B.mh,8);txt('BOSS',400,46,12,'#fff','center','#600')}
pill(10,8,92,36);avatar(30,26,14,S.ch);txt('x '+g.lives,52,34,16,'#fff');pill(112,8,100,36);coin(130,26,9);txt(''+g.coins,146,33,17,'#fff');pill(222,8,84,36);star(240,26,10,'#ffd23a');txt(g.stars+'/3',256,33,16,'#fff');
const pg=X.createLinearGradient(0,8,0,44);pg.addColorStop(0,'#4aa0ff');pg.addColorStop(1,'#1c5ad0');X.fillStyle=pg;X.strokeStyle='#bfe0ff';X.lineWidth=2;rr(746,8,44,36,10);X.fill();X.stroke();X.fillStyle='#fff';rr(758,16,7,20,2);X.fill();rr(771,16,7,20,2);X.fill();
X.globalAlpha=.78;[[60,390,'left'],[150,390,'right'],[740,390,'up']].forEach(([x,y,k],i)=>{const r=i==2?44:40,gr=X.createRadialGradient(x,y-10,5,x,y,r);gr.addColorStop(0,'#aab4c4');gr.addColorStop(1,'#5a6678');X.fillStyle=gr;X.strokeStyle='#eef3fb';X.lineWidth=4;X.beginPath();X.arc(x,y,r,0,7);X.fill();X.stroke();uiIcon(k,x,y,i==2?30:28)});X.globalAlpha=1}
function dGame(){const p=g.p;const stt=scr=='over'?'die':g.inv>85?'hurt':!p.gr?(p.vy<0?'jump':'fall'):Math.abs(p.vx)>.6?'run':'idle';bg(wi,g.cam);for(const e of g.en)if(e.t==3)plant(e);decor();tiles();
npc();const fx=(N-8)*T-g.cam;if(im('flag_red')){const I=IM.flag_red,h=6*T,w=h*I.width/I.height;X.drawImage(I,fx-w*.12,G*T-h,w,h)}else{X.fillStyle='#ccd';X.fillRect(fx,(G-6)*T,5,6*T);X.fillStyle='#e8352f';X.beginPath();X.moveTo(fx+5,(G-6)*T);X.lineTo(fx+40,(G-6)*T+14);X.lineTo(fx+5,(G-6)*T+28);X.fill();}
for(const c of g.co)if(!c.g)coin(c.x-g.cam,c.y);for(const s of g.st)if(!s.g)star(s.x-g.cam,s.y+Math.sin(fr/10)*3,13,'#ffd23a');
hzDraw();mpDraw();itDraw();for(const e of g.en)if(e.t!=3&&!(e.dead&&e.dt<=0)&&!(e.bi>0&&(e.bi>>2)%2))enemy(e);
aura();if(!(g.inv>0&&(g.inv>>2)%2))hero(p.x+11-g.cam,p.y+p.h,p.f,S.ch,Math.abs(p.vx)>.6?p.an+1:0,!p.gr,.8*(g.big?1.2:1),stt,Math.floor(p.an/20));
for(const q of g.parts){X.fillStyle=q.c;X.fillRect(q.x-g.cam,q.y,5,5)}pjDraw();wDraw();fxDraw();hud()}
function panel(t){X.fillStyle='rgba(0,0,0,.55)';X.fillRect(0,0,W,H);uiFrame(150,70,500,330);txt(t,400,130,34,'#ffd23a','center','#7a3a00')}
function draw(){fr++;X.clearRect(0,0,W,H);
if(scr=='menu')dMenu();else if(scr=='lev')dLev();else if(scr=='char')dChar();else if(scr=='shop')dShop();else if(scr=='mis')dMis();else if(scr=='daily')dDaily();else if(scr=='set')dSet();else{dGame();
if(scr=='pause'){panel('PAUSE');btn(300,190,200,44,'Lanjut',1);btn(300,250,200,44,'Menu')}
else if(scr=='win'){panel('LEVEL SELESAI!');for(let i=0;i<3;i++)star(330+i*70,205,28,i<g.stars?'#ffd23a':'#556');coin(360,262,12);txt('x '+g.coins,380,270,22,'#fff');btn(170,320,140,44,'Menu');btn(330,320,140,44,'Retry','green');if(wi<9)btn(490,320,140,44,'Next','blue')}
else if(scr=='over'){panel('GAME OVER');txt('Coba lagi, kamu pasti bisa!',400,230,18,'#fff','center');btn(230,320,160,44,'Menu');btn(410,320,160,44,'Retry','green')}}
if(tm>0){tm--;pill(250,400,300,34);txt(tmsg,400,423,14,'#fff','center')}}
const EH={5:34,6:42,7:42,8:34};
function eImg(e){return e.t==0?['goomba','koopa','buzzy_beetle'][e.o%3]:e.t==1?(wi%2?'red_slime':'blue_slime'):e.t==4?'boss':e.t==5?'flying_koopa':e.t==6?'hammer_bro':e.t==7?'lakitu':e.t==8?'boo':'spiky'}
function enemy(e){const sx=e.x-g.cam+e.w/2;
if(e.t==4&&e.tel>0){X.fillStyle='rgba(255,70,30,'+(.25+.15*Math.sin(fr/2))+')';X.beginPath();X.arc(sx,e.y+e.h/2,44,0,7);X.fill()}
if(e.t==6&&!e.dead&&e.tm%110>85){X.save();X.translate(sx-(e.d>0?-8:8),e.y-8);X.rotate(Math.sin(fr/3)*.4);hamr(0,0);X.restore()}
if(e.t==8)X.globalAlpha=e.sh?.45:1;
enemy0(e);X.globalAlpha=1}
function hamr(x,y){X.fillStyle='#7a4a1a';X.fillRect(x-2,y-2,4,16);X.fillStyle='#9aa4b8';X.fillRect(x-8,y-8,16,9);X.strokeStyle='#333';X.lineWidth=1.5;X.strokeRect(x-8,y-8,16,9)}
function hzDraw(){for(const h of g.hz){const sx=h.x-g.cam;if(sx<-200||sx>W+200)continue;
if(h.k=='sp'){for(let i=0;i<h.w/16;i++){const bx=sx+i*16;X.fillStyle='#d4dbe8';X.strokeStyle='#4a5468';X.lineWidth=1.5;X.beginPath();X.moveTo(bx+1,h.y+h.h);X.lineTo(bx+8,h.y-2);X.lineTo(bx+15,h.y+h.h);X.closePath();X.fill();X.stroke()}}
else if(h.k=='sw'){const I=im(h.c);X.save();X.translate(sx+14,h.y+14);X.rotate(h.ph);if(I)X.drawImage(I,-18,-18,36,36);else{X.fillStyle='#aab';X.beginPath();X.arc(0,0,16,0,7);X.fill();X.fillStyle='#667';X.fillRect(-16,-2,32,4)}X.restore()}
else{const R=hzRect(h);if(R){const cx=R.x+9-g.cam,cy=R.y+9,gr=X.createRadialGradient(cx,cy,2,cx,cy,13);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.5,'#ff9a1a');gr.addColorStop(1,'rgba(255,60,0,0)');X.fillStyle=gr;X.beginPath();X.arc(cx,cy,13,0,7);X.fill()}}}}
function mpDraw(){for(const q of g.mp){const sx=q.x-g.cam;if(sx<-120||sx>W+40)continue;const I=im('wood_platform');if(I)X.drawImage(I,sx,q.y-6,q.w,26);else{X.fillStyle='#a8742f';X.fillRect(sx,q.y,q.w,q.h);X.fillStyle='#d9a45a';X.fillRect(sx,q.y,q.w,4)}}}
function itDraw(){for(const i of g.it){if(i.g)continue;const sx=i.x-g.cam;if(sx<-40||sx>W+40)continue;const I=im(i.k=='key'?'key_item':i.k),y=i.y+Math.sin(fr/12+i.x)*4;X.fillStyle='rgba(255,230,120,.28)';X.beginPath();X.arc(sx,y,19,0,7);X.fill();if(I){const h=30,w=h*I.width/I.height;X.drawImage(I,sx-w/2,y-h/2,w,h)}else{X.fillStyle='#ffd23a';X.fillRect(sx-8,y-8,16,16)}}}
function pjDraw(){for(const q of g.pj){const sx=q.x-g.cam;if(q.k=='hm'){X.save();X.translate(sx,q.y);X.rotate(q.a*.3);hamr(0,-6);X.restore()}else{const gr=X.createRadialGradient(sx,q.y,2,sx,q.y,q.w*.8);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.5,'#ff7a1a');gr.addColorStop(1,'rgba(255,40,0,0)');X.fillStyle=gr;X.beginPath();X.arc(sx,q.y,q.w*.8,0,7);X.fill()}}}
function wDraw(){X.fillStyle='rgba(40,130,230,.32)';for(const q of g.wp){const x0=q.c0*T-g.cam,w=(q.c1-q.c0+1)*T;if(x0>W||x0+w<0)continue;X.fillRect(x0,G*T,w,2*T);X.fillStyle='rgba(255,255,255,.5)';X.fillRect(x0,G*T,w,2);X.fillStyle='rgba(40,130,230,.32)'}}
function gateDraw(x,y,r){const I=im('stone_blocks');if(I)X.drawImage(I,x,y,T,T);else{X.fillStyle='#6a6a7a';X.fillRect(x,y,T,T);X.strokeStyle='#33334a';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2)}
if(r==G-3){const K2=im('key');if(K2){const h=26,w=h*K2.width/K2.height;X.drawImage(K2,x+16-w/2,y+3,w,h)}else{X.fillStyle='#ffd23a';X.fillRect(x+10,y+8,12,16)}}}
function aura(){const p=g.p,sx=p.x+11-g.cam;if(g.wng>0){const I=im('wing');if(I){const h=30,w=h*I.width/I.height;X.save();X.translate(sx,p.y+16);X.scale(-p.f,1);X.drawImage(I,-w-4,-h/2-4+Math.sin(fr/3)*3,w,h);X.restore()}}
if(g.sh){X.strokeStyle='rgba(120,200,255,.9)';X.lineWidth=3;X.fillStyle='rgba(120,200,255,.18)';X.beginPath();X.arc(sx,p.y+15,24,0,7);X.fill();X.stroke()}}
function fxHud(){const L=[];if(g.mag>0)L.push(['magnet',Math.ceil(g.mag/60)]);if(g.bts>0)L.push(['boots',Math.ceil(g.bts/60)]);if(g.wng>0)L.push(['wing',Math.ceil(g.wng/60)]);if(g.clk>0)L.push(['clock',Math.ceil(g.clk/60)]);if(g.sh)L.push(['shield','']);if(g.big)L.push(['mushroom','']);if(g.key)L.push(['key_item','']);
L.forEach(([k,v],i)=>{const x=10+i*52;pill(x,50,48,24);const I=im(k);if(I){const h=18,w=h*I.width/I.height;X.drawImage(I,x+6,53,w,h)}if(v!=='')txt(''+v,x+30,68,12,'#fff')})}
let AC=null,nn=0,stp=0;
function resumeAudio(){try{if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}if(AC&&AC.state=='suspended')AC.resume().catch(()=>{})}catch(e){AC=null}}
function tone(f,d,ty,v,sl,at,m){if(!(m?OPT.mu:OPT.sf)||!AC||AC.state!='running')return;try{const o=AC.createOscillator(),q=AC.createGain(),t=at||AC.currentTime;o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,sl),t+d);q.gain.setValueAtTime(v||.07,t);q.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(q);q.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const SFX={jump:()=>tone(300,.18,'square',.06,720),coin:()=>{tone(988,.07,'square',.05);tone(1319,.14,'square',.05,0,AC&&AC.currentTime+.07)},star:()=>{[660,880,1175].forEach((f,i)=>tone(f,.15,'triangle',.08,0,AC&&AC.currentTime+i*.08))},stomp:()=>tone(220,.14,'square',.09,60),bump:()=>tone(150,.1,'square',.08,80),hurt:()=>tone(320,.35,'sawtooth',.08,70),boss:()=>{tone(160,.3,'sawtooth',.1,50);tone(90,.3,'square',.08,40)},win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.22,'square',.07,0,AC&&AC.currentTime+i*.13))}};
const MA=[523,0,659,784,0,659,587,0,523,0,659,784,880,784,659,0],MB=[440,0,523,659,0,523,494,0,440,0,523,659,698,659,523,0],BS=[131,175,196,175];
function music(){if(!OPT.mu||!AC||AC.state!='running'){nn=0;return}if(!nn||nn<AC.currentTime-.5)nn=AC.currentTime+.05;const bo=scr=='game'&&wi%5==4,sp=bo?.16:.2,ml=bo?MB:MA;while(nn<AC.currentTime+.15){const k=stp%16;if(ml[k])tone(ml[k],sp*.9,'square',.03,0,nn,1);if(k%4==0)tone(BS[(stp>>2)%4]*(bo?.84:1),sp*3.4,'triangle',.06,0,nn,1);stp++;nn+=sp}}
const PR=[0,500,800,1200],FX=[];
const DEC=[['tree_1','bush','flower_bush','flower_yellow','fence','signpost'],['wood_crate','barrel','signpost','fence'],['tree_2','tree_3','bush','signpost'],['barrel','wood_crate','street_lamp'],['tree_1','tree_2','tree_3','bush','flower_yellow','bush_flowers'],['bush','flower_bush','flower_yellow','tree_1','fence'],['wood_crate','barrel','signpost'],['street_lamp','barrel','signpost','wood_crate'],['flower_bush','bush_flowers','flower_yellow','tree_3','fence'],['wood_crate','street_lamp','signpost']];
const DH={tree_1:84,tree_2:78,tree_3:70,bush:28,bush_flowers:44,flower_bush:34,flower_yellow:26,fence:26,signpost:40,street_lamp:76,wood_crate:32,barrel:34};
function decor(){for(const d of g.dec){const sx=d.x-g.cam;if(sx<-60||sx>W+60)continue;const I=im(d.k);if(!I)continue;const h=DH[d.k],w=h*I.width/I.height;X.drawImage(I,sx-w/2,G*T-h+2,w,h)}}
function fxAdd(k,x,y,s){FX.push({k,x,y,s,t:fr})}
function fxDraw(){while(FX.length&&fr-FX[0].t>=22)FX.shift();for(const q of FX){const I=im(q.k);if(!I)continue;const a=(fr-q.t)/22,s=q.s*(.6+a*.8),w=s*I.width/I.height;X.globalAlpha=Math.max(0,1-a);X.drawImage(I,q.x-g.cam-w/2,q.y-s/2,w,s)}X.globalAlpha=1}
function npc(){const I=im(['princess','frog_npc','penguin_npc'][wi%3]);if(!I)return;const nx=7*T,sx=nx-g.cam;if(sx<-60||sx>W+60)return;const h=46,w=h*I.width/I.height;X.drawImage(I,sx-w/2,G*T-h,w,h);
if(Math.abs(g.p.x-nx)<150){const t=wi%5==4?'Hati-hati, bos menunggu di ujung level!':['Ayo! Petualangan kita baru saja dimulai!','Pukul blok ? dari bawah untuk koin!','Injak musuh untuk mengalahkannya!'][wi%3];X.font='bold 12px system-ui,sans-serif';const tw=X.measureText(t).width+20;pill(sx-tw/2,G*T-h-38,tw,26,'rgba(255,255,255,.92)');txt(t,sx,G*T-h-20,12,'#123','center')}}
function dShop(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Shop',40,92,18,'#fff');
const sk=im('shopkeeper');if(sk){const h=40,w=h*sk.width/sk.height;X.drawImage(sk,100,64,w,h)}
for(let i=0;i<5;i++){const x=40+i*150,y=130;uiCard(x,y,130,250,S.ch==i&&i<4);
if(i<4){if(!S.own[i])X.globalAlpha=.5;hero(x+65,y+130,1,i,fr*.5,0,2.8);X.globalAlpha=1;txt(CH[i].n,x+65,y+156,15,'#fff','center');
if(S.own[i])btn(x+15,y+196,100,28,S.ch==i?'Dipakai':'Pilih',S.ch==i?'green':'blue');else{btn(x+15,y+196,100,28,''+PR[i],'gold');coin(x+32,y+210,8)}}
else{const Ht=im('heart');if(Ht){const h=54,w=h*Ht.width/Ht.height;X.drawImage(Ht,x+65-w/2,y+70,w,h)}else txt('❤',x+65,y+110,60,'#ff4a5a','center');txt('Nyawa awal +1',x+65,y+156,13,'#fff','center');txt(S.xl+'/2',x+65,y+176,13,'#9cc8ff','center');
if(S.xl<2){btn(x+15,y+196,100,28,'300','gold');coin(x+32,y+210,8)}else btn(x+15,y+196,100,28,'Maks','blue')}}}
// ---------- v5 screens: Mission, Daily Reward, Settings
const mqReady=()=>MIS.some((m,i)=>S.mq.t[i]<m.g.length&&S.mq.p[i]>=m.g[S.mq.t[i]]);
function bdg(x,y){X.fillStyle='#ff3b3b';X.strokeStyle='#fff';X.lineWidth=2;X.beginPath();X.arc(x,y,7,0,7);X.fill();X.stroke();txt('!',x,y+4,10,'#fff','center')}
function fitImg(k,cx,cy,s){const I=im(k);if(!I)return false;const r=Math.min(s/I.width,s/I.height);X.drawImage(I,cx-I.width*r/2,cy-I.height*r/2,I.width*r,I.height*r);return true}
function gemI(cx,cy,h){const D=im('diamond');if(D){const w=h*D.width/D.height;X.drawImage(D,cx-w/2,cy-h/2,w,h)}else{X.fillStyle='#4ab8ff';X.beginPath();X.moveTo(cx-h/2,cy);X.lineTo(cx,cy-h/2);X.lineTo(cx+h/2,cy);X.lineTo(cx,cy+h/2);X.fill()}}
function dMis(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Mission',40,88,18,'#fff');
MIS.forEach((m,i)=>{const t=S.mq.t[i],L=m.g.length,fin=t>=L,gl=m.g[Math.min(t,L-1)],p=S.mq.p[i],rdy=!fin&&p>=gl,y=98+i*67;
uiCard(40,y,720,60,rdy);X.fillStyle='rgba(0,0,0,.28)';rr(50,y+8,44,44,10);X.fill();
if(m.k=='star')star(72,y+30,13,'#ffd23a');else if(!fitImg(m.k,72,y+30,34)){X.fillStyle='#ffc21a';X.beginPath();X.arc(72,y+30,12,0,7);X.fill()}
txt(m.n,108,y+26,16,'#fff');txt(fin?'Semua tahap sudah diambil':'Tahap '+(t+1)+'/'+L+' · '+m.d.replace('#',gl),108,y+44,11,'#9cc8ff');
X.fillStyle='rgba(0,0,0,.4)';rr(330,y+22,190,16,8);X.fill();const q=fin?1:Math.min(1,p/gl);if(q>0){X.fillStyle=rdy||fin?'#4fd86a':'#4ad8ff';rr(330,y+22,Math.max(10,190*q),16,8);X.fill()}
txt(fin?'Selesai':Math.min(p,gl)+'/'+gl,425,y+34,11,'#fff','center','rgba(0,0,0,.5)');
if(!fin){const r=m.r[t];coin(539,y+30,8);txt('+'+r[0],552,y+35,14,'#fff');if(r[1]){gemI(604,y+30,18);txt('+'+r[1],616,y+35,14,'#fff')}}
btn(655,y+13,92,34,fin?'Selesai':rdy?'Klaim':'Berjalan',rdy?'green':'dark')})}
function dDaily(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(40,62,720,372);const f=dInfo();
txt('Daily Reward',400,104,28,'#ffd23a','center','#7a3a00');
txt(f.can&&f.reset?'Streak terputus, mulai lagi dari Hari 1':f.cur>0?'Login berturut-turut: '+f.cur+' hari':'Mulai streak-mu hari ini!',400,128,13,'#9cc8ff','center');
const n=DAILY.length,idx=(f.next-1)%n,done=f.can?idx:((f.cur-1)%n)+1;
DAILY.forEach((r,i)=>{const x=60+i*100,y=142,dn=i<done,td=f.can&&i==idx;uiCard(x,y,90,150,td);
if(dn)X.globalAlpha=.4;txt('Hari '+(i+1),x+45,y+24,13,td?'#ffd23a':'#fff','center');
if(i==n-1){if(!fitImg('chest',x+45,y+66,46)){coin(x+45,y+66,16)}}else coin(x+45,y+66,16);
txt('+'+r[0],x+45,y+108,16,'#fff','center');if(r[1]){gemI(x+30,y+130,16);txt('+'+r[1],x+42,y+135,13,'#fff')}X.globalAlpha=1;
if(dn){X.fillStyle='#2fae3a';X.strokeStyle='#fff';X.lineWidth=2;X.beginPath();X.arc(x+45,y+66,15,0,7);X.fill();X.stroke();X.strokeStyle='#fff';X.lineWidth=3.5;X.lineCap='round';X.beginPath();X.moveTo(x+38,y+66);X.lineTo(x+43,y+72);X.lineTo(x+53,y+59);X.stroke()}});
btn(300,308,200,46,f.can?'Klaim Hadiah!':'Sudah Diambil',f.can?'gold':'dark');
const r=DAILY[idx];txt(f.can?'Hari ke-'+f.next+': +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''):'Kembali besok untuk hadiah yang lebih besar',400,376,14,'#fff','center');
txt('Hadiah naik tiap hari berturut-turut. Terlewat sehari = ulang dari Hari 1.',400,394,11,'#7fa8d8','center')}
function swt(x,cy,on){const gr=X.createLinearGradient(0,cy-14,0,cy+14);gr.addColorStop(0,on?'#4fd86a':'#6a7488');gr.addColorStop(1,on?'#1fa045':'#3a4458');X.fillStyle=gr;X.strokeStyle=on?'#b6ffc4':'#8a96aa';X.lineWidth=2;rr(x,cy-14,64,28,14);X.fill();X.stroke();
X.fillStyle='#fff';X.beginPath();X.arc(x+(on?50:14),cy,10,0,7);X.fill();txt(on?'ON':'OFF',x+(on?20:44),cy+4,11,'#fff','center')}
function dSet(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(150,62,500,372);txt('Settings',400,112,30,'#ffd23a','center','#7a3a00');
const vok=typeof navigator.vibrate=='function';
[['mu','Musik','Musik latar belakang'],['sf','Efek Suara','Lompat, koin, injak musuh, dll.'],['vb','Getar',vok?'Getar saat terkena, menang, klaim hadiah':'Tidak didukung di perangkat ini']].forEach(([k,nm,sb],i)=>{const y=140+i*80;uiCard(180,y,440,66);txt(nm,204,y+30,19,'#fff');txt(sb,204,y+50,11,'#9cc8ff');swt(540,y+33,!!OPT[k])});
txt('Pengaturan tersimpan otomatis',400,400,11,'#7fa8d8','center')}
function lay(){const iw=innerWidth,ih=innerHeight,d=Math.min(devicePixelRatio||1,3);ROT=ih>iw;const a=ROT?ih:iw,b=ROT?iw:ih;V.style.width=a+'px';V.style.height=b+'px';V.width=Math.round(a*d);V.height=Math.round(b*d);
if(ROT){V.style.left=V.style.top='0px';V.style.transform='translate('+(iw/2+b/2)+'px,'+(ih/2-a/2)+'px) rotate(90deg)'}else{V.style.transform='none';V.style.left=V.style.top='0px'}}
BL.width=64;BL.height=36;
function present(){const vw=V.width,vh=V.height,S=Math.min(vw/W,vh/H),gw=Math.round(W*S),gh=Math.round(H*S),ox=(vw-gw)/2,oy=(vh-gh)/2;if(C.width!=gw||C.height!=gh){C.width=gw;C.height=gh}
X.setTransform(gw/W,0,0,gh/H,0,0);X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';draw();
VX.imageSmoothingEnabled=true;VX.imageSmoothingQuality='high';
if(ox>1||oy>1){TX.drawImage(C,0,0,64,36);const k=Math.max(vw/64,vh/36);VX.drawImage(BL,(vw-64*k)/2,(vh-36*k)/2,64*k,36*k);VX.fillStyle='rgba(0,10,30,.45)';VX.fillRect(0,0,vw,vh)}
VX.drawImage(C,ox,oy,gw,gh)}
addEventListener('resize',lay);addEventListener('orientationchange',lay);lay();
let last=0,acc=0;function loop(t){acc+=Math.min(100,t-last);last=t;while(acc>=16.67){acc-=16.67;if(scr=='game')upd()}present();music();if(fr%60==0)mqSave();requestAnimationFrame(loop)}requestAnimationFrame(loop);
