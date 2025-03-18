import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";

const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-blue-500  bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
      type="submit"
      disabled={pending}
    >
      <Send className="mr-2" /> {pending ? "Sending..." : "Send Message"}
    </button>
  );
};

export default SubmitMessageButton;
