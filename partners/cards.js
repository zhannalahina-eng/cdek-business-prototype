const stories = document.querySelector('#stories');
const hover = matchMedia('(hover:hover) and (pointer:fine)');
const reduced = matchMedia('(prefers-reduced-motion:reduce)');
const escapeHtml = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

partners.forEach((p, index) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.style.setProperty('--surface', p.color);
  card.setAttribute('aria-label', p.name);
  const name = p.name.split(' ').map(n => '<span>'+escapeHtml(n)+'</span>').join('');
  card.innerHTML = `
    <div class="rotor">
      <div class="face front">
        <img class="portrait" src="${p.image}" alt="" draggable="false">
        <div class="shade"></div>
        <button class="open" aria-label="Прочитать историю: ${p.name}" aria-expanded="false" aria-controls="story-${index}"></button>
        <a class="play" href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="Смотреть видео: ${p.name}"><img src="assets/play.svg" alt=""></a>
        <div class="front-content"><h2 class="name">${name}</h2><p class="headline">${escapeHtml(p.title)}</p><div class="badges"><span class="badge">${p.city}</span><span class="badge count">${p.count}</span></div></div>
      </div>
      <div class="face back" id="story-${index}" inert aria-hidden="true">
        <div class="back-top"><div class="avatar"><img src="${p.image}" alt="" draggable="false"></div><button class="close" aria-label="Вернуть фотографию: ${p.name}">×</button></div>
        <div class="copy"><h2>${p.name}</h2><p class="quote">${escapeHtml(p.body)}</p></div>
        <a class="video" href="${p.url}" target="_blank" rel="noopener noreferrer">Смотреть видео</a>
      </div>
    </div>`;
  stories.appendChild(card);
  const front = card.querySelector('.front'), back = card.querySelector('.back');
  const open = card.querySelector('.open'), close = card.querySelector('.close');
  let timer;
  function flip(show, keyboard = false) {
    clearTimeout(timer);
    card.classList.toggle('is-flipped', show);
    // Hide the inactive face from keyboard navigation and assistive technology.
    front.inert = show; back.inert = !show;
    front.setAttribute('aria-hidden', String(show));
    back.setAttribute('aria-hidden', String(!show));
    open.setAttribute('aria-expanded', String(show));
    if (keyboard) (show ? close : open).focus({preventScroll:true});
  }
  card.addEventListener('pointerenter', e => {
    if (hover.matches && e.pointerType === 'mouse') {
      clearTimeout(timer);
      timer = setTimeout(() => flip(true), 250);
    }
  });
  card.addEventListener('pointerleave', e => {
    clearTimeout(timer);
    if (e.pointerType === 'mouse' && !card.contains(document.activeElement)) {
      timer = setTimeout(() => flip(false), 250);
    }
  });
  open.addEventListener('click', e => flip(true, e.detail === 0));
  close.addEventListener('click', e => flip(false, e.detail === 0));
  card.addEventListener('keydown', e => {
    if (e.key === 'Escape' && card.classList.contains('is-flipped')) {e.preventDefault();flip(false,true);}
  });
  card.addEventListener('focusout', () => {
    queueMicrotask(() => {if (!card.contains(document.activeElement) && !card.matches(':hover')) flip(false);});
  });
});
const prev = document.querySelector('#prev'), next = document.querySelector('#next');
function navigation() {
  prev.disabled = stories.scrollLeft < 2;
  next.disabled = stories.scrollLeft >= stories.scrollWidth - stories.clientWidth - 2;
}
for (const [button, direction] of [[prev,-1],[next,1]]) button.addEventListener('click', () => {
  stories.scrollBy({left:direction*(stories.querySelector('.card').offsetWidth+28),behavior:reduced.matches?'instant':'smooth'});
});
stories.addEventListener('scroll', navigation, {passive:true});
window.addEventListener('resize', navigation);
navigation();
