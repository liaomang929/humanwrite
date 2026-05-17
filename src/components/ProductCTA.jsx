import { useState } from 'react'

const CONTACT = {
  wechat: 'lmloveac',
  qq: '68419964',
}

export default function ProductCTA({ productName = '该功能', description, note = '' }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}
      >
        <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          立即体验
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
          {description || `${productName}尚未开放公开注册，联系我获取使用权限`}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium no-underline transition-transform hover:scale-105 border-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#080c16' }}
        >
          联系我
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-2xl w-full max-w-sm p-8 relative"
            style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border-0 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-tertiary)' }}
              onClick={() => setShowModal(false)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)' }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                联系我
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {productName}尚未开放注册。如需使用，请通过以下方式联系我开通权限：
              </p>
            </div>

            <div className="space-y-3">
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(80,200,120,0.12)', color: '#50c878' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.643 0 1.162.54 1.162 1.202 0 .662-.519 1.202-1.162 1.202-.642 0-1.162-.54-1.162-1.202 0-.662.52-1.202 1.162-1.202zm5.812 0c.643 0 1.162.54 1.162 1.202 0 .662-.519 1.202-1.162 1.202-.642 0-1.162-.54-1.162-1.202 0-.662.52-1.202 1.162-1.202zm5.436 1.9c-1.425.047-3.11.635-4.33 1.706-1.582 1.39-2.261 3.388-1.655 5.356.599 1.956 2.536 3.356 4.893 3.356.74 0 1.46-.122 2.135-.323a.656.656 0 01.539.074l1.393.84a.246.246 0 00.126.04c.121 0 .218-.098.218-.22 0-.054-.021-.107-.036-.16l-.291-1.108a.443.443 0 01.161-.5C23.15 17.636 24 16.046 24 14.235c0-3.215-3.221-5.882-6.967-6.344z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>微信</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{CONTACT.wechat}</div>
                </div>
              </div>

              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-9a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v1a.5.5 0 01-.5.5zm0-4h-9a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v1a.5.5 0 01-.5.5zm0-4h-9a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v1a.5.5 0 01-.5.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>QQ</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{CONTACT.qq}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 text-center" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                添加时请备注{note || `「${productName}」`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
