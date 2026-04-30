export const leagues = [
  { name: '英超', rank: 1 }, { name: '西甲', rank: 2 }, { name: '意甲', rank: 3 },
  { name: '德甲', rank: 4 }, { name: '法甲', rank: 5 }, { name: '欧冠', rank: 6 },
  { name: '中超', rank: 10 },
]

export const matches = [
  {
    matchId: 'M001', league: '英超', matchTime: '2026-04-30 22:00',
    homeTeam: '曼彻斯特城', awayTeam: '阿森纳',
    oddsWin: '1.85', oddsDraw: '3.60', oddsLoss: '4.20',
    handicapLine: '半球', handicapWin: '2.02', handicapDraw: '3.40', handicapLoss: '3.55',
  },
  {
    matchId: 'M002', league: '西甲', matchTime: '2026-04-30 22:00',
    homeTeam: '巴塞罗那', awayTeam: '皇家马德里',
    oddsWin: '2.45', oddsDraw: '3.30', oddsLoss: '2.90',
    handicapLine: '平手', handicapWin: '1.92', handicapDraw: '3.35', handicapLoss: '3.60',
  },
  {
    matchId: 'M003', league: '意甲', matchTime: '2026-05-01 02:45',
    homeTeam: '国际米兰', awayTeam: 'AC米兰',
    oddsWin: '2.10', oddsDraw: '3.40', oddsLoss: '3.50',
    handicapLine: '平手/半球', handicapWin: '2.06', handicapDraw: '3.40', handicapLoss: '3.35',
  },
  {
    matchId: 'M004', league: '德甲', matchTime: '2026-04-30 21:30',
    homeTeam: '拜仁慕尼黑', awayTeam: '多特蒙德',
    oddsWin: '1.55', oddsDraw: '4.20', oddsLoss: '5.50',
    handicapLine: '一球', handicapWin: '1.98', handicapDraw: '3.55', handicapLoss: '3.40',
  },
  {
    matchId: 'M005', league: '法甲', matchTime: '2026-05-01 03:00',
    homeTeam: '巴黎圣日耳曼', awayTeam: '马赛',
    oddsWin: '1.40', oddsDraw: '4.80', oddsLoss: '6.50',
    handicapLine: '一球/球半', handicapWin: '2.08', handicapDraw: '3.60', handicapLoss: '3.20',
  },
  {
    matchId: 'M006', league: '欧冠', matchTime: '2026-05-02 03:00',
    homeTeam: '利物浦', awayTeam: '拜仁慕尼黑',
    oddsWin: '2.30', oddsDraw: '3.50', oddsLoss: '3.10',
    handicapLine: '平手/半球', handicapWin: '2.04', handicapDraw: '3.40', handicapLoss: '3.40',
  },
  {
    matchId: 'M007', league: '英超', matchTime: '2026-05-01 19:30',
    homeTeam: '切尔西', awayTeam: '托特纳姆热刺',
    oddsWin: '2.20', oddsDraw: '3.30', oddsLoss: '3.40',
    handicapLine: '平手/半球', handicapWin: '2.10', handicapDraw: '3.45', handicapLoss: '3.30',
  },
  {
    matchId: 'M008', league: '西甲', matchTime: '2026-05-01 22:00',
    homeTeam: '马德里竞技', awayTeam: '皇家社会',
    oddsWin: '1.90', oddsDraw: '3.40', oddsLoss: '4.30',
    handicapLine: '半球', handicapWin: '1.96', handicapDraw: '3.40', handicapLoss: '3.70',
  },
  {
    matchId: 'M009', league: '中超', matchTime: '2026-05-01 19:35',
    homeTeam: '上海海港', awayTeam: '山东泰山',
    oddsWin: '1.72', oddsDraw: '3.70', oddsLoss: '4.50',
    handicapLine: '半球/一球', handicapWin: '1.92', handicapDraw: '3.50', handicapLoss: '3.75',
  },
  {
    matchId: 'M010', league: '英超', matchTime: '2026-05-01 22:00',
    homeTeam: '曼联', awayTeam: '阿斯顿维拉',
    oddsWin: '1.75', oddsDraw: '3.80', oddsLoss: '4.40',
    handicapLine: '半球/一球', handicapWin: '1.94', handicapDraw: '3.55', handicapLoss: '3.60',
  },
]

