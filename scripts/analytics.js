(function () {
  window.Analytics = {
    track(event, properties) {
      const payload = { event, ...(properties || {}) };
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(payload);
      }
      if (typeof window.plausible === 'function') {
        window.plausible(event, { props: properties || {} });
      }
    }
  };

  window.addEventListener('load', function () {
    window.__analyticsReady = true;
  });
}());
