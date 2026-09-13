// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll reveal animations ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: just show everything if IntersectionObserver isn't supported
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- Certificate preview modal ----------
const certCards = document.querySelectorAll('.cert-card');
const modalOverlay = document.getElementById('certModal');
const modalFrame = document.getElementById('modalFrame');
const modalTitle = document.getElementById('modalTitle');
const modalOpenNewTab = document.getElementById('modalOpenNewTab');
const modalClose = document.getElementById('modalClose');

let lastFocusedElement = null;

function openCertModal(card) {
  const pdfPath = card.getAttribute('data-pdf');
  const title = card.getAttribute('data-title') || 'Certificate';

  lastFocusedElement = document.activeElement;

  modalFrame.src = pdfPath;
  modalTitle.textContent = title;
  modalOpenNewTab.href = pdfPath;

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  modalClose.focus();
}

function closeCertModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Clear the iframe src after the closing transition so it fully stops loading
  setTimeout(() => { modalFrame.src = ''; }, 250);

  if (lastFocusedElement) lastFocusedElement.focus();
}

certCards.forEach(card => {
  card.addEventListener('click', () => openCertModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCertModal(card);
    }
  });
});

modalClose.addEventListener('click', closeCertModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeCertModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeCertModal();
  }
});
