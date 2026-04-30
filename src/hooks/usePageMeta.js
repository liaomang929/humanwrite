import { useEffect } from 'react'

const defaults = {
  title: 'HumanWrite — 产品矩阵',
  description: 'HumanWrite 产品矩阵：球之见（体育分析管理工具）与典萃 ClassiCore（AI 深度阅读伴侣）。逻辑驱动 · 技术赋能 · 工业级稳固。',
  keywords: 'HumanWrite,球之见,典萃,ClassiCore,体育分析,AI阅读,知识胶囊,自媒体创作',
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
