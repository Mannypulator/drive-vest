// components/ui/Modal.tsx
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import logo from "@/assets/images/logo.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onOpenSecondaryAction?: () => void; // For triggering secondary action like 'Sign up'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
        <DialogHeader>
          <div className="flex justify-center mb-4 space-y-0">
            <Image
              className="-mb-4"
              src={logo}
              alt="Drive Vest Logo"
              height={40}
              width={40}
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold -mb-4">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-xs text-gray-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <>{children}</>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
