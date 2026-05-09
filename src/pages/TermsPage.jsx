import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-xs mb-6" style={{ color: 'var(--color-blue)' }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 12 }} />返回首页
        </Link>

        <h1 className="text-xl font-semibold mb-6">用户协议</h1>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>更新日期：2026 年 5 月</p>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>一、协议说明</h2>
            <p>欢迎使用逻辑透镜（以下简称"本平台"）。本平台由 Blake Pierce（个人运营）提供。使用本平台服务前，请仔细阅读本协议。访问或使用本平台即视为您已阅读、理解并同意受本协议约束。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>二、服务内容</h2>
            <p>本平台基于历史赛事数据和机器学习模型，为用户提供足球赛事胜平负概率预测结果，仅供学习参考。本平台提供的所有内容均不构成任何形式的投注建议、投资建议或决策依据。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>三、免责声明</h2>
            <p><strong>重要：本平台的预测结果基于历史数据和统计模型生成，不保证准确性、完整性和时效性。足球比赛结果受诸多不可预测因素影响，任何预测结果均存在偏差的可能。</strong></p>
            <p className="mt-2">您理解并同意：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>本平台的预测结果仅供参考和学习交流之用，不构成任何投注建议</li>
              <li>本平台不对您基于预测结果做出的任何行为承担责任</li>
              <li>您应自行承担使用本平台服务的所有风险</li>
              <li>本平台不保证预测结果能够满足您的特定需求或期望</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>四、付费会员服务</h2>
            <p>本平台提供付费会员服务，会员可解锁更多预测数据。会员费用为每月 19 元人民币，订阅后即可使用，不设自动续费。</p>
            <p className="mt-2">付费会员服务仅限个人使用，不得转让、共享或用于商业用途。如会员服务存在质量问题，请联系运营者协商处理。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>五、用户行为规范</h2>
            <p>您承诺不会将本平台的任何内容用于以下用途：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>参与或组织任何形式的非法博彩活动</li>
              <li>向他人传播不实信息或误导性预测结果</li>
              <li>对平台进行逆向工程、爬取或恶意攻击</li>
              <li>其他违反中华人民共和国法律法规的行为</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>六、知识产权</h2>
            <p>本平台的所有内容，包括但不限于文字、数据、图表、模型、界面设计等，均归运营者所有，受著作权法等相关法律保护。未经书面许可，不得复制、转载、修改或用于商业用途。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>七、协议修改</h2>
            <p>本平台保留随时修改本协议的权利。修改后的协议将在本页面公布，继续使用本平台即视为接受修改后的协议。建议您定期查阅本协议。</p>
          </section>

          <section>
            <h2 className="font-medium text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>八、联系方式</h2>
            <p>如对本协议有任何疑问，请联系：lmloveac@163.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
