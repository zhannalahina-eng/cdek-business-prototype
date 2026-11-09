const page=document.querySelector('#page');
function fit(){const scale=Math.min(1,innerWidth/1920);page.style.zoom=scale;}
fit();addEventListener('resize',fit);
const node=id=>document.querySelector(`[data-node-id="${id}"]`);
function action(el,fn,label){if(!el)return;el.tabIndex=0;el.setAttribute('role','button');el.classList.add('hotspot');if(label)el.setAttribute('aria-label',label);el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});}
for(const id of ['2134:8103','2134:8129'])action(node(id),()=>document.querySelector('#steps').scrollIntoView({behavior:'smooth'}));
for(const id of ['2134:8068','2134:8102','2134:8128','2134:11991']){const el=node(id);if(el){el.setAttribute('aria-disabled','true');el.removeAttribute('tabindex');}}
const req=document.querySelector('#requirements'),original=req.innerHTML,business=document.querySelector('#business-template').innerHTML;
function wireRequirements(){const toggles=[...req.querySelectorAll('[data-name="<ToggleButton>"]')];toggles.forEach((el,i)=>action(el,()=>{req.innerHTML=i===0?original:business;wireRequirements();}));}
wireRequirements();
const modal=document.querySelector('#video-modal');let previous;
document.querySelector('#partner-section').addEventListener('click',e=>{const a=e.target.closest('a.play,a.video');if(!a)return;e.preventDefault();previous=a;document.querySelector('#video-title').textContent=a.closest('.card').getAttribute('aria-label');modal.showModal();document.body.style.overflow='hidden';});
document.querySelector('#close-modal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});modal.addEventListener('close',()=>{document.body.style.overflow='';previous?.focus();});
const floating=document.querySelector('#floating');function float(){floating.hidden=document.querySelector('#hero').getBoundingClientRect().bottom>0||document.querySelector('#footer').getBoundingClientRect().top<innerHeight;}addEventListener('scroll',float,{passive:true});addEventListener('resize',float);float();
