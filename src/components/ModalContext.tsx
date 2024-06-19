import React, { createContext, useContext, useState } from 'react';
import Modal from './common/Modal';


interface ModalContextType {
  modals: React.ReactNode[];
  addModal: (modal: React.ReactNode) => void;
  removeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<React.ReactNode[]>([]);

  const addModal = (modal: React.ReactNode) => {
    setModals(prev => { return [...prev, modal]; });
  };

  const removeModal = () => {
    setModals(prev => prev.slice(0, -1));
  };

  return (
    <ModalContext.Provider value={{ modals, addModal, removeModal }}>
      {children}
      {modals.map((modalContent, index) => (
        <Modal key={index}>
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