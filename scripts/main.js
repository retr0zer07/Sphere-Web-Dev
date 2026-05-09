(function () {
  const track = function (eventName, data) {
    if (window.Analytics && typeof window.Analytics.track === 'function') {
      window.Analytics.track(eventName, data || {});
    }
  };

  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  const sectionObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const sectionName = entry.target.getAttribute('data-section');
        if (sectionName) {
          track('section_view_' + sectionName);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.section-track').forEach(function (section) {
    sectionObserver.observe(section);
  });

  document.querySelectorAll('[data-event]').forEach(function (node) {
    node.addEventListener('click', function () {
      const data = node.dataset || {};
      const eventName = data.event;
      if (eventName) {
        const details = {};
        Object.keys(data).forEach(function (key) {
          if (key !== 'event' && key !== 'utmPass') {
            details[key] = data[key];
          }
        });
        track(eventName, details);
      }
    });
  });

  document.querySelectorAll('#faq details').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        const label = item.querySelector('summary');
        track('faq_expand', { question: label ? label.textContent.trim() : '' });
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const hasUtm = utmKeys.some(function (key) { return params.has(key); });

  if (hasUtm) {
    document.querySelectorAll('a[data-utm-pass="true"]').forEach(function (link) {
      const url = new URL(link.href);
      utmKeys.forEach(function (key) {
        const value = params.get(key);
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      link.href = url.toString();
    });
  }

  const quoteForm = document.getElementById('quote-form');
  const status = document.getElementById('form-status');

  if (quoteForm && status) {
    quoteForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!quoteForm.checkValidity()) {
        status.hidden = false;
        status.textContent = 'Please complete all required fields before submitting.';
        track('form_quote_error');
        quoteForm.reportValidity();
        return;
      }

      status.hidden = false;
      status.innerHTML = 'Thanks! Your quote request was received. You can also <a href="https://wa.me/5358706242" target="_blank" rel="noopener">message us on WhatsApp</a> for faster response.';
      track('form_quote_submit', {
        service: (document.getElementById('service') || {}).value || ''
      });
      quoteForm.reset();
    });
  }

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}());
