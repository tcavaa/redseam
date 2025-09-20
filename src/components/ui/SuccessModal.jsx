import React, { useEffect } from 'react';
import Button from './Button';
import '../../styles/SuccessModal.css';

export default function SuccessModal({ open, onClose, onContinue }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="success-modal" role="dialog" aria-modal onClick={onClose}>
      <div className="success-dialog" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>✕</button>
        <div className="icon">
          <div className="circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2>Congrats!</h2>
        <p>Your order is placed successfully!</p>
        <div className="actions">
          <Button onClick={onContinue}>Continue shopping</Button>
        </div>
      </div>
    </div>
  );
}


