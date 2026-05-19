const loader = document.getElementById('page-loader');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

// Page loader functionality
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1500); // Show loader for 1.5 seconds
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
  setActiveLink();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinkItems.forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function setActiveLink() {
  const midpoint = window.scrollY + window.innerHeight * 0.35;

  let currentSectionId = sections[0]?.id;
  sections.forEach((section) => {
    if (midpoint >= section.offsetTop) currentSectionId = section.id;
  });

  navLinkItems.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentSectionId}`;
    link.classList.toggle('active', isActive);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((node) => {
  observer.observe(node);
});

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const duration = 1100;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        counter.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      obs.unobserve(counter);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    feedback.style.color = '#ff9f9f';
    feedback.textContent = 'Please complete all required fields before submitting.';
    form.reportValidity();
    return;
  }

  // Get form data
  const formData = new FormData(form);
  const fullName = formData.get('fullName');
  const phone = formData.get('phone');
  const email = formData.get('email') || 'Not provided';
  const service = formData.get('service');
  const urgency = formData.get('urgency');
  const location = formData.get('location') || 'Not provided';
  const message = formData.get('message') || 'No additional details';

  // Create WhatsApp message
  const whatsappMessage = encodeURIComponent(
`*NEW SECURITY REQUEST - FRONTLINE PROTECTION*

*Client Information:*
Name: ${fullName}
Phone: ${phone}
Email: ${email}

*Service Details:*
Service: ${service}
Urgency: ${urgency}
Location: ${location}

*Message:*
${message}

---
*Request submitted via website on ${new Date().toLocaleDateString()}*`
  );

  // WhatsApp number (you specified 0789424919, using +250 prefix for Rwanda)
  const whatsappNumber = '+250 783 133 025';
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '').replace('+', '')}?text=${whatsappMessage}`;

  // Show success message
  feedback.style.color = '#8bf5b2';
  feedback.textContent = 'Opening WhatsApp to send your request...';

  // Open WhatsApp in new tab
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    
    // Update feedback message
    feedback.style.color = '#8bf5b2';
    feedback.textContent = 'WhatsApp opened! Please send the message to complete your request.';
    
    // Reset form after successful submission
    setTimeout(() => {
      form.reset();
      feedback.textContent = 'Thank you! Your protection request has been sent via WhatsApp.';
    }, 2000);
  }, 1000);
});

setActiveLink();

// Gallery Lightbox Functionality
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-overlay"></div>
  <div class="lightbox-content">
    <img src="" alt="" class="lightbox-image">
    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
    <button class="lightbox-next" aria-label="Next image">&#10095;</button>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentImageIndex = 0;
const images = Array.from(galleryItems);

function openLightbox(index) {
  currentImageIndex = index;
  lightboxImage.src = images[index].src;
  lightboxImage.alt = images[index].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  lightboxImage.src = images[currentImageIndex].src;
  lightboxImage.alt = images[currentImageIndex].alt;
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  lightboxImage.src = images[currentImageIndex].src;
  lightboxImage.alt = images[currentImageIndex].alt;
}

galleryItems.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  switch(e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      showPrevImage();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
  }
});    