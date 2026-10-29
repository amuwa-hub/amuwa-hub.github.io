window.__MX_SPR=window.__MX_SPR||(function(){var b='https://amuwa-hub.github.io/tara/',m={};'idle wave talk think present cheer phone tablet sorry sleep walk_r walk_l walk_f surprised love thumbs clap shrug yawn laugh point_up point_down cake bag lifted'.split(' ').forEach(function(n){m[n]=b+n+'.webp'});return m})();
(function(){
var SPR=window.__MX_SPR||{},N={idle:3,wave:4,talk:3,think:3,present:3,cheer:4,phone:3,tablet:3,sorry:3,sleep:3,walk_r:4,walk_l:4,walk_f:4,surprised:3,love:3,thumbs:3,clap:4,shrug:3,yawn:4,laugh:3,point_up:3,point_down:3,cake:3,bag:3,lifted:3};
var reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
var root=document.getElementById('mx'),spr=document.getElementById('mxSpr'),body=document.getElementById('mxBody'),ring=document.getElementById('mxRing');
if(!root||!spr)return;
var agent=document.getElementById('agent'),typing=document.getElementById('agTyping'),msgs=document.getElementById('agMsgs');
var cur='idle',seq=[],si=0,timer=null,hold=null,lastAct=Date.now(),hidden=false;
function mobile(){return matchMedia('(max-width:899px)').matches}
function setStrip(a){spr.style.backgroundImage='url('+SPR[a]+')';spr.style.backgroundSize=(N[a]*100)+'% 100%';}
function frame(i){var n=N[cur];spr.style.backgroundPosition=(n>1?(i/(n-1))*100:0)+'% 0';}
/* sequences: [frameIndex, ms] */
var SEQ={
 idle:function(){return [[0,2600],[1,110],[2,120],[1,110],[0,2200],[0,1]];},
 wave:function(){return [[0,200],[1,160],[2,260],[3,260],[2,260],[3,260],[2,260],[3,260],[1,160]];},
 talk:function(){return [[0,170],[1,150],[2,170],[1,150],[2,170],[0,150],[1,150],[2,170]];},
 think:function(){return [[0,500],[1,700],[2,500],[1,700]];},
 present:function(){return [[0,200],[1,220],[2,1500]];},
 cheer:function(){return [[0,180],[1,260],[2,260],[3,260],[2,260],[1,260],[3,300]];},
 phone:function(){return [[0,220],[1,500],[2,900]];},
 tablet:function(){return [[0,220],[1,420],[2,1100]];},
 sorry:function(){return [[0,300],[1,500],[2,1100]];},
 sleep:function(){return [[0,1400],[1,1400],[2,1400],[1,1400]];},
 walk_r:function(){return [[0,140],[1,140],[2,140],[3,140]];},
 walk_l:function(){return [[0,140],[1,140],[2,140],[3,140]];},
 walk_f:function(){return [[0,140],[1,140],[2,140],[3,140]];},
 lifted:function(){return [[0,200],[1,200],[2,200],[1,200]];}
};
function gen(n){var o=[];for(var i=0;i<n;i++)o.push([i,i===n-1?1400:260]);return o;}
Object.keys(N).forEach(function(k){if(!SEQ[k])SEQ[k]=function(){return gen(N[k]);};});
var LOOP={idle:1,think:1,sleep:1,talk:1,walk_r:1,walk_l:1,walk_f:1,lifted:1};
function stop(){clearTimeout(timer);clearTimeout(hold);}
function play(a,opt){
  opt=opt||{};stop();cur=a;setStrip(a);root.classList.toggle('sleepy',a==='sleep');
  root.classList.toggle('flip',!!opt.flip);
  root.classList.toggle('hop',a==='cheer'&&!reduced);
  seq=SEQ[a]();si=0;
  if(reduced){frame(a==='sleep'?1:(a==='idle'?0:Math.min(2,N[a]-1)));if(!LOOP[a])timer=setTimeout(function(){play('idle');},opt.hold||2200);return;}
  (function step(){
    var s=seq[si];frame(s[0]);
    si++;
    if(si>=seq.length){
      if(LOOP[a]&&!opt.once){si=0;}
      else{ // finished: stay on last frame for hold then idle
        timer=setTimeout(function(){if(opt.keep)return;play('idle');},opt.hold||s[1]);return;}
    }
    timer=setTimeout(step,s[1]);
  })();
}
function say(a,opt){lastAct=Date.now();if(cur==='sleep'&&a!=='idle')root.classList.remove('sleepy');play(a,opt);}
/* visibility */
function vis(){
  var show=!hidden&&(!mobile()||scrollY>360);
  if(show&&!root.classList.contains('on')){root.classList.add('on');if(!root.dataset.hi){root.dataset.hi=1;setTimeout(function(){say('wave');},500);}}
  else if(!show)root.classList.remove('on');
}
addEventListener('scroll',vis,{passive:true});addEventListener('resize',vis);
/* open/close */
var isOpen=function(){return agent&&agent.classList.contains('open')};
function panelState(){
  var o=isOpen();document.body.classList.toggle('mx-panel',o);
  if(o)say('wave');else say('idle');
}
if(agent)new MutationObserver(function(m){panelState();}).observe(agent,{attributes:true,attributeFilter:['class']});

/* reactions to the conversation */
function reactUser(t){
  t=t.toLowerCase();
  if(/thank|thanks|thx|great|awesome|lovely|beautiful/.test(t))return 'love';
  if(/\b(ok|okay|yes|yep|sure|perfect|done|cool)\b/.test(t))return 'thumbs';
  if(/haha|lol|funny/.test(t))return 'laugh';
  if(/\b(hi|hello|hey|namaste|bye)\b/.test(t))return 'wave';
  return null;}
function reactBot(t){
  if(/don.t have|not confirmed|can.t confirm|aren.t confirmed|only annie can|not sure/i.test(t))return 'shrug';
  if(/deliver|pickup|pick up|pick-up/i.test(t))return 'bag';
  if(/cake ticket|ticket/i.test(t)&&/here.s your/i.test(t))return 'cheer';
  return null;}
/* typing -> think ; new bot message -> talk */
var busy=false;
if(typing)new MutationObserver(function(){
  var on=!typing.hidden;
  if(on&&!busy){busy=true;say('think');}
  else if(!on&&busy){busy=false;}
}).observe(typing,{attributes:true,attributeFilter:['hidden']});
if(msgs)new MutationObserver(function(ms){
  var added=[];ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)added.push(n)})});
  if(!added.length)return;
  var el=added[added.length-1];
  var txt=el.textContent||'';
  if(el.classList.contains('user')||/\buser\b/.test(el.className)){var ru=reactUser(txt);if(ru&&!busy)say(ru,{hold:1600});return;}
  if(/Couldn.t connect/i.test(txt)){say('sorry',{hold:2000});return;}
  var rb=reactBot(txt);
  if(rb){say(rb,{hold:1800});clearTimeout(hold);return;}
  say('talk',{once:true,hold:200});
  // talk for ~ reading time, then idle
  clearTimeout(hold);
  hold=setTimeout(function(){if(cur==='talk')play('idle');},Math.min(4200,900+txt.length*28));
}).observe(msgs,{childList:true});

