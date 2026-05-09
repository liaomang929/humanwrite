import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-xs mb-6" style={{ color: 'var(--color-blue)' }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 12 }} />返回首页
        </Link>

        <h1 className="text-xl font-semibold mb-6">隐私政策</h1>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>更新日期：2026 年 5 月</p>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>一、信息收集</h2>
            <p>在使用本平台服务过程中，我们可能会收集以下类型的信息：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>手机号码：</strong>当您开通会员时，需要提供手机号码用于身份验证和服务授权</li>
              <li><strong>支付信息：</strong>会员开通时的支付记录（本平台使用微信支付，不存储您的银行卡或支付密码信息）</li>
              <li><strong>浏览数据：</strong>页面访问记录、设备类型、浏览器版本等基本访问日志</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>二、信息使用</h2>
            <p>我们收集的信息仅用于以下目的：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>验证会员身份并开通相应服务权限</li>
              <li>优化平台功能和服务体验</li>
              <li>统计平台使用情况（匿名化处理）</li>
              <li>处理用户反馈和提供服务支持</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>三、信息存储与保护</h2>
            <p>我们采取合理的技术措施保护您的个人信息安全，包括但不限于数据加密传输、服务器访问控制等。您的个人信息存储在中国境内的服务器上，我们将持续维护这些安全措施。</p>
            <p className="mt-2">尽管有上述措施，互联网环境下的数据传输和存储无法保证绝对安全，我们将尽最大努力保护您的信息。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>四、信息共享</h2>
            <p>我们不会将您的个人信息出售或分享给第三方，以下情况除外：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>经您明确同意</li>
              <li>法律法规要求</li>
              <li>保护本平台合法权益</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>五、用户权利</h2>
            <p>根据《中华人民共和国个人信息保护法》，您享有以下权利：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>查询权：</strong>查询我们持有的您的个人信息</li>
              <li><strong>更正权：</strong>发现信息有误时要求更正</li>
              <li><strong>删除权：</strong>要求删除您的个人信息（我们将依法保留必要的备份数据除外）</li>
              <li><strong>撤回同意：</strong>撤回对信息收集和使用的同意</li>
            </ul>
            <p className="mt-2">如需行使上述权利，请通过下方联系方式与我们联系，我们将在 15 个工作日内回复。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>六、Cookie 及本地存储</h2>
            <p>本平台使用浏览器本地存储来记录您的登录状态和偏好设置。您可以随时在浏览器设置中清除这些数据。清除后不会影响您正常访问本平台。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>七、未成年人保护</h2>
            <p>本平台不面向未成年人提供服务。若您是未成年人，请在监护人指导下使用本平台。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>八、政策更新</h2>
            <p>我们可能会不时更新本隐私政策。重大变更时，我们将在平台上发布通知。继续使用本平台即表示您同意更新后的隐私政策。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>九、联系方式</h2>
            <p>如对隐私政策有任何疑问或需要行使个人信息相关权利，请联系：</p>
            <p className="mt-1">邮箱：lmloveac@163.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
