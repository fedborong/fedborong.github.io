/**
 * Template Name: eBusiness (Optimized & Fast Version)
 * Updated: Oct 2025 by ChatGPT
 * Fix: Optimized for speed, safe for all pages
 */

(function() {
  "use strict";

  /** Debounce helper **/
  function debounce(func, wait = 100) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /** Cache commonly used selectors **/
  const body = document.querySelector('body');
  const header = document.querySelector('#header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelectorAll('#navmenu a');
  const faqItems = document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header');
  const carousels = document.querySelectorAll('.carousel-indicators');

  /** Toggle scrolled class **/
  function toggleScrolled() {
    if (!header) return;
    if (!header.classList.contains('scroll-up-sticky') &&
        !header.classList.contains('sticky-top') &&
        !header.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
  }

  document.addEventListener('scroll', debounce(toggleScrolled));
  window.addEventListener('load', toggleScrolled);

  /** Mobile nav toggle **/
  function mobileNavToggle() {
    body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /** Hide mobile nav on same-page/hash links **/
  if (navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (body.classList.contains('mobile-nav-active')) mobileNavToggle();
      });
    });
  }

  /** Toggle mobile nav dropdowns **/
  const dropdownToggles = document.querySelectorAll('.navmenu .toggle-dropdown');
  if (dropdownToggles.length) {
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        const next = this.parentNode.nextElementSibling;
        if (next) next.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  }

  /** Preloader **/
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /** Scroll top button **/
  function toggleScrollTop() {
    if (scrollTopBtn) {
      window.scrollY > 100 ? scrollTopBtn.classList.add('active') : scrollTopBtn.classList.remove('active');
    }
  }
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  document.addEventListener('scroll', debounce(toggleScrollTop));
  window.addEventListener('load', toggleScrollTop);

  /** Animation on scroll (AOS) **/
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  }
  window.addEventListener('load', aosInit);

  /** Pure Counter **/
  if (typeof PureCounter !== 'undefined') new PureCounter();

  /** Swiper sliders **/
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(swiperElement => {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      const config = JSON.parse(configEl.innerHTML.trim());
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /** GLightbox **/
  if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });

  /** Isotope Layout **/
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
      const container = isotopeItem.querySelector('.isotope-container');
      if (!container) return;

      const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(container, () => {
        initIsotope = new Isotope(container, { itemSelector: '.isotope-item', layoutMode: layout, filter, sortBy: sort });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(btn => {
        btn.addEventListener('click', () => {
          const active = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (active) active.classList.remove('filter-active');
          btn.classList.add('filter-active');
          if (initIsotope) initIsotope.arrange({ filter: btn.getAttribute('data-filter') });
        });
      });
    });
  }

  /** FAQ Toggle **/
  if (faqItems.length) {
    faqItems.forEach(faq => {
      faq.addEventListener('click', () => faq.parentNode.classList.toggle('faq-active'));
    });
  }

  /** Carousel indicators **/
  if (carousels.length) {
    carousels.forEach(carouselIndicator => {
      const carousel = carouselIndicator.closest('.carousel');
      if (!carousel) return;
      const items = carousel.querySelectorAll('.carousel-item');
      if (!items.length) return;
      const fragment = document.createDocumentFragment();
      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-bs-target', `#${carousel.id}`);
        li.setAttribute('data-bs-slide-to', index);
        if (index === 0) li.classList.add('active');
        fragment.appendChild(li);
      });
      carouselIndicator.appendChild(fragment);
    });
  }

  /** Hash scroll fix **/
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (!section) return;
      setTimeout(() => {
        const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop) || 0;
        window.scrollTo({ top: section.offsetTop - scrollMarginTop, behavior: 'smooth' });
      }, 100);
    }
  });

  /** Navmenu Scrollspy **/
  function navmenuScrollspy() {
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', debounce(navmenuScrollspy));

})();
