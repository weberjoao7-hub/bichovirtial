'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const SAVE_KEY='bichovirtual_save_v1';
const output=path.join(__dirname,'screenshots');
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.js':'text/javascript'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(target!==path.join(root,'index.html')&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)});
});
function listen(){return new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))}
function shutdown(){return new Promise(resolve=>server.close(resolve))}
async function state(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY)}
async function updateSaved(page,patch){await page.evaluate(({key,patch})=>{const p=JSON.parse(localStorage.getItem(key));Object.assign(p,patch);localStorage.setItem(key,JSON.stringify(p))},{key:SAVE_KEY,patch})}
async function checkViewport(page,width,height){
 await page.setViewportSize({width,height});
 const metrics=await page.evaluate(()=>{
  const buttons=[...document.querySelectorAll('#actions button')].map(b=>{const r=b.getBoundingClientRect();return {text:b.textContent.trim(),top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}});
  const footer=document.querySelector('.footer').getBoundingClientRect();
  return {viewportW:innerWidth,viewportH:innerHeight,buttons,footerBottom:footer.bottom,docHeight:document.documentElement.scrollHeight};
 });
 for(const b of metrics.buttons){assert.ok(b.top>=0&&b.bottom<=height+2&&b.left>=0&&b.right<=width+2,'Action offscreen '+width+'x'+height+': '+JSON.stringify(b));assert.ok(b.height>=30,'Action too short: '+JSON.stringify(b))}
 assert.ok(metrics.footerBottom<=height+2,'Footer offscreen at '+width+'x'+height+': '+JSON.stringify(metrics));
 assert.ok(metrics.docHeight<=height+3,'Page overflows at '+width+'x'+height+': '+JSON.stringify(metrics));
}
async function run(){
 await listen();
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const type of ['cat','bunny','bear']){
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/jogar-v2.html',{waitUntil:'load'});
   await page.locator('[data-type="'+type+'"]').click();
   await page.locator('#nickname').fill('Teste '+type);
   await page.locator('#begin').click();
   assert.equal((await state(page)).type,type);
   assert.ok(await page.locator('#heroPet svg').count(),'Egg missing for '+type);
   await updateSaved(page,{born:Date.now()-5*60000,updated:Date.now(),hunger:25,joy:40,health:65,clean:35,coins:35});
   await page.reload({waitUntil:'load'});
   await page.locator('#heroPet img').waitFor();
   const loaded=await page.locator('#heroPet img').evaluate(async img=>{if(!img.complete)await new Promise(r=>{img.onload=r;img.onerror=r});return {width:img.naturalWidth,src:img.getAttribute('src')}});
   assert.ok(loaded.width>0,'Artwork not loaded: '+type+' '+JSON.stringify(loaded));
   for(const [w,h] of [[320,568],[375,667],[390,844],[430,932]])await checkViewport(page,w,h);
   await page.setViewportSize({width:390,height:844});
   await page.screenshot({path:path.join(output,type+'-mobile.png')});
   const before=await state(page);
   await page.locator('[data-act="feed"]').click();
   await page.locator('[data-food="0"]').click();
   assert.ok((await state(page)).hunger>before.hunger,'Feeding failed '+type);
   assert.ok((await page.locator('#heroPet img').getAttribute('src')).includes('#eat'),'Eat pose missing');
   await page.locator('[data-act="play"]').click();
   assert.ok((await state(page)).plays>=1,'Playing failed '+type);
   await page.locator('[data-act="clean"]').click();
   assert.ok((await state(page)).clean>before.clean,'Cleaning failed '+type);
   await page.locator('[data-act="heal"]').click();
   assert.ok((await state(page)).health>before.health,'Healing failed '+type);
   await page.locator('[data-act="sleep"]').click();
   assert.equal((await state(page)).asleep,true,'Sleep failed');
   await page.locator('[data-act="feed"]').click();
   assert.match(await page.locator('#message').innerText(),/dormindo/i,'Sleeping guard missing');
   await page.locator('[data-act="sleep"]').click();
   assert.equal((await state(page)).asleep,false,'Wake failed');
   await page.locator('[data-act="game"]').click();
   await page.locator('[data-guess="0"]').click();
   const afterGame=await state(page);
   assert.ok(afterGame.coins>=0&&afterGame.lastGameAt>0,'Minigame failed');
   await page.evaluate(()=>document.querySelector('[data-guess="1"]').click());
   assert.equal((await state(page)).coins,afterGame.coins,'Repeated box click paid twice');
   await page.locator('[data-act="game"]').click();
   assert.match(await page.locator('#message').innerText(),/Aguarde.*s/i,'Cooldown warning missing');
   assert.equal((await state(page)).coins,afterGame.coins,'Cooldown allowed extra coins');
   await page.reload({waitUntil:'load'});
   assert.equal((await state(page)).type,type,'Save restore failed');
   assert.equal((await state(page)).lastGameAt,afterGame.lastGameAt,'Minigame cooldown did not persist');
   await page.locator('#helpBtn').click();
   const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#backupExport').click()]);
   assert.equal(download.suggestedFilename(),'bicho-virtual-backup.json');
   const exported=fs.readFileSync(await download.path());
   const parsed=JSON.parse(exported.toString('utf8'));
   assert.equal(parsed.pet.type,type,'Export corrupted');
   await page.locator('#backupFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"format":"wrong"}')});
   await page.waitForTimeout(100);
   assert.equal((await state(page)).type,type,'Invalid import changed save');
   await updateSaved(page,{coins:0,joy:0});
   await page.reload({waitUntil:'load'});
   await page.locator('#helpBtn').click();
   await page.locator('#backupFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:exported});
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).coins>0,SAVE_KEY);
   assert.equal((await state(page)).coins,parsed.pet.coins,'Import failed');
   await page.reload({waitUntil:'load'});
   assert.equal((await state(page)).coins,parsed.pet.coins,'Imported save did not persist');
   assert.deepEqual(errors,[],'Browser JS errors '+type);
   console.log('PASS '+type+': eggs, HD artwork, viewport, actions, save, backup roundtrip');
   await context.close();
  }
  const blocked=await browser.newContext({viewport:{width:390,height:844}});
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('storage disabled')}}));
  const page=await blocked.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/jogar-v2.html',{waitUntil:'load'});
  await page.locator('#begin').click();
  assert.match(await page.locator('.version-stamp').innerText(),/⚠/);
  assert.deepEqual(errors,[],'Storage blocked should not crash game');
  await blocked.close();
  console.log('PASS storage blocked: game remains playable with warning');
 }finally{await browser.close()}
}
run().then(()=>shutdown()).catch(async e=>{console.error(e.stack||e);await shutdown();process.exitCode=1});
