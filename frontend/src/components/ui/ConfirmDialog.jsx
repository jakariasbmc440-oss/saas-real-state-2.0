import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning'
}) {
  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  };

  const bgColors = {
    danger: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50'
  };

  const buttonVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" showCloseButton={false} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-4 ${bgColors[variant]}`}>
          {icons[variant]}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        
        <div className="flex w-full gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={buttonVariants[variant]} fullWidth onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
