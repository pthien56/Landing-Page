// ===== NAV: scroll effect + auto hide =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  // Luon hien o trang dau
  if (currentY < 80) {
    navbar.classList.remove('scrolled', 'nav--hidden');
    lastScrollY = currentY;
    return;
  }

  navbar.classList.add('scrolled');

  if (currentY > lastScrollY + 8) {
    // Scroll xuong -> an navbar (tru khi menu dang mo)
    if (!navMenu.classList.contains('open')) {
      navbar.classList.add('nav--hidden');
    }
  } else if (currentY < lastScrollY - 8) {
    // Scroll len -> hien navbar
    navbar.classList.remove('nav--hidden');
  }

  lastScrollY = currentY;
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

weatherTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    weatherTabs.forEach(t => t.classList.remove('active'));
    weatherPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`season-${tab.dataset.season}`).classList.add('active');
  });
});

// ===== LEAFLET MAP =====
const map = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: false }).setView([19.85, 105.7], 9);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  maxZoom: 18
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
