import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import AppRouter from './Routes/AppRouter';
import SideBar from './Components/Sidebar';

function App() {
  return (
    <UserContextProvider>
      <div className="App">
        <SideBar />
        <div className="content">
          <AppRouter />
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;
