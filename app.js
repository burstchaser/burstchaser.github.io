const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });
}

const modal = document.querySelector('#registration-modal');
const openButtons = document.querySelectorAll('.js-open-registration');
const closeButtons = document.querySelectorAll('.js-close-registration');
let lastFocusedElement = null;

function openModal() {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => modal.querySelector('input')?.focus(), 80);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}

openButtons.forEach((button) => button.addEventListener('click', openModal));
closeButtons.forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
});

const form = document.querySelector('#registration-form');
const formSuccess = document.querySelector('#form-success');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  form.hidden = true;
  formSuccess.hidden = false;
  window.setTimeout(closeModal, 2200);
});

const agendaTabs = document.querySelectorAll('.agenda-tab');
const agendaPanels = document.querySelectorAll('.agenda-list');
agendaTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.day;
    agendaTabs.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    agendaPanels.forEach((panel) => {
      const selected = panel.id === target;
      panel.classList.toggle('active', selected);
      panel.hidden = !selected;
    });
  });
});

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!toast) return;
    toast.textContent = button.dataset.toast;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navigationItems = [...document.querySelectorAll('.nav-links a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visibleSection) return;
    navigationItems.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visibleSection.target.id}`);
    });
  }, { rootMargin: '-25% 0px -62% 0px', threshold: [0.05, .2, .45] });
  sections.forEach((section) => sectionObserver.observe(section));
}
