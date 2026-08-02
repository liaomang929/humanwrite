import { Routes, Route } from 'react-router-dom'
import { usePageAnalytics } from './hooks/usePageAnalytics'
import PortalPage from './pages/PortalPage'
import LogicLensLab from './pages/LogicLensLab'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import StatsPage from './pages/StatsPage'

function AppRoutes() {
  usePageAnalytics()
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/lab" element={<LogicLensLab />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
