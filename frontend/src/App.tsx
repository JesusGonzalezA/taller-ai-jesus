import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CampaignProvider } from './context/CampaignContext';
import { CompanyProvider } from './context/CompanyContext';
import CampaignDetail from './pages/CampaignDetail';
import CampaignList from './pages/CampaignList';
import CampaignNew from './pages/CampaignNew';
import CompanySettings from './pages/CompanySettings';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <CompanyProvider>
        <CampaignProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/company" element={<CompanySettings />} />
              <Route path="/campaigns" element={<CampaignList />} />
              <Route path="/campaigns/new" element={<CampaignNew />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
            </Route>
          </Routes>
        </CampaignProvider>
      </CompanyProvider>
    </BrowserRouter>
  );
}
