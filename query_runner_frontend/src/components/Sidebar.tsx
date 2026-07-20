import { Tabs, App } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';
import TemplateModal from './TemplateModal';
import TemplateCard from './TemplateCard';
import type { Template } from './TemplateCard';
import './Sidebar.scss';

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'Tüm Aktif Kullanıcılar',
    description: 'Son 30 gün içerisinde giriş yapmış, e-posta onaylı tüm kullanıcıların listesi.',
    visibility: 'personal',
    query: 'SELECT id, username, email, created_at FROM users WHERE is_active = true AND last_login >= NOW() - INTERVAL \'30 days\';',
  },
  {
    id: '2',
    name: 'Haftalık Satış Analizi',
    description: 'Kategori bazında haftalık sipariş adedi, toplam ciro ve ortalama sepet tutarı.',
    visibility: 'team',
    query: `SELECT 
  c.category_name,
  COUNT(o.id) AS total_orders,
  SUM(o.total_amount) AS total_revenue,
  AVG(o.total_amount) AS avg_order_value
FROM orders o
JOIN categories c ON o.category_id = c.id
WHERE o.created_at >= NOW() - INTERVAL '7 days'
GROUP BY c.category_name
ORDER BY total_revenue DESC;`,
  },
  {
    id: '3',
    name: 'Sistem Performans Raporu',
    description: 'Sunucu yanıt süreleri, CPU kullanımı ve veri tabanı gecikme raporları.',
    visibility: 'personal',
    query: 'SELECT server_id, avg_response_time, cpu_usage, latency, checked_at FROM system_metrics ORDER BY checked_at DESC LIMIT 50;',
  },
];

interface SidebarProps {
  onSelectQuery?: (query: string) => void;
}

function Sidebar({ onSelectQuery }: SidebarProps) {
  const { message, modal } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);

  const handleSaveTemplate = (template: Template) => {
    setTemplates((prev) => [template, ...prev]);
    setIsModalOpen(false);
    message.success(`"${template.name}" başarıyla şablon olarak kaydedildi.`);
  };

  const handleDeleteTemplate = (id: string) => {
    const templateToDelete = templates.find((t) => t.id === id);
    if (!templateToDelete) return;

    modal.confirm({
      title: 'Şablonu Sil',
      content: `"${templateToDelete.name}" şablonunu silmek istediğinize emin misiniz?`,
      okText: 'Evet, Sil',
      okType: 'danger',
      cancelText: 'Vazgeç',
      onOk() {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        message.info(`"${templateToDelete.name}" şablonu silindi.`);
      },
    });
  };

  const handleSelectTemplate = (template: Template) => {
    if (template.query && onSelectQuery) {
      onSelectQuery(template.query);
    }
    message.success(`"${template.name}" şablonu sorgu alanına yüklendi!`);
  };

  const items: TabsProps['items'] = [
    {
      key: 'panel-1',
      label: 'Şablonlar',
      children: (
        <div className="template-list-container">
          <TemplateCard onClick={() => setIsModalOpen(true)} />
          <div className="template-list">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleSelectTemplate(template)}
                onDelete={handleDeleteTemplate}
              />
            ))}
            {templates.length === 0 && (
              <div className="template-list-empty">
                Henüz kayıtlı şablonunuz yok. Yeni bir tane eklemek için yukarıdaki butona tıklayın!
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'panel-2',
      label: 'Geçmiş Sorgular',
      children: (
        <div className="history-empty">
          Son çalıştırılan sorgularınız burada listelenir.
        </div>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Query Runner</h3>
      </div>
      <Tabs className="sidebar-tabs" tabPosition="top" defaultActiveKey="panel-1" items={items} />
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </aside>
  );
}

export default Sidebar;


