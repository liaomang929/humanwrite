import { Link } from 'react-router-dom'

function LegalNav() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(10,10,15,.85)', borderBottom: '1px solid rgba(255,255,255,.07)',
    }}>
      <div style={{ maxWidth: 768, margin: '0 auto', padding: '0 1.25rem', height: 56, display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none',
          fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#f0eeff',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c6ef0' }} />
          Blake Pierce
        </Link>
      </div>
    </header>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-secondary)' }}>
      <LegalNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        <h1 className="text-xl font-semibold mb-6">用户协议</h1>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>更新日期：2026 年 5 月</p>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>一、协议说明</h2>
            <p>欢迎使用逻辑透镜（以下简称"本平台"）。本平台由 廖莽（个人运营）提供，是个人数据研究与学习交流项目。使用本平台服务前，请仔细阅读本协议。访问或使用本平台即视为您已阅读、理解并同意受本协议约束。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>二、服务内容</h2>
            <p>本平台是个人兴趣驱动的数据研究项目，通过对公开赛事历史数据进行统计分析与机器学习建模，展示数据训练与分析结果。平台所呈现的所有内容均为个人学习与研究目的，仅供数据爱好者交流参考。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>三、免责声明</h2>
            <p><strong>本平台展示的数据分析结果基于历史数据与统计模型生成，不保证准确性、完整性和时效性。数据模型存在固有偏差，分析结果仅供参考。</strong></p>
            <p className="mt-2">您理解并同意：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>本平台所有内容均为个人学习研究与技术交流目的，不构成任何形式的建议或决策依据</li>
              <li>本平台不对您基于平台内容做出的任何行为承担责任</li>
              <li>您应自行承担使用本平台服务的所有风险</li>
              <li>本平台不保证数据分析结果能够满足您的特定需求或期望</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>四、用户行为规范</h2>
            <p>您承诺不会将本平台的任何内容用于以下用途：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>对平台进行逆向工程、爬取或恶意攻击</li>
              <li>将平台内容用于任何违反中华人民共和国法律法规的行为</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>五、知识产权</h2>
            <p>本平台的所有内容，包括但不限于文字、数据、图表、模型、界面设计等，均归运营者所有，受著作权法等相关法律保护。未经书面许可，不得复制、转载、修改或用于商业用途。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>六、协议修改</h2>
            <p>本平台保留随时修改本协议的权利。修改后的协议将在本页面公布，继续使用本平台即视为接受修改后的协议。建议您定期查阅本协议。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>七、联系方式</h2>
            <p>如对本协议有任何疑问，请联系：lmloveac@163.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
