import { Routes, Route, Navigate } from 'react-router-dom'
import { usePageAnalytics } from './hooks/usePageAnalytics'
import PortalNav from './components/PortalNav'
import PortalPage from './pages/PortalPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import StatsPage from './pages/StatsPage'

function AppRoutes() {
  usePageAnalytics()
  return (
    <>
      <PortalNav />
      <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/lab" element={<Navigate to="/" replace />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return <AppRoutes />
}
