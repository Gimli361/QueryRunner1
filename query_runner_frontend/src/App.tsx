import { useState } from 'react';
import './styles/main.scss';
import Sidebar from './components/Sidebar';
import Db_dropdown from './components/Db_dropdown';
import Query_tab from './components/Query_tab';
import { App as AntdApp } from 'antd';

function App() {
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const handleSelectQuery = (query: string) => {
    setSelectedQuery(query);
  };

  return (
    <AntdApp>
      <div className="app-shell">
        <Sidebar onSelectQuery={handleSelectQuery} />
        <main className="main-content">
          <section className="navbar">
            <div className="Db_selector">
              <h6>Veritabanı : </h6><Db_dropdown />
            </div>
            <div className='UserInfo'>
              <h5>Kullanıcı : </h5><span>User 1</span>
            </div>
          </section>
          <section className="query-tab">
            <div className="query-tab-container">
              <Query_tab selectedQuery={selectedQuery} />
            </div>
          </section>
        </main>
      </div>
    </AntdApp>
  );
}

export default App;

