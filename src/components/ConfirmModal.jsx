import React from 'react';

export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) {
  return (
    <div
      className="modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-msg"
    >
      <div className="modal-box" style={{ textAlign: 'center', maxWidth: '380px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
        <h2 id="confirm-title" style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          {title}
        </h2>
        <p id="confirm-msg" style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className={`btn btn-lg ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            id="confirm-yes-btn"
          >
            {confirmLabel}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onCancel} id="confirm-no-btn">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
