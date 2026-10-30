'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal(html,fs.readFileSync(path.join(root,'jogar-v2.html'),'utf8'),'Game pages differ');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match,'Game script missing');
new vm.Script(match[1],{filename:'index.html'});
const a=match[1].indexOf('const eggColors='),b=match[1].indexOf('function render()');
assert.ok(a>=0&&b>a,'Pixel egg renderer missing');
const eggSvg=new Function(match[1].slice(a,b)+';return eggSvg;')();
for(const type of ['cat','bunny','bear']){
 const art=fs.readFileSync(path.join(root,'assets',type+'-motion.svg'),'utf8');
 const embedded=art.match(/data:image\/webp;base64,([A-Za-z0-9+\/=]+)/);
 assert.ok(embedded,'Missing pixel art '+type);
 assert.match(art,/class="head-reconstruction"/,'Missing hand-reconstructed ears/crown '+type);
 assert.match(art,/viewBox="-5 -38 190 218"/,'Repaired head outside SVG viewport '+type);
 assert.match(art,/prefers-reduced-motion:reduce/,'Reduced-motion support missing '+type);
 const data=Buffer.from(embedded[1],'base64');
 assert.equal(data.subarray(0,4).toString(),'RIFF');
 assert.equal(data.subarray(8,12).toString(),'WEBP');
 for(const pose of ['idle','happy','hungry','sick','sleep','eat','play','wash','heal','hop','stretch'])
  assert.ok(art.includes('id="'+pose+'"'),type+' missing '+pose);
 for(const pose of ['sleep','eat','play','wash','heal'])
  assert.ok(art.includes('#'+pose+':target'),type+' missing animation '+pose);
 const whole=eggSvg(type,false),cracked=eggSvg(type,true);
 assert.match(whole,/<svg/);
 assert.notEqual(whole,cracked);
 assert.match(cracked,/stroke-linejoin/);
 console.log('PASS '+type+': art, poses, egg and hatching');
}
assert.match(html,/height:100dvh/);
assert.match(html,/motion\.svg\?v=31#idle/,'Adoption still uses cropped fallback art');
assert.match(html,/V3\.1/,'Expected version stamp missing');
assert.match(match[1],/storageSet\(KEY/);
assert.match(match[1],/storageGet\(KEY/);
assert.match(match[1],/function normalizeBackup\(data\)/);
assert.match(match[1],/async function importBackup\(file\)/);
console.log('All smoke tests passed.');
