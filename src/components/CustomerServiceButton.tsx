import React from 'react';
import { MessageCircle } from 'lucide-react';

interface CustomerServiceButtonProps {
  onClick: () => void;
}

const CustomerServiceButton: React.FC<CustomerServiceButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#194fe8] hover:bg-[#1640c7] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
      title="客服咨询"
    >
      <MessageCircle className="w-6 h-6 hover:scale-110 transition-transform duration-200" />
    </button>
  );
};

export default CustomerServiceButton; 