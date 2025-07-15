import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

const FloatingNav: React.FC = () => {
  const [showQRCode, setShowQRCode] = useState(false);

  const toggleQRCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 flex flex-col">
      {/* 微信二维码弹出框 */}
      {showQRCode && (
        <div className="absolute -left-40 top-0 bg-white rounded-lg shadow-xl p-4 mb-4 w-40 h-48 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-2">
            <span className="text-gray-500 text-xs text-center">
              微信二维码
              <br />
              扫码添加客服
            </span>
          </div>
          <p className="text-xs text-gray-600">扫码添加客服微信</p>
        </div>
      )}
      
      {/* 微信咨询按钮 */}
      <button
        onClick={toggleQRCode}
        className="bg-white w-20 h-20 rounded-lg shadow-lg flex flex-col items-center justify-center mb-2 hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-6 h-6 text-gray-500 mb-1" />
        <span className="text-xs text-gray-600">微信咨询</span>
      </button>
      
      {/* 电话咨询按钮 */}
      <a
        href="tel:4000262606"
        className="bg-white w-20 h-20 rounded-lg shadow-lg flex flex-col items-center justify-center mb-2 hover:shadow-xl transition-shadow"
      >
        <Phone className="w-6 h-6 text-blue-500 mb-1" />
        <span className="text-xs text-gray-600">电话咨询</span>
      </a>
      
      {/* 在线预约按钮 */}
      <div className="bg-white w-20 h-20 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
        <Calendar className="w-6 h-6 text-gray-500 mb-1" />
        <span className="text-xs text-gray-600">在线预约</span>
      </div>
    </div>
  );
};

export default FloatingNav;