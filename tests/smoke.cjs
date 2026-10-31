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
const source=fs.readFileSync(path.join(root,'assets/pet-art.js'),'utf8');
new vm.Script(source,{filename:'assets/pet-art.js'});
const sandbox={window:{},URL:{createObjectURL:()=> 'blob:mock'},Blob:class{}};
vm.runInNewContext(source,sandbox);
const art=sandbox.window.PixelPets;
const poses=['idle','happy','hungry','sick','sleep','eat','play','wash','heal','hop','stretch'];
assert.deepEqual(Array.from(art.poses),poses);
for(const type of ['cat','bunny','bear']){
 const svg=art.generate(type);
 assert.match(svg,/viewBox="0 0 128 128"/,'Unexpected canvas '+type);
 assert.match(svg,/shape-rendering="crispEdges"/,'Missing crisp pixel edges '+type);
 assert.match(svg,/prefers-reduced-motion:reduce/,'Reduced-motion support missing '+type);
 assert.doesNotMatch(svg,/data:image\/webp;base64/,'Old cropped raster still embedded '+type);
 for(const pose of poses){
  const a=svg.indexOf('class="frame frame-'+pose+'-0"'),b=svg.indexOf('class="frame frame-'+pose+'-1"');
  assert.ok(a>=0&&b>a,type+' missing independently drawn frames for '+pose);
  const next=svg.indexOf('class="frame frame-',b+1);
  assert.notEqual(svg.slice(a,b),svg.slice(b,next<0?undefined:next),type+' frames identical for '+pose);
  if(pose!=='idle')assert.ok(svg.includes('#'+pose+':target~.frame-'+pose+'-0'),type+' missing state '+pose);
 }
 const whole=eggSvg(type,false),cracked=eggSvg(type,true);
 assert.match(whole,/<svg/);assert.notEqual(whole,cracked);assert.match(cracked,/stroke-linejoin/);
 console.log('PASS '+type+': 11 poses, 22 unique drawn frames, complete silhouettes and eggs');
}
assert.match(html,/height:100dvh/);
assert.match(html,/PixelPets\.url\(k\)/,'Adoption still uses cropped art');
assert.match(html,/PixelPets\.url\(pet\.type\)/,'Game still uses cropped art');
assert.match(html,/assets\/pet-art\.js/,'Pixel art engine not loaded');
assert.doesNotMatch(html,/motion\.svg\?v=31/,'Old motion art still referenced');
assert.match(html,/V3\.2/,'Expected version stamp missing');
assert.match(match[1],/storageSet\(KEY/);
assert.match(match[1],/storageGet\(KEY/);
assert.match(match[1],/function normalizeBackup\(data\)/);
assert.match(match[1],/async function importBackup\(file\)/);
console.log('All smoke tests passed.');
