import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const routes=['/','/about','/companies','/companies/chainso','/companies/hospitality','/companies/atlas','/companies/nexus','/companies/orbit','/labs','/ventures','/technologies','/contact','/privacy','/legal'];
const pages=new Map();
for(const route of routes){const file=route==='/'?'dist/index.html':`dist${route}/index.html`;const html=await readFile(file,'utf8');pages.set(route,html);assert.match(html,/<html lang="ru">/,route);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`h1: ${route}`);assert.ok(html.includes(`data-route="${route}"`),`route: ${route}`);for(const marker of ['rel="canonical"','property="og:title"','property="og:description"','name="description"'])assert.ok(html.includes(marker),`${route}: ${marker}`);}
for(const [route,html] of pages){for(const [,href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)){if(!href.startsWith('/')&&!href.startsWith('#'))continue;const [destination,hash]=href.split('#');const target=destination||route;assert.ok(pages.has(target),`${route}: broken route ${href}`);if(hash){const targetHtml=pages.get(target);assert.ok(targetHtml.includes(`id="${hash}"`),`${route}: broken anchor ${href}`);}}}
const portfolio=pages.get('/companies');for(const slug of ['chainso','hospitality','atlas','nexus','orbit'])assert.ok(portfolio.includes(`/companies/${slug}`));assert.ok(portfolio.includes('В разработке / Концепция'));assert.ok(portfolio.includes('Активный проект'));
assert.ok(pages.get('/contact').includes('Доставка сообщений пока не подключена.'));
assert.ok((await readFile('dist/404.html','utf8')).includes('Страница не найдена'));
for(const asset of ['dist/q-poster.svg','dist/favicon.svg','dist/social.png','dist/robots.txt','dist/sitemap.xml'])await access(asset);
const luminance=hex=>{const c=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
for(const [fg,bg,min] of [['181918','f3f3ef',4.5],['444640','e8e8e3',4.5],['f3f3ef','191c1c',4.5],['ffffff','d52d1e',4.5],['c8cec6','191c1c',4.5],['30372a','d8ddd5',4.5]]){const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=min,`contrast ${fg}/${bg}: ${ratio}`);console.log(`Contrast ${fg}/${bg}: ${ratio.toFixed(2)}:1`);}
console.log('14 routes, local links/anchors, project statuses, honest form state, 404, metadata and asset presence verified.');

for(const [slug,name] of [['labs','ZERQON Labs'],['ventures','ZERQON Ventures'],['technologies','ZERQON Technologies']]){assert.ok(pages.get('/'+slug).includes('<h1>'+name+'</h1>'));for(const html of pages.values())assert.ok(html.includes(name));assert.ok(pages.get('/').includes('id="division-'+slug+'"'));}
console.log('Official division names, headings and chapter anchors verified.');
