import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import OpenAI from 'openai'

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE || 'https://api.deepseek.com',
})

const platformPrompts = {
  general: `你是"净言 AI Cleaner"——专业去除AI生成文本痕迹的助手。用户的输入是AI生成的文本，你需要将其改写成自然、地道的人类写作风格。

改写原则：
1. 打破AI式的"完美结构"——不要每段都有主题句+展开+总结
2. 加入自然的语气词和口语化表达（但不过度）
3. 句式长短交错，避免整齐划一的排比
4. 减少"首先/其次/最后""一方面/另一方面"等过渡词
5. 使用更具体的例子替代泛泛而谈
6. 可以适当保留一些不完美的表达，显得更真实
7. 不要加"作为一名AI""作为语言模型"之类的表述
8. 保持原意不变，只改变表达方式

直接输出改写后的文本，不要任何前缀说明。`,

  academic: `你是"净言 AI Cleaner"学术降重助手——专门帮助学术文本降低AI检测率的工具。用户的输入是AI生成的学术文本，你需要将其改写为更自然的人类学术写作风格。

改写原则：
1. 保持学术严谨性和专业性，但打破AI式的刻板结构
2. 使用更多样的句式和学术表达方式
3. 避免"首先/其次/最后""综上所述"等八股结构
4. 将长句合理拆分为短句，或将短句合并为长句，避免AI式的均匀句式
5. 使用同义替换，特别是高频出现的术语和动词
6. 保持学术语气的正式性，但增加一些人类学者的真实表达习惯
7. 保留所有学术数据和引用，只改变表述方式
8. 可以在论述中加入适度的限定词（"可能""往往""倾向于"等）

直接输出改写后的文本，不要任何前缀说明。`,

  business: `你是"净言 AI Cleaner"商务润色助手——专门为商务场景优化AI生成的文本。用户的输入是AI生成的商务文本（邮件、报告、方案等），你需要将其改写为专业但不生硬的人类商务写作风格。

改写原则：
1. 保持专业性和商务礼仪，但去除AI式的模板感
2. 将AI的长篇大论浓缩为更直接有效的表达
3. 避免"首先允许我介绍一下""我想强调的是"等AI常用套话
4. 句式更简洁有力，更像经验丰富的商务人士的实际表达
5. 可以使用行业术语，但要自然融入上下文
6. 适当增加具体细节和数字，减少笼统表述
7. 保持积极专业的语调，但不过度使用"卓越""领先""创新"等空洞词汇

直接输出改写后的文本，不要任何前缀说明。`,

  social: `你是"净言 AI Cleaner"社交媒体口语化助手——专门为社交媒体/自媒体场景优化AI生成的文本。用户的输入是AI生成的社交媒体内容，你需要将其改写为更自然、更像真人博主的口吻。

改写原则：
1. 把AI式的书面表达改成口语化、亲切的交流方式
2. 可以加入适当的语气词（啦、哦、嘛、呢、哈）
3. 使用短句、问句、感叹句，增加节奏感
4. 可以适当使用网络用语（但不要过度，保持自然）
5. 加入个人化的表达——像是朋友在分享而不是官方账号在发布
6. 打破AI式的"第一步/第二步/第三步"结构
7. 可以使用括号补充说明、波浪线等增加亲切感
8. 结尾可以更加随性，不一定要总结升华

直接输出改写后的文本，不要任何前缀说明。`,
}

function preprocessText(text) {
  return text
    // remove markdown headings
    .replace(/^#{1,6}\s+/gm, '')
    // remove bold/italic markers but keep content
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // remove links but keep text
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    // remove blockquotes markers
    .replace(/^>\s+/gm, '')
    // normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

app.post('/api/clean', async (req, res) => {
  const { text, platform = 'general' } = req.body

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: '请提供需要处理的文本' })
  }

  const cleaned = preprocessText(text)
  const prompt = platformPrompts[platform] || platformPrompts.general
  const chars = text.length
  const cleanChars = cleaned.length

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: cleaned },
      ],
      temperature: parseFloat(process.env.TEMPERATURE) || 0.8,
      max_tokens: parseInt(process.env.MAX_TOKENS) || 4096,
    })

    const result = completion.choices[0]?.message?.content?.trim() || ''

    res.json({
      original: text,
      cleaned: result,
      stats: {
        origChars: chars,
        cleanChars: cleanChars,
        resultChars: result.length,
        reduction: Math.round((1 - result.length / chars) * 100),
      },
      model: completion.model,
    })
  } catch (err) {
    console.error('AI API error:', err)
    res.status(500).json({ error: 'AI 处理失败，请稍后重试', detail: err.message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`AI Cleaner server running on port ${PORT}`)
})
