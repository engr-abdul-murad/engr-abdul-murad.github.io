const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const progress = document.getElementById('pageProgress');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id], footer[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

function updateProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

document.getElementById('year').textContent = new Date().getFullYear();
// PEC Certificates Loader
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('pec-certificates-list');
  if (!container) return;

  try {
    const response = await fetch('assets/certificates/pec/certificates.json');
    const certificates = await response.json();

    container.innerHTML = '';

    certificates.forEach((cert, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'pec-certificate-card';
      card.innerHTML = `
        <div class="pec-card-icon">PEC</div>
        <div class="pec-card-content">
          <strong>${cert.title}</strong>
          <small>${cert.date} · ${cert.cpd}</small>
        </div>
        <span class="pec-card-more">View Details →</span>
      `;

      card.addEventListener('click', () => openPecCertificate(cert));
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = '<p>Unable to load PEC certificates.</p>';
    console.error('PEC certificates error:', error);
  }
});

function openPecCertificate(cert) {
  let modal = document.getElementById('pecCertificateModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pecCertificateModal';
    modal.className = 'pec-modal';
    modal.innerHTML = `
      <div class="pec-modal-overlay"></div>
      <div class="pec-modal-panel">
        <button class="pec-modal-close" type="button" aria-label="Close">×</button>
        <div class="pec-modal-grid">
          <div class="pec-modal-image-wrap">
            <img class="pec-modal-image" alt="PEC Certificate">
          </div>
          <div class="pec-modal-details">
            <span class="pec-modal-kicker">PAKISTAN ENGINEERING COUNCIL</span>
            <h3 class="pec-modal-title"></h3>
            <div class="pec-modal-meta"></div>
            <h4>Key Learnings</h4>
            <ul class="pec-modal-learning"></ul>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.pec-modal-close').addEventListener('click', closePecCertificate);
    modal.querySelector('.pec-modal-overlay').addEventListener('click', closePecCertificate);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePecCertificate();
    });
  }

  const imagePath =
    'assets/certificates/pec/' + encodeURIComponent(cert.image);

  modal.querySelector('.pec-modal-image').src = imagePath;
  modal.querySelector('.pec-modal-image').alt = cert.title;
  modal.querySelector('.pec-modal-title').textContent = cert.title;

  modal.querySelector('.pec-modal-meta').innerHTML = `
    <p><strong>Issuer:</strong> ${cert.issuer}</p>
    <p><strong>Date:</strong> ${cert.date}</p>
    <p><strong>CPD:</strong> ${cert.cpd}</p>
    <p><strong>Serial No:</strong> ${cert.serial}</p>
  `;

  const learningList = modal.querySelector('.pec-modal-learning');
  learningList.innerHTML = '';

  cert.learning.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    learningList.appendChild(li);
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePecCertificate() {
  const modal = document.getElementById('pecCertificateModal');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';
}
