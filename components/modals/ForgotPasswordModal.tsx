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
        <Label className="text-xs font-normal text-[#0A0A0B]">Email*</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
        />
      </div>
      <div>
        <Button className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]">
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default ForgetPassordModal;
