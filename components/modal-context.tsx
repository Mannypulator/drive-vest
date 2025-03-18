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
  | "add-post";

type ModalContextType = {
  activeModal: ModalType | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal: setActiveModal,
        closeModal: () => setActiveModal(null),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