export const selectedMatches = [
  {
    matchId: 'M001', league: '英超', matchTime: '2026-04-30 22:00',
    homeTeam: '曼彻斯特城', awayTeam: '阿森纳',
    oddsWin: '1.85', oddsDraw: '3.60', oddsLoss: '4.20',
    handicapLine: '半球', handicapWin: '2.02', handicapDraw: '3.40', handicapLoss: '3.55',
    prediction: ['胜'], confidence: 4, analysisNote: '曼城主场强势，阿森纳客场不稳，盘口半球合理，看好正路打出。', isHot: true,
  },
  {
    matchId: 'M002', league: '西甲', matchTime: '2026-04-30 22:00',
    homeTeam: '巴塞罗那', awayTeam: '皇家马德里',
    oddsWin: '2.45', oddsDraw: '3.30', oddsLoss: '2.90',
    handicapLine: '平手', handicapWin: '1.92', handicapDraw: '3.35', handicapLoss: '3.60',
    prediction: ['胜', '平'], confidence: 3, analysisNote: '国家德比，巴萨主场不败，皇马客场稳健，双选防平。', isHot: true,
  },
  {
    matchId: 'M004', league: '德甲', matchTime: '2026-04-30 21:30',
    homeTeam: '拜仁慕尼黑', awayTeam: '多特蒙德',
    oddsWin: '1.55', oddsDraw: '4.20', oddsLoss: '5.50',
    handicapLine: '一球', handicapWin: '1.98', handicapDraw: '3.55', handicapLoss: '3.40',
    prediction: ['胜'], confidence: 5, analysisNote: '拜仁主场一球低水，多特防线不稳，基本面和盘口一致。', isHot: false,
  },
  {
    matchId: 'M007', league: '英超', matchTime: '2026-05-01 19:30',
    homeTeam: '切尔西', awayTeam: '托特纳姆热刺',
    oddsWin: '2.20', oddsDraw: '3.30', oddsLoss: '3.40',
    handicapLine: '平手/半球', handicapWin: '2.10', handicapDraw: '3.45', handicapLoss: '3.30',
    prediction: ['让负'], confidence: 3, analysisNote: '', isHot: false,
  },
  {
    matchId: 'M010', league: '英超', matchTime: '2026-05-01 22:00',
    homeTeam: '曼联', awayTeam: '阿斯顿维拉',
    oddsWin: '1.75', oddsDraw: '3.80', oddsLoss: '4.40',
    handicapLine: '半球/一球', handicapWin: '1.94', handicapDraw: '3.55', handicapLoss: '3.60',
    prediction: ['胜', '让平'], confidence: 4, analysisNote: '曼联近期状态回升，维拉客场有抵抗力，看好小胜。', isHot: true,
  },
]

export const analyses = [
  {
    matchId: 'M001',
    content: `【基本面分析】
曼彻斯特城 vs 阿森纳
联赛：英超 | 时间：2026-04-30 22:00

主队近况：曼城近10场联赛8胜2平，主场5连胜，场均进球2.4，场均失球0.8。德布劳内状态火热，哈兰德连续4场破门。

客队近况：阿森纳近10场6胜3平1负，客场3胜2平，萨卡伤疑，厄德高组织核心。

【盘口解析】
初盘开出主让半球中水，后势水位略有下调，机构对曼城信心增强。欧赔方面，主胜集中在1.85-1.90区间，平赔高企至3.60以上，负赔离散度较大。

【数据模型】
预计进球数：2-3球
控球率：曼城58% - 42%阿森纳
射门比：14:8

【推荐结论】
曼城主场统治力强，阿森纳客场硬仗能力存疑。半球盘合理反映双方实力差距，看好主队取胜。推荐：主胜（胜）`,
  },
  {
    matchId: 'M002',
    content: `【基本面分析】
巴塞罗那 vs 皇家马德里
联赛：西甲 | 时间：2026-04-30 22:00
赛事：国家德比

主队近况：巴萨近10场7胜2平1负，主场4连胜，莱万状态回升，佩德里中场串联能力强。

客队近况：皇马近10场8胜1平1负，客场4胜1平，贝林厄姆本赛季客场进球效率高。

【盘口解析】
平手盘开出，两队水位接近。国家德比历来平手盘居多，欧赔2.45-3.30-2.90的格局对巴萨略有利好，但平赔拉低至3.30防范意图明显。

【数据模型】
预计进球数：2-3球
控球率：巴萨55% - 45%皇马
射门比：12:11

【推荐结论】
国家德比胜负难料，巴萨主场占优但皇马反击犀利。平手盘下看好主队不败。推荐：双选胜·平（主队不败）`,
  },
  {
    matchId: 'M004',
    content: `【基本面分析】
拜仁慕尼黑 vs 多特蒙德
联赛：德甲 | 时间：2026-04-30 21:30

主队近况：拜仁近10场9胜1平，主场全胜，场均进球3.1，凯恩34球领跑射手榜。

客队近况：多特近10场5胜2平3负，客场2胜2平1负，防线场均失1.8球。

【盘口解析】
一球中低水，欧赔1.55-4.20-5.50，主胜集中。拜仁实力碾压，一球盘口深开但水位偏低，机构赔付控制严格。

【数据模型】
预计进球数：3-4球
控球率：拜仁62% - 38%多特
射门比：18:6

【推荐结论】
拜仁主场实力碾压，多特防线难以抵挡。一球盘深开低水，正路概率极高。推荐：主胜（胜）`,
  },
]
