import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowUp, ArrowUpRight, BookOpen, Check, ChevronDown,
  Copy, Menu, Search, X
} from 'lucide-react'

const chapters = [
  { id: 'overview', no: '00', label: '行业坐标' },
  { id: 'map', no: '01', label: '应用全景' },
  { id: 'stack', no: '02', label: '技术底座' },
  { id: 'npc', no: '03', label: 'AI角色系统' },
  { id: 'workflow', no: '04', label: '策划工作流' },
  { id: 'metrics', no: '05', label: '评估与成本' },
  { id: 'governance', no: '06', label: '边界与合规' },
  { id: 'future', no: '07', label: '未来能力' },
  { id: 'roadmap', no: '08', label: '90天路线' },
  { id: 'sources', no: '09', label: '来源索引' },
]

type Domain = {
  title: string
  en: string
  category: '生产提效' | '运行时玩法' | '经营增长'
  summary: string
  uses: string[]
  designer: string
  watch: string
  maturity: string
}

const domains: Domain[] = [
  {
    title: '创意与预研', en: 'DISCOVERY', category: '生产提效', maturity: '高频使用',
    summary: '把资料搜集、竞品拆解、脑暴和方案变体变成可追踪的假设列表。',
    uses: ['竞品机制对照与资料摘要', '核心循环、题材与规则变体', '用户故事、风险清单、评审问题'],
    designer: '提供评价标准与反例，不让模型替团队决定“什么好玩”。',
    watch: '看似合理的资料幻觉、同质化创意、把网络多数意见当玩家结论。'
  },
  {
    title: '叙事与文本', en: 'NARRATIVE', category: '生产提效', maturity: '需强审核',
    summary: '从单次写台词，升级为世界观知识库、角色圣经、风格约束与版本管理。',
    uses: ['支线与 bark 草稿、多语言本地化', '剧情一致性检查、分支覆盖率检查', '角色口吻样本与禁用表达约束'],
    designer: '锁定叙事事实、角色动机和不可变情节；作者负责最终文本。',
    watch: '角色失声、设定漂移、版权与配音授权、无限文本稀释叙事节奏。'
  },
  {
    title: '美术、3D与音频', en: 'ASSET PIPELINE', category: '生产提效', maturity: '管线分化',
    summary: '概念探索最快，量产资产仍需风格、拓扑、骨骼、性能和授权检查。',
    uses: ['概念图与贴图变体、3D粗模', '动作捕捉清理、口型与表情', '临时配音、音效草稿、营销素材'],
    designer: '把需求写成可验收的资产规格，而不只写“感觉要更酷”。',
    watch: '风格不一致、不可编辑资产、性能超标、训练数据与声音肖像授权。'
  },
  {
    title: '原型与工程协作', en: 'PROTOTYPING', category: '生产提效', maturity: '高价值',
    summary: '策划能更快做出灰盒与交互样例，但“能运行”不等于“可维护”。',
    uses: ['编辑器脚本、数值表校验、调试面板', '灰盒关卡与玩法假原型', '代码解释、单测草稿、bug复现步骤'],
    designer: '学会读逻辑、跑构建、写验收用例；核心架构仍由工程负责。',
    watch: '隐性依赖、安全漏洞、错误状态同步、技术债被原型速度掩盖。'
  },
  {
    title: '测试与平衡', en: 'QA & BALANCE', category: '生产提效', maturity: '值得投入',
    summary: '用代理与仿真扩大探索覆盖，用模型辅助聚类问题，而不是替代真人体验。',
    uses: ['自动跑图、异常路径与 soak test', '阵容、经济和难度参数扫描', '日志聚类、重复缺陷归并'],
    designer: '定义状态空间、奖励约束、有效对局与“真人是否觉得公平”的验证。',
    watch: '代理目标与玩家目标不同、仿真偏差、最优解破坏多样性。'
  },
  {
    title: '对话NPC与队友', en: 'CHARACTER RUNTIME', category: '运行时玩法', maturity: '早期商用',
    summary: '从“能聊天”走向能感知局势、遵守规则、调用动作并承担玩法后果。',
    uses: ['任务向导、侦探问询、角色陪伴', '语音指挥队友、战术协同', '有记忆的关系与阵营互动'],
    designer: '设计人格、知识、记忆、权限、失败反馈与可跳过的确定性路径。',
    watch: '延迟、出戏、剧透、玩家诱导、不可复现bug、每次交互成本。'
  },
  {
    title: '动态内容与难度', en: 'ADAPTIVE GAME', category: '运行时玩法', maturity: '谨慎试验',
    summary: '依据状态调整提示、遭遇和节奏，优先做可解释的局部适配。',
    uses: ['新手提示与情境教学', '导演式遭遇编排、动态难度', '个性化任务候选与内容排序'],
    designer: '明确适配目标、可调参数、公平边界和玩家可理解性。',
    watch: '暗中放水被感知、强者被惩罚、竞技公平、优化指标伤害乐趣。'
  },
  {
    title: 'UGC与共创', en: 'CO-CREATION', category: '运行时玩法', maturity: '平台加速',
    summary: '自然语言降低创作门槛，真正壁垒转向模板、可组合规则、供给质量与分发。',
    uses: ['文本生成物件、关卡草稿与脚本', '创作助手、自动补全与错误诊断', 'AI素材审核、标签与推荐冷启动'],
    designer: '设计“可控的创作空间”：原件、约束、撤销、归属、激励和安全。',
    watch: '内容洪水、低质复制、侵权、未成年人安全、创作者价值被稀释。'
  },
  {
    title: '运营、推荐与商业化', en: 'LIVE & GROWTH', category: '经营增长', maturity: '相对成熟',
    summary: 'AI不仅生产素材，也参与理解内容、预测行为、分配流量和控制实验。',
    uses: ['玩家反馈聚类、客服与社区辅助', '内容标签、推荐特征与冷启动', '活动文案变体、素材测试、异常检测'],
    designer: '把目标从短期点击扩展到留存、生态多样性和长期玩家价值。',
    watch: '反馈闭环、信息茧房、过度商业化、隐私与自动化决策边界。'
  },
]

