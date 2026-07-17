import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: 'panel-1',
    label: 'Şablonlar',
    children: 'Content of panel 1',
  },
  {
    key: 'panel-2',
    label: 'Geçmiş Sorgular',
    children: 'Content of panel 2',
  },
  
];

function Sidebar() {
  return (
    
    <aside className="sidebar">
      <h3>Query Runner</h3>
      <Tabs className="sidebar-tabs" tabPosition="top" defaultActiveKey="panel-1" items={items} />
    </aside>
  );
}

export default Sidebar;
