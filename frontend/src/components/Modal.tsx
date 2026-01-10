import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  type?: 'error' | 'success' | 'info' | 'confirm';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  onConfirm, 
  confirmText = 'Confirm', 
  type = 'info' 
}) => {
  if (!isOpen) return null;

  const getHeaderColor = () => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'success': return '#22c55e';
      case 'confirm': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        animation: 'slideIn 0.2s ease-out'
      }}>
        <div style={{
          backgroundColor: getHeaderColor(),
          padding: '1rem',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{title}</span>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: '1',
              padding: '0 0.5rem'
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#333', margin: 0 }}>{message}</p>
        </div>
        <div style={{ 
          padding: '0 1.5rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'end',
          gap: '1rem'
        }}>
          {onConfirm ? (
            <>
              <button 
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: getHeaderColor(),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