/* ===== walk to a section, point, walk back ===== */
var walking=false;
function place0(){return null;}
function walkTo(tx,done){
  var r=root.getBoundingClientRect(),c=clampPos(tx,r.top),dx=c[0]-r.left;
  if(Math.abs(dx)<12||reduced){place(c[0],r.top);done();return;}
  var dur=Math.min(2800,Math.max(600,Math.abs(dx)*3.4));
  place(r.left,r.top);
  void root.offsetWidth;
  root.style.transition='left '+dur+'ms linear,opacity .35s ease';
  play(dx>0?'walk_r':'walk_l');
  root.style.left=c[0]+'px';
  setTimeout(function(){root.style.transition='';done();},dur+30);
}
function navPlan(anchor){
  var el=document.querySelector(anchor);if(!el||el.hidden||walking||drag)return;
  var W=root.offsetWidth,origin=root.getBoundingClientRect(),wasPlaced=root.classList.contains('placed'),ox=origin.left;
  if(anchor==='#top')say('point_up',{hold:2200});
  else if(anchor==='#cakes'||anchor==='#recent-cakes')say('cake',{hold:2200});
  setTimeout(function(){
    if(!root.classList.contains('on'))return;
    var r=el.getBoundingClientRect();
    var top=Math.max(72,Math.min(r.top,innerHeight*0.2));
    ring.style.cssText='left:'+Math.max(6,r.left-6)+'px;top:'+top+'px;width:'+Math.min(innerWidth-12,r.width+12)+'px;height:'+Math.min(innerHeight*0.6,r.height+12)+'px';
    var farLeft=origin.left>innerWidth/2; // go to the side farther from where she is
    var tx=farLeft?6:innerWidth-W-6, flip=!farLeft; // standing at left -> point right (no flip); at right -> flip
    walking=true;
    walkTo(tx,function(){
      ring.classList.add('on');
      say(anchor==='#cake-brief'?'tablet':'present',{flip:anchor==='#cake-brief'?false:flip,hold:2600});
      clearTimeout(ringT);ringT=setTimeout(function(){ring.classList.remove('on');},2400);
      setTimeout(function(){
        root.classList.remove('flip');
        walkTo(ox,function(){
          if(!wasPlaced){root.classList.remove('placed');root.style.left=root.style.top='';}
          walking=false;play('idle');
        });
      },3000);
    });
  },mobile()?950:700);
}
/* analytics-driven actions */
var ringT=null;
function highlight(sel){return;
  var el=document.querySelector(sel);if(!el||el.hidden)return;
  clearTimeout(ringT);
  setTimeout(function(){
    var r=el.getBoundingClientRect();
    var top=Math.max(72,Math.min(r.top,innerHeight*0.2));
    ring.style.cssText='left:'+Math.max(6,r.left-6)+'px;top:'+(top)+'px;width:'+Math.min(innerWidth-12,r.width+12)+'px;height:'+Math.min(innerHeight*0.6,r.height+12)+'px';
    ring.classList.add('on');ringT=setTimeout(function(){ring.classList.remove('on')},1800);
  },mobile()?900:650);
}
function __onEv(e){
  var d=e.detail||{};
  switch(d.event){
    case 'agent_navigation':navPlan(d.anchor);break;
    case 'agent_cta_click':
      if(d.type==='call'||d.type==='whatsapp')say('phone');
      else if(d.type==='email')say('tablet');break;
    case 'cta_call_click':say('phone');break;
    case 'agent_ticket_handoff':say('cheer',{hold:1200});break;
    case 'agent_error':say('sorry',{hold:2000});break;
  }
}
document.addEventListener('site:analytics',__onEv);document.addEventListener('annies:analytics',__onEv);
/* click mascot = open agent */
body.addEventListener('click',function(){
  if(moved)return;
  var b=document.getElementById(mobile()?'agTab':'agPill');if(b&&!isOpen())b.click();else if(isOpen())say('wave');
});

