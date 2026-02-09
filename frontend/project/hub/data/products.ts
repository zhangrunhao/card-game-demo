import cardgameCover from "../assets/cardgame.png";
import type { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "card-game",
    title: "卡牌游戏",
    summary: "快节奏 1v1 对战卡牌游戏，持续迭代战斗反馈和匹配体验。",
    description:
      "以策略构筑和回合博弈为核心，正在持续优化新手引导、卡组编辑体验和排位系统。",
    url: "https://zhangrh.top/cardgame/",
    cover: cardgameCover,
    category: "游戏",
    status: "Active",
    version: "v0.8.0",
    lastUpdated: "2026-02-05",
    lastUpdatedLabel: "2/5",
  },
  {
    id: "calorie-intake-app",
    title: "热量摄入 app",
    summary: "帮助用户快速记录每日热量和营养摄入的轻量健康应用。",
    description:
      "支持拍照识别、语音录入和目标追踪，目前以移动端体验为主，持续补齐健康数据洞察。",
    url: "https://zhangrh.top/hub/",
    mockCover: {
      title: "Calorie Intake",
      subtitle: "Track food, calories and macro trends",
      from: "#0f766e",
      to: "#1d4ed8",
      accent: "#fb923c",
    },
    category: "健康",
    status: "Active",
    version: "v0.4.1",
    lastUpdated: "2026-01-28",
    lastUpdatedLabel: "1/28",
  },
];
