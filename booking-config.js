(() => {
    // Replace with your scheduling URL when available.
    const DEFAULT_BOOKING_URL = 'mailto:cyril@llmxai.co?subject=LLMx%200%E2%86%921%20Shipping%20Sprint';
    window.BOOKING_URL = window.BOOKING_URL || DEFAULT_BOOKING_URL;

    // No-op-safe analytics bridge.
    window.llmxTrack = function llmxTrack(eventName, props = {}) {
        try {
            if (typeof window.plausible === 'function') {
                window.plausible(eventName, { props });
                return;
            }
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, props);
            }
        } catch (_error) {
            // Deliberately swallow analytics errors.
        }
    };
})();
