import React, { useEffect, memo } from 'react';
import Button from './Button';
import { Done } from '../ui';
import '../../styles/SuccessModal.css';

function SuccessModal({ open, onClose, onContinue }) {
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
            <img src={Done} alt="Done" />
          </div>
        </div>
        <h2>Congrats!</h2>
        <p>Your order is placed successfully!</p>
        <div className="actions">
          <Button className="btn btn-primary btn-success-modal" onClick={onContinue}>Continue shopping</Button>
        </div>
      </div>
    </div>
  );
}

export default memo(SuccessModal);


