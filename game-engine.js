/**
 * 选秀导演模拟器 - 核心游戏引擎
 * Audition Director Simulator - Game Engine
 */

(function () {
  'use strict';

  // ============================================================
  // 常量定义
  // ============================================================

  const SURNAMES = [
    '王', '李', '张', '陈', '杨', '赵', '黄', '周', '吴', '徐',
    '孙', '胡', '高', '林', '何', '郭', '梁', '宋', '唐', '曹', '邓',
    '欧阳', '司马', '东方'
  ];

  const GIVEN_NAMES = [
    '朔', '衡', '骁', '拓', '峥', '成', '平', '明', '知遥', '沐承',
    '书珩', '逸辰', '承宇', '云峥', '思齐', '嘉树', '闻谦', '锐岩', '霆越',
    '明远', '俊杰', '瑞霖', '嘉骏', '瑞安', '天磊', '一凡', '逸飞', '天翊',
    '泽言', '一航', '铭泽', '书尧', '沐阳', '清源', '子谦', '云朗', '嘉木',
    '晏清', '明骁', '乐安', '文翰', '景舟'
  ];

  const STAGE_NAMES = [
    'Yung Ace', 'Lil Kairo', 'Big Rell', 'Drex', 'Zay Savage',
    'Kyro', 'Niko Blaze', 'Juvie', 'YNM Melo', 'Trap Kye',
    'Rixx', 'Vex', 'Lil Zylo'
  ];

  const PERSONALITIES = [
    '阳光开朗', '争强好胜', '温柔善良', '内向沉默', '自信张扬',
    '敏感脆弱', '综艺担当', '严谨认真', '精明世故', '天然呆'
  ];

  const EXPERIENCES = [
    { name: '出道经验', bonuses: { sing: 10, dance: 10, stressResistance: 5 }, triggersStageName: true },
    { name: '选秀经历', bonuses: { stressResistance: 15 }, extraFans: true },
    { name: '影视经验', bonuses: { look: 5 }, extraFans: true },
    { name: '网红背景', bonuses: { variety: 10 }, extraFans: true },
    { name: '海外经历', bonuses: { look: 5 }, randomBonus: 'sing_or_dance', triggersStageName: true },
    { name: '学霸背景', bonuses: { education: 20 }, randomBonus: 'create' },
    { name: '情感经历', bonuses: { look: 5 }, topicBonus: true },
    { name: '体育特长', bonuses: { stamina: 20, dance: 5 } },
    { name: '学艺经历', bonuses: { sing: 15, dance: 15 } },
    { name: '争议经历', bonuses: { stressResistance: -10 }, topicBonus: true }
  ];

  const LARGE_COMPANIES = [
    '星耀娱乐', '天娱传媒', '乐华娱乐', '时代峰峻'
  ];

  const MEDIUM_COMPANIES = [
    '芒果娱乐', '哇唧唧哇', '丝芭传媒', '华谊兄弟',
    '英皇娱乐', '寰亚传媒', '天浩盛世', '匠星娱乐'
  ];

  const SMALL_COMPANIES = [
    '嘉行新悦', '悦凯娱乐', '耀客传媒', '华策影视', '慈文传媒', '新丽传媒', '欢瑞世纪'
  ];

  const SPONSOR_TYPES = ['快消', '科技', '时尚', '金融', '娱乐', '汽车'];

  const SPONSOR_NAMES = {
    '快消': ['康师傅', '农夫山泉', '蒙牛', '伊利', '百事可乐', '可口可乐', '统一', '旺旺'],
    '科技': ['华为', '小米', 'OPPO', 'vivo', '荣耀', '联想', '三星'],
    '时尚': ['耐克', '阿迪达斯', '优衣库', 'ZARA', '李宁', '安踏', '彪马'],
    '金融': ['招商银行', '支付宝', '微信支付', '建设银行', '工商银行'],
    '娱乐': ['腾讯视频', '爱奇艺', '优酷', '芒果TV', '哔哩哔哩'],
    '汽车': ['比亚迪', '蔚来', '小鹏', '理想', '特斯拉', '宝马', '奔驰']
  };

  const SPONSOR_REQUIREMENTS = [
    '镜头保证', '人气保证', '参与节目', '产品植入', '续约要求'
  ];

  const MENTOR_SPECIALTIES = ['vocal', 'dance', 'rap', 'comprehensive', 'performance', 'host'];

  const MENTOR_NAMES_POOL = [
    '甄嬛', '雍正', '华妃', '沈眉庄', '安陵容', '温实初', '果郡王', '太后', '敬妃', '端妃', '齐妃', '欣常在', '曹贵人', '槿汐', '苏培盛', '颂芝',
    '孙悟空', '唐僧', '猪八戒', '沙僧', '哪吒', '二郎神', '牛魔王', '铁扇公主', '白龙马', '红孩儿', '黑熊精', '黄风怪', '白骨精',
    '诸葛亮', '关羽', '张飞', '赵云', '刘备', '曹操', '周瑜', '吕布', '貂蝉', '孙权', '司马懿', '黄忠', '马超', '庞统', '姜维',
    '佟湘玉', '白展堂', '郭芙蓉', '吕秀才', '李大嘴', '莫小贝', '邢捕头', '燕小六', '钱掌柜', '祝无双', '小米'
  ];

  const GRADES = ['A', 'B', 'C', 'D', 'F'];

  const EDITING_OPTIONS_INITIAL = [
    { key: 'A', label: '一剪梅', minutes: 0, effects: {} },
    { key: 'B', label: '快速略过', minutes: 1, effects: { passerby: 0.01, solo: 0.002 } },
    { key: 'C', label: '正常剪辑', minutes: 5, effects: { passerby: 0.03, solo: 0.005 } },
    { key: 'D', label: '突出剪辑', minutes: 10, effects: { passerby: 0.05, solo: 0.01, cp: 0.02, anti: 0.01 } },
    { key: 'E', label: '完整故事线', minutes: 15, effects: { passerby: 0.08, solo: 0.02, cp: 0.03, anti: 0.02 } }
  ];

  const EDITING_OPTIONS_PERFORMANCE = [
    { key: 'A', label: '一剪梅', minutes: 0, effects: { solo: -0.005, anti: 0.01 } },
    { key: 'B', label: '快速略过', minutes: 5, effects: { passerby: 0.02, solo: 0.003 } },
    { key: 'C', label: '正常剪辑', minutes: 10, effects: { passerby: 0.05, solo: 0.01, cp: 0.01 } },
    { key: 'D', label: '重点剪辑', minutes: 15, effects: { passerby: 0.08, solo: 0.02, cp: 0.03, anti: 0.01 } },
    { key: 'E', label: '完整故事线', minutes: 25, effects: { passerby: 0.12, solo: 0.03, cp: 0.05, anti: 0.02 } }
  ];

  const EVENT_OPTIONS = {
    A: { label: '完全剪掉', description: '不播出该事件', minutes: 0 },
    B: { label: '突出能力性格', description: '展现练习生积极一面', minutes: 5 },
    C: { label: '突出问题冲突', description: '制造话题和戏剧性', minutes: 8 },
    D: { label: '剪辑CP线', description: '强化两人关系线', minutes: 6 }
  };

  const MARKETING_CONFIG = {
    wb_positive: {
      platform: 'wb', direction: 'positive', cost: 200, successRate: 0.4,
      effects: { passerby: 0.05, anti: 0.02 },
      soloEffect: { solo: 0.01 },
      cpEffect: { cp: 0.05 },
      limits: { passerby: 1000, anti: 1000, solo: 100, cp: 2000 },
      failureEffects: { passerby: -0.05, anti: 0.05 },
      failureLimits: { passerby: 1000, anti: 2000 },
      nobodyCaresRate: 0.30
    },
    wb_negative: {
      platform: 'wb', direction: 'negative', cost: 200, successRate: 0.6,
      effects: { passerby: -0.05, anti: 0.10 },
      soloEffect: { solo: -0.01 },
      cpEffect: { cp: -0.05 },
      limits: { passerby: 2000, anti: 3000, solo: Infinity, cp: 2000 },
      failureEffects: { passerby: 0.05, anti: 0.02, solo: 0.01 },
      failureSoloEffect: { solo: 0.01 },
      failureCpEffect: { cp: 0.05 },
      failureLimits: { passerby: 1000, anti: 1000, solo: 100, cp: 2000 },
      nobodyCaresRate: 0.30
    },
    dy_positive: {
      platform: 'dy', direction: 'positive', cost: 150, successRate: 0.3,
      effects: { passerby: 0.10, anti: 0.05 },
      soloEffect: { solo: 0.005 },
      cpEffect: { cp: 0.15 },
      limits: { passerby: 3000, anti: 1000, solo: 50, cp: 3000 },
      failureEffects: { passerby: -0.05, anti: 0.08 },
      failureLimits: { passerby: 1000, anti: 2000 },
      nobodyCaresRate: 0.50
    },
    dy_negative: {
      platform: 'dy', direction: 'negative', cost: 150, successRate: 0.6,
      effects: { passerby: -0.10, anti: 0.15 },
      soloEffect: { solo: -0.01 },
      cpEffect: { cp: -0.15 },
      limits: { passerby: 3000, anti: 4000, solo: Infinity, cp: 3000 },
      failureEffects: { passerby: 0.10, anti: -0.05 },
      failureSoloEffect: { solo: 0.005 },
      failureCpEffect: { cp: 0.15 },
      failureLimits: { passerby: 3000, anti: 1000, solo: 50, cp: 3000 },
      nobodyCaresRate: 0.50
    },
    db_positive: {
      platform: 'db', direction: 'positive', cost: 50, successRate: 0.3,
      effects: { passerby: 0.01, anti: 0.01 },
      soloEffect: { solo: 0.03 },
      cpEffect: { cp: 0.10 },
      limits: { passerby: 300, anti: 500, solo: 300, cp: 3000 },
      failureEffects: { passerby: -0.05, anti: 0.02 },
      failureLimits: { passerby: 100, anti: 300 },
      nobodyCaresRate: 0.20
    },
    db_negative: {
      platform: 'db', direction: 'negative', cost: 50, successRate: 0.4,
      effects: { passerby: -0.01, anti: 0.02 },
      soloEffect: { solo: -0.03 },
      cpEffect: { cp: -0.10 },
      limits: { passerby: 500, anti: 300, solo: Infinity, cp: 3000 },
      failureEffects: { passerby: 0.01, anti: -0.01 },
      failureSoloEffect: { solo: 0.03 },
      failureCpEffect: { cp: 0.10 },
      failureLimits: { passerby: 300, anti: 500, solo: 300, cp: 3000 },
      nobodyCaresRate: 0.40
    }
  };

  const DEFAULT_PERFORMANCE_SONGS = [
    '盛夏的果实', '最炫民族风', '双截棍', '大艺术家', '平凡之路', '我的新衣',
    '光年之外', '说散就散', '起风了', '年少有为', '漂洋过海来看你', '追梦赤子心'
  ];

  const ALL_SONG_NAMES = [
    '盛夏的果实', '最炫民族风', '双截棍', '大艺术家', '平凡之路', '我的新衣',
    '光年之外', '说散就散', '起风了', '年少有为', '漂洋过海来看你', '追梦赤子心',
    '夜曲', '稻香', '青花瓷', '七里香', '晴天', '简单爱', '告白气球', '听妈妈的话',
    '小幸运', '体面', '后来', '匆匆那年', '小苹果', '最炫小苹果', '荷塘月色',
    '月亮之上', '自由飞翔', '套马杆', '小跳蛙', '卡路里', '燃烧我的卡路里',
    '野狼disco', '芒种', '少年', '下山', '踏山河', '孤勇者', '星辰大海',
    '白月光与朱砂痣', '可可托海的牧羊人', '半生雪', '错位时空', '如愿', '孤勇者',
    '漠河舞厅', '这世界那么多人', '孤城', '天外来物', '踏鼓', '雪distance',
    '悬溺', '精卫', '罗生门', '海底', '借', '消愁', '像我这样的人',
    '南山南', '成都', '鼓楼', '理想三旬', '斑马斑马', '安和桥', '董小姐',
    '春风十里', '去大理', '关于郑州的记忆', '米店', '天空之城', '女儿情',
    '大鱼', '左手指月', '达拉崩吧', '万物生', '生如夏花', '蓝莲花',
    '曾经的你', '像风一样自由', '旅行', '时光', '漫步', '执着',
    '飞得更高', '怒放的生命', '春天里', '北京北京', '当我想你的时候',
    '存在', '一起摇摆', '花房姑娘', '一块红布', '假行僧', '新长征路上的摇滚'
  ];

  const ELIMINATION_EPISODES = {
    6: 60,
    9: 35,
    11: 20
  };

  const MERCH_EPISODES = [2, 6, 9];

  const MERCH_PRICING = {
    200: { solo: 0.20, cp: 0.15, passerby: 0.01 },
    100: { solo: 0.50, cp: 0.35, passerby: 0.05 },
    60: { solo: 0.70, cp: 0.45, passerby: 0.10 },
    20: { solo: 0.85, cp: 0.60, passerby: 0.20 }
  };

  const VENUE_TYPES = [
    { type: '顶级演播厅', cost: [30, 50], stageBonus: 0.30, audienceBonus: 0.30 },
    { type: '标准录制棚', cost: [15, 25], stageBonus: 0.15, audienceBonus: 0.15 },
    { type: '基础摄影棚', cost: [5, 10], stageBonus: 0.05, audienceBonus: 0.05 },
    { type: '训练基地', cost: [2, 5], stageBonus: 0, audienceBonus: 0, required: true },
    { type: '户外场地', cost: [20, 40], stageBonus: 0, audienceBonus: 0, topicBonus: 0.20 }
  ];

  const STAFF_TYPES = [
    { type: '顶级编导团队', cost: [20, 30], editBonus: 0.30, narrativeBonus: 0.30 },
    { type: '专业摄像团队', cost: [10, 20], visualBonus: 0.20, lensBonus: 0.20 },
    { type: '顶级造型团队', cost: [8, 15], imageBonus: 0.20, topicBonus: 0.10 },
    { type: '音乐制作团队', cost: [15, 25], musicBonus: 0.30, stageBonus: 0.20 },
    { type: '标准团队', cost: [5, 10], allBonus: 0.10 },
    { type: '实习团队', cost: [1, 3], allBonus: 0.05, errorRate: 0.15 }
  ];

  const SONG_TYPES = [
    { type: '大众流行', costRange: [400, 800] },
    { type: '年代金曲', costRange: [200, 400] },
    { type: 'DJ舞曲', costRange: [300, 600] },
    { type: '嘻哈说唱', costRange: [350, 700] },
    { type: 'dy热曲', costRange: [250, 500], maxPerSeason: 4 },
    { type: '小众原创', costRange: [400, 800], advanceEpisodes: 2 }
  ];

  // ============================================================
  // 事件池
  // ============================================================

  const EVENT_POOL = {
    initial_stage: [
      { id: 'IS01', desc: '忘词失误', type: 'initial_stage', severity: 'negative', minutes: 5, people: 1 },
      { id: 'IS02', desc: '破音事故', type: 'initial_stage', severity: 'negative', minutes: 3, people: 1 },
      { id: 'IS03', desc: '舞蹈失误', type: 'initial_stage', severity: 'negative', minutes: 3, people: 1 },
      { id: 'IS04', desc: '选座争议', type: 'initial_stage', severity: 'neutral', minutes: 15, people: 2 },
      { id: 'IS05', desc: '公司抱团', type: 'initial_stage', severity: 'positive', minutes: 10, people: [3, 5] },
      { id: 'IS06', desc: '独自角落', type: 'initial_stage', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'IS07', desc: '紧张手抖', type: 'initial_stage', severity: 'neutral', minutes: 4, people: 1 },
      { id: 'IS08', desc: '惊艳反转', type: 'initial_stage', severity: 'positive', minutes: 20, people: 1 },
      { id: 'IS09', desc: '导师分歧', type: 'initial_stage', severity: 'neutral', minutes: 13, people: 1 },
      { id: 'IS10', desc: '提前离场', type: 'initial_stage', severity: 'negative', minutes: 5, people: 2 },
      { id: 'IS11', desc: '设备故障', type: 'initial_stage', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'IS12', desc: '服装事故', type: 'initial_stage', severity: 'negative', minutes: 3, people: 1 },
      { id: 'IS13', desc: '即兴发挥', type: 'initial_stage', severity: 'positive', minutes: 7, people: 1 },
      { id: 'IS14', desc: '泪洒现场', type: 'initial_stage', severity: 'positive', minutes: 30, people: 1 },
      { id: 'IS15', desc: '撞歌尴尬', type: 'initial_stage', severity: 'neutral', minutes: 17, people: 2 },
      { id: 'IS16', desc: '忘动作', type: 'initial_stage', severity: 'negative', minutes: 5, people: 1 },
      { id: 'IS17', desc: '抢拍失误', type: 'initial_stage', severity: 'negative', minutes: 8, people: [1, 4] },
      { id: 'IS18', desc: '道具掉落', type: 'initial_stage', severity: 'neutral', minutes: 3, people: 1 },
      { id: 'IS19', desc: '走音严重', type: 'initial_stage', severity: 'negative', minutes: 7, people: 1 },
      { id: 'IS20', desc: '惊艳高音', type: 'initial_stage', severity: 'positive', minutes: 10, people: 1 },
      { id: 'IS21', desc: '舞蹈炸裂', type: 'initial_stage', severity: 'positive', minutes: 12, people: 1 },
      { id: 'IS22', desc: '原创展示', type: 'initial_stage', severity: 'positive', minutes: 18, people: 1 },
      { id: 'IS23', desc: '多国语言', type: 'initial_stage', severity: 'positive', minutes: 8, people: 1 },
      { id: 'IS24', desc: '特殊才艺', type: 'initial_stage', severity: 'positive', minutes: 15, people: 1 },
      { id: 'IS25', desc: '致敬经典', type: 'initial_stage', severity: 'positive', minutes: 14, people: 1 }
    ],
    practice_room: [
      { id: 'PR01', desc: '加练到深夜', type: 'practice_room', severity: 'positive', minutes: 13, people: 1 },
      { id: 'PR02', desc: '互相帮助', type: 'practice_room', severity: 'positive', minutes: 20, people: [2, 3] },
      { id: 'PR03', desc: '偷懒被抓', type: 'practice_room', severity: 'negative', minutes: 7, people: 1 },
      { id: 'PR04', desc: '情绪崩溃', type: 'practice_room', severity: 'negative', minutes: 27, people: 1 },
      { id: 'PR05', desc: '生病坚持', type: 'practice_room', severity: 'positive', minutes: 17, people: 1 },
      { id: 'PR06', desc: '编舞分歧', type: 'practice_room', severity: 'negative', minutes: 23, people: [3, 5] },
      { id: 'PR07', desc: '偷吃外卖', type: 'practice_room', severity: 'neutral', minutes: 8, people: [1, 2] },
      { id: 'PR08', desc: '家人来电', type: 'practice_room', severity: 'positive', minutes: 12, people: 1 },
      { id: 'PR09', desc: '枕头大战', type: 'practice_room', severity: 'positive', minutes: 15, people: [4, 6] },
      { id: 'PR10', desc: '失眠焦虑', type: 'practice_room', severity: 'negative', minutes: 10, people: 1 },
      { id: 'PR11', desc: '教学相长', type: 'practice_room', severity: 'positive', minutes: 18, people: 2 },
      { id: 'PR12', desc: '冷战对峙', type: 'practice_room', severity: 'negative', minutes: 13, people: 2 },
      { id: 'PR13', desc: '和解拥抱', type: 'practice_room', severity: 'positive', minutes: 12, people: 2 },
      { id: 'PR14', desc: '惊喜生日', type: 'practice_room', severity: 'positive', minutes: 30, people: 'multi' },
      { id: 'PR15', desc: '偷偷哭泣', type: 'practice_room', severity: 'negative', minutes: 8, people: 1 },
      { id: 'PR16', desc: '视频通话', type: 'practice_room', severity: 'positive', minutes: 13, people: 1 },
      { id: 'PR17', desc: '分享零食', type: 'practice_room', severity: 'positive', minutes: 10, people: [3, 5] },
      { id: 'PR18', desc: '争吵升级', type: 'practice_room', severity: 'negative', minutes: 17, people: 2 },
      { id: 'PR19', desc: '默默关注', type: 'practice_room', severity: 'neutral', minutes: 7, people: 2 },
      { id: 'PR20', desc: '摔倒受伤', type: 'practice_room', severity: 'negative', minutes: 12, people: 1 },
      { id: 'PR21', desc: '早起抢镜', type: 'practice_room', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'PR22', desc: '护肤分享', type: 'practice_room', severity: 'neutral', minutes: 17, people: 1 },
      { id: 'PR23', desc: '健身打卡', type: 'practice_room', severity: 'positive', minutes: 10, people: [1, 2] },
      { id: 'PR24', desc: '做饭翻车', type: 'practice_room', severity: 'neutral', minutes: 13, people: [1, 2] },
      { id: 'PR25', desc: '整理行李', type: 'practice_room', severity: 'neutral', minutes: 12, people: 1 },
      { id: 'PR26', desc: '写日记', type: 'practice_room', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'PR27', desc: '听音乐', type: 'practice_room', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'PR28', desc: '打电话', type: 'practice_room', severity: 'positive', minutes: 15, people: 1 },
      { id: 'PR29', desc: '玩游戏', type: 'practice_room', severity: 'positive', minutes: 20, people: [3, 5] },
      { id: 'PR30', desc: '敷面膜', type: 'practice_room', severity: 'neutral', minutes: 10, people: 'multi' },
      { id: 'PR31', desc: '按摩放松', type: 'practice_room', severity: 'positive', minutes: 12, people: 2 },
      { id: 'PR32', desc: '整理内务', type: 'practice_room', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'PR33', desc: '称体重', type: 'practice_room', severity: 'neutral', minutes: 8, people: 'multi' },
      { id: 'PR34', desc: '量身高', type: 'practice_room', severity: 'neutral', minutes: 13, people: 'multi' },
      { id: 'PR35', desc: '泡脚养生', type: 'practice_room', severity: 'neutral', minutes: 12, people: [2, 3] }
    ],
    performance: [
      { id: 'PF01', desc: '舞台事故', type: 'performance', severity: 'negative', minutes: 5, people: [1, 4] },
      { id: 'PF02', desc: '耳返脱落', type: 'performance', severity: 'negative', minutes: 3, people: 1 },
      { id: 'PF03', desc: '服装走光', type: 'performance', severity: 'negative', minutes: 3, people: 1 },
      { id: 'PF04', desc: '忘词救场', type: 'performance', severity: 'positive', minutes: 7, people: 1 },
      { id: 'PF05', desc: '破音救场', type: 'performance', severity: 'positive', minutes: 5, people: 1 },
      { id: 'PF06', desc: '互动过度', type: 'performance', severity: 'neutral', minutes: 8, people: 2 },
      { id: 'PF07', desc: '救场英雄', type: 'performance', severity: 'positive', minutes: 10, people: 2 },
      { id: 'PF08', desc: '临场改动作', type: 'performance', severity: 'positive', minutes: 6, people: 1 },
      { id: 'PF09', desc: '观众互动', type: 'performance', severity: 'positive', minutes: 13, people: [1, 3] },
      { id: 'PF10', desc: '道具失误', type: 'performance', severity: 'negative', minutes: 7, people: 1 },
      { id: 'PF11', desc: '灯光失误', type: 'performance', severity: 'negative', minutes: 4, people: 1 },
      { id: 'PF12', desc: '音响故障', type: 'performance', severity: 'negative', minutes: 12, people: [1, 4] },
      { id: 'PF13', desc: '摔倒爬起', type: 'performance', severity: 'positive', minutes: 7, people: 1 },
      { id: 'PF14', desc: '完美ending', type: 'performance', severity: 'positive', minutes: 5, people: 1 },
      { id: 'PF15', desc: '队友配合', type: 'performance', severity: 'positive', minutes: 8, people: 2 },
      { id: 'PF16', desc: '开场失误', type: 'performance', severity: 'negative', minutes: 5, people: 1 },
      { id: 'PF17', desc: '走位错误', type: 'performance', severity: 'negative', minutes: 7, people: 2 },
      { id: 'PF18', desc: '麦克风碰撞', type: 'performance', severity: 'negative', minutes: 3, people: 2 },
      { id: 'PF19', desc: '舞台滑倒', type: 'performance', severity: 'negative', minutes: 5, people: 1 },
      { id: 'PF20', desc: '服装脱落', type: 'performance', severity: 'negative', minutes: 3, people: 1 },
      { id: 'PF21', desc: '鞋子脱落', type: 'performance', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'PF22', desc: '头饰掉落', type: 'performance', severity: 'negative', minutes: 5, people: 1 },
      { id: 'PF23', desc: '眼泪失控', type: 'performance', severity: 'positive', minutes: 10, people: 1 },
      { id: 'PF24', desc: '笑场', type: 'performance', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'PF25', desc: '打嗝', type: 'performance', severity: 'neutral', minutes: 3, people: 1 },
      { id: 'PF26', desc: '咳嗽', type: 'performance', severity: 'negative', minutes: 3, people: 1 },
      { id: 'PF27', desc: '嗓子沙哑', type: 'performance', severity: 'negative', minutes: 8, people: 1 },
      { id: 'PF28', desc: '体力不支', type: 'performance', severity: 'negative', minutes: 7, people: 1 },
      { id: 'PF29', desc: '完美高音', type: 'performance', severity: 'positive', minutes: 10, people: 1 },
      { id: 'PF30', desc: '惊艳舞蹈', type: 'performance', severity: 'positive', minutes: 12, people: 1 },
      { id: 'PF31', desc: '情感爆发', type: 'performance', severity: 'positive', minutes: 15, people: 1 },
      { id: 'PF32', desc: '创意改编', type: 'performance', severity: 'positive', minutes: 13, people: [1, 4] },
      { id: 'PF33', desc: '跨界尝试', type: 'performance', severity: 'positive', minutes: 12, people: 1 },
      { id: 'PF34', desc: '突破自我', type: 'performance', severity: 'positive', minutes: 15, people: 1 },
      { id: 'PF35', desc: '团队默契', type: 'performance', severity: 'positive', minutes: 12, people: [3, 6] },
      { id: 'PF36', desc: '整齐划一', type: 'performance', severity: 'positive', minutes: 10, people: [3, 6] },
      { id: 'PF37', desc: '和声完美', type: 'performance', severity: 'positive', minutes: 10, people: [2, 4] },
      { id: 'PF38', desc: '说唱炸裂', type: 'performance', severity: 'positive', minutes: 10, people: [1, 2] }
    ],
    ranking: [
      { id: 'RK01', desc: '意外晋级', type: 'ranking', severity: 'positive', minutes: 10, people: 1 },
      { id: 'RK02', desc: '遗憾淘汰', type: 'ranking', severity: 'negative', minutes: 20, people: 1 },
      { id: 'RK03', desc: '安慰队友', type: 'ranking', severity: 'positive', minutes: 15, people: 2 },
      { id: 'RK04', desc: '强忍泪水', type: 'ranking', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'RK05', desc: '激动跳起', type: 'ranking', severity: 'positive', minutes: 5, people: 1 },
      { id: 'RK06', desc: '沉默接受', type: 'ranking', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'RK07', desc: '感谢粉丝', type: 'ranking', severity: 'positive', minutes: 13, people: 1 },
      { id: 'RK08', desc: '承诺努力', type: 'ranking', severity: 'positive', minutes: 10, people: 1 },
      { id: 'RK09', desc: '拥抱对手', type: 'ranking', severity: 'positive', minutes: 7, people: 2 },
      { id: 'RK10', desc: '独自离开', type: 'ranking', severity: 'negative', minutes: 12, people: 1 },
      { id: 'RK11', desc: '崩溃大哭', type: 'ranking', severity: 'negative', minutes: 15, people: 1 },
      { id: 'RK12', desc: '强颜欢笑', type: 'ranking', severity: 'neutral', minutes: 12, people: 1 },
      { id: 'RK13', desc: '不敢相信', type: 'ranking', severity: 'neutral', minutes: 8, people: 1 },
      { id: 'RK14', desc: '淡定接受', type: 'ranking', severity: 'neutral', minutes: 7, people: 1 },
      { id: 'RK15', desc: '鼓励他人', type: 'ranking', severity: 'positive', minutes: 10, people: 2 },
      { id: 'RK16', desc: '感谢导师', type: 'ranking', severity: 'positive', minutes: 10, people: 1 },
      { id: 'RK17', desc: '感谢队友', type: 'ranking', severity: 'positive', minutes: 10, people: [2, 4] },
      { id: 'RK18', desc: '回顾历程', type: 'ranking', severity: 'positive', minutes: 18, people: 1 },
      { id: 'RK19', desc: '展望未来', type: 'ranking', severity: 'positive', minutes: 12, people: 1 },
      { id: 'RK20', desc: '告别感言', type: 'ranking', severity: 'negative', minutes: 20, people: 1 }
    ],
    controversy: [
      { id: 'CV01', desc: '旧照曝光', type: 'controversy', severity: 'negative', minutes: 10, people: 1 },
      { id: 'CV02', desc: '言论争议', type: 'controversy', severity: 'negative', minutes: 15, people: 1 },
      { id: 'CV03', desc: '恋爱绯闻', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV04', desc: '整容质疑', type: 'controversy', severity: 'negative', minutes: 8, people: 1 },
      { id: 'CV05', desc: '学历质疑', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV06', desc: '背景质疑', type: 'controversy', severity: 'negative', minutes: 10, people: 1 },
      { id: 'CV07', desc: '排挤传闻', type: 'controversy', severity: 'negative', minutes: 17, people: [2, 3] },
      { id: 'CV08', desc: '耍大牌', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV09', desc: '假唱质疑', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV10', desc: '抄袭争议', type: 'controversy', severity: 'negative', minutes: 20, people: 1 },
      { id: 'CV11', desc: '年龄造假', type: 'controversy', severity: 'negative', minutes: 10, people: 1 },
      { id: 'CV12', desc: '人设崩塌', type: 'controversy', severity: 'negative', minutes: 18, people: 1 },
      { id: 'CV13', desc: '黑历史', type: 'controversy', severity: 'negative', minutes: 15, people: 1 },
      { id: 'CV14', desc: '负面新闻', type: 'controversy', severity: 'negative', minutes: 17, people: 1 },
      { id: 'CV15', desc: '丑闻曝光', type: 'controversy', severity: 'negative', minutes: 22, people: 1 },
      { id: 'CV16', desc: '争议行为', type: 'controversy', severity: 'negative', minutes: 15, people: 1 },
      { id: 'CV17', desc: '不当言论', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV18', desc: '态度问题', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV19', desc: '实力质疑', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV20', desc: '人气造假', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV21', desc: '数据异常', type: 'controversy', severity: 'negative', minutes: 10, people: 1 },
      { id: 'CV22', desc: '投票争议', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV23', desc: '排名质疑', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV24', desc: '晋级争议', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV25', desc: '淘汰不公', type: 'controversy', severity: 'negative', minutes: 15, people: 1 },
      { id: 'CV26', desc: '内幕传闻', type: 'controversy', severity: 'negative', minutes: 17, people: [1, 3] },
      { id: 'CV27', desc: '剧本质疑', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV28', desc: '剪辑争议', type: 'controversy', severity: 'negative', minutes: 12, people: 1 },
      { id: 'CV29', desc: '人设质疑', type: 'controversy', severity: 'negative', minutes: 13, people: 1 },
      { id: 'CV30', desc: '真实性质疑', type: 'controversy', severity: 'negative', minutes: 12, people: 1 }
    ]
  };

  const EVENT_TYPE_MAP = {
    1: ['initial_stage', 'practice_room'],
    2: ['practice_room'],
    3: ['practice_room', 'performance'],
    4: ['performance', 'ranking'],
    5: ['practice_room', 'ranking'],
    6: ['ranking', 'controversy'],
    7: ['practice_room', 'performance'],
    8: ['practice_room', 'performance', 'controversy'],
    9: ['ranking', 'controversy'],
    10: ['practice_room', 'performance', 'controversy'],
    11: ['ranking', 'performance', 'controversy'],
    12: ['performance', 'ranking', 'controversy']
  };

  const SCANDAL_TYPES = [
    { type: '法制类', probability: 0.10, fanEffect: { solo: -0.70, passerby: -0.90, anti: 1.00 } },
    { type: '履历造假类', probability: 0.20, fanEffect: { solo: -0.40, passerby: -0.70, anti: 0.80 } },
    { type: '情感类', probability: 0.30, fanEffect: { solo: -0.60, passerby: -0.40, anti: 0.50 } },
    { type: '性格类', probability: 0.30, fanEffect: { solo: -0.20, passerby: -0.30, anti: 0.40 } },
    { type: '经济纠纷类', probability: 0.10, fanEffect: { solo: -0.20, passerby: -0.30, anti: 0.40 } }
  ];

  const SCANDAL_DESCRIPTIONS = {
    '法制类': ['涉嫌酒驾被查', '被曝参与违法活动', '偷税漏税被调查'],
    '履历造假类': ['学历造假被揭发', '年龄信息不实', '过往经历虚构'],
    '情感类': ['被曝恋爱中', '前任爆料情感纠纷', '多人感情纠葛曝光'],
    '性格类': ['被指耍大牌', '与队友关系紧张', '对工作人员态度恶劣'],
    '经济纠纷类': ['被追讨欠款', '合同纠纷曝光', '商业投资失败']
  };

  // ============================================================
  // 工具函数
  // ============================================================

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // ============================================================
  // GameEngine 类
  // ============================================================

  class GameEngine {
    constructor() {
      this.state = null;
      this._usedNames = new Set();
      this._currentEvents = [];
      this._businessOpportunities = [];
      this._autoTrending = { wb: [], dy: [], db: [] };
      this._marketingLog = [];
      this._reversePsychology = { positive: 0, negative: 0 };
      this._finalPhase = { 
        step: 0, 
        announced1: [], 
        announced2: [],
        preRank1Done: false,
        preRank2Done: false,
        soloPerformances: [],
        finalRankAnnouncing: false,
        currentAnnounceRank: 10,
        topRevealPhase: null
      };
      this._merchSold = false;
      this._usedMentorNames = new Set();
    }

    init(mode = 'classic') {
      this._usedNames = new Set();
      this._marketingLog = [];
      this._reversePsychology = { positive: 0, negative: 0 };
      this._finalPhase = { 
        step: 0, 
        announced1: [], 
        announced2: [],
        preRank1Done: false,
        preRank2Done: false,
        soloPerformances: [],
        finalRankAnnouncing: false,
        currentAnnounceRank: 10,
        topRevealPhase: null
      };
      this._merchSold = false;
      this._currentEvents = [];
      this._businessOpportunities = [];
      this._autoTrending = { wb: [], dy: [], db: [] };
      this._usedMentorNames = new Set();

      const validModes = ['classic', 'challenge', 'hell'];
      const gameMode = validModes.includes(mode) ? mode : 'classic';

      const fundRoll = Math.random();
      let initialFunds;
      if (gameMode === 'challenge') {
        if (fundRoll < 0.15) initialFunds = randInt(1000, 1500);
        else if (fundRoll < 0.45) initialFunds = randInt(750, 1000);
        else if (fundRoll < 0.85) initialFunds = randInt(500, 750);
        else initialFunds = randInt(250, 499);
      } else if (gameMode === 'hell') {
        if (fundRoll < 0.15) initialFunds = randInt(500, 800);
        else if (fundRoll < 0.45) initialFunds = randInt(300, 500);
        else if (fundRoll < 0.85) initialFunds = randInt(200, 300);
        else initialFunds = randInt(100, 199);
      } else {
        if (fundRoll < 0.15) initialFunds = randInt(2000, 3000);
        else if (fundRoll < 0.45) initialFunds = randInt(1500, 2000);
        else if (fundRoll < 0.85) initialFunds = randInt(1000, 1500);
        else initialFunds = randInt(500, 999);
      }

      this.state = {
        funds: initialFunds,
        episode: 1,
        isFinal: false,
        gameMode: gameMode,
        trainees: this._generateTrainees(),
        mentorPool: this._generateMentorPool(),
        hiredMentors: [],
        sponsorPool: this._generateSponsorPool(),
        signedSponsors: [],
        episodeTimeUsed: 0,
        episodeMaxTime: 90,
        btsTimeUsed: 0,
        btsMaxTime: 20,
        programFans: 0,
        ratings: randFloat(0.5, 1.5),
        reputation: randFloat(50, 70),
        totalRevenue: 0,
        totalExpense: 0,
        editedTrainees: {},
        sponsorRequirements: [],
        editingTime: { studio: 0, practice: 0, dorm: 0, stage: 0, sponsor: 0 },
        btsEditingTime: { practice: 0, dorm: 0, sponsor: 0 },
        interactions: {},
        lockedBusiness: [],
        selectedVenue: null,
        selectedStaff: null,
        sponsorPenalties: [],
        musicLicenses: [],
        dyHotSongCount: 0,
        stageGroups: null,
        currentEpisodeEvents: null,
        currentBTSEvents: null,
        sponsorRequiredTraineeIds: new Set(),
        studioFollows: [],
        practiceMaterials: [],
        gatheredMaterials: {},
        editedMaterials: [],
        totalEditCounts: { problem: 0, ability: 0, cp: 0 },
        focusedTraineeIds: new Set(),
        scandals: [],
        unhandledScandals: 0,
        usedSongNames: new Set(),
        gambleAgreements: [],  // 对赌协议列表
        totalInviteCost: 0,    // 邀请艺人累计花费
        totalMarketingCount: 0, // 购买营销次数
        totalBusinessAccept: 0, // 接受商务次数
        invitedArtists: []
      };

      this._initSponsorRequirements();
      
      // 【修复3】初期自动扣除默认场地和工作人员费用
      this._deductInitialCosts();
      
      this._updateProgramFans();
      this._updateRatings();

      // 计算赞助商广告时长
      this.state.sponsorAdTime = this.calculateSponsorAdTime();

      return this.state;
    }

    _generateTrainees() {
      const trainees = [];
      let idCounter = 1;

      for (const company of LARGE_COMPANIES) {
        const count = randInt(0, 5);
        for (let i = 0; i < count; i++) {
          trainees.push(this._createTrainee(idCounter++, company, 'company'));
        }
      }

      for (const company of MEDIUM_COMPANIES) {
        const count = randInt(1, 3);
        for (let i = 0; i < count; i++) {
          trainees.push(this._createTrainee(idCounter++, company, 'company'));
        }
      }

      for (const company of SMALL_COMPANIES) {
        const count = randInt(1, 5);
        for (let i = 0; i < count; i++) {
          trainees.push(this._createTrainee(idCounter++, company, 'company'));
        }
      }

      const personalCount = randInt(6, 8);
      for (let i = 0; i < personalCount; i++) {
        trainees.push(this._createTrainee(idCounter++, '个人练习生', 'individual'));
      }

      const sponsorCount = clamp(100 - trainees.length, 8, 10);
      for (let i = 0; i < sponsorCount; i++) {
        const company = pick([...LARGE_COMPANIES, ...MEDIUM_COMPANIES, ...SMALL_COMPANIES]);
        trainees.push(this._createTrainee(idCounter++, company, 'sponsor'));
      }

      while (trainees.length < 100) {
        const company = pick([...LARGE_COMPANIES, ...MEDIUM_COMPANIES, ...SMALL_COMPANIES]);
        trainees.push(this._createTrainee(idCounter++, company, 'company'));
      }

      while (trainees.length > 100) {
        const idx = trainees.findIndex(t => t.type !== 'sponsor');
        if (idx >= 0) trainees.splice(idx, 1);
        else break;
      }

      this._assignGrades(trainees);
      trainees.forEach((t, idx) => {
        t.rank = idx + 1;
        t.initialRank = idx + 1;
      });
      return trainees;
    }

    _createTrainee(id, company, type) {
      const hasOverseas = Math.random() < 0.2;
      const name = this._generateName(hasOverseas);
      const personalities = pickN(PERSONALITIES, randInt(1, 2));
      const selectedExperiences = pickN(EXPERIENCES, randInt(1, 3));

      const hasDebutExperience = selectedExperiences.some(exp =>
        exp.name.includes('出道') || exp.name.includes('选秀')
      );
      const hasTriggerExp = selectedExperiences.some(exp => exp.triggersStageName);

      const trainee = {
        id: id,
        name: name,
        stageName: (hasOverseas || hasTriggerExp) && Math.random() < 0.2 ? pick(STAGE_NAMES) : null,
        company: company,
        type: type,
        grade: 'C',
        abilities: {
          look: randInt(1, 100),
          sing: randInt(1, 100),
          dance: randInt(1, 100),
          rap: randInt(1, 100),
          create: randInt(1, 100),
          variety: randInt(1, 100)
        },
        otherAbilities: {
          stamina: randInt(1, 100),
          wealth: randInt(1, 100),
          education: randInt(1, 100),
          stressResistance: randInt(1, 100),
          learningAbility: randInt(1, 100)
        },
        personalities: personalities,
        experiences: selectedExperiences.map(exp => exp.name),
        fans: hasDebutExperience
          ? { solo: 100, cp: 50, passerby: 200, anti: 50 }
          : { solo: 10, cp: 50, passerby: 50, anti: 50 },
        rank: 0,
        eliminated: false,
        debuted: false
      };

      for (const exp of selectedExperiences) {
        if (exp.bonuses) {
          for (const [key, value] of Object.entries(exp.bonuses)) {
            if (trainee.abilities.hasOwnProperty(key)) {
              trainee.abilities[key] = clamp(trainee.abilities[key] + value, 1, 100);
            } else if (trainee.otherAbilities.hasOwnProperty(key)) {
              trainee.otherAbilities[key] = clamp(trainee.otherAbilities[key] + value, 1, 100);
            }
          }
        }
        if (exp.randomBonus) {
          if (exp.randomBonus === 'sing_or_dance') {
            const targetKey = Math.random() < 0.5 ? 'sing' : 'dance';
            trainee.abilities[targetKey] = clamp(trainee.abilities[targetKey] + 10, 1, 100);
          } else if (exp.randomBonus === 'create') {
            trainee.abilities.create = clamp(trainee.abilities.create + 5, 1, 100);
          }
        }
        if (exp.extraFans) {
          trainee.fans.passerby += randInt(50, 150);
        }
        if (exp.topicBonus) {
          trainee.fans.passerby += randInt(20, 80);
        }
      }

      return trainee;
    }

    generateTraineeIntroduction(trainee) {
      if (!trainee) return '';

      const intros = [];

      // 粉圈构成分析（含打投能力）
      const fans = trainee.fans || { solo: 0, cp: 0, passerby: 0, anti: 0 };
      const totalFans = fans.solo + fans.cp + fans.passerby;
      const soloRatio = totalFans > 0 ? (fans.solo / totalFans * 100).toFixed(1) : 0;
      const cpRatio = totalFans > 0 ? (fans.cp / totalFans * 100).toFixed(1) : 0;
      const passerbyRatio = totalFans > 0 ? (fans.passerby / totalFans * 100).toFixed(1) : 0;
      const antiRatio = totalFans > 0 ? (fans.anti / (totalFans + fans.anti) * 100).toFixed(1) : 0;
      
      // 打投能力计算：唯粉(1.0) > CP粉(0.6) > 路人粉(0.2)
      const votingPower = {
        solo: fans.solo * 1.0,
        cp: fans.cp * 0.6,
        passerby: fans.passerby * 0.2
      };
      const totalVotingPower = votingPower.solo + votingPower.cp + votingPower.passerby;
      const votingRatios = {
        solo: totalVotingPower > 0 ? (votingPower.solo / totalVotingPower * 100).toFixed(1) : 0,
        cp: totalVotingPower > 0 ? (votingPower.cp / totalVotingPower * 100).toFixed(1) : 0,
        passerby: totalVotingPower > 0 ? (votingPower.passerby / totalVotingPower * 100).toFixed(1) : 0
      };
      
      // 打投能力TOP类型
      const votingRank = Object.entries(votingPower).sort((a, b) => b[1] - a[1]);
      const topVotingType = votingRank[0][0];
      const votingTypeNames = { solo: '唯粉', cp: 'CP粉', passerby: '路人粉' };
      
      // 粉圈构成描述
      let fanComposition = '';
      if (soloRatio >= 40) {
        fanComposition = `唯粉占比${soloRatio}%，核心粉丝粘性极高`;
      } else if (cpRatio >= 40) {
        fanComposition = `CP粉占比${cpRatio}%，粉丝群体互动性强`;
      } else if (passerbyRatio >= 50) {
        fanComposition = `路人粉占比${passerbyRatio}%，国民度潜力大`;
      } else {
        fanComposition = `唯粉${soloRatio}%、CP粉${cpRatio}%、路人粉${passerbyRatio}%构成均衡`;
      }
      if (antiRatio > 10) {
        fanComposition += `，但黑粉占比${antiRatio}%需关注`;
      }
      intros.push(`【粉圈构成】${fanComposition}。`);
      intros.push(`【打投能力】${votingTypeNames[topVotingType]}贡献${votingRatios[topVotingType]}%打投力，唯粉${votingRatios.solo}%/CP粉${votingRatios.cp}%/路人粉${votingRatios.passerby}%。`);

      // 性格分析
      const personalityDesc = trainee.personality || '沉稳内敛';
      intros.push(`【性格特点】${trainee.name}性格${personalityDesc}，在团队中独具魅力。`);

      // 过往经历
      const experiences = [];
      if (trainee.hasDebut || trainee.exDebut) {
        experiences.push('曾出道');
      }
      if (trainee.hasVarietyShow || trainee.exVariety) {
        experiences.push('有综艺经验');
      }
      if (trainee.hasActing || trainee.exActing) {
        experiences.push('有演艺经历');
      }
      if (experiences.length > 0) {
        intros.push(`【过往经历】${trainee.name}${experiences.join('、')}，舞台经验丰富。`);
      } else {
        intros.push(`【过往经历】${trainee.name}作为新人，在节目中不断成长。`);
      }

      // 业务能力
      const abilities = trainee.abilities || {};
      const topAbility = Object.entries(abilities).sort((a, b) => b[1] - a[1])[0];
      if (topAbility) {
        const abilityNames = { look: '颜值', sing: '声乐', dance: '舞蹈', rap: '说唱', create: '创作', variety: '综艺感' };
        const abilityName = abilityNames[topAbility[0]] || topAbility[0];
        if (topAbility[1] >= 90) {
          intros.push(`【业务能力】${abilityName}实力顶尖，是本季最强${abilityName}担当之一。`);
        } else if (topAbility[1] >= 80) {
          intros.push(`【业务能力】${abilityName}能力出色，备受导师认可。`);
        } else if (topAbility[1] >= 70) {
          intros.push(`【业务能力】${abilityName}表现稳定，持续进步中。`);
        }
      }

      // 公司背景
      if (trainee.company && trainee.company !== '个人练习生') {
        intros.push(`来自${trainee.company}的${trainee.name}代表公司出征。`);
      }

      // 恭喜语
      intros.push(`恭喜${trainee.name}！`);

      return intros.slice(0, 8).join('\n');
    }

    _generateName(hasOverseas) {
      let attempts = 0;
      while (attempts < 100) {
        const surname = pick(SURNAMES);
        const givenName = pick(GIVEN_NAMES);
        const fullName = surname + givenName;
        if (!this._usedNames.has(fullName)) {
          this._usedNames.add(fullName);
          return fullName;
        }
        attempts++;
      }
      const surname = pick(SURNAMES);
      const givenName = pick(GIVEN_NAMES);
      const fullName = surname + givenName + randInt(1, 99);
      this._usedNames.add(fullName);
      return fullName;
    }

    _assignGrades(trainees) {
      const sorted = [...trainees].sort((a, b) => {
        const avgA = this._getAverageAbility(a);
        const avgB = this._getAverageAbility(b);
        return avgB - avgA;
      });
      const gradeDistribution = {
        'A': 0.05,
        'B': 0.15,
        'C': 0.35,
        'D': 0.30,
        'F': 0.15
      };
      let idx = 0;
      for (const [grade, ratio] of Object.entries(gradeDistribution)) {
        const count = Math.round(100 * ratio);
        for (let i = 0; i < count && idx < sorted.length; i++) {
          sorted[idx].grade = grade;
          idx++;
        }
      }
    }

    _getAverageAbility(trainee) {
      const a = trainee.abilities;
      return (a.look + a.sing + a.dance + a.rap + a.create + a.variety) / 6;
    }

    _getMaxAbility(trainee) {
      const a = trainee.abilities;
      return Math.max(a.look, a.sing, a.dance, a.rap, a.create, a.variety);
    }

    _generateMentorPool() {
      const mentors = [];
      const tiers = [
        { tier: 'SSS', cost: randInt(2000, 3000), effect: 50, count: 1 },
        { tier: 'SS', cost: randInt(1500, 2000), effect: 30, count: 1 },
        { tier: 'S', cost: randInt(1200, 1500), effect: 25, count: 2 },
        { tier: 'A', cost: randInt(900, 1200), effect: 20, count: 3 },
        { tier: 'B', cost: randInt(500, 900), effect: 15, count: 4 },
        { tier: 'C', cost: 300, effect: 10, count: 5 }
      ];
      const availableNames = [...MENTOR_NAMES_POOL];
      for (const tierConfig of tiers) {
        for (let i = 0; i < tierConfig.count; i++) {
          const specialty = pick(MENTOR_SPECIALTIES);
          let name;
          if (availableNames.length > 0) {
            const nameIdx = randInt(0, availableNames.length - 1);
            name = availableNames.splice(nameIdx, 1)[0];
          } else {
            name = '导师' + randInt(1, 999);
          }
          mentors.push({
            id: generateId(),
            name: name,
            tier: tierConfig.tier,
            cost: tierConfig.cost,
            effect: tierConfig.effect,
            specialty: specialty,
            strictness: pick(['mild', 'moderate', 'stern']),
            topicHeat: randInt(10, 100),
            favorability: randInt(30, 70)
          });
        }
      }
      // 确保声乐、舞蹈、说唱、host至少各2人
      const requiredSpecialties = ['vocal', 'dance', 'rap', 'host'];
      const specialtyCount = {};
      mentors.forEach(m => {
        specialtyCount[m.specialty] = (specialtyCount[m.specialty] || 0) + 1;
      });
      let assignIdx = 0;
      for (const sp of requiredSpecialties) {
        while ((specialtyCount[sp] || 0) < 2 && assignIdx < mentors.length) {
          const oldSp = mentors[assignIdx].specialty;
          if ((specialtyCount[oldSp] || 0) > 2) {
            specialtyCount[oldSp]--;
            mentors[assignIdx].specialty = sp;
            specialtyCount[sp] = (specialtyCount[sp] || 0) + 1;
          }
          assignIdx++;
        }
      }
      return mentors;
    }

    _generateSponsorPool() {
      const sponsors = [];
      const usedNames = new Set();
      for (const type of SPONSOR_TYPES) {
        const count = randInt(2, 4);
        const namePool = SPONSOR_NAMES[type];
        for (let i = 0; i < count; i++) {
          let name;
          do {
            name = pick(namePool);
          } while (usedNames.has(name));
          usedNames.add(name);
          const amountRanges = {
            '快消': [100, 300],
            '科技': [200, 500],
            '时尚': [150, 400],
            '金融': [300, 600],
            '娱乐': [100, 250],
            '汽车': [500, 1000]
          };
          const amount = randInt(...amountRanges[type]);
          sponsors.push({
            id: generateId(),
            name: name,
            type: type,
            amount: amount,
            requirements: [],
            satisfaction: 50
          });
        }
      }
      return sponsors;
    }

    getTrainees() {
      return this.state ? this.state.trainees.filter(t => !t.eliminated) : [];
    }

    getAllTrainees() {
      return this.state ? this.state.trainees : [];
    }

    getMentorPool() {
      return this.state ? this.state.mentorPool : [];
    }

    getHiredMentors() {
      return this.state ? this.state.hiredMentors : [];
    }

    getSponsorPool() {
      return this.state ? this.state.sponsorPool : [];
    }

    getSignedSponsors() {
      return this.state ? this.state.signedSponsors : [];
    }

    getSponsorsByCategory() {
      if (!this.state) return {};
      const categories = {};
      for (const type of SPONSOR_TYPES) {
        categories[type] = {
          available: this.state.sponsorPool.filter(s => s.type === type && !this.state.signedSponsors.find(ss => ss.id === s.id)),
          signed: this.state.signedSponsors.filter(s => s.type === type)
        };
      }
      return categories;
    }

    getFunds() {
      return this.state ? this.state.funds : 0;
    }

    getCurrentEpisode() {
      return this.state ? this.state.episode : 0;
    }

    getAvailableTime() {
      if (!this.state) return 0;
      const sponsorAdTime = this.state.sponsorAdTime || 0;
      return this.state.episodeMaxTime - sponsorAdTime - this.state.episodeTimeUsed;
    }

    getBTSAvailableTime() {
      if (!this.state) return 0;
      return this.state.btsMaxTime - this.state.btsTimeUsed;
    }

    getProgramFans() {
      return this.state ? this.state.programFans : 0;
    }

    getRatings() {
      return this.state ? this.state.ratings : 0;
    }

    getReputation() {
      return this.state ? this.state.reputation : 0;
    }

    getState() {
      return this.state;
    }

    getGameMode() {
      return this.state ? this.state.gameMode : 'classic';
    }

    getTraineeLabel(traineeId) {
      if (!this.state) return '';
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return '';
      if (trainee.type === 'sponsor') return '赞助';
      return '';
    }

    toggleFocusTrainee(traineeId) {
      if (!this.state) return { success: false };
      if (this.state.focusedTraineeIds.has(traineeId)) {
        this.state.focusedTraineeIds.delete(traineeId);
        return { success: true, focused: false };
      } else {
        this.state.focusedTraineeIds.add(traineeId);
        return { success: true, focused: true };
      }
    }

    isFocusedTrainee(traineeId) {
      return this.state && this.state.focusedTraineeIds.has(traineeId);
    }

    getTraineeDetail(traineeId) {
      if (!this.state) return null;
      return this.state.trainees.find(t => t.id === traineeId) || null;
    }

    saveGame() {
      if (!this.state) return { success: false, message: '游戏未初始化，无法存档' };
      try {
        const saveData = {
          gameState: this.state,
          _usedNames: Array.from(this._usedNames),
          _currentEvents: this._currentEvents,
          _businessOpportunities: this._businessOpportunities,
          _autoTrending: this._autoTrending,
          _marketingLog: this._marketingLog,
          _reversePsychology: this._reversePsychology,
          _finalPhase: this._finalPhase,
          _merchSold: this._merchSold
        };
        localStorage.setItem('audition_director_save', JSON.stringify(saveData));
        return { success: true, message: '存档成功' };
      } catch (e) {
        return { success: false, message: '存档失败：' + e.message };
      }
    }

    loadGame() {
      try {
        const raw = localStorage.getItem('audition_director_save');
        if (!raw) return { success: false, message: '没有找到存档' };
        const saveData = JSON.parse(raw);
        this.state = saveData.gameState;
        this._usedNames = new Set(saveData._usedNames || []);
        this._currentEvents = saveData._currentEvents || [];
        this._businessOpportunities = saveData._businessOpportunities || [];
        this._autoTrending = saveData._autoTrending || { wb: [], dy: [], db: [] };
        this._marketingLog = saveData._marketingLog || [];
        this._reversePsychology = saveData._reversePsychology || { positive: 0, negative: 0 };
        this._finalPhase = saveData._finalPhase || { round: 0, announced1: [], announced2: [] };
        this._merchSold = saveData._merchSold || false;
        if (!this.state.editedTrainees) this.state.editedTrainees = {};
        if (!this.state.sponsorRequirements) this.state.sponsorRequirements = [];
        if (!this.state.editingTime) this.state.editingTime = { studio: 0, practice: 0, dorm: 0, stage: 0, sponsor: 0 };
        if (!this.state.btsEditingTime) this.state.btsEditingTime = { practice: 0, dorm: 0, sponsor: 0 };
        if (!this.state.interactions) this.state.interactions = {};
        if (!this.state.lockedBusiness) this.state.lockedBusiness = [];
        if (!this.state.selectedVenue) this.state.selectedVenue = null;
        if (!this.state.selectedStaff) this.state.selectedStaff = null;
        if (!this.state.sponsorPenalties) this.state.sponsorPenalties = [];
        if (!this.state.musicLicenses) this.state.musicLicenses = [];
        if (this.state.dyHotSongCount === undefined) this.state.dyHotSongCount = 0;
        return { success: true, message: '读档成功', state: this.state };
      } catch (e) {
        return { success: false, message: '读档失败：' + e.message };
      }
    }

    hasSave() {
      try {
        return localStorage.getItem('audition_director_save') !== null;
      } catch (e) {
        return false;
      }
    }

    deleteSave() {
      try {
        localStorage.removeItem('audition_director_save');
        return { success: true, message: '存档已删除' };
      } catch (e) {
        return { success: false, message: '删除存档失败：' + e.message };
      }
    }

    hireMentor(mentorId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const mentor = this.state.mentorPool.find(m => m.id === mentorId);
      if (!mentor) return { success: false, message: '导师不存在' };
      if (this.state.hiredMentors.find(m => m.id === mentorId)) {
        return { success: false, message: '已雇佣该导师' };
      }
      if (this.state.hiredMentors.length >= 6) {
        return { success: false, message: '最多雇佣6名导师' };
      }
      if (this.state.funds < mentor.cost) {
        return { success: false, message: '资金不足' };
      }
      this.state.funds -= mentor.cost;
      this.state.totalExpense += mentor.cost;
      this.state.hiredMentors.push({ ...mentor });
      this.state.reputation = clamp(this.state.reputation + mentor.topicHeat * 0.1, 0, 100);
      return { success: true, message: `成功雇佣导师 ${mentor.name}`, mentor: mentor };
    }

    canStartShow() {
      if (!this.state) return { canStart: false, reason: '游戏未初始化' };
      if (this.state.hiredMentors.length < 4) {
        return { canStart: false, reason: `需要至少4名导师（当前${this.state.hiredMentors.length}名）` };
      }
      const coveredSpecialties = new Set(this.state.hiredMentors.map(m => m.specialty));
      const requiredSpecialties = ['vocal', 'dance', 'rap'];
      const missing = requiredSpecialties.filter(s => !coveredSpecialties.has(s));
      if (missing.length > 0) {
        const nameMap = { vocal: '声乐', dance: '舞蹈', rap: 'Rap' };
        return { canStart: false, reason: `需要覆盖声乐/舞蹈/Rap专业（缺少：${missing.map(s => nameMap[s]).join('、')}）` };
      }
      const hasHost = coveredSpecialties.has('host') || coveredSpecialties.has('comprehensive');
      if (!hasHost) {
        return { canStart: false, reason: '需要至少1名国民制作人代表（主持人/PD角色）' };
      }
      return { canStart: true, reason: '满足开播条件' };
    }

    signSponsor(sponsorId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const sponsor = this.state.sponsorPool.find(s => s.id === sponsorId);
      if (!sponsor) return { success: false, message: '赞助商不存在' };
      if (this.state.signedSponsors.find(s => s.id === sponsorId)) {
        return { success: false, message: '已签约该赞助商' };
      }
      const mutuallyExclusiveTypes = new Set(['金融', '汽车']);
      if (mutuallyExclusiveTypes.has(sponsor.type) && this.state.signedSponsors.some(s => s.type === sponsor.type)) {
        const existing = this.state.signedSponsors.find(s => s.type === sponsor.type);
        return { success: false, message: `${sponsor.type}类品牌只能选择一个，已签约${existing.name}` };
      }
      this.state.funds += sponsor.amount;
      this.state.totalRevenue += sponsor.amount;
      this.state.signedSponsors.push({ ...sponsor, signedEpisode: this.state.episode });
      this.state.sponsorAdTime = this.calculateSponsorAdTime();
      return { success: true, message: `成功签约赞助商 ${sponsor.name}，获得${sponsor.amount}万`, sponsor: sponsor };
    }

    isSponsorRequiredTrainee(traineeId) {
      if (!this.state || !this.state.sponsorRequiredTraineeIds) return false;
      return this.state.sponsorRequiredTraineeIds.has(traineeId);
    }

    applyEditing(traineeId, option, isPerformance) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return { success: false, message: '练习生不存在' };
      if (trainee.eliminated) return { success: false, message: '练习生已淘汰' };
      const options = isPerformance ? EDITING_OPTIONS_PERFORMANCE : EDITING_OPTIONS_INITIAL;
      const editOption = options.find(o => o.key === option);
      if (!editOption) return { success: false, message: '无效的剪辑选项' };
      if (this.state.episodeTimeUsed + editOption.minutes > this.state.episodeMaxTime) {
        return { success: false, message: '时长不足' };
      }
      const effects = editOption.effects;
      for (const [key, value] of Object.entries(effects)) {
        if (trainee.fans.hasOwnProperty(key)) {
          trainee.fans[key] = Math.max(0, trainee.fans[key] + Math.round(trainee.fans[key] * value));
        }
      }
      this.state.episodeTimeUsed += editOption.minutes;
      const epKey = String(this.state.episode);
      if (!this.state.editedTrainees[epKey]) {
        this.state.editedTrainees[epKey] = new Set();
      }
      this.state.editedTrainees[epKey].add(traineeId);
      return {
        success: true,
        message: `已对 ${trainee.name} 应用${editOption.label}剪辑`,
        option: editOption,
        trainee: trainee
      };
    }

    filterTrainees(filters) {
      if (!this.state) return [];
      let result = this.state.trainees.filter(t => !t.eliminated);
      if (filters.company) {
        result = result.filter(t => t.company === filters.company);
      }
      if (filters.abilities && filters.abilities.length > 0) {
        for (const filter of filters.abilities) {
          result = result.filter(t => {
            const val = t.abilities[filter.key] || t.otherAbilities[filter.key] || 0;
            return val >= filter.min;
          });
        }
      }
      if (filters.isSponsor === true) {
        result = result.filter(t => t.type === 'sponsor');
      } else if (filters.isSponsor === false) {
        result = result.filter(t => t.type !== 'sponsor');
      }
      if (filters.sortBy) {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        result.sort((a, b) => {
          let valA, valB;
          if (filters.sortBy === 'rank') {
            valA = a.rank; valB = b.rank;
          } else if (filters.sortBy === 'fans') {
            valA = a.fans.solo + a.fans.cp + a.fans.passerby;
            valB = b.fans.solo + b.fans.cp + b.fans.passerby;
          } else if (filters.sortBy === 'averageAbility') {
            valA = this._getAverageAbility(a); valB = this._getAverageAbility(b);
          } else if (filters.sortBy === 'grade') {
            const gradeOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'F': 5 };
            valA = gradeOrder[a.grade] || 6; valB = gradeOrder[b.grade] || 6;
          } else if (a.abilities.hasOwnProperty(filters.sortBy)) {
            valA = a.abilities[filters.sortBy]; valB = b.abilities[filters.sortBy];
          } else if (a.otherAbilities && a.otherAbilities.hasOwnProperty(filters.sortBy)) {
            valA = a.otherAbilities[filters.sortBy]; valB = b.otherAbilities[filters.sortBy];
          } else {
            return 0;
          }
          return (valA - valB) * order;
        });
      }
      return result;
    }

    getAvailableTrainees(episode) {
      if (!this.state) return [];
      const editedSet = new Set();
      for (let ep = 1; ep < episode; ep++) {
        const epKey = String(ep);
        const prevEdited = this.state.editedTrainees[epKey];
        if (prevEdited) {
          for (const id of prevEdited) {
            editedSet.add(id);
          }
        }
      }
      return this.state.trainees.filter(t => {
        if (t.eliminated) return false;
        if (editedSet.has(t.id)) return false;
        return true;
      });
    }

    batchApplyEditing(traineeIds, option, isPerformance) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const options = isPerformance ? EDITING_OPTIONS_PERFORMANCE : EDITING_OPTIONS_INITIAL;
      const editOption = options.find(o => o.key === option);
      if (!editOption) return { success: false, message: '无效的剪辑选项' };
      const totalMinutes = editOption.minutes * traineeIds.length;
      if (this.state.episodeTimeUsed + totalMinutes > this.state.episodeMaxTime) {
        return { success: false, message: '时长不足' };
      }
      const results = [];
      for (const traineeId of traineeIds) {
        const trainee = this.state.trainees.find(t => t.id === traineeId);
        if (!trainee || trainee.eliminated) continue;
        const effects = editOption.effects;
        for (const [key, value] of Object.entries(effects)) {
          if (trainee.fans.hasOwnProperty(key)) {
            trainee.fans[key] = Math.max(0, trainee.fans[key] + Math.round(trainee.fans[key] * value));
          }
        }
        const epKey = String(this.state.episode);
        if (!this.state.editedTrainees[epKey]) {
          this.state.editedTrainees[epKey] = new Set();
        }
        this.state.editedTrainees[epKey].add(traineeId);
        results.push({ traineeId: trainee.id, traineeName: trainee.name });
      }
      this.state.episodeTimeUsed += totalMinutes;
      return {
        success: true,
        message: `批量剪辑完成，共处理${results.length}人，消耗${totalMinutes}分钟`,
        results: results,
        totalMinutes: totalMinutes
      };
    }

    applyNaturalFanGrowth() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const episode = this.state.episode;
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const growthDetails = [];
      for (const trainee of activeTrainees) {
        if (episode <= 5) {
          const soloGrowth = Math.max(500, Math.round(trainee.fans.solo * 0.15));
          const passerbyGrowth = Math.max(1000, Math.round(trainee.fans.passerby * 0.20));
          const cpGrowth = Math.max(150, Math.round(trainee.fans.cp * 0.20));
          trainee.fans.solo += soloGrowth;
          trainee.fans.passerby += passerbyGrowth;
          trainee.fans.cp += cpGrowth;
          growthDetails.push({
            traineeId: trainee.id,
            traineeName: trainee.name,
            soloGrowth: soloGrowth,
            passerbyGrowth: passerbyGrowth,
            cpGrowth: cpGrowth
          });
        } else {
          const soloGrowth = Math.round(trainee.fans.solo * 0.10);
          const passerbyGrowth = Math.round(trainee.fans.passerby * 0.10);
          const cpGrowth = Math.round(trainee.fans.cp * 0.05);
          trainee.fans.solo += soloGrowth;
          trainee.fans.passerby += passerbyGrowth;
          trainee.fans.cp += cpGrowth;
          growthDetails.push({
            traineeId: trainee.id,
            traineeName: trainee.name,
            soloGrowth: soloGrowth,
            passerbyGrowth: passerbyGrowth,
            cpGrowth: cpGrowth
          });
        }
      }
      return { success: true, message: '自然涨粉完成', details: growthDetails };
    }

    applyEditingFanGrowth(traineeId, totalMinutes, cpMinutes) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return { success: false, message: '练习生不存在' };
      const passerbyGain = totalMinutes * 10000;
      const soloGain = totalMinutes * 1000;
      const cpGain = (cpMinutes || 0) * 2000;
      const antiGain = totalMinutes * 500;
      trainee.fans.passerby += passerbyGain;
      trainee.fans.solo += soloGain;
      trainee.fans.cp += cpGain;
      trainee.fans.anti += antiGain;
      return {
        success: true,
        message: `剪辑涨粉完成：${trainee.name}`,
        details: { passerbyGain, soloGain, cpGain, antiGain }
      };
    }

    batchApplyEditingFanGrowth(growthData) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const results = [];
      for (const data of growthData) {
        const { traineeId, totalMinutes, cpMinutes } = data;
        const result = this.applyEditingFanGrowth(traineeId, totalMinutes, cpMinutes);
        if (result.success) {
          results.push({ traineeId, ...result.details });
        }
      }
      return { success: true, message: `批量剪辑涨粉完成，共处理${results.length}人`, results: results };
    }

    // ========== 邀请外部艺人 ==========

    inviteArtist(artistType) {
      if (!this.state) return { success: false, message: '游戏未初始化' };

      const artistConfig = {
        star: { name: '当红爱豆', cost: 4000, ratingBoost: 3, passerbyBoost: 0.10, cpBoost: 0.15, soloBoost: 0.05 },
        singer: { name: '实力唱将', cost: 2500, ratingBoost: 2, passerbyBoost: 0.07, cpBoost: 0.10, soloBoost: 0.05 },
        cList: { name: '三线艺人', cost: 1000, ratingBoost: 0.5, passerbyBoost: 0.03, cpBoost: 0.05, soloBoost: 0.02 },
        influencer: { name: '素人网红', cost: 400, ratingBoost: 0, passerbyBoost: 0, cpBoost: 0.02, soloBoost: 0.01 }
      };

      const config = artistConfig[artistType];
      if (!config) return { success: false, message: '无效的艺人类型' };

      if (this.state.funds < config.cost) {
        return { success: false, message: '资金不足，需要' + config.cost + '万' };
      }

      // 检查是否已邀请同类型
      if (this.state.invitedArtists.find(a => a.type === artistType)) {
        return { success: false, message: '本期已邀请过' + config.name };
      }

      this.state.funds -= config.cost;
      this.state.totalExpense += config.cost;
      this.state.totalInviteCost += config.cost;

      const artist = {
        id: generateId(),
        type: artistType,
        name: config.name,
        cost: config.cost,
        ratingBoost: config.ratingBoost,
        passerbyBoost: config.passerbyBoost,
        cpBoost: config.cpBoost,
        soloBoost: config.soloBoost,
        episode: this.state.episode
      };

      this.state.invitedArtists.push(artist);

      return { success: true, message: '成功邀请' + config.name + '，花费' + config.cost + '万', artist: artist };
    }

    getInvitedArtists() {
      if (!this.state) return [];
      return this.state.invitedArtists || [];
    }

    getArtistOptions() {
      return [
        { type: 'star', name: '当红爱豆', cost: 4000, desc: '收视率+3pp，路人粉+10%，CP粉+15%，唯粉+5%' },
        { type: 'singer', name: '实力唱将', cost: 2500, desc: '收视率+2pp，路人粉+7%，CP粉+10%，唯粉+5%' },
        { type: 'cList', name: '三线艺人', cost: 1000, desc: '收视率+0.5pp，路人粉+3%，CP粉+5%，唯粉+2%' },
        { type: 'influencer', name: '素人网红', cost: 400, desc: '收视率无增益，CP粉+2%，唯粉+1%' }
      ];
    }

    calculateVotePower(trainee) {
      return trainee.fans.solo * 5000 + trainee.fans.cp * 3000 + trainee.fans.passerby * 100;
    }

    getVotingPower(traineeId) {
      if (!this.state) return 0;
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return 0;

      const episode = this.state.episode;
      const solo = trainee.fans.solo;
      const cp = trainee.fans.cp;
      const passerby = trainee.fans.passerby;

      if (episode <= 6) {
        return solo * 500 + cp * 1000 + passerby * 1000;
      } else if (episode <= 9) {
        return solo * 1000 + cp * 2000 + passerby * 700;
      } else if (episode <= 11) {
        return solo * 3000 + cp * 3000 + passerby * 500;
      } else {
        return solo * 5000 + cp * 2000 + passerby * 100;
      }
    }

    getRandomEvents() {
      if (!this.state) return [];
      const episode = this.state.episode;
      const eventTypes = EVENT_TYPE_MAP[episode] || ['practice_room'];
      const eventCount = randInt(2, 5);
      const events = [];
      for (let i = 0; i < eventCount; i++) {
        const type = pick(eventTypes);
        const pool = EVENT_POOL[type] || EVENT_POOL.practice_room;
        const template = pick(pool);
        const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
        let peopleCount = template.people;
        if (Array.isArray(peopleCount)) {
          peopleCount = randInt(peopleCount[0], peopleCount[1]);
        } else if (peopleCount === 'multi') {
          peopleCount = randInt(3, Math.min(6, activeTrainees.length));
        }
        peopleCount = Math.min(peopleCount, activeTrainees.length);
        const involvedTrainees = pickN(activeTrainees, peopleCount);
        if (involvedTrainees.length === 2) {
          this.recordInteraction(involvedTrainees[0].id, involvedTrainees[1].id);
        }
        events.push({
          ...template,
          instanceId: generateId(),
          involvedTraineeIds: involvedTrainees.map(t => t.id),
          involvedTraineeNames: involvedTrainees.map(t => t.name),
          options: { ...EVENT_OPTIONS }
        });
      }
      this._currentEvents = events;
      return events;
    }

    handleEvent(eventId, option) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const event = this._currentEvents.find(e => e.instanceId === eventId);
      if (!event) return { success: false, message: '事件不存在' };
      const optionConfig = EVENT_OPTIONS[option];
      if (!optionConfig) return { success: false, message: '无效选项' };
      const eventMinutes = event.minutes || optionConfig.minutes;
      if (this.state.episodeTimeUsed + eventMinutes > this.state.episodeMaxTime) {
        return { success: false, message: '时长不足' };
      }
      this.state.episodeTimeUsed += eventMinutes;
      const involved = event.involvedTraineeIds.map(id =>
        this.state.trainees.find(t => t.id === id)
      ).filter(Boolean);
      const severity = event.severity;
      for (const trainee of involved) {
        switch (option) {
          case 'A': break;
          case 'B':
            if (severity === 'positive') {
              trainee.fans.passerby += randInt(5, 20);
              trainee.fans.solo += randInt(1, 5);
            } else if (severity === 'negative') {
              trainee.fans.passerby += randInt(1, 10);
              trainee.fans.anti += randInt(2, 8);
            } else {
              trainee.fans.passerby += randInt(3, 15);
              trainee.fans.solo += randInt(0, 3);
            }
            break;
          case 'C':
            trainee.fans.anti += randInt(5, 15);
            trainee.fans.passerby += randInt(10, 30);
            if (severity === 'positive') {
              trainee.fans.solo += randInt(2, 8);
            }
            break;
          case 'D':
            trainee.fans.cp += randInt(10, 30);
            trainee.fans.passerby += randInt(5, 15);
            if (involved.length === 2) {
              this.recordInteraction(involved[0].id, involved[1].id);
            }
            break;
        }
        trainee.fans.solo = Math.max(0, trainee.fans.solo);
        trainee.fans.cp = Math.max(0, trainee.fans.cp);
        trainee.fans.passerby = Math.max(0, trainee.fans.passerby);
        trainee.fans.anti = Math.max(0, trainee.fans.anti);
      }
      return {
        success: true,
        message: `事件处理完成：${event.desc}`,
        event: event,
        option: optionConfig
      };
    }

    purchaseMarketing(traineeId, platform, direction, isCP, cpPartnerId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const configKey = `${platform}_${direction}`;
      const config = MARKETING_CONFIG[configKey];
      if (!config) return { success: false, message: '无效的营销配置' };
      if (this.state.funds < config.cost) {
        return { success: false, message: '资金不足' };
      }
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return { success: false, message: '练习生不存在' };
      if (trainee.eliminated) return { success: false, message: '练习生已淘汰' };
      let cpPartner = null;
      if (isCP) {
        if (!cpPartnerId || isNaN(cpPartnerId)) {
          return { success: false, message: 'CP营销需要指定CP对象' };
        }
        cpPartner = this.state.trainees.find(t => t.id === cpPartnerId);
        if (!cpPartner) return { success: false, message: 'CP对象不存在' };
        if (cpPartner.eliminated) return { success: false, message: 'CP对象已淘汰' };
        if (cpPartnerId === traineeId) return { success: false, message: '不能与自己组CP' };
      }
      this.state.funds -= config.cost;
      this.state.totalExpense += config.cost;
      this.state.totalMarketingCount = (this.state.totalMarketingCount || 0) + 1;

      const nobodyCaresRate = config.nobodyCaresRate || 0;
      if (Math.random() < nobodyCaresRate) {
        this._marketingLog.push({
          traineeId, platform, direction, isCP, cpPartnerId, success: false, nobodyCares: true, cost: config.cost
        });
        return {
          success: true,
          marketingSuccess: false,
          nobodyCares: true,
          message: `0人在意！营销完全没有引起任何反响，费用${config.cost}万打了水漂`
        };
      }

      const success = Math.random() < config.successRate;
      const rpKey = direction === 'positive' ? 'positive' : 'negative';
      this._reversePsychology[rpKey] += randFloat(0.10, 0.30);

      if (!success) {
        const failureEffects = config.failureEffects;
        const failureLimits = config.failureLimits;
        const failureSoloEffect = isCP ? null : (config.failureSoloEffect || null);
        const failureCpEffect = isCP ? (config.failureCpEffect || null) : null;
        if (failureEffects) {
          this._applyFanEffects(trainee, failureEffects, isCP ? failureCpEffect : failureSoloEffect, failureLimits);
        }
        if (isCP && cpPartner && failureEffects) {
          this._applyFanEffects(cpPartner, failureEffects, failureCpEffect, failureLimits);
        }
        trainee.fans.solo = Math.max(0, trainee.fans.solo);
        trainee.fans.cp = Math.max(0, trainee.fans.cp);
        trainee.fans.passerby = Math.max(0, trainee.fans.passerby);
        trainee.fans.anti = Math.max(0, trainee.fans.anti);
        if (cpPartner) {
          cpPartner.fans.solo = Math.max(0, cpPartner.fans.solo);
          cpPartner.fans.cp = Math.max(0, cpPartner.fans.cp);
          cpPartner.fans.passerby = Math.max(0, cpPartner.fans.passerby);
          cpPartner.fans.anti = Math.max(0, cpPartner.fans.anti);
        }
        this._marketingLog.push({
          traineeId, platform, direction, isCP, cpPartnerId, success: false, cost: config.cost
        });
        return { success: true, marketingSuccess: false, message: '营销失败，产生了负面效果' };
      }

      const limits = config.limits;
      const effects = config.effects;
      const targetEffect = isCP ? config.cpEffect : config.soloEffect;
      this._applyFanEffects(trainee, effects, targetEffect, limits);
      if (isCP && cpPartner) {
        this._applyFanEffects(cpPartner, effects, config.cpEffect, limits);
        this.recordInteraction(traineeId, cpPartnerId);
      }
      trainee.fans.solo = Math.max(0, trainee.fans.solo);
      trainee.fans.cp = Math.max(0, trainee.fans.cp);
      trainee.fans.passerby = Math.max(0, trainee.fans.passerby);
      trainee.fans.anti = Math.max(0, trainee.fans.anti);
      if (cpPartner) {
        cpPartner.fans.solo = Math.max(0, cpPartner.fans.solo);
        cpPartner.fans.cp = Math.max(0, cpPartner.fans.cp);
        cpPartner.fans.passerby = Math.max(0, cpPartner.fans.passerby);
        cpPartner.fans.anti = Math.max(0, cpPartner.fans.anti);
      }
      const rpTrigger = this._checkReversePsychology(trainee);
      this._marketingLog.push({
        traineeId, platform, direction, isCP, cpPartnerId, success: true, cost: config.cost
      });
      return {
        success: true,
        marketingSuccess: true,
        message: isCP ? `CP营销成功：${trainee.name} & ${cpPartner.name}` : '营销成功',
        trainee: trainee,
        cpPartner: cpPartner,
        reversePsychologyTriggered: rpTrigger
      };
    }

    _applyFanEffects(trainee, effects, targetEffect, limits) {
      for (const [key, value] of Object.entries(effects)) {
        const limit = limits[key] || Infinity;
        const currentVal = trainee.fans[key] || 0;
        const change = Math.round(currentVal * Math.abs(value));
        if (value > 0) {
          trainee.fans[key] = Math.min(currentVal + change, limit);
        } else {
          trainee.fans[key] = Math.max(currentVal - change, 0);
        }
      }
      if (targetEffect) {
        for (const [key, value] of Object.entries(targetEffect)) {
          const limit = limits[key] || Infinity;
          const currentVal = trainee.fans[key] || 0;
          const change = Math.round(currentVal * Math.abs(value));
          if (value > 0) {
            trainee.fans[key] = Math.min(currentVal + change, limit);
          } else {
            trainee.fans[key] = Math.max(currentVal - change, 0);
          }
        }
      }
    }

    getCPPartners(traineeId) {
      if (!this.state) return [];
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee || trainee.eliminated) return [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated && t.id !== traineeId);
      if (activeTrainees.length === 0) return [];
      const interactionPartners = [];
      const otherPartners = [];
      for (const other of activeTrainees) {
        const count = this.getInteractionCount(traineeId, other.id);
        if (count > 0) {
          interactionPartners.push({
            traineeId: other.id, traineeName: other.name,
            interactionCount: count, totalFans: other.fans.solo + other.fans.cp + other.fans.passerby,
            rank: other.rank || 0,
            priority: 'high'
          });
        } else {
          otherPartners.push({
            traineeId: other.id, traineeName: other.name,
            interactionCount: 0, totalFans: other.fans.solo + other.fans.cp + other.fans.passerby,
            rank: other.rank || 0,
            priority: 'normal'
          });
        }
      }
      interactionPartners.sort((a, b) => b.interactionCount - a.interactionCount);
      otherPartners.sort((a, b) => b.totalFans - a.totalFans);
      return [...interactionPartners, ...otherPartners];
    }

    _checkReversePsychology(trainee) {
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const sortedBySolo = [...activeTrainees].sort((a, b) => b.fans.solo - a.fans.solo);
      const sortedByPasserby = [...activeTrainees].sort((a, b) => b.fans.passerby - a.fans.passerby);
      const isSoloTop10 = sortedBySolo.indexOf(trainee) < 10;
      const isPasserbyTop10 = sortedByPasserby.indexOf(trainee) < 10;
      const hasHighAbility = this._getMaxAbility(trainee) > 85;
      if (this._reversePsychology.positive > 0.9) {
        this._reversePsychology.positive = 0;
        if (hasHighAbility || isSoloTop10 || isPasserbyTop10) {
          trainee.fans.solo = Math.min(trainee.fans.solo + Math.round(trainee.fans.solo * 0.05), 3000);
          trainee.fans.anti = Math.max(0, trainee.fans.anti - Math.round(trainee.fans.anti * 0.10));
          return { type: '忍无可忍', effect: 'positive', target: trainee.name };
        } else {
          trainee.fans.passerby = Math.max(0, trainee.fans.passerby - Math.round(trainee.fans.passerby * 0.10));
          return { type: '忍无可忍', effect: 'negative', target: trainee.name };
        }
      }
      if (this._reversePsychology.negative > 0.9) {
        this._reversePsychology.negative = 0;
        if (hasHighAbility || isSoloTop10 || isPasserbyTop10) {
          trainee.fans.solo = Math.min(trainee.fans.solo + Math.round(trainee.fans.solo * 0.10), 5000);
          trainee.fans.anti = Math.max(0, trainee.fans.anti - Math.round(trainee.fans.anti * 0.10));
          return { type: '别再黑了', effect: 'positive', target: trainee.name };
        } else {
          trainee.fans.passerby = Math.min(trainee.fans.passerby + Math.round(trainee.fans.passerby * 0.10), 2000);
          trainee.fans.anti = Math.max(0, trainee.fans.anti - Math.round(trainee.fans.anti * 0.05));
          return { type: '别再黑了', effect: 'neutral', target: trainee.name };
        }
      }
      return null;
    }

    getAutoTrending() {
      if (!this.state) return { wb: [], dy: [], db: [] };
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return { wb: [], dy: [], db: [] };
      const wbCount = randInt(3, 7);
      const dyCount = randInt(2, 5);
      const dbCount = randInt(1, 2);
      const wbTrending = [];
      const dyTrending = [];
      const dbTrending = [];
      for (let i = 0; i < wbCount; i++) {
        const trainee = pick(activeTrainees);
        const direction = Math.random() < 0.6 ? 'positive' : 'negative';
        const config = MARKETING_CONFIG[direction === 'positive' ? 'wb_positive' : 'wb_negative'];
        wbTrending.push(this._createAutoTrendingItem(trainee, config, 'wb'));
      }
      for (let i = 0; i < dyCount; i++) {
        const trainee = pick(activeTrainees);
        const direction = Math.random() < 0.5 ? 'positive' : 'negative';
        const config = MARKETING_CONFIG[direction === 'positive' ? 'dy_positive' : 'dy_negative'];
        dyTrending.push(this._createAutoTrendingItem(trainee, config, 'dy'));
      }
      for (let i = 0; i < dbCount; i++) {
        const trainee = pick(activeTrainees);
        const direction = Math.random() < 0.5 ? 'positive' : 'negative';
        const config = MARKETING_CONFIG[direction === 'positive' ? 'db_positive' : 'db_negative'];
        dbTrending.push(this._createAutoTrendingItem(trainee, config, 'db'));
      }
      this._autoTrending = { wb: wbTrending.slice(0, 10), dy: dyTrending.slice(0, 7), db: dbTrending.slice(0, 3) };
      return this._autoTrending;
    }

    _createAutoTrendingItem(trainee, config, platform) {
      const effects = config.effects;
      const limits = config.limits;
      for (const [key, value] of Object.entries(effects)) {
        const limit = limits[key] || Infinity;
        const currentVal = trainee.fans[key] || 0;
        const change = Math.round(currentVal * Math.abs(value) * 0.5);
        if (value > 0) {
          trainee.fans[key] = Math.min(currentVal + change, limit);
        } else {
          trainee.fans[key] = Math.max(currentVal - change, 0);
        }
      }
      trainee.fans.solo = Math.max(0, trainee.fans.solo);
      trainee.fans.cp = Math.max(0, trainee.fans.cp);
      trainee.fans.passerby = Math.max(0, trainee.fans.passerby);
      trainee.fans.anti = Math.max(0, trainee.fans.anti);
      const direction = config.direction;
      const topics = {
        wb_positive: [`${trainee.name}舞台太绝了`, `${trainee.name}实力认证`, `${trainee.name}神仙舞台`],
        wb_negative: [`${trainee.name}实力争议`, `${trainee.name}排名质疑`, `${trainee.name}黑料`],
        dy_positive: [`${trainee.name}名场面`, `${trainee.name}绝美瞬间`, `${trainee.name}高光时刻`],
        dy_negative: [`${trainee.name}翻车`, `${trainee.name}尴尬瞬间`, `${trainee.name}争议`],
        db_positive: [`${trainee.name}安利贴`, `${trainee.name}实力分析`, `${trainee.name}成长记录`],
        db_negative: [`${trainee.name}吐槽贴`, `${trainee.name}实力质疑`, `${trainee.name}排名分析`]
      };
      const configKey = `${platform}_${direction}`;
      const topicList = topics[configKey] || [`${trainee.name}热搜`];
      return {
        traineeId: trainee.id, traineeName: trainee.name,
        platform: platform, direction: direction,
        topic: pick(topicList), effects: effects
      };
    }

    getBusinessOpportunities() {
      if (!this.state) return [];
      // 只在第一次调用时生成商务，后续直接返回已有数据
      if (this._businessOpportunities && this._businessOpportunities.length > 0) {
        return this._businessOpportunities;
      }
      const count = randInt(1, 3);
      const opportunities = [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      for (let i = 0; i < count; i++) {
        const isPromo = Math.random() < 0.8;
        let specifiedTraineeId = null;
        if (Math.random() < 0.2 && activeTrainees.length > 0) {
          const randomTrainee = pick(activeTrainees);
          specifiedTraineeId = randomTrainee.id;
        }
        if (isPromo) {
          const maxPeople = randInt(1, 10);
          const revenue = randInt(50, 400);
          opportunities.push({
            id: generateId(), type: 'promotion',
            name: pick(['品牌推广', '产品代言', '广告拍摄', '直播带货', '品牌合作']),
            revenue: revenue, maxPeople: maxPeople,
            effect: { passerby: 0.03, limit: 1000 },
            specifiedTraineeId: specifiedTraineeId,
            accepted: false,
            description: `推广型商务，最多${maxPeople}人参与，收入${revenue}万${specifiedTraineeId ? '（指定练习生）' : ''}`
          });
        } else {
          const maxPeople = randInt(1, 3);
          const revenue = randInt(100, 600);
          opportunities.push({
            id: generateId(), type: 'appearance',
            name: pick(['品牌站台', '商业活动', '发布会出席', '粉丝见面会']),
            revenue: revenue, maxPeople: maxPeople,
            effect: { solo: 0.005, limit: 200 },
            specifiedTraineeId: specifiedTraineeId,
            accepted: false,
            description: `站台型商务，最多${maxPeople}人参与，收入${revenue}万${specifiedTraineeId ? '（指定练习生）' : ''}`
          });
        }
      }
      this._businessOpportunities = opportunities;
      return opportunities;
    }

    acceptBusiness(businessId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const business = this._businessOpportunities.find(b => b.id === businessId);
      if (!business) return { success: false, message: '商务机会不存在' };
      if (business.accepted) return { success: false, message: '已接受该商务' };

      this.state.funds += business.revenue;
      this.state.totalRevenue += business.revenue;
      this.state.totalBusinessAccept = (this.state.totalBusinessAccept || 0) + 1;

      // 对所有未淘汰练习生生效
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      for (const trainee of activeTrainees) {
        if (business.type === 'promotion') {
          const change = Math.round(trainee.fans.passerby * business.effect.passerby);
          trainee.fans.passerby = Math.min(trainee.fans.passerby + change, business.effect.limit);
        } else {
          const change = Math.round(trainee.fans.solo * business.effect.solo);
          trainee.fans.solo = Math.min(trainee.fans.solo + change, business.effect.limit);
        }
      }

      for (const sponsor of this.state.signedSponsors) {
        if (Math.random() < 0.3) {
          sponsor.satisfaction = clamp(sponsor.satisfaction + randInt(1, 5), 0, 100);
        }
      }

      business.accepted = true;
      this.state.lockedBusiness.push({
        ...business, traineeIds: activeTrainees.map(t => t.id),
        traineeNames: activeTrainees.map(t => t.name), episode: this.state.episode
      });

      return {
        success: true,
        message: `商务合作完成，收入${business.revenue}万，所有练习生受益`,
        revenue: business.revenue
      };
    }

    rejectBusiness(businessId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const business = this._businessOpportunities.find(b => b.id === businessId);
      if (!business) return { success: false, message: '商务机会不存在' };
      if (business.accepted) return { success: false, message: '已接受该商务' };
      business.rejected = true;
      return { success: true, message: '已拒绝该商务机会' };
    }

    getTraineeCoreAbility(traineeId) {
      if (!this.state) return 0;
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return 0;
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const sortedByFans = [...activeTrainees].sort((a, b) => {
        const fansA = a.fans.solo + a.fans.cp + a.fans.passerby;
        const fansB = b.fans.solo + b.fans.cp + b.fans.passerby;
        return fansB - fansA;
      });
      const rankIndex = sortedByFans.findIndex(t => t.id === traineeId);
      const popularityScore = activeTrainees.length > 1
        ? ((activeTrainees.length - 1 - rankIndex) / (activeTrainees.length - 1)) * 100
        : 100;
      const a = trainee.abilities;
      const businessAbilityAvg = (a.look + a.sing + a.dance + a.rap + a.create + a.variety) / 6;
      return (popularityScore + businessAbilityAvg) / 2;
    }

    _initSponsorRequirements() {}

    // 【修复3】初期自动扣除默认场地和工作人员费用
    _deductInitialCosts() {
      if (!this.state) return;
      
      // 默认选择"训练基地"场地（最低成本）
      const defaultVenue = VENUE_TYPES.find(v => v.type === '训练基地');
      if (defaultVenue) {
        const venueCost = randInt(defaultVenue.cost[0], defaultVenue.cost[1]);
        this.state.funds -= venueCost;
        this.state.totalExpense += venueCost;
        this.state.selectedVenue = {
          type: '训练基地', cost: venueCost,
          stageBonus: defaultVenue.stageBonus, audienceBonus: defaultVenue.audienceBonus,
          topicBonus: defaultVenue.topicBonus || 0, required: true
        };
      }
      
      // 默认选择"标准团队"
      const defaultStaff = STAFF_TYPES.find(s => s.type === '标准团队');
      if (defaultStaff) {
        const staffCost = randInt(defaultStaff.cost[0], defaultStaff.cost[1]);
        this.state.funds -= staffCost;
        this.state.totalExpense += staffCost;
        this.state.selectedStaff = {
          type: '标准团队', cost: staffCost,
          editBonus: defaultStaff.editBonus || 0, narrativeBonus: defaultStaff.narrativeBonus || 0,
          visualBonus: defaultStaff.visualBonus || 0, lensBonus: defaultStaff.lensBonus || 0,
          imageBonus: defaultStaff.imageBonus || 0, topicBonus: defaultStaff.topicBonus || 0,
          musicBonus: defaultStaff.musicBonus || 0, stageBonus: defaultStaff.stageBonus || 0,
          allBonus: defaultStaff.allBonus || 0, errorRate: defaultStaff.errorRate || 0
        };
      }
    }

    getSponsorRequirements() {
      if (!this.state) return [];
      return this.state.sponsorRequirements.map(req => ({
        ...req, achieved: this.checkSponsorRequirement(req.id)
      }));
    }

    checkSponsorRequirement(requirementId) {
      if (!this.state) return false;
      const req = this.state.sponsorRequirements.find(r => r.id === requirementId);
      if (!req) return false;
      if (req.achieved) return true;
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      switch (req.requirement) {
        case '镜头保证': {
          const epKey = String(this.state.episode);
          const editedSet = this.state.editedTrainees[epKey];
          return editedSet && editedSet.size > 0;
        }
        case '人气保证': {
          const topTrainees = [...activeTrainees].sort((a, b) => {
            const fansA = a.fans.solo + a.fans.cp + a.fans.passerby;
            const fansB = b.fans.solo + b.fans.cp + b.fans.passerby;
            return fansB - fansA;
          });
          const threshold = Math.max(1, Math.floor(topTrainees.length * 0.2));
          return topTrainees.length > 0 && threshold > 0;
        }
        case '参与节目': {
          return this.state.episode > 0 && !this.state.isFinal;
        }
        case '产品植入': {
          // 【修复2】检查赞助商剪辑时长是否达到要求（默认5分钟）
          const targetMinutes = req.target || 5;
          return (this.state.editingTime && this.state.editingTime.sponsor >= targetMinutes);
        }
        case '续约要求': {
          return false;
        }
        case '广告植入': {
          return this.state.editingTime && this.state.editingTime.sponsor > 0;
        }
        default:
          return false;
      }
    }

    checkAllSponsorRequirements() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const unmetRequirements = [];
      let allMet = true;
      for (const req of this.state.sponsorRequirements) {
        const isMet = this.checkSponsorRequirement(req.id);
        if (!isMet) {
          allMet = false;
          unmetRequirements.push({ sponsorName: req.sponsorName, requirement: req.requirement });
        }
      }
      return {
        success: true, allMet: allMet, unmetRequirements: unmetRequirements,
        message: allMet ? '所有赞助商要求已满足' : `有${unmetRequirements.length}项赞助商要求未满足`
      };
    }

    updateSponsorStatus() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const updates = [];
      for (const req of this.state.sponsorRequirements) {
        const wasAchieved = req.achieved;
        const nowAchieved = this.checkSponsorRequirement(req.id);
        if (!wasAchieved && nowAchieved) {
          req.achieved = true;
          req.achievedEpisode = this.state.episode;
          updates.push({ sponsorName: req.sponsorName, requirement: req.requirement, achieved: true });
        }
      }
      for (const sponsor of this.state.signedSponsors) {
        const sponsorReqs = this.state.sponsorRequirements.filter(r => r.sponsorId === sponsor.id);
        const achievedCount = sponsorReqs.filter(r => r.achieved).length;
        const totalReqs = sponsorReqs.length;
        if (totalReqs > 0) {
          const achievementRate = achievedCount / totalReqs;
          if (achievementRate >= 0.8) {
            sponsor.satisfaction = clamp(sponsor.satisfaction + randInt(3, 8), 0, 100);
          } else if (achievementRate >= 0.5) {
            sponsor.satisfaction = clamp(sponsor.satisfaction + randInt(0, 3), 0, 100);
          } else {
            sponsor.satisfaction = clamp(sponsor.satisfaction - randInt(2, 5), 0, 100);
          }
        }
      }
      return {
        success: true,
        message: `赞助商状态已更新，${updates.length}项要求达成`,
        updates: updates
      };
    }

    processSponsorPenalties() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const penalties = [];
      for (const req of this.state.sponsorRequirements) {
        if (req.achieved) continue;
        if (req.requirement === '续约要求') continue;
        if (!req.firstMissedEpisode) {
          req.firstMissedEpisode = this.state.episode;
          req.compensationRequired = true;
          penalties.push({
            sponsorName: req.sponsorName, requirement: req.requirement,
            status: 'warning',
            message: `${req.sponsorName}的"${req.requirement}"要求首次未达成，需要补偿`
          });
        } else if (req.compensationRequired) {
          const sponsor = this.state.signedSponsors.find(s => s.id === req.sponsorId);
          if (sponsor) {
            const penaltyRate = randFloat(0.20, 0.50);
            const penaltyAmount = Math.round(sponsor.amount * penaltyRate);
            this.state.sponsorPenalties.push({
              sponsorId: sponsor.id, sponsorName: sponsor.name,
              requirement: req.requirement, penaltyAmount: penaltyAmount,
              episode: this.state.episode
            });
            req.compensationRequired = false;
            penalties.push({
              sponsorName: req.sponsorName, requirement: req.requirement,
              status: 'penalty', penaltyAmount: penaltyAmount,
              message: `${req.sponsorName}的"${req.requirement}"补偿仍未达成，赔偿${penaltyAmount}万`
            });
          }
        }
      }
      return {
        success: true,
        message: penalties.length > 0 ? `赞助商惩罚处理完成，${penalties.length}项问题` : '赞助商惩罚检查通过',
        penalties: penalties
      };
    }

    getEditingTime(tab) {
      if (!this.state || !this.state.editingTime) return 0;
      // 【修复1】练习室和宿舍合并，统一返回practiceDorm时长
      if (tab === 'practiceDorm') {
        return (this.state.editingTime.practice || 0) + (this.state.editingTime.dorm || 0);
      }
      return this.state.editingTime[tab] || 0;
    }

    addEditingTime(tab, minutes) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      // 【修复1】练习室和宿舍合并为一个tab
      const actualTab = tab === 'practiceDorm' ? 'practice' : tab;
      if (!this.state.editingTime.hasOwnProperty(actualTab)) {
        return { success: false, message: '无效的Tab名称' };
      }
      if (this.getTotalEditingTime() + minutes > this.state.episodeMaxTime) {
        return { success: false, message: '总时长超出限制' };
      }
      this.state.editingTime[actualTab] += minutes;
      this.state.episodeTimeUsed = this.getTotalEditingTime();
      return {
        success: true, message: `${tab} Tab时长增加${minutes}分钟`,
        tab: tab, minutes: minutes,
        tabTotal: this.state.editingTime[actualTab],
        grandTotal: this.getTotalEditingTime()
      };
    }

    getTotalEditingTime() {
      if (!this.state || !this.state.editingTime) return 0;
      const t = this.state.editingTime;
      // 【修复1】练习室和宿舍合并计算
      return (t.studio || 0) + (t.practice || 0) + (t.dorm || 0) + (t.stage || 0) + (t.sponsor || 0);
    }

    getRemainingTime() {
      if (!this.state) return 0;
      const sponsorAdTime = this.state.sponsorAdTime || 0;
      return this.state.episodeMaxTime - sponsorAdTime - this.getTotalEditingTime();
    }

    calculateSponsorAdTime() {
      if (!this.state) return 0;
      const sponsors = this.state.signedSponsors || [];
      return sponsors.length * 3;
    }

    getUsableTime() {
      if (!this.state) return 0;
      const sponsorAdTime = this.state.sponsorAdTime || 0;
      return this.state.episodeMaxTime - sponsorAdTime;
    }

    validateEditingTimeLimit() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const t = this.state.editingTime;
      const sponsorTime = t.sponsor || 0;
      const stageTime = t.stage || 0;
      const practiceTime = t.practice || 0;
      const totalLimitedTime = sponsorTime + stageTime + practiceTime;
      const isValid = totalLimitedTime <= 75;
      return {
        success: true, isValid: isValid,
        sponsorTime: sponsorTime, stageTime: stageTime, practiceTime: practiceTime,
        totalLimitedTime: totalLimitedTime, limit: 75,
        remaining: Math.max(0, 75 - totalLimitedTime),
        message: isValid
          ? `时长限制检查通过（${totalLimitedTime}/75分钟）`
          : `时长超出限制！产品植入+舞台+练习室共${totalLimitedTime}分钟，超过75分钟上限`
      };
    }

    getBTSEditingTime(tab) {
      if (!this.state || !this.state.btsEditingTime) return 0;
      return this.state.btsEditingTime[tab] || 0;
    }

    addBTSEditingTime(tab, minutes) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.btsEditingTime.hasOwnProperty(tab)) {
        return { success: false, message: '无效的花絮Tab名称' };
      }
      if (this.getTotalBTSTime() + minutes > this.state.btsMaxTime) {
        return { success: false, message: '花絮总时长超出限制' };
      }
      this.state.btsEditingTime[tab] += minutes;
      this.state.btsTimeUsed = this.getTotalBTSTime();
      return {
        success: true, message: `花絮${tab} Tab时长增加${minutes}分钟`,
        tab: tab, minutes: minutes,
        tabTotal: this.state.btsEditingTime[tab],
        grandTotal: this.getTotalBTSTime()
      };
    }

    getTotalBTSTime() {
      if (!this.state || !this.state.btsEditingTime) return 0;
      const t = this.state.btsEditingTime;
      return (t.practice || 0) + (t.dorm || 0) + (t.sponsor || 0);
    }

    getRemainingBTSTime() {
      if (!this.state) return 0;
      return this.state.btsMaxTime - this.getTotalBTSTime();
    }

    recordInteraction(traineeId1, traineeId2) {
      if (!this.state) return;
      const minId = Math.min(traineeId1, traineeId2);
      const maxId = Math.max(traineeId1, traineeId2);
      const key = `${minId}-${maxId}`;
      if (!this.state.interactions[key]) {
        this.state.interactions[key] = 0;
      }
      this.state.interactions[key]++;
    }

    getInteractionCount(traineeId1, traineeId2) {
      if (!this.state || !this.state.interactions) return 0;
      const minId = Math.min(traineeId1, traineeId2);
      const maxId = Math.max(traineeId1, traineeId2);
      const key = `${minId}-${maxId}`;
      return this.state.interactions[key] || 0;
    }

    canSellMerch() {
      if (!this.state) return false;
      return MERCH_EPISODES.includes(this.state.episode) && !this._merchSold;
    }

    sellMerch(priceLevel) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.canSellMerch()) return { success: false, message: '当前期数不可售卖周边' };

      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return { success: false, message: '没有可售卖周边的练习生' };

      let totalSolo = 0, totalCp = 0, totalPasserby = 0;
      for (const t of activeTrainees) {
        totalSolo += t.fans.solo;
        totalCp += t.fans.cp;
        totalPasserby += t.fans.passerby;
      }

      let sales, unitPrice, priceName;
      switch(priceLevel) {
        case 'premium':
          unitPrice = 200;
          priceName = '豪华版';
          sales = Math.floor(totalSolo * 0.20 * 2 + totalCp * 0.15 * 1 + totalPasserby * 0.01 * 1);
          break;
        case 'standard':
          unitPrice = 130;
          priceName = '标准版';
          sales = Math.floor(totalSolo * 0.50 * 3 + totalCp * 0.35 * 2 + totalPasserby * 0.05 * 1);
          break;
        case 'budget':
          unitPrice = 60;
          priceName = '平价版';
          sales = Math.floor(totalSolo * 0.75 * 6 + totalCp * 0.45 * 3 + totalPasserby * 0.10 * 1);
          break;
        case 'basic':
          unitPrice = 20;
          priceName = '基础版';
          sales = Math.floor(totalSolo * 0.85 * 10 + totalCp * 0.60 * 6 + totalPasserby * 0.20 * 1);
          break;
        default:
          return { success: false, message: '无效价格等级' };
      }

      sales = Math.floor(sales * (0.8 + Math.random() * 0.4));

      const revenueWan = Math.round(sales * unitPrice / 10000 * 100) / 100;
      this.state.funds += revenueWan;
      this.state.totalRevenue += revenueWan;
      this._merchSold = true;

      return {
        success: true,
        message: `${priceName}周边售出${sales}份，收入${revenueWan.toFixed(1)}万`,
        sales: sales,
        revenue: revenueWan,
        unitPrice: unitPrice
      };
    }

    getMerchEstimates() {
      if (!this.state) return [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      let totalSolo = 0, totalCp = 0, totalPasserby = 0;
      for (const t of activeTrainees) {
        totalSolo += t.fans.solo;
        totalCp += t.fans.cp;
        totalPasserby += t.fans.passerby;
      }
      const levels = [
        { key: 'premium', name: '豪华版', unitPrice: 200, soloRate: 0.20, soloMul: 2, cpRate: 0.15, cpMul: 1, passerbyRate: 0.01, passerbyMul: 1 },
        { key: 'standard', name: '标准版', unitPrice: 130, soloRate: 0.50, soloMul: 3, cpRate: 0.35, cpMul: 2, passerbyRate: 0.05, passerbyMul: 1 },
        { key: 'budget', name: '平价版', unitPrice: 60, soloRate: 0.75, soloMul: 6, cpRate: 0.45, cpMul: 3, passerbyRate: 0.10, passerbyMul: 1 },
        { key: 'basic', name: '基础版', unitPrice: 20, soloRate: 0.85, soloMul: 10, cpRate: 0.60, cpMul: 6, passerbyRate: 0.20, passerbyMul: 1 }
      ];
      return levels.map(l => {
        const estSales = Math.floor(totalSolo * l.soloRate * l.soloMul + totalCp * l.cpRate * l.cpMul + totalPasserby * l.passerbyRate * l.passerbyMul);
        const estRevenueWan = Math.round(estSales * l.unitPrice / 10000 * 100) / 100;
        return { key: l.key, name: l.name, unitPrice: l.unitPrice, estSales, estRevenueWan };
      });
    }

    getRankings() {
      if (!this.state) return [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const ranked = activeTrainees.map(t => {
        const votingPower = this.calculateVotePower(t);
        return { ...t, votingPower };
      }).sort((a, b) => b.votingPower - a.votingPower);
      ranked.forEach((t, idx) => {
        t.rank = idx + 1;
        const original = this.state.trainees.find(tr => tr.id === t.id);
        if (original) original.rank = idx + 1;
      });
      return ranked;
    }

    eliminateTrainees() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const episode = this.state.episode;
      const targetCount = ELIMINATION_EPISODES[episode];
      if (!targetCount) return { success: false, message: `第${episode}期不执行淘汰` };
      const rankings = this.getRankings();
      const activeCount = rankings.length;
      if (activeCount <= targetCount) return { success: false, message: '人数已达标，无需淘汰' };
      const eliminateCount = activeCount - targetCount;
      const eliminated = rankings.slice(targetCount);
      for (const trainee of eliminated) {
        const original = this.state.trainees.find(t => t.id === trainee.id);
        if (original) { original.eliminated = true; original.rank = 0; }
      }
      const remaining = this.getRankings();
      remaining.forEach((t, idx) => {
        const original = this.state.trainees.find(tr => tr.id === t.id);
        if (original) original.rank = idx + 1;
      });
      return {
        success: true,
        message: `淘汰${eliminateCount}人，剩余${targetCount}人`,
        eliminated: eliminated.map(t => ({ id: t.id, name: t.name, rank: t.rank })),
        remaining: remaining.length
      };
    }

    getLiveRankings(episode) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return { success: false, message: '没有可用练习生' };
      const rankedTrainees = activeTrainees.map(t => {
        const votingPower = this.calculateVotePower(t);
        const totalFans = t.fans.solo + t.fans.cp + t.fans.passerby;
        return {
          id: t.id, name: t.name, company: t.company, grade: t.grade,
          votingPower: votingPower,
          fans: { solo: t.fans.solo, cp: t.fans.cp, passerby: t.fans.passerby, anti: t.fans.anti, total: totalFans },
          abilities: t.abilities, rank: 0
        };
      });
      rankedTrainees.sort((a, b) => b.votingPower - a.votingPower);
      rankedTrainees.forEach((t, idx) => {
        t.rank = idx + 1;
        const original = this.state.trainees.find(tr => tr.id === t.id);
        if (original) original.rank = idx + 1;
      });
      const rankingChanges = rankedTrainees.map(t => ({
        id: t.id, name: t.name, currentRank: t.rank, rankChange: Math.floor(Math.random() * 10) - 5
      }));
      const debutZone = rankedTrainees.slice(0, 11);
      const dangerZone = rankedTrainees.slice(8, 15);
      const targetCount = ELIMINATION_EPISODES[episode];
      const eliminationZone = targetCount ? rankedTrainees.slice(targetCount) : [];
      return {
        success: true, episode: episode, totalTrainees: rankedTrainees.length,
        rankings: rankedTrainees.map(t => ({
          rank: t.rank, id: t.id, name: t.name, company: t.company,
          grade: t.grade, votingPower: t.votingPower, totalFans: t.fans.total
        })),
        debutZone: debutZone.map(t => ({ rank: t.rank, id: t.id, name: t.name, votingPower: t.votingPower })),
        dangerZone: dangerZone.map(t => ({ rank: t.rank, id: t.id, name: t.name, isInDebutZone: t.rank <= 11 })),
        eliminationZone: targetCount ? eliminationZone.map(t => ({ rank: t.rank, id: t.id, name: t.name })) : [],
        hasElimination: !!targetCount, eliminationTargetCount: targetCount || null,
        message: `第${episode}期实时排名更新完成，共${rankedTrainees.length}名练习生参与排名`
      };
    }

    getPerformanceGroups(episode) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return { success: false, message: '没有可用练习生' };
      let groupSize;
      if (episode <= 3) groupSize = 5;
      else if (episode <= 6) groupSize = 7;
      else if (episode <= 9) groupSize = 10;
      else groupSize = 6;
      const groupCount = Math.ceil(activeTrainees.length / groupSize);
      const shuffledTrainees = [...activeTrainees].sort(() => Math.random() - 0.5);
      const groups = [];
      const songs = ['《破风》', '《英雄》', '《梦不落雨林》', '《炙热的我们》', '《青春有你》', '《创造营》', '《少年之名》', '《以团之名》'];
      for (let i = 0; i < groupCount; i++) {
        const startIdx = i * groupSize;
        const endIdx = Math.min(startIdx + groupSize, shuffledTrainees.length);
        const groupTrainees = shuffledTrainees.slice(startIdx, endIdx);
        if (groupTrainees.length === 0) continue;
        const center = groupTrainees.reduce((max, t) => {
          const maxFans = max.fans.solo + max.fans.cp + max.fans.passerby;
          const tFans = t.fans.solo + t.fans.cp + t.fans.passerby;
          return tFans > maxFans ? t : max;
        }, groupTrainees[0]);
        const leader = groupTrainees.reduce((max, t) => {
          const maxAbility = this._getAverageAbility(max);
          const tAbility = this._getAverageAbility(t);
          return tAbility > maxAbility ? t : max;
        }, groupTrainees[0]);
        groups.push({
          groupId: i + 1, groupName: `第${i + 1}组`, song: pick(songs),
          trainees: groupTrainees.map(t => ({
            id: t.id, name: t.name, company: t.company,
            isCenter: t.id === center.id, isLeader: t.id === leader.id
          })),
          traineeCount: groupTrainees.length,
          centerId: center.id, centerName: center.name,
          leaderId: leader.id, leaderName: leader.name
        });
      }
      return {
        success: true, episode: episode, groupCount: groups.length, groups: groups,
        message: `第${episode}期公演分组完成，共${groups.length}个小组`
      };
    }

    eliminationVoting(episode) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const targetCount = ELIMINATION_EPISODES[episode];
      if (!targetCount) return { success: false, message: `第${episode}期不进行淘汰投票` };
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const rankings = [...activeTrainees].sort((a, b) => {
        return this.getVotingPower(b.id) - this.getVotingPower(a.id);
      });
      rankings.forEach((t, idx) => { t.rank = idx + 1; });

      const activeCount = rankings.length;
      if (activeCount <= targetCount) return { success: false, message: '人数已达标，无需淘汰投票' };
      const eliminateCount = activeCount - targetCount;
      const safeZoneTrainees = rankings.slice(0, targetCount);
      const eliminationZoneTrainees = rankings.slice(targetCount);
      const belowLine = rankings.slice(targetCount);
      // 再次过滤确保 rank > targetCount
      let dangerZoneTrainees = belowLine.filter(t => t.rank > targetCount);
      if (dangerZoneTrainees.length > 3) {
        dangerZoneTrainees = [...dangerZoneTrainees].sort(() => Math.random() - 0.5).slice(0, 3);
      }

      const tensionNarration = [
        '灯光渐暗，大屏幕上的数字缓缓跳动，所有人都屏住了呼吸...',
        '主持人手中握着信封，全场鸦雀无声，只有心跳声在回响...',
        '倒计时开始，练习生们紧握双手，命运即将揭晓...',
        '舞台上的灯光一盏盏熄灭，只剩下聚光灯下的排名位...',
        '音乐停歇，主持人深吸一口气，准备宣布最终结果...'
      ];

      const farewellSpeeches = eliminationZoneTrainees.slice(0, 3).map(t => {
        const speeches = [
          `${t.name}：感谢这段旅程，我学到了很多，不会放弃梦想。`,
          `${t.name}：虽然遗憾，但能站在这里已经很幸福了，谢谢大家。`,
          `${t.name}：我会继续努力，这不是终点，而是新的起点。`,
          `${t.name}：感谢所有支持我的人，对不起让你们失望了。`,
          `${t.name}：这段经历让我成长了很多，未来会更好。`
        ];
        return pick(speeches);
      });

      const comfortScenes = safeZoneTrainees.slice(0, 3).map(t => {
        const scenes = [
          `${t.name}紧紧拥抱了即将离开的队友，眼中含泪。`,
          `${t.name}向淘汰的练习生深深鞠躬，表示感谢。`,
          `${t.name}握住队友的手，低声说着鼓励的话。`
        ];
        return pick(scenes);
      });

      const votingData = rankings.slice(0, 20).map(t => ({
        id: t.id, name: t.name, votingPower: t.votingPower,
        totalFans: t.fans.solo + t.fans.cp + t.fans.passerby,
        soloFans: t.fans.solo, cpFans: t.fans.cp, passerbyFans: t.fans.passerby
      }));

      let debutBattleNarration = null;
      if (episode === 11) {
        const top15 = rankings.slice(0, 15);
        const debutBattle = top15.map((t, idx) => ({
          rank: idx + 1, name: t.name, votingPower: t.votingPower,
          inDebutZone: idx < 11,
          gap: idx > 0 ? rankings[idx - 1].votingPower - t.votingPower : 0
        }));
        debutBattleNarration = {
          title: '出道位争夺战',
          description: '最后11个出道名额即将揭晓，每一票都至关重要！',
          battle: debutBattle,
          suspensePoint: debutBattle.length > 11
            ? `${debutBattle[10].name}与${debutBattle[11].name}的票差仅为${debutBattle[11].gap}，出道位岌岌可危！`
            : null
        };
      }

      const scenario = {
        type: 'elimination_voting', episode: episode,
        tensionNarration: pick(tensionNarration),
        farewellSpeeches: farewellSpeeches,
        comfortScenes: comfortScenes,
        debutBattle: debutBattleNarration
      };

      let debutEdgeTrainees = [];
      if (episode === 11) {
        debutEdgeTrainees = rankings.slice(10, 15).map(t => ({
          id: t.id, name: t.name, rank: t.rank || 0
        }));
      }

      return {
        success: true, episode: episode, scenario: scenario,
        targetCount: targetCount, eliminateCount: eliminateCount,
        safeZone: safeZoneTrainees.map(t => ({ id: t.id, name: t.name, rank: t.rank, votingPower: t.votingPower })),
        dangerZone: dangerZoneTrainees.map(t => ({ id: t.id, name: t.name, rank: t.rank, votingPower: t.votingPower, isEliminated: t.rank > targetCount })),
        eliminationZone: eliminationZoneTrainees.map(t => ({ id: t.id, name: t.name, rank: t.rank, votingPower: t.votingPower })),
        votingData: votingData,
        debutEdge: debutEdgeTrainees,
        message: `第${episode}期淘汰投票剧情生成完成`
      };
    }

    getFinalRound1() {
      if (!this.state) return [];
      const rankings = this.getRankings();
      return rankings.slice(0, 18).map(t => ({ id: t.id, name: t.name, rank: t.rank, votingPower: t.votingPower }));
    }

    announceRound1(announcedIds) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const results = [];
      for (const id of announcedIds) {
        const trainee = this.state.trainees.find(t => t.id === id);
        if (trainee && !trainee.eliminated) {
          trainee.fans.passerby += Math.round(trainee.fans.passerby * 0.05);
          trainee.fans.solo += Math.round(trainee.fans.solo * 0.02);
          results.push({ id: trainee.id, name: trainee.name });
        }
      }
      this._finalPhase.round = 1;
      this._finalPhase.announced1 = announcedIds;
      return { success: true, message: '第一轮预排名公布完成', announced: results };
    }

    getFinalRound2() {
      if (!this.state) return [];
      const rankings = this.getRankings();
      return rankings.slice(0, 15).map(t => ({ id: t.id, name: t.name, rank: t.rank, votingPower: t.votingPower }));
    }

    announceRound2(announcedIds) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const results = [];
      for (const id of announcedIds) {
        const trainee = this.state.trainees.find(t => t.id === id);
        if (trainee && !trainee.eliminated) {
          trainee.fans.passerby += Math.round(trainee.fans.passerby * 0.08);
          trainee.fans.solo += Math.round(trainee.fans.solo * 0.04);
          results.push({ id: trainee.id, name: trainee.name });
        }
      }
      this._finalPhase.round = 2;
      this._finalPhase.announced2 = announcedIds;
      return { success: true, message: '第二轮预排名公布完成', announced: results };
    }

    getFinalResults() {
      if (!this.state) return { debutGroup: [], eliminated: [] };
      const rankings = this.getRankings();
      const top11 = rankings.slice(0, 11);
      const rest = rankings.slice(11);
      for (const trainee of top11) {
        const original = this.state.trainees.find(t => t.id === trainee.id);
        if (original) { original.debuted = true; original.rank = top11.indexOf(trainee) + 1; }
      }
      for (const trainee of rest) {
        const original = this.state.trainees.find(t => t.id === trainee.id);
        if (original) { original.eliminated = true; }
      }
      this.state.isFinal = true;
      return {
        debutGroup: top11.map((t, idx) => ({
          id: t.id, name: t.name, rank: idx + 1, votingPower: t.votingPower,
          company: t.company, grade: t.grade, abilities: t.abilities, fans: t.fans
        })),
        eliminated: rest.map(t => ({ id: t.id, name: t.name, rank: top11.length + rest.indexOf(t) + 1 }))
      };
    }

    getFinalStep() {
      if (!this._finalPhase) return 0;
      return this._finalPhase.step;
    }

    advanceFinalStep() {
      if (!this._finalPhase) return { success: false };
      this._finalPhase.step++;
      return { success: true, step: this._finalPhase.step };
    }

    announceNextFinalRank() {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this._finalPhase.finalRankAnnouncing) {
        this._finalPhase.finalRankAnnouncing = true;
        this._finalPhase.currentAnnounceRank = 10;
      }

      const rankings = this.getCurrentRankings();
      if (this._finalPhase.currentAnnounceRank > rankings.length) {
        return { success: false, message: '所有名次已公布', done: true };
      }

      const rank = this._finalPhase.currentAnnounceRank;
      const trainee = rankings[rank - 1];

      this._finalPhase.currentAnnounceRank--;

      return {
        success: true,
        rank: rank,
        trainee: trainee,
        done: this._finalPhase.currentAnnounceRank <= 0
      };
    }

    getTraineeEvaluation(traineeId) {
      if (!this.state) return null;
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return null;

      const totalFans = trainee.fans.solo + trainee.fans.cp + trainee.fans.passerby;
      const fanRatios = {
        solo: totalFans > 0 ? trainee.fans.solo / totalFans : 0,
        cp: totalFans > 0 ? trainee.fans.cp / totalFans : 0,
        passerby: totalFans > 0 ? trainee.fans.passerby / totalFans : 0
      };

      const episode = this.state.episode;
      let soloWeight, cpWeight, passerbyWeight;
      if (episode <= 6) { soloWeight = 500; cpWeight = 1000; passerbyWeight = 1000; }
      else if (episode <= 9) { soloWeight = 1000; cpWeight = 2000; passerbyWeight = 700; }
      else if (episode <= 11) { soloWeight = 3000; cpWeight = 3000; passerbyWeight = 500; }
      else { soloWeight = 5000; cpWeight = 2000; passerbyWeight = 100; }

      const soloVotingPower = trainee.fans.solo * soloWeight;
      const cpVotingPower = trainee.fans.cp * cpWeight;
      const passerbyVotingPower = trainee.fans.passerby * passerbyWeight;

      let fanType = '泛人气';
      if ((trainee.fans.anti || 0) >= 500) {
        fanType = '黑红参半';
      } else if (cpVotingPower >= soloVotingPower && cpVotingPower >= passerbyVotingPower || fanRatios.cp >= 0.4) {
        fanType = '麦麸达人';
      } else if (fanRatios.solo >= 0.6) {
        fanType = '依靠死忠';
      } else if (passerbyVotingPower >= soloVotingPower && passerbyVotingPower >= cpVotingPower || fanRatios.passerby >= 0.4) {
        fanType = '泛人气';
      }

      const experienceComments = {
        '出道经验': '有过出道经历，舞台经验丰富',
        '选秀经历': '曾参加选秀节目，对赛制熟悉',
        '影视经验': '有影视表演经验，镜头感强',
        '网红背景': '自带网络流量，话题度高',
        '海外经历': '有海外训练经历，国际化视野',
        '学霸背景': '学历背景优秀，综合素质高',
        '情感经历': '情感丰富，容易引发观众共鸣',
        '体育特长': '体能出众，舞台爆发力强',
        '学艺经历': '科班出身，基本功扎实',
        '争议经历': '曾卷入争议，话题度与风险并存'
      };

      const expComments = (trainee.experiences || []).map(exp =>
        experienceComments[exp] || `${exp}经历独特`
      );

      const rankChange = (trainee.initialRank || trainee.rank) - trainee.rank;
      let rankTrend = '➡️ 稳定';
      if (rankChange > 40) rankTrend = '📈📈 大幅上升';
      else if (rankChange > 15) rankTrend = '📈 上升';
      else if (rankChange < -15) rankTrend = '📉📉 大幅下降';
      else if (rankChange < -5) rankTrend = '📉 下降';

      return {
        traineeId: trainee.id,
        name: trainee.name,
        fanType: fanType,
        experienceComments: expComments,
        rankTrend: rankTrend,
        rankChange: rankChange,
        currentRank: trainee.rank,
        abilities: { ...trainee.abilities },
        fans: { ...trainee.fans }
      };
    }

    _generateGambleAgreements() {
      const count = randInt(2, 4);
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const selected = pickN(activeTrainees, Math.min(count, activeTrainees.length));
      const requirementTypes = [
        { type: 'survive_60', label: '60强不被淘汰', check: (rank) => rank <= 60 },
        { type: 'survive_35', label: '35强不被淘汰', check: (rank) => rank <= 35 },
        { type: 'survive_20', label: '20强不被淘汰', check: (rank) => rank <= 20 },
        { type: 'debut', label: '最终必须出道', check: (rank) => rank <= 11 }
      ];
      for (const t of selected) {
        const req = pick(requirementTypes);
        const source = Math.random() < 0.5 ? '赞助商' : '娱乐公司';
        this.state.gambleAgreements.push({
          id: generateId(),
          traineeId: t.id,
          traineeName: t.name,
          requirementType: req.type,
          requirementLabel: req.label,
          checkFn: req.check,
          source: source,
          achieved: false,
          penalty: 3000
        });
        t.hasGamble = true;
        t.gambleLabel = '【对赌】' + req.label;
      }
    }

    getGambleAgreements() {
      if (!this.state) return [];
      return this.state.gambleAgreements || [];
    }

    getAllGambleAchieved() {
      if (!this.state || !this.state.gambleAgreements) return false;
      return this.state.gambleAgreements.length > 0 && this.state.gambleAgreements.every(g => g.achieved);
    }

    getFinalSettlement() {
      if (!this.state) return null;

      const rankings = this.getCurrentRankings();
      const debuted = rankings.slice(0, 11);
      const eliminated = rankings.slice(11);

      const totalRevenue = this.state.totalRevenue;
      const totalExpense = this.state.totalExpense;
      const netProfit = totalRevenue - totalExpense;

      const penalties = this.state.sponsorPenalties || [];
      const totalPenalty = penalties.reduce((sum, p) => sum + (p.penaltyAmount || p.amount || 0), 0);

      // 对赌协议结算
      let gamblePenalty = 0;
      let gambleAchieved = 0;
      let gambleTotal = this.state.gambleAgreements.length;
      for (const g of this.state.gambleAgreements) {
        const trainee = this.state.trainees.find(t => t.id === g.traineeId);
        if (trainee) {
          const rank = trainee.currentRank || trainee.rank;
          if (g.checkFn(rank)) {
            g.achieved = true;
            gambleAchieved++;
          }
        }
      }
      const gambleFailed = gambleTotal - gambleAchieved;
      gamblePenalty = gambleFailed * 3000;

      return {
        debuted: debuted.map(t => ({ id: t.id, name: t.name, rank: t.currentRank || t.rank })),
        eliminated: eliminated.map(t => ({ id: t.id, name: t.name })),
        totalRevenue: totalRevenue,
        totalExpense: totalExpense,
        netProfit: netProfit,
        totalPenalty: totalPenalty,
        gamblePenalty: gamblePenalty,
        gambleAchieved: gambleAchieved,
        gambleTotal: gambleTotal,
        finalFunds: this.state.funds,
        ratings: this.state.ratings,
        reputation: this.state.reputation,
        programFans: this.state.programFans
      };
    }

    generateScandals() {
      if (!this.state) return [];
      if (Math.random() > 0.40) return [];

      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return [];

      const count = randInt(1, 3);
      const scandals = [];
      const affected = new Set();

      for (let i = 0; i < count; i++) {
        const weighted = activeTrainees.filter(t => !affected.has(t.id)).map(t => ({
          trainee: t,
          weight: 1 + (t.abilities.variety || 50) / 100
        }));
        if (weighted.length === 0) break;

        const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
        let roll = Math.random() * totalWeight;
        let selected = weighted[0].trainee;
        for (const w of weighted) {
          roll -= w.weight;
          if (roll <= 0) { selected = w.trainee; break; }
        }

        affected.add(selected.id);

        const typeRoll = Math.random();
        let cumulative = 0;
        let scandalType = SCANDAL_TYPES[0];
        for (const st of SCANDAL_TYPES) {
          cumulative += st.probability;
          if (typeRoll <= cumulative) { scandalType = st; break; }
        }

        const descriptions = SCANDAL_DESCRIPTIONS[scandalType.type] || ['负面新闻曝光'];
        const description = pick(descriptions);

        scandals.push({
          id: generateId(),
          traineeId: selected.id,
          traineeName: selected.name,
          scandalType: scandalType.type,
          description: description,
          fanEffect: scandalType.fanEffect,
          handled: false,
          handleMethod: null,
          cost: randInt(500, 2000)
        });
      }

      return scandals;
    }

    refreshScandals() {
      if (!this.state) return [];
      const existing = this.state.scandals || [];
      const unhandled = existing.filter(s => !s.handled && s.handleMethod === null);
      if (unhandled.length > 0) return unhandled;

      const newScandals = this.generateScandals();
      if (newScandals.length > 0) {
        this.state.scandals = [...(this.state.scandals || []), ...newScandals];
      }
      return newScandals;
    }

    handleScandal(scandalId, method) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const scandal = this.state.scandals.find(s => s.id === scandalId);
      if (!scandal) return { success: false, message: '黑料不存在' };
      if (scandal.handled) return { success: false, message: '已处理' };

      const trainee = this.state.trainees.find(t => t.id === scandal.traineeId);

      switch(method) {
        case 'a': {
          const cost = scandal.cost;
          if (this.state.funds < cost) return { success: false, message: `资金不足，需要${cost}万` };

          let successRate = 0.60;
          if (scandal.scandalType === '法制类') successRate = 0.05;
          else if (scandal.scandalType === '性格类') successRate = 0.80;

          this.state.funds -= cost;
          this.state.totalExpense += cost;

          if (Math.random() < successRate) {
            scandal.handled = true;
            scandal.handleMethod = 'a';
            return { success: true, message: `花费${cost}万成功压下${trainee.name}的黑料`, suppressed: true };
          } else {
            scandal.handleMethod = 'a_failed';
            this._applyScandalEffect(scandal, trainee);
            return { success: true, message: `花费${cost}万但未能压下黑料，黑料曝光`, suppressed: false };
          }
        }
        case 'b': {
          const totalFans = trainee.fans.solo + trainee.fans.cp + trainee.fans.passerby;
          const allTrainees = this.state.trainees.filter(t => !t.eliminated);
          const sortedByFans = [...allTrainees].sort((a, b) => {
            const fa = a.fans.solo + a.fans.cp + a.fans.passerby;
            const fb = b.fans.solo + b.fans.cp + b.fans.passerby;
            return fb - fa;
          });
          const isTop10 = sortedByFans.slice(0, 10).some(t => t.id === trainee.id);

          const agreeRate = isTop10 ? 1.0 : 0.5;
          if (Math.random() < agreeRate) {
            scandal.handled = true;
            scandal.handleMethod = 'b';
            return { success: true, message: `经纪公司同意压下${trainee.name}的黑料`, suppressed: true };
          } else {
            scandal.handleMethod = 'b_failed';
            this._applyScandalEffect(scandal, trainee);
            return { success: true, message: `经纪公司拒绝压下黑料，黑料曝光`, suppressed: false };
          }
        }
        case 'c': {
          const cost = scandal.cost;
          if (this.state.funds < cost) return { success: false, message: `资金不足，需要${cost}万` };

          this.state.funds -= cost;
          this.state.totalExpense += cost;

          const otherTypes = SCANDAL_TYPES.filter(st => st.type !== scandal.scandalType);
          const newType = pick(otherTypes);
          const descriptions = SCANDAL_DESCRIPTIONS[newType.type] || ['新的负面新闻'];
          const newDesc = pick(descriptions);

          const newScandal = {
            id: generateId(),
            traineeId: trainee.id,
            traineeName: trainee.name,
            scandalType: newType.type,
            description: newDesc,
            fanEffect: newType.fanEffect,
            handled: false,
            handleMethod: null,
            cost: randInt(500, 2000)
          };
          this.state.scandals.push(newScandal);

          scandal.handleMethod = 'c';
          this._applyScandalEffect(scandal, trainee);

          return { success: true, message: `花费${cost}万购买更多黑料，原黑料曝光并新增一条${newType.type}黑料`, newScandal: newScandal };
        }
        case 'd': {
          scandal.handleMethod = 'd';
          this._applyScandalEffect(scandal, trainee);
          this.state.unhandledScandals = (this.state.unhandledScandals || 0) + 1;
          return { success: true, message: `放任不管，${trainee.name}的黑料曝光`, suppressed: false };
        }
        default:
          return { success: false, message: '无效处理方式' };
      }
    }

    _applyScandalEffect(scandal, trainee) {
      if (!trainee) return;
      const effect = scandal.fanEffect;
      if (effect.solo) trainee.fans.solo = Math.max(0, trainee.fans.solo + Math.round(trainee.fans.solo * effect.solo));
      if (effect.passerby) trainee.fans.passerby = Math.max(0, trainee.fans.passerby + Math.round(trainee.fans.passerby * effect.passerby));
      if (effect.anti) trainee.fans.anti = Math.max(0, trainee.fans.anti + Math.round(trainee.fans.anti * effect.anti));

      this.state.ratings = clamp(this.state.ratings + 0.3, 0, 10);
      this.state.reputation = clamp(this.state.reputation - 3, 0, 100);
    }

    getScandals() {
      if (!this.state) return [];
      return this.state.scandals || [];
    }

    getCurrentRankings() {
      if (!this.state) return [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      return [...activeTrainees].sort((a, b) => {
        const fansA = a.fans.solo + a.fans.cp + a.fans.passerby;
        const fansB = b.fans.solo + b.fans.cp + b.fans.passerby;
        return fansB - fansA;
      }).map((t, idx) => ({ ...t, currentRank: idx + 1 }));
    }

    announcePreRank1(rankToAnnounce, useRealRank = true) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const rankings = this.getCurrentRankings();

      let target;
      if (useRealRank) {
        target = rankings.find(t => t.currentRank === rankToAnnounce);
      } else {
        target = rankings.find(t => t.id === parseInt(rankToAnnounce));
      }

      if (!target) return { success: false, message: '找不到该练习生' };

      target.fans.passerby = Math.min(
        target.fans.passerby + Math.round(target.fans.passerby * 0.05),
        10000
      );
      target.fans.solo = Math.min(
        target.fans.solo + Math.round(target.fans.solo * 0.02),
        10000
      );

      this._finalPhase.announced1.push(target.id);
      this._finalPhase.preRank1Done = true;

      return { 
        success: true, 
        trainee: target, 
        message: useRealRank 
          ? `第${rankToAnnounce}名：${target.name}` 
          : `公布：${target.name}`,
        useRealRank: useRealRank
      };
    }

    announcePreRank2(rankToAnnounce, useRealRank = true) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const rankings = this.getCurrentRankings();

      let target;
      if (useRealRank) {
        target = rankings.find(t => t.currentRank === rankToAnnounce);
      } else {
        target = rankings.find(t => t.id === parseInt(rankToAnnounce));
      }

      if (!target) return { success: false, message: '找不到该练习生' };

      target.fans.passerby = Math.min(
        target.fans.passerby + Math.round(target.fans.passerby * 0.08),
        10000
      );
      target.fans.solo = Math.min(
        target.fans.solo + Math.round(target.fans.solo * 0.04),
        10000
      );

      this._finalPhase.announced2.push(target.id);
      this._finalPhase.preRank2Done = true;

      return { 
        success: true, 
        trainee: target, 
        message: useRealRank 
          ? `第${rankToAnnounce}名：${target.name}` 
          : `公布：${target.name}`,
        useRealRank: useRealRank
      };
    }

    addMusicLicense(songId, cost, songType) {
      return { success: false, message: '已移除音乐版权功能' };
    }

    getMusicLicenses() {
      return [];
    }

    hasMusicLicense(songId) {
      if (!this.state || !this.state.musicLicenses) return false;
      return this.state.musicLicenses.some(l => l.songId === songId);
    }

    generateSongPool() {
      const songs = [];
      const songNames = {
        '大众流行': ['光年之外', '起风了', '漠河舞厅', '孤勇者', '错位时空', '白月光与朱砂痣'],
        '年代金曲': ['海阔天空', '光辉岁月', '朋友', '追梦赤子心', '我的未来不是梦', '红日'],
        'DJ舞曲': ['野狼Disco', '大风吹', '踏山河', '半生雪', '芒种', '少年'],
        '嘻哈说唱': ['说唱天地', '嘻哈少年', 'Rap Star', '说唱新世代', '地下王者', '街头诗人'],
        'dy热曲': ['星辰大海', '可可托海的牧羊人', '白月光', '飞鸟和蝉', '千千万万', '沦陷'],
        '小众原创': ['无名之辈', '深夜独白', '城市之光', '破晓', '逆风飞翔', '寻光']
      };
      for (const typeConfig of SONG_TYPES) {
        const names = songNames[typeConfig.type] || [];
        for (const name of names) {
          const cost = randInt(typeConfig.costRange[0], typeConfig.costRange[1]);
          songs.push({
            id: generateId(), name: name, type: typeConfig.type, cost: cost,
            maxPerSeason: typeConfig.maxPerSeason || null,
            advanceEpisodes: typeConfig.advanceEpisodes || 0
          });
        }
      }
      return songs;
    }

    getVenuePool() {
      return VENUE_TYPES;
    }

    selectVenue(venueType) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const venueConfig = VENUE_TYPES.find(v => v.type === venueType);
      if (!venueConfig) return { success: false, message: '无效的场地类型' };
      const cost = randInt(venueConfig.cost[0], venueConfig.cost[1]);
      if (this.state.funds < cost) return { success: false, message: '资金不足' };
      this.state.funds -= cost;
      this.state.totalExpense += cost;
      this.state.selectedVenue = {
        type: venueType, cost: cost,
        stageBonus: venueConfig.stageBonus, audienceBonus: venueConfig.audienceBonus,
        topicBonus: venueConfig.topicBonus || 0, required: venueConfig.required || false
      };
      return { success: true, message: `成功选择${venueType}，花费${cost}万`, venue: this.state.selectedVenue };
    }

    getStaffPool() {
      return STAFF_TYPES;
    }

    selectStaff(staffType) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const staffConfig = STAFF_TYPES.find(s => s.type === staffType);
      if (!staffConfig) return { success: false, message: '无效的工作人员类型' };
      const cost = randInt(staffConfig.cost[0], staffConfig.cost[1]);
      if (this.state.funds < cost) return { success: false, message: '资金不足' };
      this.state.funds -= cost;
      this.state.totalExpense += cost;
      this.state.selectedStaff = {
        type: staffType, cost: cost,
        editBonus: staffConfig.editBonus || 0, narrativeBonus: staffConfig.narrativeBonus || 0,
        visualBonus: staffConfig.visualBonus || 0, lensBonus: staffConfig.lensBonus || 0,
        imageBonus: staffConfig.imageBonus || 0, topicBonus: staffConfig.topicBonus || 0,
        musicBonus: staffConfig.musicBonus || 0, stageBonus: staffConfig.stageBonus || 0,
        allBonus: staffConfig.allBonus || 0, errorRate: staffConfig.errorRate || 0
      };
      return { success: true, message: `成功选择${staffType}，花费${cost}万`, staff: this.state.selectedStaff };
    }

    validatePrepComplete() {
      if (!this.state) return { complete: false, missing: ['游戏未初始化'] };
      const missing = [];
      const canStart = this.canStartShow();
      if (!canStart.canStart) missing.push(canStart.reason);
      if (this.state.signedSponsors.length < 1) missing.push('至少需要1个赞助商');
      const hasAnyVenue = this.state.selectedVenue !== null;
      if (!hasAnyVenue) missing.push('必须选择场地');
      else {
        const venueType = this.state.selectedVenue.type;
        if (this.state.isFinal || this.state.episode >= 12) {
          if (venueType !== '顶级演播厅' && venueType !== '户外场地') {
            missing.push('总决赛必须使用顶级演播厅或户外场地');
          }
        }
      }
      if (!this.state.selectedStaff) missing.push('必须选择工作人员');
      return {
        complete: missing.length === 0, missing: missing,
        message: missing.length === 0 ? '筹备阶段完成，可以开始节目' : `还缺少：${missing.join('、')}`
      };
    }

    getInitialStageGroups() {
      if (!this.state) return { individual: [], companyGroups: [] };
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const individualTrainees = activeTrainees.filter(t => t.company === '个人练习生');
      const companyMap = new Map();
      for (const trainee of activeTrainees) {
        if (trainee.company !== '个人练习生') {
          if (!companyMap.has(trainee.company)) companyMap.set(trainee.company, []);
          companyMap.get(trainee.company).push(trainee);
        }
      }
      const companyGroups = [];
      for (const [companyName, trainees] of companyMap) {
        companyGroups.push({
          companyName: companyName, trainees: trainees,
          traineeCount: trainees.length, isGroupPerformance: trainees.length > 1
        });
      }
      return {
        individual: individualTrainees.map(t => ({ id: t.id, name: t.name, company: t.company, type: 'individual' })),
        companyGroups: companyGroups
      };
    }

    getPhaseName(episode) {
      if (episode <= 1) return '初舞台';
      if (episode <= 3) return '练习室阶段';
      if (episode <= 5) return '公演准备';
      if (episode === 6) return '第一次淘汰';
      if (episode <= 8) return '公演对抗';
      if (episode === 9) return '第二次淘汰';
      if (episode === 10) return '冲刺阶段';
      if (episode === 11) return '第三次淘汰';
      if (episode === 12) return '总决赛';
      return `第${episode}期`;
    }

    getStageGroups() {
      if (!this.state) return [];
      if (this.state.stageGroups && this.state.stageGroups.length > 0) {
        return this.state.stageGroups;
      }

      const episode = this.state.episode;
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return [];

      if (!this.state.usedSongNames) this.state.usedSongNames = new Set();

      const getUniqueSongs = (count) => {
        const available = ALL_SONG_NAMES.filter(s => !this.state.usedSongNames.has(s));
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        selected.forEach(s => this.state.usedSongNames.add(s));
        return selected;
      };

      const groups = [];
      const groupNames = ['A组', 'B组', 'C组', 'D组', 'E组', 'F组', 'G组', 'H组', 'I组', 'J组', 'K组', 'L组'];

      if (episode <= 2) {
        const companyMap = {};
        for (const t of activeTrainees) {
          if (!companyMap[t.company]) companyMap[t.company] = [];
          companyMap[t.company].push(t);
        }

        const companies = Object.keys(companyMap);
        const songs = getUniqueSongs(companies.length);

        let idx = 0;
        for (const company of companies) {
          const members = companyMap[company];
          groups.push({
            name: company,
            members: members.map(t => t.name),
            memberIds: members.map(t => t.id),
            song: songs[idx] || '自由选曲',
            isCompanyStage: true
          });
          idx++;
        }
      } else if ([4, 5].includes(episode)) {
        const shuffled = [...activeTrainees].sort(() => Math.random() - 0.5);
        const songCount = 10;
        const songs = getUniqueSongs(songCount);
        const perGroup = Math.ceil(shuffled.length / songCount);

        for (let i = 0; i < songCount; i++) {
          const startIdx = i * perGroup;
          const endIdx = Math.min(startIdx + perGroup, shuffled.length);
          const members = shuffled.slice(startIdx, endIdx);
          if (members.length === 0) continue;
          groups.push({
            name: groupNames[i],
            members: members.map(t => t.name),
            memberIds: members.map(t => t.id),
            song: songs[i] || '自由选曲'
          });
        }
      } else if ([7, 8].includes(episode)) {
        const shuffled = [...activeTrainees].sort(() => Math.random() - 0.5);
        const songCount = 7;
        const songs = getUniqueSongs(songCount);
        const perGroup = Math.ceil(shuffled.length / songCount);

        for (let i = 0; i < songCount; i++) {
          const startIdx = i * perGroup;
          const endIdx = Math.min(startIdx + perGroup, shuffled.length);
          const members = shuffled.slice(startIdx, endIdx);
          if (members.length === 0) continue;
          groups.push({
            name: groupNames[i],
            members: members.map(t => t.name),
            memberIds: members.map(t => t.id),
            song: songs[i] || '自由选曲'
          });
        }
      } else if ([10].includes(episode)) {
        const shuffled = [...activeTrainees].sort(() => Math.random() - 0.5);
        const songCount = 5;
        const songs = getUniqueSongs(songCount);
        const perGroup = Math.ceil(shuffled.length / songCount);

        for (let i = 0; i < songCount; i++) {
          const startIdx = i * perGroup;
          const endIdx = Math.min(startIdx + perGroup, shuffled.length);
          const members = shuffled.slice(startIdx, endIdx);
          if (members.length === 0) continue;
          groups.push({
            name: groupNames[i],
            members: members.map(t => t.name),
            memberIds: members.map(t => t.id),
            song: songs[i] || '自由选曲'
          });
        }
      }

      this.state.stageGroups = groups;
      return groups;
    }

    generateEpisodeEvents() {
      if (!this.state) return [];
      if (this.state.currentEpisodeEvents && this.state.currentEpisodeEvents.length > 0) {
        return this.state.currentEpisodeEvents;
      }
      const episode = this.state.episode;
      const eventTypes = this.getEventTypesForEpisode(episode);
      const events = [];
      const count = randInt(5, 7);
      const locations = ['练习室', '宿舍'];
      for (let i = 0; i < count; i++) {
        const type = pick(eventTypes);
        const pool = EVENT_POOL[type] || [];
        if (pool.length === 0) continue;
        const event = pick(pool);
        const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
        const participantCount = event.participants || event.people || 1;
        const participants = [];
        const shuffled = [...activeTrainees].sort(() => Math.random() - 0.5);
        for (let j = 0; j < Math.min(participantCount, shuffled.length); j++) {
          participants.push(shuffled[j]);
        }
        // 根据事件类型选择地点
        let location = pick(locations);
        if (type === 'performance' || type === 'initial_stage') {
          location = '舞台';
        } else if (type === 'ranking') {
          location = '演播厅';
        }
        events.push({
          id: generateId(),
          type: type,
          description: event.description || event.desc || event.name,
          severity: event.severity,
          minutes: event.minutes || 5,
          participants: participants.map(t => ({ id: t.id, name: t.name })),
          location: location,
          options: [
            { key: 'A', label: '完全剪掉', description: '不播出该事件', minutes: 0 },
            { key: 'B', label: '突出能力性格', description: '展现练习生积极一面', minutes: 5 },
            { key: 'C', label: '突出问题冲突', description: '制造话题和戏剧性', minutes: 8 },
            { key: 'D', label: '剪辑CP线', description: '强化两人关系线', minutes: 6 }
          ],
          optionChosen: null
        });
      }
      this.state.currentEpisodeEvents = events;
      return events;
    }

    getEventTypesForEpisode(episode) {
      const isHell = this.state && this.state.gameMode === 'hell';
      if (episode <= 2) return ['initial_stage', ...(isHell ? ['controversy'] : [])];
      if (episode === 3) return ['practice_room', ...(isHell ? ['controversy'] : [])];
      if ([4, 5, 7, 8, 10].includes(episode)) return ['practice_room', 'performance', ...(isHell ? ['controversy'] : [])];
      if ([6, 9, 11].includes(episode)) return ['ranking', ...(isHell ? ['controversy'] : [])];
      return ['practice_room', ...(isHell ? ['controversy'] : [])];
    }

    handleEpisodeEventChoice(eventId, optionKey) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const events = this.state.currentEpisodeEvents || [];
      const event = events.find(e => e.id === eventId);
      if (!event) return { success: false, message: '事件不存在' };
      if (event.optionChosen) return { success: false, message: '已选择' };

      const option = EVENT_OPTIONS[optionKey];
      if (!option) return { success: false, message: '无效选项' };

      if (this.state.episodeTimeUsed + (option.minutes || 0) > this.state.episodeMaxTime) {
        return { success: false, message: '时长不足' };
      }

      event.optionChosen = optionKey;
      this.state.episodeTimeUsed += option.minutes || 0;

      for (const p of event.participants) {
        const trainee = this.state.trainees.find(t => t.id === p.id);
        if (!trainee) continue;
        if (optionKey === 'B') {
          const fanGain = randInt(10, 50);
          trainee.fans.passerby += fanGain;
        } else if (optionKey === 'C') {
          const fanGain = randInt(20, 80);
          trainee.fans.passerby += fanGain;
          trainee.fans.anti += randInt(5, 20);
        } else if (optionKey === 'D') {
          if (event.participants.length >= 2) {
            const fanGain = randInt(30, 100);
            trainee.fans.cp += fanGain;
          }
        }
      }

      return { success: true, message: `事件处理完成：${option.label}`, event: event };
    }

    getEpisodeScenario() {
      if (!this.state) return { pages: [] };
      const episode = this.state.episode;
      const pages = [];
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      const topTrainees = [...activeTrainees].sort((a, b) => a.rank - b.rank).slice(0, 5);
      const randomTrainees = [...activeTrainees].sort(() => Math.random() - 0.5).slice(0, 8);

      const phaseName = this.getPhaseName(episode);

      let content = '';

      if (episode <= 2) {
        content = `<p>100名怀揣梦想的练习生齐聚节目录制基地，正式开启了一段充满挑战与机遇的追梦之旅。初舞台的帷幕即将拉开，每个人都带着各自的故事和期待站在这里。</p>`;
        content += `<p>录制基地的大厅里，练习生们三三两两地聚在一起。来自${randomTrainees[0]?.company || '某公司'}的${randomTrainees[0]?.name || '某练习生'}显得格外紧张，不停地搓着手，而旁边的${randomTrainees[1]?.name || '另一位练习生'}则主动上前搭话，两人很快聊了起来。${randomTrainees[2]?.name || '某练习生'}独自坐在角落里，安静地翻看着手机，似乎在给自己打气。</p>`;
        content += `<p>初舞台以公司为单位进行表演，每家公司都需要展示自己练习生的实力。${topTrainees[0]?.company || '某公司'}的练习生们显得信心十足，${topTrainees[0]?.name || '某练习生'}在排练时展现出了出色的舞台表现力，引来了不少旁人的注目。而${randomTrainees[3]?.name || '某练习生'}在排练中出现了小失误，但很快调整了状态，队友们也给予了鼓励。</p>`;
        content += `<p>导师们陆续到场，SS级导师${this.state.hiredMentors?.[0]?.name || '某导师'}表情严肃地坐在评审席上，不时在本子上记录着什么。练习生们感受到了无形的压力，但也有人将这份压力转化为了动力。</p>`;
        content += `<p>随着初舞台的进行，一些练习生开始崭露头角，而另一些人则面临着巨大的挑战。作为导演，你需要决定如何呈现这些故事，让观众看到最真实、最动人的画面。</p>`;
      } else if (episode === 3) {
        content = `<p>初舞台的硝烟刚刚散去，练习生们便马不停蹄地投入到了紧张的训练中。没有了舞台上的聚光灯，训练室里的每一滴汗水都显得格外真实。</p>`;
        content += `<p>清晨六点，${randomTrainees[0]?.name || '某练习生'}已经出现在了练习室里，反复打磨着舞蹈动作。${randomTrainees[1]?.name || '某练习生'}则在声乐室里一遍又一遍地练习着高音部分，力求完美。而宿舍里，${randomTrainees[2]?.name || '某练习生'}还在熟睡，似乎并没有感受到紧迫感。</p>`;
        content += `<p>午餐时间，${randomTrainees[3]?.name || '某练习生'}和${randomTrainees[4]?.name || '某练习生'}因为使用练习室的时间产生了小小的争执，但很快在其他人的调解下化解了矛盾。${randomTrainees[5]?.name || '某练习生'}主动分享了自己带来的零食，紧张的气氛逐渐缓和。</p>`;
        content += `<p>导师巡场时，${this.state.hiredMentors?.[0]?.name || '某导师'}对${topTrainees[0]?.name || '某练习生'}的表现给予了高度评价，但也指出了${randomTrainees[6]?.name || '某练习生'}在节奏感上的不足。面对批评，有人选择加倍努力，有人则默默流下了眼泪。</p>`;
        content += `<p>这一期没有公演舞台，但训练中的每一个细节都可能成为节目中的精彩片段。作为导演，你需要在平凡的日常中发现不平凡的故事。</p>`;
      } else if ([4, 5].includes(episode)) {
        const groups = this.getStageGroups();
        content = `<p>第一次公演舞台终于到来！练习生们经过数周的刻苦训练，终于要在舞台上展示自己的实力。这一次的公演将决定谁能在竞争中占据有利位置。</p>`;
        content += `<p>分组结果公布后，练习生们迅速进入了备战状态。${groups[0]?.name || 'A组'}演唱《${groups[0]?.song || '某歌曲'}》，${groups[0]?.members?.slice(0, 3).join('、') || '几位练习生'}等人需要在一个团队中磨合配合。${groups[1]?.name || 'B组'}的${groups[1]?.members?.[0] || '某练习生'}主动承担了队长的职责，带领团队进行排练。</p>`;
        content += `<p>排练过程中，${randomTrainees[0]?.name || '某练习生'}和${randomTrainees[1]?.name || '某练习生'}在编舞上产生了分歧，两人各执己见，气氛一度紧张。最终在${randomTrainees[2]?.name || '某练习生'}的协调下，大家达成了共识。</p>`;
        content += `<p>舞台上的灯光亮起，每一组都全力以赴。${topTrainees[0]?.name || '某练习生'}的表现堪称完美，赢得了全场的掌声。而${randomTrainees[3]?.name || '某练习生'}虽然紧张到声音发抖，但依然坚持完成了表演，这份勇气打动了在场的每一个人。</p>`;
        content += `<p>公演结束后，导师们给出了中肯的评价。作为导演，你需要决定如何剪辑这场精彩的公演，让每一份努力都被看见。</p>`;
      } else if (episode === 6) {
        content = `<p>第一次排名公布日，紧张的气氛弥漫在整个录制基地。练习生们穿着统一的服装，排排坐在等候区，等待着命运的宣判。</p>`;
        content += `<p>大屏幕上的数字不断跳动，每公布一个名次，就有人欢喜有人忧。${topTrainees[0]?.name || '某练习生'}毫无悬念地获得了第一名，但脸上并没有太多喜悦，因为知道还有很长的路要走。${randomTrainees[0]?.name || '某练习生'}的名次比预期低了不少，眼眶微微泛红。</p>`;
        content += `<p>淘汰线附近的练习生们更是紧张到无法呼吸。${randomTrainees[1]?.name || '某练习生'}在听到自己安全过关的那一刻，终于忍不住哭了出来。而${randomTrainees[2]?.name || '某练习生'}则遗憾地离开了舞台，临走前拥抱了每一位队友。</p>`;
        content += `<p>被淘汰的练习生们发表了简短的告别感言，有人感谢这段经历，有人遗憾未能走得更远。留下的练习生们默默擦干眼泪，因为他们知道，下一轮的竞争只会更加激烈。</p>`;
        content += `<p>作为导演，你需要用镜头记录下这些真实的情感瞬间，让观众感受到每一份不舍与坚持。</p>`;
      } else if ([7, 8].includes(episode)) {
        const groups = this.getStageGroups();
        content = `<p>第二次公演舞台拉开帷幕！经过上一轮的淘汰，留下的练习生们更加珍惜每一次站上舞台的机会。这一次的公演，竞争更加激烈，每一组都拿出了看家本领。</p>`;
        content += `<p>${groups[0]?.name || 'A组'}选择了《${groups[0]?.song || '某歌曲'}》，${groups[0]?.members?.slice(0, 2).join('和') || '几位练习生'}在排练中展现出了极高的默契度。${groups[1]?.name || 'B组'}的排练则遇到了一些困难，${randomTrainees[0]?.name || '某练习生'}在舞蹈部分总是跟不上节奏，${randomTrainees[1]?.name || '某练习生'}主动留下来陪练到深夜。</p>`;
        content += `<p>舞台上的表演精彩纷呈。${topTrainees[0]?.name || '某练习生'}再次用实力证明了自己的位置，而${randomTrainees[2]?.name || '某练习生'}则实现了惊人的逆袭，从之前的默默无闻到今天的惊艳全场，让所有人都刮目相看。</p>`;
        content += `<p>导师${this.state.hiredMentors?.[0]?.name || '某导师'}在点评时动情地说："看到你们的成长，是我做导师最幸福的时刻。"这句话让不少练习生红了眼眶。</p>`;
        content += `<p>公演的余温还未散去，每个人都在思考自己在节目中的定位。作为导演，你需要捕捉这些微妙的情感变化，为观众呈现一个更加立体的故事。</p>`;
      } else if (episode === 9) {
        content = `<p>第二次排名公布日到来，留下的练习生们已经经历了太多。这一次的淘汰将更加残酷，因为每个人都在为出道位而战。</p>`;
        content += `<p>名次逐一公布，${topTrainees[0]?.name || '某练习生'}依然稳坐榜首，但${randomTrainees[0]?.name || '某练习生'}的名次却出现了大幅下滑，从安全区跌入了危险区。${randomTrainees[1]?.name || '某练习生'}则凭借上期公演的出色表现，名次大幅上升。</p>`;
        content += `<p>淘汰环节，${randomTrainees[2]?.name || '某练习生'}在发表告别感言时泣不成声："我以为我还能再坚持一下......"留下的练习生们纷纷上前拥抱，场面令人动容。</p>`;
        content += `<p>随着人数的减少，出道位的争夺愈发白热化。每个人都知道，接下来的每一期都可能是自己的最后一期。${randomTrainees[3]?.name || '某练习生'}在回到宿舍后独自坐了很久，似乎在思考着什么。</p>`;
        content += `<p>作为导演，你需要在残酷的竞争中找到那些温暖人心的瞬间，让观众看到练习生们之间真挚的情谊。</p>`;
      } else if ([10].includes(episode)) {
        const groups = this.getStageGroups();
        content = `<p>第三次公演——也是总决赛前的最后一次公演！留下的练习生们都知道，这是他们最后一次用舞台证明自己的机会。</p>`;
        content += `<p>${groups[0]?.name || 'A组'}的《${groups[0]?.song || '某歌曲'}》排练中，${randomTrainees[0]?.name || '某练习生'}提出了一个大胆的改编想法，虽然风险很大，但全组决定放手一搏。${groups[1]?.name || 'B组'}则选择了稳扎稳打，${topTrainees[0]?.name || '某练习生'}带领团队反复打磨每一个细节。</p>`;
        content += `<p>舞台上的表演堪称本季最佳。每一组都倾注了全部的心血和情感，${randomTrainees[1]?.name || '某练习生'}在表演中甚至流下了眼泪，但声音依然稳定有力。${randomTrainees[2]?.name || '某练习生'}的高音部分震撼全场，导师们纷纷起立鼓掌。</p>`;
        content += `<p>公演结束后，练习生们紧紧拥抱在一起。不管结果如何，他们都已经在这段旅程中收获了最珍贵的友谊和成长。接下来，就是最后的决战——总决赛。</p>`;
        content += `<p>作为导演，这是你呈现最精彩故事的机会。如何将这些动人的瞬间编织成一段令人难忘的叙事，全在你的剪辑之中。</p>`;
      } else if (episode === 11) {
        content = `<p>最后一次排名公布，也是总决赛前最关键的一战。20名练习生中，只有11人能够出道，竞争已经到了最白热化的阶段。</p>`;
        content += `<p>出道位的争夺异常激烈。${topTrainees[0]?.name || '某练习生'}和${topTrainees[1]?.name || '某练习生'}一直在第一第二名的位置上交替，谁才是最终的C位，悬念依然存在。${randomTrainees[0]?.name || '某练习生'}在第11名到第13名之间徘徊，每一票都可能改变命运。</p>`;
        content += `<p>名次公布的过程中，${randomTrainees[1]?.name || '某练习生'}在听到自己无缘出道时，强忍泪水向晋级的队友送上了祝福。${randomTrainees[2]?.name || '某练习生'}则因为惊险保住出道位而激动得说不出话来。</p>`;
        content += `<p>最终，11名出道练习生诞生了。他们将在总决赛中迎来最后的考验——C位的归属。而遗憾离开的练习生们，也在这段旅程中留下了属于自己的精彩篇章。</p>`;
        content += `<p>作为导演，你见证了这一切的发生。现在，是时候为这档节目画上一个圆满的句号了。</p>`;
      } else {
        content = `<p>节目正在如火如荼地进行中，练习生们在训练和比赛中不断成长。每一天都有新的故事发生，每一个人都在为自己的梦想拼搏。</p>`;
        content += `<p>${randomTrainees[0]?.name || '某练习生'}在今天的训练中表现出色，${randomTrainees[1]?.name || '某练习生'}则遇到了一些困难但依然坚持。${randomTrainees[2]?.name || '某练习生'}和${randomTrainees[3]?.name || '某练习生'}之间的互动引起了不少关注。</p>`;
        content += `<p>作为导演，你需要捕捉这些日常中的闪光点，将它们编织成引人入胜的故事线。</p>`;
      }

      pages.push({ title: `${phaseName}`, content: content });

      if ([4, 5, 7, 8, 10].includes(episode)) {
        const groups = this.getStageGroups();
        let page2Content = `<p>各组练习生正在紧张排练中。以下是本期公演分组：</p>`;
        page2Content += `<div class="scenario-groups">`;
        for (const g of groups) {
          page2Content += `<div class="scenario-group">
        <div class="sg-title">${g.name} - 《${g.song}》</div>
        <div class="sg-members">${g.members.join('、')}</div>
      </div>`;
        }
        page2Content += `</div>`;
        pages.push({ title: '公演分组', content: page2Content });
      } else if ([6, 9, 11].includes(episode)) {
        const targetCounts = { 6: 60, 9: 35, 11: 20 };
        const targetCount = targetCounts[episode] || 100;
        const activeCount = activeTrainees.length;
        const eliminateCount = Math.max(0, activeCount - targetCount);
        let page2Content = `<p>本期将有${eliminateCount}名练习生被淘汰，仅保留${targetCount}名。</p>`;
        pages.push({ title: '淘汰预告', content: page2Content });
      }

      return { pages: pages };
    }

    getFinalScore() {
      if (!this.state) return { groupScore: 0, directorScore: 0 };
      const debutTrainees = this.state.trainees.filter(t => t.debuted);
      if (debutTrainees.length === 0) return { groupScore: 0, directorScore: 0, grade: 'C' };
      const avgAbility = debutTrainees.reduce((sum, t) => sum + this._getAverageAbility(t), 0) / debutTrainees.length;
      const totalFans = debutTrainees.reduce((sum, t) => sum + t.fans.solo + t.fans.cp + t.fans.passerby, 0);
      const avgFans = totalFans / debutTrainees.length;
      const commercialValue = avgFans * 0.5 + avgAbility * 0.3;
      const avgSponsorSatisfaction = this.state.signedSponsors.length > 0
        ? this.state.signedSponsors.reduce((sum, s) => sum + s.satisfaction, 0) / this.state.signedSponsors.length
        : 50;
      const totalPenalty = this.state.sponsorPenalties.reduce((sum, p) => sum + p.penaltyAmount, 0);
      const groupScore = {
        strength: clamp(avgAbility / 100, 0, 1) * 100,
        popularity: clamp(avgFans / 5000, 0, 1) * 100,
        commercial: clamp(commercialValue / 3000, 0, 1) * 100,
        satisfaction: avgSponsorSatisfaction,
        reputation: this.state.reputation
      };
      groupScore.total = (
        groupScore.strength * 0.25 + groupScore.popularity * 0.25 +
        groupScore.commercial * 0.20 + groupScore.satisfaction * 0.15 +
        groupScore.reputation * 0.15
      );
      const financialHealth = clamp((this.state.funds - totalPenalty) / 5000, 0, 1) * 100;
      const ratingsScore = clamp(this.state.ratings / 3, 0, 1) * 100;
      const topicScore = clamp(this.state.reputation, 0, 100);
      const reputationScore = this.state.reputation;
      const goalAchievement = debutTrainees.length >= 11 ? 100 : (debutTrainees.length / 11) * 100;
      const directorScore = {
        finance: financialHealth, ratings: ratingsScore,
        topic: topicScore, reputation: reputationScore, goal: goalAchievement
      };
      directorScore.total = (
        directorScore.finance * 0.20 + directorScore.ratings * 0.20 +
        directorScore.topic * 0.20 + directorScore.reputation * 0.20 +
        directorScore.goal * 0.20
      );
      return { groupScore, directorScore, totalPenalty };
    }

    getGrade() {
      const { groupScore, directorScore } = this.getFinalScore();
      const avgScore = ((groupScore?.total || 0) + (directorScore?.total || 0)) / 2;
      let grade;
      if (avgScore >= 95) grade = 'SSS';
      else if (avgScore >= 85) grade = 'SS';
      else if (avgScore >= 75) grade = 'S';
      else if (avgScore >= 65) grade = 'A';
      else if (avgScore >= 50) grade = 'B';
      else grade = 'C';
      return { grade, groupScore: groupScore?.total || 0, directorScore: directorScore?.total || 0, average: avgScore };
    }

    gatherMaterial(materialType) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.gatheredMaterials) this.state.gatheredMaterials = {};
      if (!this.state.gatheredMaterials[materialType]) {
        this.state.gatheredMaterials[materialType] = [];
      }
      return { success: true };
    }

    addStudioFollow(traineeId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.studioFollows) this.state.studioFollows = [];
      if (this.state.studioFollows.includes(traineeId)) {
        return { success: false, message: '已跟拍该练习生' };
      }
      this.state.studioFollows.push(traineeId);
      return { success: true, message: '已添加跟拍' };
    }

    removeStudioFollow(traineeId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.studioFollows) return { success: false };
      const idx = this.state.studioFollows.indexOf(traineeId);
      if (idx >= 0) {
        this.state.studioFollows.splice(idx, 1);
        return { success: true };
      }
      return { success: false };
    }

    getStudioFollows() {
      if (!this.state) return [];
      return this.state.studioFollows || [];
    }

    addPracticeMaterial(eventId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.practiceMaterials) this.state.practiceMaterials = [];
      if (this.state.practiceMaterials.includes(eventId)) {
        return { success: false, message: '已取材该事件' };
      }
      this.state.practiceMaterials.push(eventId);
      return { success: true, message: '已取材' };
    }

    removePracticeMaterial(eventId) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      if (!this.state.practiceMaterials) return { success: false };
      const idx = this.state.practiceMaterials.indexOf(eventId);
      if (idx >= 0) {
        this.state.practiceMaterials.splice(idx, 1);
        return { success: true };
      }
      return { success: false };
    }

    getStageMaterials() {
      if (!this.state) return [];
      const groups = this.getStageGroups();
      return groups.map(g => ({
        groupId: g.name,
        song: g.song,
        members: g.members,
        memberIds: g.memberIds,
        minutes: g.memberIds.length * 5,
        materialType: 'stage'
      }));
    }

    getEditingMaterials() {
      if (!this.state) return [];
      const materials = [];

      const follows = this.state.studioFollows || [];
      for (const tid of follows) {
        const t = this.state.trainees.find(tr => tr.id === tid);
        if (t && !t.eliminated) {
          materials.push({
            id: 'studio_' + tid,
            type: 'studio',
            name: `${t.name} 演播室跟拍`,
            traineeIds: [tid],
            minutes: 5,
            editOption: null
          });
        }
      }

      const practiceMats = this.state.practiceMaterials || [];
      const events = this.state.currentEpisodeEvents || [];
      for (const eid of practiceMats) {
        const event = events.find(e => e.id === eid);
        if (event) {
          materials.push({
            id: 'practice_' + eid,
            type: 'practice',
            name: event.description,
            traineeIds: event.participants.map(p => p.id),
            minutes: event.minutes || 5,
            editOption: null
          });
        }
      }

      const stageGroups = this.getStageGroups();
      const episode = this.state.episode;
      if ([1, 2, 4, 5, 7, 8, 10].includes(episode)) {
        const stageSubType = episode === 1 ? 'first' : 'public';
        for (const g of stageGroups) {
          materials.push({
            id: 'stage_' + g.name,
            type: 'stage',
            stageSubType: stageSubType,
            name: `${g.name} - 《${g.song}》`,
            traineeIds: g.memberIds,
            minutes: g.memberIds.length * 5,
            editOption: null
          });
        }
      }

      return materials;
    }

    editMaterial(materialId, optionKey) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const materials = this.getEditingMaterials();
      const material = materials.find(m => m.id === materialId);
      if (!material) return { success: false, message: '素材不存在' };

      const editOptions = {
        'A': { label: '一剪梅', minutes: 0 },
        'B': { label: '突出能力', minutes: 3 },
        'C': { label: '突出问题', minutes: 3 },
        'D': { label: 'CP线', minutes: 5 }
      };

      const option = editOptions[optionKey];
      if (!option) return { success: false, message: '无效选项' };

      if (!this.state.editedMaterials) this.state.editedMaterials = [];

      const sponsorTime = this._getSponsorTime();
      const totalEdited = this.state.editedMaterials.reduce((sum, m) => sum + (m.editedMinutes || 0), 0);
      if (totalEdited + option.minutes > this.state.episodeMaxTime - sponsorTime) {
        return { success: false, message: '时长不足' };
      }

      const isStage = material.type === 'stage';
      const stageSubType = material.stageSubType || null;

      this.state.editedMaterials.push({
        materialId: materialId,
        optionKey: optionKey,
        editedMinutes: option.minutes,
        traineeIds: material.traineeIds,
        isStage: isStage
      });

      // 累计剪辑次数统计
      if (!this.state.totalEditCounts) this.state.totalEditCounts = { problem: 0, ability: 0, cp: 0 };
      if (optionKey === 'C') this.state.totalEditCounts.problem++;
      else if (optionKey === 'B') this.state.totalEditCounts.ability++;
      else if (optionKey === 'D') this.state.totalEditCounts.cp++;

      for (const tid of material.traineeIds) {
        const trainee = this.state.trainees.find(t => t.id === tid);
        if (!trainee) continue;

        if (isStage) {
          if (optionKey === 'C') {
            if (stageSubType === 'first') {
              trainee.fans.passerby = Math.max(0, Math.round(trainee.fans.passerby * 0.95));
              trainee.fans.solo = Math.max(0, Math.round(trainee.fans.solo * 0.995));
            } else if (stageSubType === 'public') {
              trainee.fans.passerby = Math.max(0, Math.round(trainee.fans.passerby * 0.9));
              trainee.fans.solo = Math.max(0, Math.round(trainee.fans.solo * 0.99));
            }
          } else if (optionKey === 'B') {
            trainee.fans.passerby += isStage ? randInt(20, 60) : randInt(10, 50);
            trainee.fans.solo += randInt(5, 20);
          } else if (optionKey === 'D') {
            if (material.traineeIds.length >= 2) {
              trainee.fans.cp += isStage ? randInt(40, 120) : randInt(30, 100);
            }
          }
        } else {
          if (optionKey === 'A') {
          } else if (optionKey === 'B') {
            trainee.fans.passerby += Math.round(trainee.fans.passerby * 0.05);
            trainee.fans.solo += Math.round(trainee.fans.solo * 0.01);
          } else if (optionKey === 'C') {
            trainee.fans.passerby = Math.max(0, Math.round(trainee.fans.passerby * 0.95));
            trainee.fans.solo = Math.max(0, Math.round(trainee.fans.solo * 0.995));
          } else if (optionKey === 'D') {
            trainee.fans.solo += Math.round(trainee.fans.solo * 0.005);
            trainee.fans.cp += Math.round(trainee.fans.cp * 0.1);
          }
        }
      }

      return { success: true, message: `已剪辑：${option.label}`, editedMinutes: option.minutes };
    }

    _getSponsorTime() {
      if (!this.state) return 0;
      const sponsorCount = this.state.signedSponsors.length;
      return Math.min(sponsorCount * 3, 15);
    }

    getEditedMaterials() {
      if (!this.state) return [];
      return this.state.editedMaterials || [];
    }

    getTotalEditedTime() {
      if (!this.state) return 0;
      return (this.state.editedMaterials || []).reduce((sum, m) => sum + (m.editedMinutes || 0), 0);
    }

    nextEpisode() {
      if (!this.state) return { success: false, message: '游戏未初始化' };

      // 第一期开始前生成对赌协议
      if (this.state.episode === 1 && (!this.state.gambleAgreements || this.state.gambleAgreements.length === 0)) {
        this._generateGambleAgreements();
      }

      this.state.episodeTimeUsed = 0;
      this.state.btsTimeUsed = 0;
      this._currentEvents = [];
      this._businessOpportunities = [];
      this._merchSold = false;
      this.state.stageGroups = null;
      this.state.currentEpisodeEvents = null;
      this.state.currentBTSEvents = null;
      this.state.editingTime = { studio: 0, practice: 0, dorm: 0, stage: 0, sponsor: 0 };
      this.state.btsEditingTime = { practice: 0, dorm: 0, sponsor: 0 };
      this.state.studioFollows = [];
      this.state.practiceMaterials = [];
      this.state.gatheredMaterials = {};
      this.state.editedMaterials = [];
      this.state.scandals = [];
      this.state.unhandledScandals = 0;

      if (this.state.episode >= 12) {
        this.state.isFinal = true;
        return { success: true, message: '已进入总决赛阶段', episode: this.state.episode, isFinal: true };
      }

      this.state.episode++;

      // 保存本期邀请的艺人（重置前），用于应用效果
      const currentInvitedArtists = this.state.invitedArtists || [];
      this.state.invitedArtists = [];

      // 应用邀请艺人效果（收视率加成先于_updateRatings，粉丝加成在自然涨粉后）
      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);

      // 不邀请艺人的惩罚
      if (currentInvitedArtists.length === 0 && this.state.episode > 1) {
        for (const t of activeTrainees) {
          t.fans.passerby = Math.round(t.fans.passerby * 0.90);
        }
      }

      // 应用邀请艺人粉丝加成（在_updateRatings之前，因为ratings依赖粉丝数）
      for (const artist of currentInvitedArtists) {
        for (const t of activeTrainees) {
          t.fans.passerby = Math.round(t.fans.passerby * (1 + (artist.passerbyBoost || 0)));
          t.fans.cp = Math.round(t.fans.cp * (1 + (artist.cpBoost || 0)));
          t.fans.solo = Math.round(t.fans.solo * (1 + (artist.soloBoost || 0)));
        }
      }

      this._updateProgramFans();
      this._updateRatings();

      // 邀请艺人收视率加成（在_updateRatings之后叠加）
      for (const artist of currentInvitedArtists) {
        this.state.ratings += (artist.ratingBoost || 0);
      }
      this.state.ratings = clamp(this.state.ratings, 0.1, 5.0);

      this.applyNaturalFanGrowth();
      this._updateSponsorSatisfaction();
      this.updateSponsorStatus();
      this.processSponsorPenalties();
      return {
        success: true,
        message: `进入第${this.state.episode}期（${this.getPhaseName(this.state.episode)}）`,
        episode: this.state.episode, isFinal: false
      };
    }

    _updateProgramFans() {
      if (!this.state) return;
      const totalFans = this.state.trainees.reduce((sum, t) =>
        sum + t.fans.solo + t.fans.cp + t.fans.passerby, 0
      );
      this.state.programFans = totalFans;
    }

    _updateRatings() {
      if (!this.state) return;
      const fanFactor = Math.min(this.state.programFans / 50000, 1);
      const repFactor = this.state.reputation / 100;
      const baseRating = 0.5;
      const maxRating = 5.0;
      this.state.ratings = clamp(
        baseRating + (maxRating - baseRating) * (fanFactor * 0.6 + repFactor * 0.4) + randFloat(-0.2, 0.2),
        0.1, maxRating
      );
    }

    _updateSponsorSatisfaction() {
      if (!this.state) return;
      for (const sponsor of this.state.signedSponsors) {
        sponsor.satisfaction = clamp(sponsor.satisfaction + randInt(-5, 5), 0, 100);
      }
    }

    applyBTSEditing(traineeId, minutes) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const trainee = this.state.trainees.find(t => t.id === traineeId);
      if (!trainee) return { success: false, message: '练习生不存在' };
      if (this.state.btsTimeUsed + minutes > this.state.btsMaxTime) {
        return { success: false, message: '花絮时长不足' };
      }
      this.state.btsTimeUsed += minutes;
      const passerbyGain = Math.round(minutes * randFloat(0.5, 2));
      const cpGain = Math.round(minutes * randFloat(0.2, 1));
      trainee.fans.passerby += passerbyGain;
      trainee.fans.cp += cpGain;
      return {
        success: true,
        message: `花絮剪辑完成，${trainee.name} 路人粉+${passerbyGain}，CP粉+${cpGain}`,
        passerbyGain, cpGain
      };
    }

    generateBTSEvents() {
      if (!this.state) return [];
      if (this.state.currentBTSEvents && this.state.currentBTSEvents.length > 0) {
        return this.state.currentBTSEvents;
      }

      const activeTrainees = this.state.trainees.filter(t => !t.eliminated);
      if (activeTrainees.length === 0) return [];

      const btsEventTypes = ['practice_room'];
      const events = [];
      const count = randInt(3, 5);

      for (let i = 0; i < count; i++) {
        const type = pick(btsEventTypes);
        const pool = EVENT_POOL[type] || [];
        if (pool.length === 0) continue;
        const event = pick(pool);
        const participantCount = typeof event.people === 'number' ? event.people : randInt(1, 3);
        const participants = [];
        const shuffled = [...activeTrainees].sort(() => Math.random() - 0.5);
        for (let j = 0; j < Math.min(participantCount, shuffled.length); j++) {
          participants.push(shuffled[j]);
        }
        events.push({
          id: generateId(),
          type: 'bts',
          sourceType: type,
          description: event.desc || event.name,
          severity: event.severity,
          minutes: Math.min(event.minutes || 5, 20),
          participants: participants.map(t => ({ id: t.id, name: t.name })),
          optionChosen: null
        });
      }

      this.state.currentBTSEvents = events;
      return events;
    }

    handleBTSEventChoice(eventId, optionKey) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const events = this.state.currentBTSEvents || [];
      const event = events.find(e => e.id === eventId);
      if (!event) return { success: false, message: '事件不存在' };
      if (event.optionChosen) return { success: false, message: '已选择' };

      const option = EVENT_OPTIONS[optionKey];
      if (!option) return { success: false, message: '无效选项' };

      const minutesUsed = option.minutes || 0;
      if (this.state.btsTimeUsed + minutesUsed > this.state.btsMaxTime) {
        return { success: false, message: '花絮时长不足' };
      }

      event.optionChosen = optionKey;
      this.state.btsTimeUsed += minutesUsed;

      for (const p of event.participants) {
        const trainee = this.state.trainees.find(t => t.id === p.id);
        if (!trainee) continue;
        if (optionKey === 'B') {
          trainee.fans.passerby += randInt(10, 50);
        } else if (optionKey === 'C') {
          trainee.fans.passerby += randInt(20, 80);
          trainee.fans.anti += randInt(5, 20);
        } else if (optionKey === 'D') {
          if (event.participants.length >= 2) {
            trainee.fans.cp += randInt(30, 100);
          }
        }
      }

      return { success: true, message: `花絮事件处理完成：${option.label}`, event: event };
    }

    applyMentorTraining(mentorId, traineeIds) {
      if (!this.state) return { success: false, message: '游戏未初始化' };
      const mentor = this.state.hiredMentors.find(m => m.id === mentorId);
      if (!mentor) return { success: false, message: '导师未雇佣' };
      const trainees = traineeIds.map(id => this.state.trainees.find(t => t.id === id)).filter(Boolean);
      if (trainees.length === 0) return { success: false, message: '未选择练习生' };
      const results = [];
      for (const trainee of trainees) {
        if (trainee.eliminated) continue;
        const specialtyMap = {
          vocal: 'sing', dance: 'dance', rap: 'rap',
          comprehensive: null, performance: 'variety'
        };
        const targetAbility = specialtyMap[mentor.specialty];
        const effectValue = Math.round(mentor.effect * randFloat(0.5, 1.0));
        if (targetAbility && trainee.abilities.hasOwnProperty(targetAbility)) {
          trainee.abilities[targetAbility] = clamp(trainee.abilities[targetAbility] + effectValue, 1, 100);
          results.push({ traineeName: trainee.name, ability: targetAbility, improvement: effectValue });
        } else if (mentor.specialty === 'comprehensive') {
          const keys = Object.keys(trainee.abilities);
          const improvement = Math.round(effectValue / keys.length);
          for (const key of keys) {
            trainee.abilities[key] = clamp(trainee.abilities[key] + improvement, 1, 100);
          }
          results.push({ traineeName: trainee.name, ability: '综合', improvement: improvement });
        }
        if (mentor.strictness === 'stern') {
          trainee.otherAbilities.stressResistance = clamp(
            trainee.otherAbilities.stressResistance + randInt(1, 3), 1, 100
          );
        }
      }
      return { success: true, message: `导师 ${mentor.name} 训练完成`, results };
    }

    // ========== 总决赛观众点评 ==========
    getAudienceComments(trainees) {
      // trainees: 出道11人（已按排名排序）
      // 多项命中则并列展示
      const commentMap = {}; // traineeId -> [tags]

      // 规则1：路人粉低于30% OR 镜头不超过20分钟 → 黑幕
      for (const t of trainees) {
        const totalFans = (t.fans.solo || 0) + (t.fans.cp || 0) + (t.fans.passerby || 0) + (t.fans.anti || 0);
        const passerbyRatio = totalFans > 0 ? (t.fans.passerby || 0) / totalFans : 0;
        const screenTime = t.totalScreenTime || randInt(5, 90);
        if (passerbyRatio < 0.3 || screenTime <= 20) {
          if (!commentMap[t.id]) commentMap[t.id] = [];
          commentMap[t.id].push({ tag: '🎭 黑幕', desc: passerbyRatio < 0.3 ? '路人缘太差，疑似暗箱操作保送' : '镜头少得可怜 查无此人' });
        }
      }

      // 规则2：没有一项业务能力超过80 → 美丽five
      for (const t of trainees) {
        const maxAbility = Math.max(t.abilities.look, t.abilities.sing, t.abilities.dance, t.abilities.rap, t.abilities.create, t.abilities.variety);
        if (maxAbility <= 80) {
          if (!commentMap[t.id]) commentMap[t.id] = [];
          commentMap[t.id].push({ tag: '🦋 美丽five', desc: '业务能力全面平庸，全靠脸吃饭' });
        }
      }

      // 规则3：CP粉团内最多的两个人 → 麦麸专家
      const cpSorted = [...trainees].sort((a, b) => (b.fans.cp || 0) - (a.fans.cp || 0));
      if (cpSorted.length >= 2 && (cpSorted[0].fans.cp || 0) > 0) {
        if (!commentMap[cpSorted[0].id]) commentMap[cpSorted[0].id] = [];
        commentMap[cpSorted[0].id].push({ tag: '💕 麦麸专家', desc: 'CP粉最多，靠炒CP上位' });
        if (!commentMap[cpSorted[1].id]) commentMap[cpSorted[1].id] = [];
        commentMap[cpSorted[1].id].push({ tag: '💕 麦麸专家', desc: 'CP粉第二多，CP营业达人' });
      }

      // 规则4：唯粉数量团内最高 → 购买力TOP
      const soloSorted = [...trainees].sort((a, b) => (b.fans.solo || 0) - (a.fans.solo || 0));
      if (soloSorted.length >= 1 && (soloSorted[0].fans.solo || 0) > 0) {
        if (!commentMap[soloSorted[0].id]) commentMap[soloSorted[0].id] = [];
        commentMap[soloSorted[0].id].push({ tag: '💰 购买力TOP', desc: '唯粉数量全团最高，氪金能力惊人' });
      }

      // 规则5：路人粉数量团内最高 → 国民度TOP
      const passerbySorted = [...trainees].sort((a, b) => (b.fans.passerby || 0) - (a.fans.passerby || 0));
      if (passerbySorted.length >= 1 && (passerbySorted[0].fans.passerby || 0) > 0) {
        if (!commentMap[passerbySorted[0].id]) commentMap[passerbySorted[0].id] = [];
        commentMap[passerbySorted[0].id].push({ tag: '🌟 国民度TOP', desc: '路人粉数量全团最高，国民认知度一流' });
      }

      // 规则6：声乐+舞蹈能力全团最高 → 全能ACE
      const aceSorted = [...trainees].sort((a, b) => {
        const aScore = (a.abilities.sing || 0) + (a.abilities.dance || 0);
        const bScore = (b.abilities.sing || 0) + (b.abilities.dance || 0);
        return bScore - aScore;
      });
      if (aceSorted.length >= 1) {
        if (!commentMap[aceSorted[0].id]) commentMap[aceSorted[0].id] = [];
        commentMap[aceSorted[0].id].push({ tag: '👑 全能ACE', desc: '声乐+舞蹈能力全团最高，综合实力最强' });
      }

      // 规则7：声乐能力在90以上且团内最高的2个人 → 大主唱
      const vocalSorted = [...trainees]
        .filter(t => (t.abilities.sing || 0) >= 90)
        .sort((a, b) => (b.abilities.sing || 0) - (a.abilities.sing || 0));
      if (vocalSorted.length >= 1) {
        if (!commentMap[vocalSorted[0].id]) commentMap[vocalSorted[0].id] = [];
        commentMap[vocalSorted[0].id].push({ tag: '🎤 大主唱', desc: '声乐能力90+且全团最高，天籁之音' });
        if (vocalSorted.length >= 2) {
          if (!commentMap[vocalSorted[1].id]) commentMap[vocalSorted[1].id] = [];
          commentMap[vocalSorted[1].id].push({ tag: '🎤 大主唱', desc: '声乐能力90+且全团第二，实力vocal' });
        }
      }

      // 规则8：颜值团内最高的1个人 → 神颜门面
      const lookSorted = [...trainees].sort((a, b) => (b.abilities.look || 0) - (a.abilities.look || 0));
      if (lookSorted.length >= 1) {
        if (!commentMap[lookSorted[0].id]) commentMap[lookSorted[0].id] = [];
        commentMap[lookSorted[0].id].push({ tag: '✨ 神颜门面', desc: '颜值全团最高，门面担当' });
      }

      // 规则9：说唱+制作能力全团最高 → 爱豆制作人
      const producerSorted = [...trainees].sort((a, b) => {
        const aScore = (a.abilities.rap || 0) + (a.abilities.create || 0);
        const bScore = (b.abilities.rap || 0) + (b.abilities.create || 0);
        return bScore - aScore;
      });
      if (producerSorted.length >= 1) {
        if (!commentMap[producerSorted[0].id]) commentMap[producerSorted[0].id] = [];
        commentMap[producerSorted[0].id].push({ tag: '🎹 爱豆制作人', desc: '说唱+制作能力全团最高，创作才子' });
      }

      // 规则10：综艺全团最高的2个人 → 开心果
      const varietySorted = [...trainees].sort((a, b) => (b.abilities.variety || 0) - (a.abilities.variety || 0));
      if (varietySorted.length >= 1) {
        if (!commentMap[varietySorted[0].id]) commentMap[varietySorted[0].id] = [];
        commentMap[varietySorted[0].id].push({ tag: '😄 开心果', desc: '综艺感全团最强，搞笑担当' });
        if (varietySorted.length >= 2) {
          if (!commentMap[varietySorted[1].id]) commentMap[varietySorted[1].id] = [];
          commentMap[varietySorted[1].id].push({ tag: '😄 开心果', desc: '综艺感全团第二，气氛担当' });
        }
      }

      return commentMap;
    }

    // ========== 位置分配 ==========
    getPositionAssignments(trainee) {
      const abilityMap = {
        look: '颜值担当', sing: '声乐担当', dance: '舞蹈担当',
        rap: '说唱担当', create: '创作担当', variety: '综艺担当'
      };
      const positions = [];
      for (const [key, label] of Object.entries(abilityMap)) {
        if ((trainee.abilities[key] || 0) > 80) {
          positions.push(label);
        }
      }
      return positions.length > 0 ? positions : ['全能练习生'];
    }

    // ========== 团体称号 ==========
    getGroupTitle(trainees) {
      const countMap = { '颜值担当': 0, '声乐担当': 0, '舞蹈担当': 0, '说唱担当': 0, '创作担当': 0, '综艺担当': 0 };
      for (const t of trainees) {
        const positions = this.getPositionAssignments(t);
        for (const p of positions) {
          if (countMap.hasOwnProperty(p)) countMap[p]++;
        }
      }

      // 顶配男团：颜值担当≥2 and 声乐担当≥3 and 舞蹈担当≥4 and 说唱担当≥2 and 创作担当≥1 and 综艺担当≥2
      if (countMap['颜值担当'] >= 2 && countMap['声乐担当'] >= 3 && countMap['舞蹈担当'] >= 4 && countMap['说唱担当'] >= 2 && countMap['创作担当'] >= 1 && countMap['综艺担当'] >= 2) {
        return { title: '🏆 顶配男团', desc: '六边形战士，无短板组合！' };
      }
      // 标准组合：颜值担当≥2 and 声乐担当≥3 and 舞蹈担当≥3 and 说唱担当≥1
      if (countMap['颜值担当'] >= 2 && countMap['声乐担当'] >= 3 && countMap['舞蹈担当'] >= 3 && countMap['说唱担当'] >= 1) {
        return { title: '⭐ 标准组合', desc: '配置均衡，中规中矩的合格男团' };
      }
      // 全员愁人：颜值担当=0
      if (countMap['颜值担当'] === 0) {
        return { title: '😱 全员愁人', desc: '一个能打的都没有...颜值即正义' };
      }
      // 从不开麦：声乐担当＜3
      if (countMap['声乐担当'] < 3) {
        return { title: '🔇 从不开麦', desc: '声乐担当不足，全靠伴奏撑场' };
      }
      // 听歌罚站：舞蹈担当＜3
      if (countMap['舞蹈担当'] < 3) {
        return { title: '🪑 听歌罚站', desc: '舞蹈担当不足，舞台像罚站' };
      }
      // 无趣组合：综艺担当＜3
      if (countMap['综艺担当'] < 3) {
        return { title: '😴 无趣组合', desc: '综艺担当不足，缺乏综艺感' };
      }
      return { title: '😐 普普通通', desc: '没什么特别的，泯然众人' };
    }

    // ========== 节目评价 & 剪辑时长统计 ==========
    getProgramEvaluation() {
      if (!this.state) return { programTag: '', hateTop3: [], royalTop3: [], ghostTop3: [] };

      const editedMaterials = this.state.editedMaterials || [];
      // 统计各类剪辑的累计次数
      const counts = this.state.totalEditCounts || { problem: 0, ability: 0, cp: 0 };
      const problemCount = counts.problem || 0;
      const cpCount = counts.cp || 0;
      const abilityCount = counts.ability || 0;

      // 节目评价：根据剪辑次数判断（并列时优先级：问题 > CP > 能力）
      let programTag = '';
      if (problemCount >= cpCount && problemCount >= abilityCount && problemCount > 0) {
        programTag = '🎭 宫斗大戏';
      } else if (cpCount >= abilityCount && cpCount > 0) {
        programTag = '💕 本质恋综';
      } else {
        programTag = '🍚 下饭神作';
      }

      const traineeEditMinutes = {};
      const traineeProblemMinutes = {};

      for (const m of editedMaterials) {
        const mins = m.editedMinutes || 0;
        for (const tid of (m.traineeIds || [])) {
          traineeEditMinutes[tid] = (traineeEditMinutes[tid] || 0) + mins;
          if (m.optionKey === 'C') {
            traineeProblemMinutes[tid] = (traineeProblemMinutes[tid] || 0) + mins;
          }
        }
      }

      // 只考虑未被淘汰的选手（决赛圈）
      const activeTrainees = (this.state.trainees || []).filter(t => !t.eliminated);
      const top20 = activeTrainees.slice(0, 20);

      const top20WithData = top20.map(t => ({
        id: t.id, name: t.name, rank: t.rank, initialRank: t.initialRank || t.rank,
        totalMinutes: traineeEditMinutes[t.id] || 0,
        problemMinutes: traineeProblemMinutes[t.id] || 0
      }));

      // 你好恨他：决赛圈20人里突出问题类剪辑时长最长的3个人
      const byProblem = [...top20WithData].sort((a, b) => b.problemMinutes - a.problemMinutes);
      const usedIds = new Set();
      const hateTop3 = [];
      for (const t of byProblem) {
        if (hateTop3.length >= 3) break;
        if (usedIds.has(t.id)) continue;
        usedIds.add(t.id);
        hateTop3.push({ ...t, tag: '😡 你好恨他' });
      }

      // 强捧皇族：决赛圈20人里总剪辑时长最长的3个人（与你好恨他不重复）
      const byTotal = [...top20WithData].sort((a, b) => b.totalMinutes - a.totalMinutes);
      const royalTop3 = [];
      for (const t of byTotal) {
        if (royalTop3.length >= 3) break;
        if (usedIds.has(t.id)) continue;
        usedIds.add(t.id);
        royalTop3.push({ ...t, tag: '👑 强捧皇族' });
      }

      // 疑似参赛：决赛圈20人里剪辑时长最少的3个人（与前两个分类不重复）
      const byLeast = [...top20WithData].sort((a, b) => a.totalMinutes - b.totalMinutes);
      const ghostTop3 = [];
      for (const t of byLeast) {
        if (ghostTop3.length >= 3) break;
        if (usedIds.has(t.id)) continue;
        usedIds.add(t.id);
        ghostTop3.push({ ...t, tag: '🤔 疑似参赛' });
      }

      return { programTag, hateTop3, royalTop3, ghostTop3, directorTags: this._getDirectorTags() };
    }

    _getDirectorTags() {
      const tags = [];
      const state = this.state;

      // (1) 购买营销超过20次：买粉达人
      if ((state.totalMarketingCount || 0) > 20) {
        tags.push({ icon: '📢', label: '买粉达人', desc: '购买营销超过20次' });
      }

      // (2) 接受商务超过20次：生财有道
      if ((state.totalBusinessAccept || 0) > 20) {
        tags.push({ icon: '💰', label: '生财有道', desc: '接受商务超过20次' });
      }

      // (3) 突出问题类剪辑超过50次：恶剪专家
      const counts = state.totalEditCounts || { problem: 0, ability: 0, cp: 0 };
      if ((counts.problem || 0) > 50) {
        tags.push({ icon: '🔪', label: '恶剪专家', desc: '突出问题类剪辑超过50次' });
      }

      // (4) CP类剪辑超过40次：恋综预备
      if ((counts.cp || 0) > 40) {
        tags.push({ icon: '💕', label: '恋综预备', desc: 'CP类剪辑超过40次' });
      }

      // (5) 突出能力类剪辑超过50次：皆大欢喜
      if ((counts.ability || 0) > 50) {
        tags.push({ icon: '🎉', label: '皆大欢喜', desc: '突出能力类剪辑超过50次' });
      }

      // (6) 邀请艺人累计花费超过6000万：豪华阵容
      if ((state.totalInviteCost || 0) > 6000) {
        tags.push({ icon: '🌟', label: '豪华阵容', desc: '邀请艺人累计花费超过6000万' });
      }

      // (7) 达成所有对赌协议：迫于生计
      if (this.getAllGambleAchieved()) {
        tags.push({ icon: '😰', label: '迫于生计', desc: '达成所有对赌协议' });
      }

      // (8) 筹备阶段签约6家以上赞助商：金牌销售
      if ((state.signedSponsors || []).length >= 6) {
        tags.push({ icon: '🏆', label: '金牌销售', desc: '签约6家以上赞助商' });
      }

      // (9) 最终出道成团11人中有3个及以上A等级：国民PD
      const rankings = this.getCurrentRankings ? this.getCurrentRankings() : [];
      const debuted = rankings.slice(0, 11);
      const gradeACount = debuted.filter(t => t.grade === 'A' || t.grade === 'S' || t.grade === 'SS' || t.grade === 'SSS').length;
      if (gradeACount >= 3) {
        tags.push({ icon: '🎯', label: '国民PD', desc: '出道成团中有3个及以上A等级练习生' });
      }

      return tags;
    }

    // ========== 未来3年发展模拟 ==========
    getFutureDevelopment(trainees) {
      const developments = [];
      const careerMap = {
        look: '演员', sing: '歌手', dance: '舞者',
        rap: 'rapper', create: '制作人', variety: '综艺咖'
      };
      const careerTemplates = {
        '演员': [
          '签约影视公司，从配角做起，三年内出演了{n}部网剧，逐渐积累演技经验',
          '凭借出众外形接下首个代言，随后转型演员，在都市剧中崭露头角',
          '被星探发掘进入演艺圈，从广告模特起步，逐步获得电视剧角色',
          '参加演技类综艺获得关注，随后签约经纪公司正式转型演员'
        ],
        '歌手': [
          '发行个人单曲，在音乐平台获得{n}万播放量，逐渐建立音乐人身份',
          '签约唱片公司，推出首张EP，以独特嗓音在小众音乐圈获得认可',
          '参加音乐类节目翻红，随后发行个人专辑，开启全国巡演',
          '与知名制作人合作推出单曲，凭借实力唱功赢得乐评人好评'
        ],
        '舞者': [
          '加入顶级舞团，参与多个商业演出和MV拍摄，成为业内知名舞者',
          '开设个人舞蹈工作室，在短视频平台分享编舞获得百万粉丝',
          '受邀担任知名歌手演唱会伴舞，随后成立自己的舞蹈厂牌',
          '参加舞蹈竞技类节目夺冠，成为新生代舞蹈代表人物'
        ],
        'rapper': [
          '地下说唱圈摸爬滚打，发行mixtape获得圈内认可，逐渐走向主流',
          '参加说唱综艺表现亮眼，签约厂牌后发行个人专辑',
          '在短视频平台发布原创说唱作品走红，商业演出邀约不断',
          '与多位知名rapper合作featuring，建立个人音乐品牌'
        ],
        '制作人': [
          '转型幕后制作，为多位歌手创作歌曲，成为业内新锐制作人',
          '成立个人音乐工作室，为影视剧制作OST，逐渐打开知名度',
          '参加创作类综艺展示才华，获得多家公司抛出橄榄枝',
          '自学编曲混音，在网络平台发布beat获得关注，走上职业制作人道路'
        ],
        '综艺咖': [
          '凭借综艺感成为各大综艺常客，三年内录制了{n}档节目',
          '转型综艺主持人，以幽默风格获得观众喜爱，片约不断',
          '在直播平台开启个人频道，以互动能力吸引大批粉丝',
          '参加多档真人秀展现真实性格，成为广告商新宠'
        ]
      };
      const defaultTemplates = [
        '回家继承家业，偶尔在社交媒体分享生活日常，粉丝感叹可惜了',
        '继续在娱乐圈边缘徘徊，偶尔接一些小型商演维持曝光',
        '转行做幕后工作，利用圈内人脉资源开启新的事业方向',
        '彻底退出娱乐圈，回归普通人生活，偶尔被路人认出'
      ];

      // 第一轮：收集所有选手的规则匹配结果（包括出道组和未出道组）
      const rule6Candidates = [];
      const tempResults = [];
      
      for (const t of trainees) {
        const curRank = t.currentRank || t.rank;
        const isDebuted = curRank <= 11;
        
        if (isDebuted) {
          const positions = this.getPositionAssignments(t);
          const posStr = positions.join(' & ');
          const popularityChange = Math.round((Math.random() - 0.4) * 30);
          const popTrend = popularityChange > 10 ? '人气飙升' : popularityChange > 0 ? '人气稳步上升' : popularityChange > -10 ? '人气略有下滑' : '人气大幅下跌';
          // 出道组也需要匹配规则，以便统一处理规则6
          const result = this._matchCareerRule(t, careerMap, careerTemplates);
          tempResults.push({ 
            trainee: t, 
            isDebuted: true, 
            rule: result.rule, 
            story: result.story,
            positionStr: posStr,
            popTrend: popTrend
          });
          if (result.rule === 6) {
            rule6Candidates.push(t.id);
          }
        } else {
          const result = this._matchCareerRule(t, careerMap, careerTemplates);
          tempResults.push({ trainee: t, isDebuted: false, rule: result.rule, story: result.story });
          if (result.rule === 6) {
            rule6Candidates.push(t.id);
          }
        }
      }

      // 从规则6候选人中随机选一人展示"制作游戏"
      const gameMakerId = rule6Candidates.length > 0 ? pick(rule6Candidates) : null;
      const otherFailTemplates = [
        '回家开了一家网红甜品店，把选秀时学的营销手段用在店里，生意红火',
        '回老家开了一家网吧，偶尔有粉丝慕名前来开黑，日子过得悠闲',
        '转行跑起了滴滴，凭借选秀积累的粉丝基础，经常被乘客认出',
        '干起了代驾，深夜接送醉酒老板时偶尔被认出，还能聊几句选秀往事'
      ];

      // 第二轮：生成最终故事
      for (const result of tempResults) {
        const t = result.trainee;
        let story = result.story;
        
        // 处理规则6的情况
        if (result.rule === 6) {
          if (t.id === gameMakerId) {
            story = '彻底退出娱乐圈，在家宅了半年后突发奇想，制作了一款"选秀导演模拟器"游戏，意外爆火';
          } else {
            story = pick(otherFailTemplates);
          }
        }
        
        // 出道组需要添加团体定位前缀
        if (result.isDebuted) {
          story = '团体定位：' + result.positionStr + '。两年团体活动中' + result.popTrend + '，积累了稳定的粉丝基础。组合解散后，' + story;
        }
        
        developments.push({ traineeId: t.id, name: t.name, rank: t.currentRank || t.rank, debuted: result.isDebuted, story });
      }

      return developments;
    }

    _matchCareerRule(trainee, careerMap, careerTemplates) {
      const abilities = trainee.abilities || {};
      const otherAbilities = trainee.otherAbilities || {};

      // 优先级1：任意业务能力超过90
      let maxAbilityKey = null, maxAbilityVal = 0;
      for (const [key, val] of Object.entries(abilities)) {
        if (val > maxAbilityVal) { maxAbilityVal = val; maxAbilityKey = key; }
      }

      if (maxAbilityVal > 90 && careerMap[maxAbilityKey]) {
        const career = careerMap[maxAbilityKey];
        const templates = careerTemplates[career] || [];
        return { rule: 1, story: pick(templates).replace('{n}', randInt(2, 8)) };
      }

      // 优先级2：赞助商指定
      if (trainee.type === 'sponsor') {
        const career = careerMap[maxAbilityKey] || '综艺咖';
        const templates = careerTemplates[career] || [];
        return { rule: 2, story: '赞助商持续投入资源力捧，' + pick(templates).replace('{n}', randInt(2, 8)) };
      }

      // 优先级3：财力大于85
      if ((otherAbilities.wealth || 0) > 85) {
        const wealthTemplates = [
          '回家继承家业，偶尔在社交媒体分享生活日常，粉丝感叹"少爷/大小姐不差钱"',
          '利用家族资源创办个人品牌，涉足商业领域，偶尔客串综艺节目',
          '回归富裕家庭生活，投资了几家初创公司，事业风生水起'
        ];
        return { rule: 3, story: pick(wealthTemplates) };
      }

      // 优先级4：学历大于85
      if ((otherAbilities.education || 0) > 85) {
        const eduTemplates = [
          '选择继续深造，考取了知名大学研究生，偶尔被同学认出是"那个选秀练习生"',
          '回归校园完成学业，毕业后进入互联网大厂工作，实现了人生的华丽转身',
          '利用高学历优势转型自媒体知识博主，分享学习经验获得百万粉丝'
        ];
        return { rule: 4, story: pick(eduTemplates) };
      }

      // 优先级6：均不符合（标记为规则6，后续处理）
      return { rule: 6, story: '' };
    }
  }

  window.GameEngine = GameEngine;

})();