const glossary = [
  { term: 'LLM / 多模态模型', short: '生成与理解的通用引擎', detail: '处理文本、语音、图像等输入。策划要理解它按概率生成，不天然知道项目设定，也不保证事实正确。多模态让角色能同时理解语音、画面与游戏状态。' },
  { term: '上下文 / Token', short: '模型的短期工作台与计量单位', detail: '上下文决定模型当下能看到什么，窗口越大不代表记忆越好。Token同时影响成本与延迟；要把无关设定移出上下文，按场景检索必要信息。' },
  { term: 'RAG / 知识库', short: '先查项目事实，再组织回答', detail: '把世界观、道具表、任务规则等做成可检索知识。适合事实问答和设定约束，但仍需处理知识更新、权限、召回失败与引用验证。' },
  { term: '微调 / 风格适配', short: '让行为与表达更稳定', detail: '用项目样本调整模型行为，适合稳定口吻、分类与结构化输出。它不是自动注入所有知识，也不能替代清晰规则和评测集。' },
  { term: 'Agent / 工具调用', short: '从“说”到“做事”', detail: '模型在循环中选择工具、读取状态、执行动作。游戏侧必须把工具做成白名单，例如查询背包、移动到锚点、播放表情；关键结果仍由服务器和游戏规则裁决。' },
  { term: '记忆 / 状态', short: '让关系连续，而非无限记流水账', detail: '区分会话记忆、摘要记忆、结构化关系值与游戏真实状态。需要写入条件、遗忘、冲突处理、删除机制和玩家可见的边界。' },
  { term: '传统游戏AI / 强化学习', short: '确定性规则与学习策略仍是主角', detail: '行为树、状态机、寻路和效用系统依旧适合可控角色；强化学习适合仿真、对战代理和策略优化。大模型不应替代所有底层决策。' },
  { term: '世界模型', short: '学习环境如何随行动变化', detail: '研究生成可交互环境与预测世界状态。它可能改变原型、仿真和内容生成，但持续一致性、动作空间、多代理交互与可控设计仍是关键限制。' },
]

const npcStages = [
  { name: '感知', en: 'PERCEIVE', input: '语音、文本、附近事件、可见状态', task: '定义角色能知道什么，以及绝不能知道什么。', fail: '全知NPC剧透；把玩家隐私直接写入上下文。' },
  { name: '记忆', en: 'REMEMBER', input: '会话摘要、关系值、长期事件', task: '设计写入、召回、遗忘、冲突和删除规则。', fail: '记住每句话却忘记关键承诺；错误记忆无法修复。' },
  { name: '检索', en: 'GROUND', input: '角色圣经、任务表、世界事实', task: '给事实来源排优先级，准备“不知道”的回答。', fail: '过期攻略混入当前版本；模型凭空补设定。' },
  { name: '规划', en: 'PLAN', input: '人格目标、当前意图、可用工具', task: '限制目标与计划层级，为关键剧情保留作者控制。', fail: '为了取悦玩家擅自改任务、送道具或跳过挑战。' },
  { name: '行动', en: 'ACT', input: '白名单工具、动画、导航、规则接口', task: '把表达与真实游戏事务分开，定义幂等与回滚。', fail: '台词说“已开门”，实际门没开；重复发奖励。' },
  { name: '表达', en: 'EXPRESS', input: '台词、语音、表情、口型、字幕', task: '控制长度、情绪、可打断性与无障碍呈现。', fail: '回答像客服、语音等待过久、口型与情绪割裂。' },
  { name: '裁决', en: 'VERIFY', input: '规则校验、安全过滤、状态回写', task: '服务器最终裁决，提供确定性降级和日志。', fail: '把模型输出直接当游戏真相；出错后没有退路。' },
]

const workflowSteps = [
  { no: 'A', title: '定义体验，不先选模型', text: '写清目标玩家、使用时刻、情绪目标、成功行为和不用AI的基线方案。' },
  { no: 'B', title: '划定事实与权限', text: '区分不可变规则、可生成空间、可读状态、可执行工具和人工审批点。' },
  { no: 'C', title: '制作上下文包', text: '角色卡、世界事实、示例与反例、输出Schema、禁止事项、版本号。' },
  { no: 'D', title: '先建评测，再调提示', text: '固定20—100个典型与对抗用例；比较基线，不让“一次好回答”代表稳定质量。' },
  { no: 'E', title: '灰度、观测、降级', text: '记录延迟、成本、拦截、玩家重试和退出；准备规则文本、缓存与人工接管。' },
]

