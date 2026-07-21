import React from 'react';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Flex, Segmented } from 'antd';

export type Visibility = 'personal' | 'team';

interface SegmentedItemProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
}

// Not: SCSS değişkenleri (ör. $color-primary) burada literal string olarak
// kullanılamaz — bu dosya Sass tarafından işlenmez, tarayıcı geçersiz renk
// olarak görüp yok sayar. Renkler bu yüzden doğrudan hex olarak verildi.
const SegmentedItem: React.FC<SegmentedItemProps> = ({ value, onChange }) => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented
      value={value}
      onChange={(val) => onChange(val as Visibility)}
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <div>Kişisel</div>
            </div>
          ),
          value: 'personal',
          tooltip: { title: 'Kişisel' },
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#09013d' }} icon={<TeamOutlined />} />
              <div>Ekibimle Paylaş</div>
            </div>
          ),
          value: 'team',
          tooltip: { title: 'Ekibimle Paylaş' },
        },
      ]}
    />
  </Flex>
);

export default SegmentedItem;