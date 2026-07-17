import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';
import ButtonComponent from './ButtonComponent';
import TemplateModal from './TemplateModal';



function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items: TabsProps['items'] = [
  {
    key: 'panel-1',
    label: 'Şablonlar',
    children: <div>
        <div style={{ marginBottom: 16 }}>
          <ButtonComponent className="btn-template" text="Şablon Ekle" onClick={() => setIsModalOpen(true)} />
        </div>
        
      </div>,
  },
  {
    key: 'panel-2',
    label: 'Geçmiş Sorgular',
    children: 'Content of panel 2',
  },
  
];
  return (
    
    <aside className="sidebar">
      <h3>Query Runner</h3>
      <Tabs className="sidebar-tabs" tabPosition="top" defaultActiveKey="panel-1" items={items} />
      <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}

export default Sidebar;
