import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Modal from "./Modal";

interface ForgetPassordModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   onOpenResetPassoword: () => void;
}
const ForgetPassordModal: React.FC<ForgetPassordModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Forgot Password"
      description=""
    >
      <div>
        <Label className="text-xs font-normal text-text-primary">Email*</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-border-gray-100 rounded-[5px] placeholder:text-text-secondary placeholder:text-xs placeholder:font-normal"
        />
      </div>
      <div>
        <Button className="w-full bg-primary font-semibold text-base text-white">
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default ForgetPassordModal;
