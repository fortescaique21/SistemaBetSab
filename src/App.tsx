import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { IAAnalysis } from './pages/IAAnalysis';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';
import { SessionProvider } from './context/SessionContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import './App.css';

function App() {
  return (
    <SiteSettingsProvider>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="analise-ia" element={<IAAnalysis />} />
              <Route path="history" element={<History />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </SiteSettingsProvider>
  );
}

export default App;
