import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Modal from './common/Modal';


interface ModalEntry {
  id: number;
  content: React.ReactNode;
}

interface ModalContextType {
  modals: ModalEntry[];
  addModal: (modal: React.ReactNode) => void;
  removeModal: () => void;
}

let nextModalId = 0;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  const addModal = useCallback((modal: React.ReactNode) => {
    setModals(prev => [...prev, { id: nextModalId++, content: modal }]);
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
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    } else {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    }
  }, [modals]);

  return (
    <ModalContext.Provider value={{ modals, addModal, removeModal }}>
      {children}
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          zIndex={100 + (index * 2)}
          top={`${(index * 2) + 10}%`}
        >
          {modal.content}
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