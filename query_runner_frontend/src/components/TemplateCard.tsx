import React from 'react';
import { Card, Tag, Button, Tooltip, Flex } from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import './TemplateCard.scss';

export interface Template {
  id: string;
  name: string;
  description: string;
  visibility: 'personal' | 'team';
  query?: string;
}

interface TemplateCardProps {
  template?: Template;
  onClick: () => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

// Tek bileşen iki hâlde render olur: şablon verisi varsa Ant Design Card ile,
// yoksa Ant Design dashed Button ile render edilir.
const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick, onDelete }) => {
  if (!template) {
    return (
      <Button
        type="dashed"
        block
        icon={<PlusOutlined className="template-card__add-icon" />}
        onClick={onClick}
        className="template-card template-card--add"
      >
        Yeni Şablon Ekle
      </Button>
    );
  }

  return (
    <Card
      hoverable
      onClick={onClick}
      className="template-card"
      styles={{ body: { padding: '12px 14px' } }}
    >
      <Flex justify="space-between" align="center" className="template-card__header">
        {template.visibility === 'personal' ? (
          <Tag color="success" icon={<UserOutlined />} className="template-card__tag template-card__tag--personal">
            Kişisel
          </Tag>
        ) : (
          <Tag color="processing" icon={<TeamOutlined />} className="template-card__tag template-card__tag--team">
            Ekip
          </Tag>
        )}
        <Flex gap={6} className="template-card__actions" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Şablonu Uygula" placement="top">
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<PlayCircleOutlined />}
              className="template-card__action-btn template-card__action-btn--run"
              onClick={onClick}
            />
          </Tooltip>
          {onDelete && (
            <Tooltip title="Şablonu Sil" placement="top">
              <Button
                type="text"
                size="small"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                className="template-card__action-btn template-card__action-btn--delete"
                onClick={(e) => onDelete(template.id, e)}
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <div className="template-card__content">
        <h4 className="template-card__name" title={template.name}>{template.name}</h4>
        {template.description && (
          <p className="template-card__description" title={template.description}>
            {template.description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default TemplateCard;


