import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { IAAnalysis } from './pages/IAAnalysis';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { SessionProvider } from './context/SessionContext';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analise-ia" element={<IAAnalysis />} />
            <Route path="history" element={<History />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