const metrics = [
  { group: '体验', color: 'clay', items: ['任务完成率与卡关点', '角色一致性 / 出戏率', '交互后情绪与理解度', '重复感、无聊感、可控感'] },
  { group: '系统', color: 'blue', items: ['P50 / P95端到端延迟', '工具调用成功率', '事实正确与状态一致率', '降级触发率、崩溃与恢复'] },
  { group: '经营', color: 'cyan', items: ['单次有效交互成本', '留存、付费与长期增量', '内容采纳率而非生成量', '人工成本是否真正下降'] },
  { group: '安全', color: 'gray', items: ['越权、剧透与有害输出率', '未成年人与隐私事件', '投诉、拉黑与关闭AI比例', '问题可复现与追溯完整度'] },
]

const futures = {
  '近端 · 1—2年': [
    ['AI工作流成为基础素养', '差距不在会不会聊天，而在能否把项目知识、验收标准和生产工具接成稳定管线。'],
    ['小团队原型密度继续上升', '玩法验证更快，稀缺性转向选题、审美、分发、打磨和持续运营。'],
    ['局部运行时AI先于全能世界', '教练、向导、队友、侦探问询等边界明确的场景更容易控制质量与成本。'],
  ],
  '中期 · 3—5年': [
    ['策划成为“体验系统架构师”', '设计对象从固定内容扩展到人格、记忆、规则、工具和动态内容边界。'],
    ['内容生产转向可组合资产生态', 'AI降低生成门槛，风格一致、语义标签、可编辑结构和版权来源成为资产价值。'],
    ['评测与实时运营合流', '离线评测集、线上遥测和玩家反馈共同驱动角色与内容版本迭代。'],
  ],
  '远期 · 高不确定': [
    ['世界模型与生成式模拟', '可能让可交互空间按需生成，但持久性、作者控制、多玩家一致性和算力仍是硬问题。'],
    ['AI原生类型出现', '真正的新类型会把模型不确定性变成玩法资源，而不是把聊天窗口贴到旧游戏上。'],
    ['组织分工重新定价', '重复执行减少，跨学科Owner、工具策划、AI叙事设计与评测岗位的重要性上升。'],
  ],
}

const roadmap = [
  { phase: '第1—2周', title: '建立共同语言', output: '一页技术术语图 + 10个场景判断', tasks: ['理解LLM、RAG、Agent、记忆、推理成本', '区分规则AI、生成式AI与强化学习', '体验3类工具，记录失败而非只记录惊喜'] },
  { phase: '第3—4周', title: '改造个人工作流', output: '一套可复用的策划上下文包', tasks: ['建立项目资料库与引用习惯', '做方案变体、反方评审、结构化验收表', '保留人工终稿和来源检查记录'] },
  { phase: '第5—8周', title: '完成可玩原型', output: '一个边界明确的AI玩法Demo', tasks: ['优先选择向导、问询或语音队友', '只开放3—5个白名单工具', '准备无AI降级路径与日志字段'] },
  { phase: '第9—12周', title: '用证据完成闭环', output: '评测报告 + 作品集复盘', tasks: ['建立典型、边缘、对抗三类用例', '测试质量、延迟、成本与玩家理解', '写清何时不该用AI以及下一版取舍'] },
]

const sources = [
  { id: 'S1', title: 'GDC 2026 State of the Game Industry', org: 'GDC Festival of Gaming · 2026-01-28', url: 'https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/', note: '行业岗位使用、用途分布与从业者态度。' },
  { id: 'S2', title: '2026 Unity Game Development Report', org: 'Unity · 2025年300名受访者样本', url: 'https://unity.com/resources/gaming-report', note: '代码、叙事、NPC、测试与动态难度等应用分布。' },
  { id: 'S3', title: 'PUBG Ally gains long-term memory, powered by NVIDIA ACE', org: 'NVIDIA · 2026-01-14', url: 'https://www.nvidia.com/en-sg/geforce/news/dlss-4-rtx-path-tracing-game-announcements-ces-2026/', note: '端侧语音、SLM、游戏状态感知与长期记忆的队友案例。' },
  { id: 'S4', title: 'NVIDIA ACE Game Agent SDK and UE5 Plugins', org: 'NVIDIA Developer · 2026-06-16', url: 'https://developer.nvidia.com/blog/build-on-device-ai-companions-with-the-nvidia-ace-game-agent-sdk-and-unreal-engine-5-plugins/', note: 'Agent、Chat与RAG接口；游戏工具调用与知识检索。' },
  { id: 'S5', title: 'Genie 3: A new frontier for world models', org: 'Google DeepMind · 2025-08-05', url: 'https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/', note: '实时交互世界模型能力及动作、时长、多代理限制。' },
  { id: 'S6', title: 'How Ubisoft’s NEO NPC prototype changes narrative', org: 'Ubisoft · 2024-03-19', url: 'https://news.ubisoft.com/en-us/article/5qXdxhshJBXoanFZApdG3L/how-ubisofts-new-generative-ai-prototype-changes-the-narrative-for-npcs', note: '玩家面对的原型、角色真实性与人类创作主导。' },
  { id: 'S7', title: 'Steamworks Content Survey', org: 'Valve · 持续更新文档', url: 'https://partner.steamgames.com/doc/gettingstarted/contentsurvey', note: '预生成与实时生成AI内容披露、实时生成防护要求。' },
  { id: 'S8', title: '《人工智能生成合成内容标识办法》', org: '国家网信办等四部门 · 2025-09-01施行', url: 'https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm', note: '文本、音频、图片、视频、虚拟场景的显式与隐式标识。' },
]

