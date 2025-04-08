// 1. Create our "Magic Cookie Jar" (Modal Context)
// components/modal-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ModalType =
  | "login"
  | "signup"
  | "forgot-password"
  | "password-change"
  | "success"
  | "reset-password"
  | "add-post"
  | "edit-post";

type ModalContextType = {
  activeModal: ModalType | null;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  activeModal: null,
  modalData: null,
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal: (type, data) => {
          setActiveModal(type);
          setModalData(data);
        },
        closeModal: () => {
          setActiveModal(null);
          setModalData(null);
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
