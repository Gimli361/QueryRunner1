import React, { useRef, useState } from 'react';
import { Tabs } from 'antd';
import ButtonComponent from './Button_Component';
import NumberInput from './Number_Input';
import './Query_Tab.scss';
import Auto_Complete from './Auto_Complete';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange }) => (
  <div className="Query-Area">
    <Auto_Complete
      className="query-editor"
      placeholder="SQL Sorgunuzu buraya yazın..."
      value={value}
      onChange={onChange}
    />
    <div className="query-controls">
      <ButtonComponent text="Run Query" />
      <h5>Limit : </h5>
      <NumberInput />
    </div>
  </div>
);

interface TabItem {
  label: string;
  key: string;
  query: string;
}

const initialTabs: TabItem[] = [{ label: 'Sorgu 1', key: '1', query: '' }];

interface QueryTabProps {
  selectedQuery?: string;
}

const Query_Tab: React.FC<QueryTabProps> = ({ selectedQuery }) => {
  const [activeKey, setActiveKey] = useState(initialTabs[0].key);
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const newTabIndex = useRef(0);

  // Dışarıdan yeni bir şablon seçildiğinde aktif olan sekmenin query değerini güncelle
  React.useEffect(() => {
    if (selectedQuery !== undefined && selectedQuery !== '') {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.key === activeKey ? { ...tab, query: selectedQuery } : tab
        )
      );
    }
  }, [selectedQuery]);

  const handleQueryChange = (key: string, newQuery: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.key === key ? { ...tab, query: newQuery } : tab))
    );
  };

  const items = tabs.map((tab) => ({
    label: tab.label,
    key: tab.key,
    children: (
      <QueryEditor
        value={tab.query}
        onChange={(val) => handleQueryChange(tab.key, val)}
      />
    ),
  }));

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setTabs([
      ...tabs,
      { label: `Sorgu ${tabs.length + 1}`, key: newActiveKey, query: '' },
    ]);
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

export default Query_Tab;