/* ===== drag to place anywhere (mouse + touch), remembered ===== */
var KEY='tara_pos',moved=false;
function clampPos(x,y){var w=root.offsetWidth,h=root.offsetHeight;return [Math.max(4,Math.min(innerWidth-w-4,x)),Math.max(4,Math.min(innerHeight-h-4,y))];}
function place(x,y){var c=clampPos(x,y);root.classList.add('placed');root.style.left=c[0]+'px';root.style.top=c[1]+'px';}
function savePos(){}
function resetPos(){root.classList.remove('placed');root.style.left=root.style.top='';say('wave');}
addEventListener('resize',function(){if(root.classList.contains('placed')){var r=root.getBoundingClientRect();place(r.left,r.top);}});
var drag=null;
body.addEventListener('pointerdown',function(e){
  if(e.button>0)return;var r=root.getBoundingClientRect();
  drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:r.left,oy:r.top,on:false};
  try{body.setPointerCapture(e.pointerId);}catch(_){}
});
body.addEventListener('pointermove',function(e){
  if(!drag||e.pointerId!==drag.id)return;
  var dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
  if(!drag.on&&Math.hypot(dx,dy)<7)return;
  if(!drag.on){drag.on=true;moved=true;root.classList.add('drag');say('lifted');}
  place(drag.ox+dx,drag.oy+dy);e.preventDefault();
});
function endDrag(e){
  if(!drag||e.pointerId!==drag.id)return;
  var was=drag.on;drag=null;try{body.releasePointerCapture(e.pointerId);}catch(_){}
  if(was){root.classList.remove('drag');savePos();say('cheer',{hold:300});setTimeout(function(){moved=false;},60);}
}
body.addEventListener('pointerup',endDrag);body.addEventListener('pointercancel',endDrag);
/* sleep after inactivity */
['pointerdown','keydown','scroll','touchstart'].forEach(function(ev){addEventListener(ev,function(){lastAct=Date.now();if(cur==='sleep'){play('yawn');}},{passive:true});});
setInterval(function(){if(!isOpen()&&cur==='idle'&&Date.now()-lastAct>40000)play('sleep');},4000);
/* start */
setStrip('idle');frame(0);play('idle');vis();
window.TaraMascot={play:say,actions:Object.keys(N)};
})();
