import { useCallback, useState } from 'react';

export function useToggle(initial = false) {
  const [value, setValue] = useState(Boolean(initial));
  const toggle = useCallback(() => setValue(v => !v), []);
  const setOn = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);
  return { value, toggle, setOn, setOff };
}


