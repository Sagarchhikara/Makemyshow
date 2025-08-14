/* ========= HERO SLIDESHOW (auto + arrows + dots) ========= */
const slides = Array.from(document.querySelectorAll('.slide'));
const titleEl = document.getElementById('hero-title');
const tagEl = document.getElementById('hero-tag');
const dotsWrap = document.querySelector('.hero-dots');
let index = slides.findIndex(s => s.classList.contains('active'));
if(index < 0) index = 0;

/* build dots */
slides.forEach((s,i)=> {
  const btn = document.createElement('button');
  btn.addEventListener('click', ()=> goto(i));
  if(i===index) btn.classList.add('active');
  dotsWrap.appendChild(btn);
});

const left = document.querySelector('.hero-arrow.left');
const right = document.querySelector('.hero-arrow.right');
left?.addEventListener('click', ()=> goto(index-1));
right?.addEventListener('click', ()=> goto(index+1));

function goto(i){
  const next = (i + slides.length) % slides.length;
  slides.forEach((s,idx)=> s.classList.toggle('active', idx===next));
  Array.from(dotsWrap.children).forEach((d,idx)=> d.classList.toggle('active', idx===next));
  index = next;
  // update info from active slide dataset
  const active = slides[index];
  if(active){
    titleEl.textContent = active.dataset.title || '';
    tagEl.textContent = active.dataset.tag || '';
  }
}

/* autoplay */
let autoplay = setInterval(()=> goto(index+1), 4500);
/* pause on hover */
const heroSlideshow = document.querySelector('.hero-slideshow');
heroSlideshow?.addEventListener('mouseenter', ()=> clearInterval(autoplay));
heroSlideshow?.addEventListener('mouseleave', ()=> autoplay = setInterval(()=> goto(index+1), 4500));

/* set initial info */
goto(index);

/* ========= SCROLL REVEAL (IntersectionObserver) ========= */
const reveals = document.querySelectorAll('.reveal, .fade-up');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
},{threshold:0.2});

reveals.forEach(el => io.observe(el));

/* ========= CARD TILT (subtle) ========= */
const cards = document.querySelectorAll('.movie-card');
cards.forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${ -y * 5 }deg) rotateY(${ x * 6 }deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

/* ========= accessibility: keyboard focus visual ========= */
document.querySelectorAll('.movie-card, .card, .btn').forEach(el=>{
  el.addEventListener('focus', ()=> el.classList.add('focus'));
  el.addEventListener('blur', ()=> el.classList.remove('focus'));
});