const searchItems = [
  ...chapters.map(c => ({ title: c.label, meta: `章节 ${c.no}`, id: c.id })),
  ...domains.map(d => ({ title: d.title, meta: d.category, id: 'map' })),
  ...glossary.map(g => ({ title: g.term, meta: g.short, id: 'stack' })),
  { title: '90天学习与作品集路线', meta: '行动方案', id: 'roadmap' },
  { title: 'AI项目评估指标与成本', meta: '质量、系统、经营、安全', id: 'metrics' },
]

function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0
    const pointer = { x: -1000, y: -1000 }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
    }
    const leave = () => { pointer.x = -1000; pointer.y = -1000 }
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const cols = Math.max(28, Math.floor(width / 13))
      const rows = Math.max(25, Math.floor(height / 13))
      const t = reduced ? 0.8 : frame * 0.009
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x / (cols - 1)) * width
          const baseY = (y / (rows - 1)) * height
          const dx = px - pointer.x
          const dy = baseY - pointer.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = Math.max(0, 1 - dist / 180)
          const wave = Math.sin(x * 0.33 + t) * 8 + Math.cos(y * 0.29 - t * 0.7) * 7
          const py = baseY + wave + force * Math.sin(dist * 0.06 - t * 2) * 22
          const alpha = 0.12 + (Math.sin(x * 0.21 + y * 0.18 + t) + 1) * 0.09 + force * 0.35
          ctx.beginPath()
          ctx.fillStyle = x > cols * 0.68 && y < rows * 0.28
            ? `rgba(217,119,87,${Math.min(alpha, .55)})`
            : `rgba(183,183,178,${Math.min(alpha, .48)})`
          ctx.arc(px + force * dx * .035, py, force > .25 ? 1.35 : .85, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      frame++
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <canvas ref={ref} className="neural-field" aria-hidden="true" />
}

