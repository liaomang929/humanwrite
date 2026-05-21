import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SKIP_PATHS = ['/stats']

function trackPageView(path) {
  if (SKIP_PATHS.includes(path)) return
  const payload = JSON.stringify({ path })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/view', new Blob([payload], { type: 'application/json' }))
    return
  }
  fetch('/api/analytics/view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}

export function usePageAnalytics() {
  const { pathname } = useLocation()
  const lastPath = useRef('')

  useEffect(() => {
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    trackPageView(pathname)
  }, [pathname])
}
