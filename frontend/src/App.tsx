import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import MatchDetailPage from './pages/MatchDetailPage';
import MatchesPage from './pages/MatchesPage';
import NewMatchPage from './pages/NewMatchPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import PlayersPage from './pages/PlayersPage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import './styles/global.css';

function PenaLayout({ penaName }: { penaName?: string }) {
  return (
    <>
      <Navbar penaName={penaName} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />

        {/* Peña routes */}
        <Route
          path="/pena/:id"
          element={
            <>
              <PenaLayout />
              <DashboardPage />
            </>
          }
        />
        <Route
          path="/pena/:id/settings"
          element={
            <>
              <PenaLayout />
              <SettingsPage />
            </>
          }
        />
        <Route
          path="/pena/:id/players"
          element={
            <>
              <PenaLayout />
              <PlayersPage />
            </>
          }
        />
        <Route
          path="/pena/:id/matches"
          element={
            <>
              <PenaLayout />
              <MatchesPage />
            </>
          }
        />
        <Route
          path="/pena/:id/match/new"
          element={
            <>
              <PenaLayout />
              <NewMatchPage />
            </>
          }
        />
        <Route
          path="/pena/:id/match/:matchId"
          element={
            <>
              <PenaLayout />
              <MatchDetailPage />
            </>
          }
        />
        <Route
          path="/pena/:id/stats"
          element={
            <>
              <PenaLayout />
              <StatsPage />
            </>
          }
        />
        <Route
          path="/pena/:id/stats/:playerId"
          element={
            <>
              <PenaLayout />
              <PlayerStatsPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
