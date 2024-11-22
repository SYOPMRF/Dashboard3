import '@testing-library/jest-dom';

// setupTests.js
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  window.ResizeObserver = ResizeObserver;
  