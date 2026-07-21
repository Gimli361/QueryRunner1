import { useMemo, useState } from 'react';
import './styles/main.scss';
import Sidebar from './components/Sidebar';
import Db_Dropdown from './components/Db_Dropdown';
import Query_tab from './components/Query_Tab';
import { App as AntdApp } from 'antd';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ClientSideRowModelModule, ModuleRegistry, } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
function App() {
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const handleSelectQuery = (query: string) => {
    setSelectedQuery(query);
  };
  const [rowData] = useState([
    { markasi: "Tesla", model: "Model 3", fiyat: 45000, elektrikli: true },
    { markasi: "Ford", model: "F-Series", fiyat: 38000, elektrikli: false },
    { markasi: "Toyota", model: "Corolla", fiyat: 28000, elektrikli: true },
    { markasi: "Chevrolet", model: "Silverado", fiyat: 40000, elektrikli: false },
    { markasi: "Nissan", model: "Leaf", fiyat: 32000, elektrikli: true },
    { markasi: "Honda", model: "Civic", fiyat: 25000, elektrikli: false },
    { markasi: "BMW", model: "i3", fiyat: 42000, elektrikli: true },
  ]);
  const defaultColDef = useMemo(() => ({
    flex: 1, // Sütunları eşit miktarda genişleterek ekranı kaplatır
    minWidth: 100,
    filter: true,
    sortable: true,
    floatingFilter: true,
  }), []);

  // 2. Sütun Tanımları (Column Definitions)
  const [columnDefs] = useState([
  { field: "markasi" as const, headerName: "Marka" },
  { field: "model" as const, headerName: "Model" },
  { field: "fiyat" as const, headerName: "Fiyat ($)" },
  { field: "elektrikli" as const, headerName: "Elektrikli mi?" }
]);
  

  return (
    <AntdApp>
      <div className="app-shell">
        <Sidebar onSelectQuery={handleSelectQuery} />
        <main className="main-content">
          <section className="navbar">
            <div className="Db_selector">
              <h6>Veritabanı : </h6><Db_Dropdown />

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
          <div className="ag-theme-Material" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>

        </main>
      </div>
    </AntdApp>
  );
}

export default App;
