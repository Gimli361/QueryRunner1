import './styles/app-shell.scss';
import Sidebar from './components/Sidebar';
import Db_dropdown from './components/Db_dropdown';
import Query_tab from './components/Query_tab';
function App() {
  return (
    <div className="app-shell">
       <Sidebar />
      <main className="main-content">
        <section className= "navbar">
          <div className="Db_selector">
             <h6>Veritabanı : </h6><Db_dropdown />
          </div>
          <div className='UserInfo'>
            <h5>Kullanıcı : </h5><span>User 1</span>
          </div>
          
        </section>
        <section className="query-tab">
       <div className="query-tab-container">
          <Query_tab />
          
        </div>
        </section>
       

      </main>
    </div>
  );
}

export default App;
