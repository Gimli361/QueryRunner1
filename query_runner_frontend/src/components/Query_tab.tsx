import React, { useRef, useState } from 'react';
import { Tabs } from 'antd';
import ButtonComponent from './ButtonComponent';
import NumberInput from './NumberInput';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const QueryEditor: React.FC = () => (
  <div className="Query-Area">
    <textarea className="query-editor" placeholder="" />
    <div className="query-controls">
      <ButtonComponent text="Run Query" />
      <h5>Limit : </h5>
      <NumberInput />
    </div>
  </div>
);

const initialTabs = [{ label: 'Sorgu 1', key: '1' }];

const query_tab: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialTabs[0].key);
  const [tabs, setTabs] = useState(initialTabs);
  const newTabIndex = useRef(0);

  const items = tabs.map((tab) => ({ ...tab, children: <QueryEditor /> }));

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setTabs([...tabs, { label: `Sorgu ${tabs.length + 1}`, key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabs.filter((tab) => tab.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabs(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
};

export default query_tab;