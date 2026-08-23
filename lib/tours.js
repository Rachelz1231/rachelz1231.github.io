// 旅游规划的唯一数据源：侧边栏、索引页、以及 /tour_guide/[slug] 的静态路由
// 都从这里生成。新增一个计划 = 在数组里加一项，不需要建目录或改路由。
//
// slug        URL 片段，/tour_guide/<slug>
// title       侧边栏与页面标题
// destination 目的地
// dates       行程日期，纯展示字符串
// status      "planning" | "booked" | "done"
// summary     一句话概述
// flexible[]  机动项：想做但还没定在哪天的事 { title, note }
// days[]      按天分组的行程
//   label     Day N
//   date      日期，如 "9.5"
//   title     当天主线
//   stay      当晚住宿，省略表示不过夜（如返程日）
//   legs[]    驾车路段 { from, to, distance, duration }
//   options   当天的岔路 { note, choices: [{ label, detail }] }
//   items[]   当天安排
//   tips[]    提醒与避雷，单独渲染成灰框，避免被行程条目淹没

export const tours = [
  {
    slug: "altay-2026-september",
    title: "新疆阿勒泰环线",
    destination: "中国 新疆・阿勒泰",
    dates: "2026-09-05 – 2026-09-11",
    status: "planning",
    summary:
      "阿勒泰进出的 7 天自驾环线，布尔津 — 白哈巴 — 喀纳斯 — 禾木，返程反穿阿禾公路。",
    flexible: [
      {
        title: "巴特巴依观景台",
        note: "白哈巴连住两晚，9.7 傍晚看日落、9.8 清晨看晨雾都可以，看天气再定。",
      },
    ],
    days: [
      {
        label: "Day 1",
        date: "9.5",
        title: "落地阿勒泰",
        stay: "阿勒泰市区",
        items: ["中午出发，晚上落地阿勒泰雪都机场", "市区休息，不安排行程"],
      },
      {
        label: "Day 2",
        date: "9.6",
        title: "阿勒泰 → 布尔津 → 白哈巴",
        stay: "白哈巴",
        legs: [
          { from: "阿勒泰", to: "布尔津", distance: "106 km", duration: "1h22" },
          { from: "布尔津", to: "五彩滩", distance: "22 km", duration: "23min" },
          {
            from: "五彩滩",
            to: "中哈边境大峡谷",
            distance: "131 km",
            duration: "2h16",
          },
          {
            from: "中哈边境大峡谷",
            to: "白哈巴游客停车场",
            distance: "12 km",
            duration: "23min",
          },
        ],
        items: [
          "布尔津美食街吃冷水鱼，三道黑一鱼两吃，街上有很多家",
          "网红酸奶店「小牛克恩」",
          "喀纳斯塔桥打卡 —— 布尔津的景点，不是餐厅",
          "吃完采购物资进山，推荐西瓜、老汉瓜等水果 —— 在新疆总吃肉要补维生素",
          "途经中哈边境大峡谷，可以打卡",
        ],
        tips: [
          "避雷：红石榴餐厅不要去",
          "前段路比较好开；经边防站办完边防证之后开始崎岖，很多路段在修路",
          "不建议晚上开这一段",
        ],
      },
      {
        label: "Day 3",
        date: "9.7",
        title: "喀纳斯景区",
        stay: "白哈巴",
        items: [
          "白哈巴坐大巴约 1 小时到喀纳斯游客换乘中心",
          "上午徒步三湾",
          "下午登观鱼台、看喀纳斯湖",
          "下午回白哈巴逛西北第一村，一下午足够",
        ],
        tips: [
          "买两日进票，视情况决定是否走喀纳斯徒步路线",
          "一天时间足够，并且不仓促",
        ],
      },
      {
        label: "Day 4",
        date: "9.8",
        title: "白哈巴 → 禾木（铁贾公路）",
        stay: "禾木",
        legs: [
          {
            from: "白哈巴",
            to: "禾木",
            distance: "147 km",
            duration: "3h15",
          },
        ],
        options: {
          note: "取决于前一天喀纳斯有没有玩尽兴",
          choices: [
            {
              label: "上午继续喀纳斯",
              detail:
                "用掉两日票的第二天，下午再出发去禾木。怕一天玩不完的话走这条。",
            },
            {
              label: "上午直接出发",
              detail: "喀纳斯已经玩够，早点走，下午在禾木有更多时间休整。",
            },
            {
              label: "上午在白哈巴休息",
              detail: "不想再跑喀纳斯，就在白哈巴悠闲待一上午，下午再出发。",
            },
          ],
        },
        items: [
          "铁热克提乡加油、补给物资",
          "走铁贾公路，地貌从低山怪石林一路变到高山草甸",
          "下午抵达禾木村，休整",
        ],
        tips: [
          "铁热克提乡之后一直到回阿勒泰都没有加油站，务必加满",
          "从贾登峪开始是盘山公路，山路十八弯，提前备好晕车药",
        ],
      },
      {
        label: "Day 5",
        date: "9.9",
        title: "禾木村",
        stay: "禾木",
        items: ["白天游玩禾木村", "哈登平台看日落", "晚上篝火晚会"],
      },
      {
        label: "Day 6",
        date: "9.10",
        title: "禾木 → 阿勒泰市区（反穿阿禾公路）",
        stay: "阿勒泰市区",
        legs: [
          {
            from: "禾木",
            to: "阿勒泰市区",
            distance: "233 km",
            duration: "地图 4h35 / 实测 6h",
          },
        ],
        items: ["反穿阿禾公路返程，全程是观景公路"],
        tips: [
          "地图显示四个半小时；走走停停拍照、中间服务区休息半小时，亲测实际需要 6 小时",
          "反穿的好处是车少 —— 大部分人选择从阿勒泰直奔禾木",
        ],
      },
      {
        label: "Day 7",
        date: "9.11",
        title: "阿勒泰雪都机场，中午返程",
        items: ["时间充足可以在阿勒泰买纪念品"],
      },
    ],
  },
];

export const tourStatusLabels = {
  planning: "规划中",
  booked: "已订",
  done: "已完成",
};

export function getTour(slug) {
  return tours.find((tour) => tour.slug === slug);
}
