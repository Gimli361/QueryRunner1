import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Space } from 'antd';
import type { DropdownProps, MenuProps } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  root: {
    backgroundColor: token.colorFillAlter,
    border: `1px solid ${token.colorBorder}`,
    borderRadius: token.borderRadius,
  },
}));

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Database 1',
  },
  {
    key: '2',
    label: 'Database 2 ',
    
  },
  {
    key: '3',
    label: 'Database 3',
    
  },
];

const objectStyles: DropdownProps['styles'] = {
  root: {
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginInlineEnd: '8px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
};

const Db_dropdown: React.FC = () => {
  const { styles } = useStyles();
  const [selectedKey, setSelectedKey] = React.useState<string>();

  const selectedItem = items?.find((item) => item?.key === selectedKey);
  const selectedLabel =
    selectedItem && 'label' in selectedItem ? selectedItem.label : undefined;

  const sharedProps: DropdownProps = {
    menu: {
      items,
      selectable: true,
      selectedKeys: selectedKey ? [selectedKey] : [],
      onClick: ({ key }) => setSelectedKey(key),
    },
    placement: 'bottomLeft',
    classNames: { root: styles.root },
  };

  return (
    <Flex gap="medium" wrap="wrap">
      <Space vertical size="large">
        <Dropdown {...sharedProps} styles={objectStyles}>
          <Button>
            <Space>
              {selectedLabel ?? 'Veritabanı Seç'}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Flex>
  );
};

export default Db_dropdown;