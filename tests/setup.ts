import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof global.IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof global.ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill PointerEvents methods that Radix UI expects but JSDOM lacks
// See failures like: TypeError: target.hasPointerCapture is not a function
if (typeof Element !== "undefined") {
  const elementProto = Element.prototype as unknown as {
    setPointerCapture?: (pointerId: number) => void;
    releasePointerCapture?: (pointerId: number) => void;
    hasPointerCapture?: (pointerId: number) => boolean;
    scrollIntoView?: (arg?: boolean | ScrollIntoViewOptions) => void;
  };
  if (!elementProto.setPointerCapture) {
    elementProto.setPointerCapture = () => {};
  }
  if (!elementProto.releasePointerCapture) {
    elementProto.releasePointerCapture = () => {};
  }
  if (!elementProto.hasPointerCapture) {
    elementProto.hasPointerCapture = () => false;
  }
  if (!elementProto.scrollIntoView) {
    elementProto.scrollIntoView = () => {};
  }
}
