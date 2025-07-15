import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import ErpInfoForm from './ErpInfoForm';

interface DynamicFormRouterProps {
  buttonId: string;
  children: React.ReactNode;
  className?: string;
}

interface ButtonFormMapping {
  id: string;
  button_id: string;
  form_id: string;
  is_active: boolean;
}

interface FormConfig {
  id: string;
  name: string;
  description: string;
  form_url: string;
  form_config: any;
}

const DynamicFormRouter: React.FC<DynamicFormRouterProps> = ({ 
  buttonId, 
  children, 
  className = '' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    // 不再需要获取表单配置，直接使用ErpInfoForm
    setLoading(false);
  }, [buttonId]);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        disabled={loading}
      >
        {children}
      </button>
      <ErpInfoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DynamicFormRouter;