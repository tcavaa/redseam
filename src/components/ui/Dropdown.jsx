import React, { createContext, useContext, useMemo, useState } from 'react';

const DropdownContext = createContext(null);

export default function Dropdown({ open: controlled, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlled != null;
  const open = isControlled ? controlled : uncontrolledOpen;
  const setOpen = (next) => {
    const value = typeof next === 'function' ? next(open) : next;
    if (onOpenChange) onOpenChange(Boolean(value));
    else setUncontrolledOpen(Boolean(value));
  };
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

Dropdown.Trigger = function Trigger({ children }) {
  const ctx = useContext(DropdownContext);
  return (
    <button className="menu-trigger" onClick={() => ctx.setOpen(!ctx.open)} aria-expanded={ctx.open}>
      {children}
    </button>
  );
};

Dropdown.Panel = function Panel({ children }) {
  const ctx = useContext(DropdownContext);
  if (!ctx.open) return null;
  return <div className="menu-panel">{children}</div>;
};


