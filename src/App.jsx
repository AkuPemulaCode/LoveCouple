import { Routes, Route, Navigate } from 'react-router-dom';
import BrowsePage from './pages/BrowsePage';
import WatchPage from './pages/WatchPage';
import OfflinePage from './pages/OfflinePage';
import useOnlineStatus from './hooks/useOnlineStatus';

export default function App() {
  const online = useOnlineStatus();

  if (!online) {
    return <OfflinePage />;
  }

  return (
    <Routes>
      {/* Browse (landing page) */}
      <Route path="/" element={<BrowsePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/browse/:genre" element={<BrowsePage />} />

      {/* Search */}
      <Route path="/search" element={<BrowsePage />} />

      {/* Watch page */}
      <Route path="/watch/:id" element={<WatchPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}