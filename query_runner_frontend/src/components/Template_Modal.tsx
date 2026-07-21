import React, { useState, useEffect } from 'react';
import { Modal, Input, Space, Typography } from 'antd';
import SegmentedItem from './Segmented_Item';
import type { Visibility } from './Segmented_Item';
import type { Template } from './Template_Card';

const { Text } = Typography;

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('personal');

  // Reset form when modal is closed/opened
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setQuery('');
      setVisibility('personal');
    }
  }, [isOpen]);

  const handleOk = () => {
    if (!name.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      query: query.trim(),
      visibility,
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Sorguyu Şablon Olarak Kaydet"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Kaydet"
      cancelText="İptal"
      okButtonProps={{ disabled: !name.trim() }}
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 12 }}>
        <div>
          <div style={{ marginBottom: 6 }}>
            <Text strong>Sorgu adı</Text> <Text type="danger">*</Text>
          </div>
          <Input
            placeholder="Örn: Aktif Kullanıcı Listesi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            allowClear
          />
        </div>
        <div>
          <div style={{ marginBottom: 6 }}>
            <Text strong>SQL Sorgusu</Text>
          </div>
          <Input.TextArea
            placeholder="SELECT * FROM users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            allowClear
          />
        </div>
        <div>
          <div style={{ marginBottom: 6 }}>
            <Text strong>Sorgu açıklaması</Text>
          </div>
          <Input.TextArea
            placeholder="Sorgunun amacını ve ne döndürdüğünü açıklayın..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={200}
            showCount
          />
        </div>
        <div>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Görünürlük</Text>
          </div>
          <SegmentedItem value={visibility} onChange={setVisibility} />
        </div>
      </Space>
    </Modal>
  );
};

export default TemplateModal;