function SectionHead({ no, title, intro }: { no: string; title: string; intro: string }) {
  return (
    <div className="section-head">
      <span className="section-no">{no}</span>
      <div>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('overview')
  const [filter, setFilter] = useState('全部')
  const [openDomain, setOpenDomain] = useState<number | null>(0)
  const [openTerm, setOpenTerm] = useState(0)
  const [npcStage, setNpcStage] = useState(0)
  const [futureTab, setFutureTab] = useState<keyof typeof futures>('近端 · 1—2年')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [checked, setChecked] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-15% 0px -65% 0px', threshold: [0, .1, .3] })
    chapters.forEach(c => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setSearchOpen(v => !v)
      }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [searchOpen, menuOpen])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSearchOpen(false); setMenuOpen(false); setQuery('')
  }

  const filteredDomains = domains.filter(d => filter === '全部' || d.category === filter)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? searchItems.filter(i => `${i.title}${i.meta}`.toLowerCase().includes(q)).slice(0, 10) : searchItems.slice(0, 8)
  }, [query])

  const copyTemplate = async () => {
    const text = '【体验目标】谁在什么时刻获得什么体验？\n【非AI基线】不用AI如何实现？AI增量是什么？\n【事实来源】角色、世界、任务与数值以哪些表为准？\n【可生成空间】允许变化什么？绝不能改变什么？\n【工具权限】可读状态、可执行动作、服务器裁决是什么？\n【输出Schema】字段、长度、格式、语言、禁用项。\n【评测集】典型、边缘、对抗用例及通过阈值。\n【运行约束】P95延迟、单次成本、并发、降级路径。\n【上线观测】质量、安全、退出、投诉与长期体验指标。'
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { setCopied(false) }
  }

  const score = checked.length
  const scoreText = score <= 2 ? '先补齐技术共同语言，再做一个小型可玩闭环。' : score <= 5 ? '已具备协作基础，下一步重点是评测、成本与上线证据。' : '可以挑战更完整的AI玩法Owner角色，继续强化治理与长期指标。'

  return (
    <div className="site-shell">
      <a className="skip-link" href="#overview">跳到正文</a>
      <header className="topbar">
        <button className="brand" onClick={() => go('overview')} aria-label="返回顶部">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>AI × GAME DESIGN</span>
        </button>
        <div className="top-meta"><span className="live-dot" />知识快照 2026.10.26</div>
        <div className="top-actions">
          <button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={16} /><span>检索知识</span><kbd>⌘ K</kbd></button>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="打开章节导航"><Menu size={20} /></button>
        </div>
      </header>

      <nav className="chapter-rail" aria-label="章节导航">
        {chapters.map(c => (
          <button key={c.id} className={active === c.id ? 'active' : ''} onClick={() => go(c.id)} aria-label={`${c.no} ${c.label}`} title={c.label}>
            <span>{c.no}</span><i />
          </button>
        ))}
      </nav>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker">THE AI GAME DESIGNER'S FIELD GUIDE / 2026</p>
            <h1 id="hero-title">从使用工具，<br />到设计<span>会思考的游戏</span></h1>
            <p className="hero-lead">一份写给游戏策划的 AI 知识体系：看懂生产管线、角色智能、动态玩法与经营增长，掌握评估、成本和治理，把技术可能性转化为可玩、可控、可上线的体验。</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => go('map')}>进入知识地图 <ArrowDown size={17} /></button>
              <button className="text-cta" onClick={() => go('roadmap')}>直接看90天路线 <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="hero-visual">
            <NeuralField />
            <div className="visual-label top"><span>INPUT</span>玩家意图 × 游戏状态</div>
            <div className="visual-label bottom"><span>OUTPUT</span>可解释的体验变化</div>
            <div className="orbit-tag tag-a">PERCEIVE</div>
            <div className="orbit-tag tag-b">PLAN</div>
            <div className="orbit-tag tag-c">ACT</div>
          </div>
          <div className="hero-index"><strong>10</strong><span>章节<br />完整知识框架</span></div>
        </section>

        <section id="overview" className="content-section overview-section">
          <SectionHead no="00" title="先建立正确的行业坐标" intro="AI不是单一工具，而是三条同时演进、风险结构完全不同的路径。" />
          <div className="thesis-grid">
            <article><span className="thesis-tag">路径 A</span><h3>生产管线智能化</h3><p>策划、文本、美术、代码、测试的提效。核心是<span>质量是否更稳定</span>，不是生成数量。</p></article>
            <article><span className="thesis-tag">路径 B</span><h3>运行时体验智能化</h3><p>NPC、队友、动态难度、世界模拟。核心是<span>不确定性能否变成乐趣</span>。</p></article>
            <article><span className="thesis-tag">路径 C</span><h3>经营与生态智能化</h3><p>推荐、运营、UGC、商业化。核心是<span>长期生态价值</span>，不是局部点击最大化。</p></article>
          </div>
          <div className="evidence-band">
            <div className="evidence-stat"><strong>36%</strong><p>受访游戏行业从业者在工作中使用生成式AI</p><a href={sources[0].url} target="_blank" rel="noreferrer">GDC 2026 <ArrowUpRight size={13} /></a></div>
            <div className="evidence-stat"><strong>81%</strong><p>上述调查中，AI使用者常用于研究或脑暴</p><a href={sources[0].url} target="_blank" rel="noreferrer">GDC 2026 <ArrowUpRight size={13} /></a></div>
            <div className="evidence-stat warning"><strong>52%</strong><p>受访者认为生成式AI对行业产生负面影响</p><a href={sources[0].url} target="_blank" rel="noreferrer">GDC 2026 <ArrowUpRight size={13} /></a></div>
            <div className="evidence-note"><span>如何解读</span><p>采用率上升与负面态度上升并不矛盾。越接近生产，越能看见质量、权利、文化与工作方式的代价。未来策划的价值不是盲目拥抱，而是做出有证据的取舍。</p></div>
          </div>
          <div className="principle-line"><span>核心判断</span><p>AI时代的策划，不是“提示词写得最长的人”，而是能定义体验目标、系统边界、评价函数与失败退路的人。</p></div>
        </section>

        <section id="map" className="content-section">
          <SectionHead no="01" title="AI在游戏行业的应用全景" intro="点击场景展开：它做什么、策划管什么、哪里最容易失败。" />
          <div className="filter-row" role="group" aria-label="应用类型筛选">
            {['全部', '生产提效', '运行时玩法', '经营增长'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => { setFilter(f); setOpenDomain(null) }}>{f}</button>)}
          </div>
          <div className="domain-list">
            {filteredDomains.map(d => {
              const originalIndex = domains.indexOf(d)
              const isOpen = openDomain === originalIndex
              return <article className={`domain ${isOpen ? 'open' : ''}`} key={d.title}>
                <button className="domain-summary" onClick={() => setOpenDomain(isOpen ? null : originalIndex)} aria-expanded={isOpen}>
                  <span className="domain-en">{d.en}</span>
                  <span className="domain-title"><small>{d.category} / {d.maturity}</small><strong>{d.title}</strong></span>
                  <span className="domain-desc">{d.summary}</span>
                  <ChevronDown size={19} />
                </button>
                {isOpen && <div className="domain-detail">
                  <div><h4>典型应用</h4><ul>{d.uses.map(u => <li key={u}>{u}</li>)}</ul></div>
                  <div><h4>策划的核心职责</h4><p>{d.designer}</p></div>
                  <div><h4>失败观察点</h4><p>{d.watch}</p></div>
                </div>}
              </article>
            })}
          </div>
          <p className="scope-note">应用成熟度为截至2026年10月的概括性判断，不代表所有项目均已量产。选型应以自有玩法的实测结果为准。</p>
        </section>

        <section id="stack" className="content-section">
          <SectionHead no="02" title="策划需要的技术底座" intro="学到能定义需求、识别限制、评估方案；不要求先成为模型训练工程师。" />
          <div className="stack-layout">
            <div className="term-list">
              {glossary.map((g, i) => <button key={g.term} onClick={() => setOpenTerm(i)} className={openTerm === i ? 'active' : ''}><span>{String(i + 1).padStart(2, '0')}</span><strong>{g.term}</strong><small>{g.short}</small></button>)}
            </div>
            <div className="term-detail" key={openTerm}>
              <span className="mono-label">DESIGNER'S MENTAL MODEL</span>
              <h3>{glossary[openTerm].term}</h3>
              <p>{glossary[openTerm].detail}</p>
              <div className="term-question"><span>在评审中应该问</span><strong>{[
                '输入的事实从哪里来？输出错了由谁发现？',
                '上下文里哪些是必要信息？每次调用花多少钱、等多久？',
                '检索不到或知识过期时，系统怎样承认不知道？',
                '有没有足够的数据证明微调优于更好的上下文与规则？',
                '模型能调用哪些工具？越权、重复执行、回滚怎么处理？',
                '这条记忆为何写入？玩家能否理解、修正或删除？',
                '这个决策真的需要大模型，还是行为树与效用系统更可靠？',
                '它能否支持作者控制、持久状态和多人一致，而非只生成漂亮视频？',
              ][openTerm]}</strong></div>
            </div>
          </div>
          <div className="tech-rule"><strong>技术选型第一原则</strong><p>能用确定性规则解决的，不交给概率模型；需要开放理解、生成或自然交互的，再评估AI。最常见的高质量系统是<span>规则兜底 + 检索供事实 + 模型做理解与表达 + 服务器裁决结果</span>。</p></div>
        </section>

        <section id="npc" className="content-section npc-section">
          <SectionHead no="03" title="重点拆解：AI角色不是聊天机器人" intro="一个可玩的角色系统，是感知、记忆、规划、行动与游戏规则共同构成的闭环。" />
          <div className="pipeline" role="tablist" aria-label="AI角色系统阶段">
            {npcStages.map((s, i) => <button key={s.name} role="tab" aria-selected={npcStage === i} className={npcStage === i ? 'active' : ''} onClick={() => setNpcStage(i)}><span>{String(i + 1).padStart(2, '0')}</span><strong>{s.name}</strong><small>{s.en}</small></button>)}
          </div>
          <div className="npc-detail" key={npcStage}>
            <div><span className="mono-label">STAGE {String(npcStage + 1).padStart(2, '0')}</span><h3>{npcStages[npcStage].name} / {npcStages[npcStage].en}</h3><p>{npcStages[npcStage].input}</p></div>
            <div className="npc-design"><span>策划设计任务</span><p>{npcStages[npcStage].task}</p></div>
            <div className="npc-fail"><span>典型失败</span><p>{npcStages[npcStage].fail}</p></div>
          </div>
          <div className="case-strip">
            <div><span className="mono-label">CASE SIGNAL / 2026</span><h3>从会说话，到会一起玩</h3></div>
            <p>NVIDIA披露的PUBG Ally测试方案，将语音识别、SLM、游戏状态感知、实时反应与长期记忆组合为队友系统；这说明重点已从台词生成转向<span>理解局势并参与行动</span>。</p>
            <a href={sources[2].url} target="_blank" rel="noreferrer">查看官方案例 <ArrowUpRight size={15} /></a>
          </div>
          <div className="design-checklist">
            <h3>立项前的六个“能”</h3>
            <div>{['不用自由聊天，玩法是否仍成立？', '角色不知道答案时，能否自然承认？', '玩家能否打断、跳过或关闭AI？', '关键剧情与奖励是否由规则裁决？', 'bug能否通过日志和状态快照复现？', '服务不可用时，是否有完整降级体验？'].map(x => <p key={x}><Check size={16} />{x}</p>)}</div>
          </div>
        </section>

        <section id="workflow" className="content-section">
          <SectionHead no="04" title="AI时代策划的标准工作流" intro="把“写提示词”升级为可协作、可测试、可维护的系统设计。" />
          <div className="workflow-steps">
            {workflowSteps.map(s => <article key={s.no}><span>{s.no}</span><h3>{s.title}</h3><p>{s.text}</p></article>)}
          </div>
          <div className="brief-panel">
            <div><span className="mono-label">AI FEATURE BRIEF / 模板</span><h3>一份能直接进入评审的AI功能需求</h3><p>复制模板，替换为项目实际内容。关键是同时写清体验、事实、权限、评测与降级。</p></div>
            <button onClick={copyTemplate}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '已复制' : '复制模板'}</button>
            <pre>{`【体验目标】谁在什么时刻获得什么体验？
【非AI基线】不用AI如何实现？AI增量是什么？
【事实来源】角色、世界、任务与数值以哪些表为准？
【可生成空间】允许变化什么？绝不能改变什么？
【工具权限】可读状态、可执行动作、服务器裁决是什么？
【输出Schema】字段、长度、格式、语言、禁用项。
【评测集】典型、边缘、对抗用例及通过阈值。
【运行约束】P95延迟、单次成本、并发、降级路径。
【上线观测】质量、安全、退出、投诉与长期体验指标。`}</pre>
          </div>
        </section>

        <section id="metrics" className="content-section">
          <SectionHead no="05" title="评估、实验与成本：让AI从Demo走向产品" intro="模型评分高，不代表玩法更好；单次调用便宜，也不代表规模化可持续。" />
          <div className="metrics-grid">
            {metrics.map(m => <article key={m.group} className={m.color}><h3>{m.group}</h3>{m.items.map(i => <p key={i}>{i}</p>)}</article>)}
          </div>
          <div className="formula-layout">
            <div className="formula-block"><span className="mono-label">UNIT ECONOMICS</span><h3>单次有效交互成本</h3><div className="formula">（输入Token × 单价 + 输出Token × 单价 + 语音 / 检索 / 工具成本）<br />÷ 有效交互率</div><p>有效交互不是“成功返回”，而是玩家完成目标、没有重试风暴、没有触发严重出戏或安全问题。还需计入缓存、失败重试、内容审核、人工复核与工程运维。</p></div>
            <div className="experiment-block"><span className="mono-label">EXPERIMENT DESIGN</span><h3>一次合格的玩法实验</h3><ol><li><strong>设基线</strong>固定台词、规则NPC或人工内容。</li><li><strong>分维度</strong>质量、乐趣、延迟、成本分别通过。</li><li><strong>看分布</strong>别只看平均值，重点看P95和坏案例。</li><li><strong>测长期</strong>新鲜感退去后，关系与重复体验是否仍成立。</li></ol></div>
          </div>
          <div className="survey-note"><BookOpen size={19} /><p>Unity 2026报告的300名开发者样本中，代码辅助62%、写作与叙事44%、NPC行为40%、自动试玩35%、自适应难度34%。这些数字可用于观察方向，不应直接外推到整个游戏行业。</p><a href={sources[1].url} target="_blank" rel="noreferrer" aria-label="查看Unity报告"><ArrowUpRight size={17} /></a></div>
        </section>

        <section id="governance" className="content-section">
          <SectionHead no="06" title="边界、合规与玩家信任" intro="把权利与安全做进系统，而不是上线前补一页免责声明。此处为工作检查框架，不替代法律意见。" />
          <div className="risk-table" role="table" aria-label="AI游戏风险检查">
            {[
              ['知识产权', '素材来源、输出相似性、可商用条款、项目保密', '授权台账 / 来源记录 / 人工审核'],
              ['人格与声音', '演员、声优、角色形象的授权范围与期限', '明确合成用途、地区、撤回与替换机制'],
              ['隐私与数据', '语音、聊天、行为记忆、跨端数据与删除权', '最小采集 / 分区存储 / 保留期限 / 删除入口'],
              ['未成年人', '诱导、依赖、消费、内容分级和不当对话', '更严格默认策略 / 监护与举报 / 人工升级'],
              ['实时生成安全', '越狱、提示注入、违法内容、越权工具调用', '输入输出防护 / 工具白名单 / 规则裁决 / 日志'],
              ['透明与标识', 'AI生成内容披露、虚拟场景与导出内容标识', '按地区、平台和内容形态建立合规矩阵'],
              ['社区与劳动', '玩家对AI素材的接受度、创作者署名与收益', '提前沟通 / 社区反馈 / 合理署名与激励'],
            ].map((r, i) => <div className="risk-row" role="row" key={r[0]}><span>{String(i + 1).padStart(2, '0')}</span><strong>{r[0]}</strong><p>{r[1]}</p><p>{r[2]}</p></div>)}
          </div>
          <div className="regulation-grid">
            <a href={sources[7].url} target="_blank" rel="noreferrer"><span>中国 · 2025-09-01施行</span><h3>生成合成内容标识</h3><p>办法覆盖文本、图片、音频、视频、虚拟场景等，区分显式与隐式标识。项目需结合自身服务与传播角色确认具体义务。</p><ArrowUpRight size={18} /></a>
            <a href={sources[6].url} target="_blank" rel="noreferrer"><span>STEAMWORKS · 内容调查</span><h3>预生成与实时生成分别披露</h3><p>Steam文档要求描述开发期或产品内AI实现；实时生成还需说明防止生成非法内容的防护措施。</p><ArrowUpRight size={18} /></a>
          </div>
        </section>

        <section id="future" className="content-section future-section">
          <SectionHead no="07" title="未来AI游戏策划的核心知识体系" intro="不是新增一个孤立岗位，而是在传统策划能力之上叠加五层新能力。" />
          <div className="capability-stack">
            {[
              ['01', '体验与审美', '玩家心理、核心循环、叙事、节奏、关卡与商业伦理', '仍是不可替代的底座'],
              ['02', '概率系统设计', '人格、记忆、检索、工具、生成空间、确定性与随机性的分工', '从写内容到设计内容边界'],
              ['03', '数据与评测', '评测集、遥测、A/B实验、坏案例分析、长期指标与反事实', '从感觉好到证据充分'],
              ['04', '技术与生产协作', '结构化数据、API概念、引擎原型、版本管理、推理性能与成本', '能跨专业做完整闭环'],
              ['05', '治理与生态', '版权、隐私、安全、未成年人、创作者激励、玩家沟通', '让系统值得被信任'],
            ].map(x => <article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><strong>{x[3]}</strong></article>)}
          </div>
          <div className="future-forecast">
            <div className="future-tabs" role="tablist" aria-label="趋势时间范围">{(Object.keys(futures) as Array<keyof typeof futures>).map(k => <button key={k} role="tab" aria-selected={futureTab === k} className={futureTab === k ? 'active' : ''} onClick={() => setFutureTab(k)}>{k}</button>)}</div>
            <div className="forecast-list" key={futureTab}>{futures[futureTab].map((f, i) => <article key={f[0]}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{f[0]}</h3><p>{f[1]}</p></div></article>)}</div>
            <p className="forecast-note">以上为基于当前技术、产品与生产约束的情景推演，不是确定性预言。越远期，越应关注条件是否成熟，而非押注具体年份。</p>
          </div>
          <div className="self-check">
            <div className="self-head"><div><span className="mono-label">CAPABILITY SELF-CHECK</span><h3>八项能力快速自评</h3></div><div className="score"><strong>{score}</strong><span>/ 8</span></div></div>
            <div className="check-grid">{[
              '能解释RAG、Agent与微调各自解决什么', '能把创意拆成可验收的体验指标',
              '能独立做出一个小型可玩原型', '能设计角色知识与记忆写入规则',
              '能列出工具权限和服务器裁决边界', '能建立典型、边缘、对抗评测集',
              '能估算P95延迟与单次有效交互成本', '能识别版权、隐私、标识与平台要求',
            ].map((x, i) => <button key={x} className={checked.includes(i) ? 'checked' : ''} onClick={() => setChecked(v => v.includes(i) ? v.filter(n => n !== i) : [...v, i])} aria-pressed={checked.includes(i)}><span>{checked.includes(i) && <Check size={14} />}</span>{x}</button>)}</div>
            <p className="score-advice">{scoreText}</p>
          </div>
        </section>

        <section id="roadmap" className="content-section roadmap-section">
          <SectionHead no="08" title="90天学习与作品集路线" intro="目标不是“学完所有AI”，而是完成一个能展示判断、系统与证据的闭环作品。" />
          <div className="roadmap-line">
            {roadmap.map((r, i) => <article key={r.phase}><div className="road-marker"><span>{String(i + 1).padStart(2, '0')}</span><i /></div><span className="mono-label">{r.phase}</span><h3>{r.title}</h3><ul>{r.tasks.map(t => <li key={t}>{t}</li>)}</ul><div className="road-output"><span>阶段交付</span><strong>{r.output}</strong></div></article>)}
          </div>
          <div className="portfolio-brief"><span className="mono-label">PORTFOLIO BRIEF</span><h3>推荐作品：有边界、有记忆、能降级的AI角色原型</h3><div><p><strong>玩法</strong>10分钟侦探问询、地下城向导或两人协作任务，三选一。</p><p><strong>范围</strong>1个角色、1张知识表、3个工具、20条评测用例。</p><p><strong>证据</strong>演示视频、系统图、失败案例、成本测算、复盘文档。</p></div></div>
          <button className="primary-cta roadmap-cta" onClick={() => go('workflow')}>带着需求模板开始 <ArrowUpRight size={17} /></button>
        </section>

        <section id="sources" className="content-section sources-section">
          <SectionHead no="09" title="来源、口径与持续更新" intro="优先使用官方报告、平台文档与一手技术资料；将事实、案例和预测分开。" />
          <div className="source-list">{sources.map(s => <a key={s.id} href={s.url} target="_blank" rel="noreferrer"><span>{s.id}</span><div><h3>{s.title}</h3><p>{s.org} · {s.note}</p></div><ArrowUpRight size={17} /></a>)}</div>
          <div className="method-note"><h3>阅读口径</h3><p>行业调查受样本、岗位与地区影响，不应把单一百分比当作全行业定论。厂商案例用于理解技术结构，不等于独立评测或普遍量产。页面中“成熟度”“未来趋势”和“90天路线”为基于上述资料的综合分析与建议。</p></div>
        </section>
      </main>

      <footer>
        <div><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><strong>AI游戏策划知识地图</strong></div>
        <p>从“生成更多”走向“设计得更好”。</p>
        <button onClick={() => go('overview')}>回到顶部 <ArrowUp size={15} /></button>
      </footer>

      {searchOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="检索知识" onMouseDown={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}>
        <div className="search-modal">
          <div className="search-input"><Search size={20} /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索NPC、RAG、成本、学习路线……" aria-label="搜索关键词" /><button onClick={() => setSearchOpen(false)} aria-label="关闭搜索"><X size={19} /></button></div>
          <div className="search-results">{results.length ? results.map((r, i) => <button key={`${r.title}${i}`} onClick={() => go(r.id)}><span><strong>{r.title}</strong><small>{r.meta}</small></span><ArrowUpRight size={16} /></button>) : <p>没有匹配结果，试试“角色”“评测”或“合规”。</p>}</div>
          <div className="search-hint"><span>ESC 关闭</span><span>点击结果跳转章节</span></div>
        </div>
      </div>}

      {menuOpen && <div className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label="章节导航" onMouseDown={e => { if (e.target === e.currentTarget) setMenuOpen(false) }}>
        <div className="mobile-nav-panel"><div className="mobile-nav-head"><strong>知识地图目录</strong><button onClick={() => setMenuOpen(false)} aria-label="关闭导航"><X size={20} /></button></div>{chapters.map(c => <button key={c.id} onClick={() => go(c.id)}><span>{c.no}</span>{c.label}<ArrowUpRight size={15} /></button>)}</div>
      </div>}
    </div>
  )
}
