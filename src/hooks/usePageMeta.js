import { useEffect } from 'react'

const defaults = {
  title: 'Blake Pierce — 足球数据分析师 / 独立开发者',
  description: 'Blake Pierce 的个人主页。足球比赛数据分析、AI 工具开发。用数据看懂比赛，用技术创造工具。',
  keywords: 'Blake Pierce,廖莽,足球分析,足球预测,逻辑透镜,LogicLens,五大联赛预测,体育数据,AI工具,独立开发者',
}

export function usePageMeta(meta) {
  useEffect(() => {
    const t = meta.title || defaults.title
    const d = meta.description || defaults.description
    const k = meta.keywords || defaults.keywords

    document.title = t

    setMeta('description', d)
    setMeta('keywords', k)

    return () => {
      document.title = defaults.title
      setMeta('description', defaults.description)
      setMeta('keywords', defaults.keywords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
