import React from 'react';
import { Modal } from 'antd';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose }) => (
  <Modal
    title="Şablon Ekle"
    open={isOpen}
    onOk={onClose}
    onCancel={onClose}
  >
    
  </Modal>
);

export default TemplateModal;
