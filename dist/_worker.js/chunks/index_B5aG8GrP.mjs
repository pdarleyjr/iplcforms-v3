globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as reactExports } from './_@astro-renderers_BIJ3dQRj.mjs';

// packages/react/use-previous/src/use-previous.tsx
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

export { usePrevious as u };
//# sourceMappingURL=index_B5aG8GrP.mjs.map
