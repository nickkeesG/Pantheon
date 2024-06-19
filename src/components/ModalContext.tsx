import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Modal from './common/Modal';


interface ModalContextType {
  modals: React.ReactNode[];
  addModal: (modal: React.ReactNode) => void;
  removeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<React.ReactNode[]>([]);

  const addModal = useCallback((modal: React.ReactNode) => {
    setModals(prev => { return [...prev, modal]; });
  }, []);

  const removeModal = useCallback(() => {
    setModals(prev => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [removeModal]);

  useEffect(() => {
    if (modals.length === 0) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [modals]);

  return (
    <ModalContext.Provider value={{ modals, addModal, removeModal }}>
      {children}
      {modals.map((modalContent, index) => (
        <Modal
          key={index}
          zIndex={100 + (index * 2)}
          top={`${(index + 1) * 10}%`}
        >
          {modalContent}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};