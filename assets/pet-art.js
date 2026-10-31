(function(){'use strict';
const species={"cat":{"main":"#E89A52","light":"#FFBA72","shade":"#BA693E","deep":"#8E4E3C","belly":"#FFF0D5","pink":"#F3A3AD","iris":"#408A79","outline":"#352636"},"bunny":{"main":"#E9DCE6","light":"#FFF7F1","shade":"#C8B7CA","deep":"#A992B3","belly":"#FFFFFF","pink":"#F5A4BB","iris":"#74619C","outline":"#403044"},"bear":{"main":"#BE7C50","light":"#DB9A62","shade":"#9D583E","deep":"#7D4439","belly":"#FFE6BC","pink":"#EFA3A3","iris":"#624A3C","outline":"#382936"}};
const poses=["idle","happy","hungry","sick","sleep","eat","play","wash","heal","hop","stretch"];
const path=(d,fill,stroke='',w=0)=>`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${w}" stroke-linejoin="miter"`:''}/>`;
const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const ellipse=(cx,cy,rx,ry,fill,stroke='',sw=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw}"`:''}/>`;
function ears(t,p,f,c){let s='';const lean=(p==='sleep'||p==='sick')?3:((p==='play'||p==='happy')&&f?2:0);if(t==='cat'){
 s+=path(`M27 41V10H33V15H39V19H45V24H49V41Z`,c.outline)+path('M31 37V17H35V21H39V25H44V37Z',c.main)+path('M34 34V23H37V26H41V34Z',c.pink);
 s+=path(`M79 41V24H84V19H90V15H96V10H101V41Z`,c.outline)+path('M83 37V25H89V21H93V17H97V37Z',c.main)+path('M87 34V26H91V23H94V34Z',c.pink);
 if(lean)s+=rect(31,10,3,3,c.light)+rect(95,10,3,3,c.light);
 }else if(t==='bunny'){
 const left=p==='sleep'&&f?'M32 39V27H25V13H28V5H36V3H43V8H47V39Z':'M30 42V12H33V4H38V1H46V6H49V42Z';
 const right=p==='play'&&f?'M79 40V20H84V8H92V4H100V10H102V22H97V41Z':'M79 42V11H82V4H87V1H95V6H99V42Z';
 s+=path(left,c.outline)+path('M35 39V13H38V8H43V12H45V39Z',c.light)+path('M39 35V14H42V11H44V34Z',c.pink);
 s+=path(right,c.outline)+path('M84 39V12H88V7H93V11H95V39Z',c.light)+path('M87 35V15H90V11H92V35Z',c.pink);
 }else{
 s+=path('M25 43V30H29V24H35V21H45V25H49V39Z',c.outline)+path('M30 39V31H34V27H42V30H45V40Z',c.main)+rect(34,30,8,8,c.deep);
 s+=path('M80 39V25H86V21H96V25H101V30H105V43Z',c.outline)+path('M84 40V30H89V27H97V31H100V39Z',c.main)+rect(89,30,8,8,c.deep);
 }return s}
function tail(t,p,f,c){if(t==='cat')return path(`M38 91H29V87H21V81H17V70H20V64H28V70H27V78H31V83H39Z`,c.outline)+path('M35 88H29V84H23V79H21V70H24V68H26V78H30V83H35Z',c.main)+rect(20,67,7,6,c.shade)+rect(26,82,5,5,c.shade);if(t==='bunny')return ellipse(31,96,11,10,c.outline)+ellipse(31,95,8,7,c.light)+rect(25,90,3,3,c.belly);return ''}
function body(t,p,f,c){const hop=p==='hop'&&f;const stretch=p==='stretch'&&f;let s=ellipse(64,119,37,5,'#5C5060', '',0).replace('fill="#5C5060"','fill="#5C5060" opacity=".24"');s+=tail(t,p,f,c);let y=stretch?81:hop?68:74;let bottom=hop?108:116;
 s+=path(`M44 ${y}H84L94 ${y+8}V104L86 ${bottom}H41L31 105V${y+12}Z`,c.outline);
 s+=path(`M46 ${y+4}H82L90 ${y+10}V103L84 ${bottom-4}H44L36 103V${y+13}Z`,c.main);
 s+=path(`M51 ${y+9}H77L83 ${y+19}V${bottom-6}H46V${y+20}Z`,c.belly);
 s+=path(`M39 ${y+14}H44V${bottom-9}H39V${y+25}Z`,c.shade)+path(`M84 ${y+15}H89V${bottom-9}H84Z`,c.shade);
 if(t==='cat')s+=rect(38,y+19,5,8,c.shade)+rect(85,y+23,5,7,c.shade);if(t==='bear')s+=rect(43,y+19,5,8,c.light)+rect(81,y+17,5,7,c.light);
 return s}
function head(t,p,f,c){let s=ears(t,p,f,c);const dy=p==='sleep'?4:(p==='stretch'&&f?3:0);s+=`<g transform="translate(0 ${dy})">`;
 s+=path('M43 31H84V34H94V40H100V48H104V65H100V72H94V80H85V85H42V82H33V77H27V69H23V51H27V42H33V36H43Z',c.outline);
 s+=path('M44 35H83V38H92V43H97V50H100V64H96V71H90V77H83V81H43V78H35V73H31V66H27V52H31V44H37V39H44Z',c.main);
 s+=path('M40 42H49V38H79V41H88V45H95V53H90V49H82V46H48V50H35V57H31V49H36Z',c.light);
 s+=path('M32 64H39V70H45V74H83V72H89V67H96V72H90V78H83V81H44V78H36V73H32Z',c.shade);
 s+=path('M46 69H82V74H78V79H50V76H46Z',c.belly);
 if(t==='cat'){s+=path('M56 37H60V43H56Z M64 35H68V43H64Z M72 38H76V44H72Z',c.shade);s+=path('M29 60H35V63H29Z M92 59H98V62H92Z',c.deep)}
 else if(t==='bunny'){s+=path('M52 38H77V42H52Z',c.light)+rect(36,67,7,4,c.light)+rect(87,67,7,4,c.light)}
 else{s+=rect(45,42,8,4,c.shade)+rect(76,42,8,4,c.shade);s+=path('M49 64H79V69H85V75H79V79H49V76H43V69H49Z',c.belly)}
 s+='</g>';return s}
function face(t,p,f,c){const closed=p==='sleep'||p==='wash'||(p==='idle'&&f===1)||(p==='happy'&&f===1);const sad=p==='hungry'||p==='sick';const blink=p==='play'&&f===1;let s='';let dy=p==='sleep'?4:(p==='stretch'&&f?3:0);s+=`<g transform="translate(0 ${dy})">`;
 for(const x of [45,77]){if(closed||blink){s+=path(`M${x-3} 58H${x+8}V60H${x+5}V62H${x-1}V60H${x-3}Z`,c.outline)}else{if(sad)s+=rect(x-3,49,13,3,c.deep);s+=path(`M${x-3} 51H${x+8}V54H${x+11}V65H${x+7}V68H${x-2}V65H${x-5}V55H${x-3}Z`,c.outline);s+=rect(x-1,54,9,11,c.iris)+rect(x+1,54,4,5,'#FFFFFF')+rect(x+6,61,2,2,'#FFFFFF')}}
 if(p==='sick'){s+=rect(42,68,8,3,c.deep)+rect(79,68,8,3,c.deep)}else{s+=ellipse(40,69,5,3,c.pink)+ellipse(88,69,5,3,c.pink)}
 if(t==='cat'){s+=path('M61 68H68V71H66V74H63V72H61Z',c.pink)+path('M64 74V78H59V76H56M64 78H69V76H72','none',c.outline,2)+path('M31 71H42M30 76H43M87 71H98M86 76H98','none',c.deep,1.6)}
 else if(t==='bunny'){s+=path('M61 69H67V72H65V74H63V72H61Z',c.pink)+path('M64 74V78H59V76M64 78H69V76','none',c.outline,2)}
 else{s+=path('M59 68H69V72H66V75H62V72H59Z',c.outline)+path('M64 75V79H59V77M64 79H69V77','none',c.outline,2)}
 if(p==='eat'){s+=rect(61,79,7,5,c.deep)+(f?rect(63,81,3,3,c.pink):'')}
 if(p==='happy'||p==='play'||p==='heal')s+=path('M58 79H70V82H67V84H61V82H58Z',c.pink);
 if(p==='hungry')s+=path('M58 83H70V81H58Z',c.outline);
 if(p==='sick')s+=rect(59,80,10,3,c.deep);
 if(p==='hop'&&f)s+=ellipse(64,82,5,5,c.deep);
 s+='</g>';return s}
function paws(t,p,f,c){const lifted=(p==='eat'||p==='wash'||p==='play'||p==='heal')&&f;let s='';const paw=(x,y)=>path(`M${x} ${y}H${x+13}V${y+3}H${x+16}V${y+10}H${x+12}V${y+13}H${x+1}V${y+10}H${x-2}V${y+3}H${x}Z`,c.outline)+path(`M${x+2} ${y+3}H${x+11}V${y+5}H${x+13}V${y+10}H${x+1}V${y+5}H${x+2}Z`,c.main)+rect(x+5,y+9,2,3,c.shade)+rect(x+9,y+9,2,3,c.shade);
 s+=paw(38,103);s+=paw(75,103);
 if(lifted){const x=p==='play'?89:79;const y=p==='wash'?58:p==='eat'?77:p==='heal'?76:75;s+=path(`M${x} ${y}H${x+13}V${y+3}H${x+16}V${y+13}H${x+11}V${y+16}H${x}V${y+12}H${x-3}V${y+4}H${x}Z`,c.outline)+path(`M${x+2} ${y+3}H${x+11}V${y+5}H${x+13}V${y+12}H${x+1}V${y+10}H${x+2}Z`,c.light)}
 if(p==='play'&&f)s+=paw(24,78);
 return s}
function props(t,p,f,c){let s='';if(p==='eat'){s+=path('M42 108H86V112H82V120H46V112H42Z','#784A5C')+path('M46 108H82V114H78V117H50V114H46Z','#E9A6A5')+ellipse(64,108,20,5,'#A96B4B');for(let i=0;i<4;i++)s+=rect(50+i*9,104+(i%2?1:0),6,4,'#D49B58')}
 if(p==='play'){s+=ellipse(f?103:105,f?102:106,14,14,'#393049')+ellipse(f?103:105,f?102:106,11,11,'#EFC858')+path(`M${f?94:96} 94L113 111M112 94L96 111`,'none','#79AFA3',4)}
 if(p==='wash'){for(const [x,y,r] of (f?[[26,61,7],[99,52,9],[107,81,6]]:[[30,53,6],[97,65,8],[102,41,5]]))s+=ellipse(x,y,r,r,'#B1EDFF','#71BCD6',2)}
 if(p==='heal'){s+=path('M98 37H106V44H113V52H106V59H98V52H91V44H98Z','#E66F89')+rect(100,40,4,16,'#FFFFFF')+rect(94,46,16,4,'#FFFFFF')}
 if(p==='sleep'){s+=path(`M${f?91:95} 33H110V37H101L110 48V52H94V48H104L94 37Z`,'#9184BD')+path('M108 20H118V23H113L118 30V33H108V30H113L108 23Z','#B5A8D6')}
 if(p==='happy'){s+=path('M99 29H105V25H111V29H117V37H112V42H104V37H99Z','#ED6F91')}
 if(p==='hungry')s+=ellipse(100,106,9,3,'#A98C7A')+rect(96,100,8,4,'#FFFFFF');
 if(p==='sick')s+=path('M93 49H109V53H93Z','#FFFFFF')+rect(104,48,5,6,'#ED7A88');
 return s}
function frame(t,p,f,c){return `<g class="frame frame-${p}-${f}">${body(t,p,f,c)}${head(t,p,f,c)}${face(t,p,f,c)}${paws(t,p,f,c)}${props(t,p,f,c)}</g>`}
function generate(t){const c=species[t];if(!c)throw Error("Unknown pet type");let css=`.frame{display:none;shape-rendering:crispEdges}.frame-idle-0,.frame-idle-1{display:inline}.frame-idle-0{animation:hold 2.8s steps(1,end) infinite}.frame-idle-1{animation:blink 2.8s steps(1,end) infinite}@keyframes hold{0%,82%,100%{opacity:1}83%,93%{opacity:0}}@keyframes blink{0%,82%,100%{opacity:0}83%,93%{opacity:1}}@keyframes a{0%,49%{opacity:1}50%,100%{opacity:0}}@keyframes b{0%,49%{opacity:0}50%,100%{opacity:1}}`;
 for(const p of poses.filter(x=>x!=='idle')){css+=`#${p}:target~.frame-idle-0,#${p}:target~.frame-idle-1{display:none}`;css+=`#${p}:target~.frame-${p}-0,#${p}:target~.frame-${p}-1{display:inline}`;css+=`#${p}:target~.frame-${p}-0{animation:a ${p==='sleep'?'2.8s':p==='play'?'0.48s':'0.7s'} steps(1,end) infinite}`;css+=`#${p}:target~.frame-${p}-1{animation:b ${p==='sleep'?'2.8s':p==='play'?'0.48s':'0.7s'} steps(1,end) infinite}`}
 css+='@media(prefers-reduced-motion:reduce){.frame{animation:none!important}.frame-idle-1{display:none}';for(const p of poses.filter(x=>x!=='idle'))css+=`#${p}:target~.frame-${p}-1{display:none}`;css+='}';
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="Bichinho ${t}" shape-rendering="crispEdges"><style>${css}</style>`;
 for(const p of poses)svg+=`<g id="${p}"/>`;for(const p of poses)for(let f=0;f<2;f++)svg+=frame(t,p,f,c);
 return svg+'</svg>'}
const cache=Object.create(null);
function url(type){if(!species[type])throw Error('Unknown pet type');if(!cache[type])cache[type]=URL.createObjectURL(new Blob([generate(type)],{type:'image/svg+xml'}));return cache[type]}
window.PixelPets=Object.freeze({url,generate,poses:Object.freeze(poses)});
})();