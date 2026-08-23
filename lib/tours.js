// 旅游规划的唯一数据源：侧边栏、索引页、以及 /tour_guide/[slug] 的静态路由
// 都从这里生成。新增一个计划 = 在数组里加一项，不需要建目录或改路由。
//
// slug        URL 片段，/tour_guide/<slug>
// title       侧边栏与页面标题
// destination 目的地，索引页副标题用
// dates       行程日期，纯展示字符串
// status      "planning" | "booked" | "done"，侧边栏与索引页显示状态点
// summary     一句话概述
// days        行程条目，按天分组

export const tours = [
  {
    slug: "kyoto-2026-spring",
    title: "京都・大阪 樱花季",
    destination: "日本 关西",
    dates: "2026-03-28 – 2026-04-05",
    status: "planning",
    summary: "关西樱花季 9 天，京都为主、大阪收尾，避开清明前后的团客高峰。",
    days: [
      {
        label: "Day 1",
        title: "关西机场 → 京都",
        items: [
          "HARUKA 特急直达京都站，约 75 分钟",
          "入住四条乌丸一带，地铁与阪急双线覆盖",
          "晚上先去锦市场解决第一顿",
        ],
      },
      {
        label: "Day 2",
        title: "东山线：清水寺 → 祇园",
        items: [
          "清水寺开门即到，8 点前人最少",
          "二年坂・三年坂步行下山至八坂神社",
          "祇园白川傍晚光线最好",
        ],
      },
      {
        label: "Day 3",
        title: "岚山",
        items: [
          "嵯峨野小火车提前一个月开售，需预订",
          "竹林小径连着天龙寺，半天足够",
        ],
      },
    ],
  },
  {
    slug: "banff-2026-summer",
    title: "Banff 落基山自驾",
    destination: "加拿大 阿尔伯塔",
    dates: "2026-07-10 – 2026-07-17",
    status: "planning",
    summary: "卡尔加里取车，Banff 与 Jasper 之间走冰原大道，8 天自驾环线。",
    days: [
      {
        label: "Day 1",
        title: "卡尔加里 → Banff",
        items: [
          "机场取车，车程约 1.5 小时",
          "国家公园通行证在入口或线上买都行",
        ],
      },
      {
        label: "Day 2",
        title: "Lake Louise + Moraine Lake",
        items: [
          "Moraine Lake 已禁止私家车进入，只能坐 shuttle，需提前订",
          "Lake Louise 停车场 8 点前基本就满了",
        ],
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
