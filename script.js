// ===== NAV: scroll effect  =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  if (currentY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

let scrollYBeforeMenu = 0;

function openMenu() {
  scrollYBeforeMenu = window.scrollY;
  hamburger.classList.add('active');
  navMenu.classList.add('open');
  // Khoa scroll, giu nguyen vi tri trang
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollYBeforeMenu}px`;
  document.body.style.width = '100%';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  // Restore vi tri truoc khi mo menu
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo({ top: scrollYBeforeMenu, behavior: 'instant' });
}

hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      closeMenu();
      // Doi body restore xong roi moi scroll
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
});

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__menu a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== STATS COUNTER ANIMATION =====
const statsItems = document.querySelectorAll('.stats__item strong');
statsItems.forEach(el => el.dataset.original = el.textContent);

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statsItems.forEach(el => countObserver.observe(el));

function animateCount(el) {
  const text = el.dataset.original;
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  const suffix = text.replace(/[0-9.,]/g, '').trim();
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = num * eased;

    let display;
    if (num >= 1000) {
      display = current.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
    } else if (Number.isInteger(num)) {
      display = Math.round(current).toString();
    } else {
      display = current.toFixed(1);
    }

    el.textContent = display + (suffix ? ' ' + suffix : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== COOKIE BANNER =====
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (!localStorage.getItem('cookie_consent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 1500);
}

function dismissCookie(value) {
  localStorage.setItem('cookie_consent', value);
  cookieBanner.classList.remove('show');
}

cookieAccept.addEventListener('click', () => dismissCookie('accepted'));
cookieDecline.addEventListener('click', () => dismissCookie('declined'));

// ===== WEATHER TABS =====
const weatherTabs = document.querySelectorAll('.weather__tab');
const weatherPanels = document.querySelectorAll('.weather__panel');

function setWeatherTab(index) {
  weatherTabs.forEach(t => t.classList.remove('active'));
  weatherPanels.forEach(p => p.classList.remove('active'));
  weatherTabs[index].classList.add('active');
  const season = weatherTabs[index].dataset.season;
  document.getElementById(`season-${season}`).classList.add('active');
}

weatherTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    setWeatherTab(i);
    resetWeatherTimer();
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const toast = document.getElementById('toast');
const toastClose = document.getElementById('toastClose');

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

toastClose && toastClose.addEventListener('click', () => toast.classList.remove('show'));

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.contact-form__submit');
    btn.textContent = 'Đang gửi...';
    btn.disabled = true;

    const data = new FormData(contactForm);

    try {
      const res = await fetch('https://formspree.io/f/xreowvyj', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        showToast();
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      formNote.textContent = '❌ Có lỗi xảy ra. Vui lòng email trực tiếp: phucthien3156@gmail.com';
      formNote.style.color = '#eb5757';
    }

    btn.textContent = 'Gửi tin nhắn ';
    btn.disabled = false;
  });
}

// ===== CULTURE LIST IMAGE SWITCH =====
const cultureItems = document.querySelectorAll('.culture__item');
const cultureImg1 = document.getElementById('cultureImg1');
const cultureImg2 = document.getElementById('cultureImg2');

function switchCultureImages(img1Url, img2Url) {
  [cultureImg1, cultureImg2].forEach(img => {
    img.style.opacity = '0';
  });
  setTimeout(() => {
    cultureImg1.style.backgroundImage = `url('${img1Url}')`;
    cultureImg2.style.backgroundImage = `url('${img2Url}')`;
    [cultureImg1, cultureImg2].forEach(img => {
      img.style.opacity = '1';
    });
  }, 250);
}

cultureItems.forEach(item => {
  item.addEventListener('click', () => {
    cultureItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    switchCultureImages(item.dataset.img1, item.dataset.img2);
  });
});

if (cultureItems.length > 0) {
  cultureItems[0].click(); 
}
// ===== LEAFLET MAP =====
const map = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: false }).setView([19.85, 105.7], 9);

L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  attribution: '&copy; Google Maps',
  maxZoom: 20
}).addTo(map);

const goldIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#c9a84c;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 4px rgba(201,168,76,0.35);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -12]
});

const locations = [
  { lat: 20.0800, lng: 105.7851, name: 'Thanh Nha Ho',  tag: 'Di san UNESCO' },
  { lat: 19.7333, lng: 105.9000, name: 'Bien Sam Son',   tag: 'Bien dep' },
  { lat: 19.5800, lng: 105.4500, name: 'VQG Ben En',     tag: 'Thien nhien' },
  { lat: 20.1200, lng: 105.4200, name: 'Lam Kinh',       tag: 'Lich su' },
];

const markers = locations.map(loc => {
  const marker = L.marker([loc.lat, loc.lng], { icon: goldIcon })
    .addTo(map)
    .bindPopup('<strong>' + loc.name + '</strong><br/><span style="color:#c9a84c">' + loc.tag + '</span>');
  return { marker, ...loc };
});

document.querySelectorAll('.map-pin').forEach((pin, i) => {
  pin.addEventListener('click', () => {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    pin.classList.add('active');
    map.flyTo([locations[i].lat, locations[i].lng], 13, { duration: 1.2 });
    markers[i].marker.openPopup();
  });
});
