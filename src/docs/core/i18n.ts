// 文档站的双语词条集中管理，组件只引用稳定 key，切换语言时不会重复维护界面结构。
import type { Category } from "../types";

export const LOCALES = ["en", "zh-CN"] as const;
export type Locale = typeof LOCALES[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "中文"
};

const DICTIONARY = {
  en: {
    "nav.start": "Start",
    "nav.gettingStarted": "Getting started",
    "nav.foundations": "Foundations",
    "nav.components": "Components",
    "nav.blocks": "Blocks",
    "nav.more": "More",
    "nav.playground": "Playground",
    "nav.changelog": "Changelog",
    "nav.noComponents": "No components yet",
    "nav.noBlocks": "No blocks yet",
    "top.menu": "Menu",
    "top.hideNavigation": "Hide navigation",
    "top.showNavigation": "Show navigation",
    "top.search": "Search",
    "top.displaySettings": "Display settings",
    "top.github": "Looseleaf on GitHub (opens in a new tab)",
    "top.documentationPages": "The pages of the documentation.",
    "settings.density": "Density",
    "settings.motion": "Motion",
    "settings.language": "Language",
    "settings.comfortable": "Comfortable",
    "settings.comfortableHint": "Roomy hit boxes, the full hand.",
    "settings.compact": "Compact",
    "settings.compactHint": "Tighter rows for dense screens.",
    "settings.calm": "Calm",
    "settings.calmHint": "Hairlines, no wobble: for data and long forms.",
    "settings.system": "Follow system",
    "settings.systemHint": "Motion unless your device asks for less.",
    "settings.reduced": "Reduced",
    "settings.reducedHint": "No animation, no per-word jitter.",
    "settings.thingsOnDesk": "Things on the desk",
    "search.dialogTitle": "Search documentation",
    "search.dialogDescription": "Search components, parts and topics. Use the arrow keys, then Enter.",
    "search.placeholder": "Search components, parts, topics...",
    "search.results": "Results",
    "search.suggestions": "Suggestions",
    "search.empty": "Nothing matches",
    "search.tryAgain": "Try a component name, a part like CardHeader, or a topic like focus.",
    "search.move": "move",
    "search.open": "open",
    "search.close": "close",
    "pager.previous": "Previous",
    "pager.next": "Next",
    "pager.label": "Previous and next page",
    "footer.description": "Looseleaf is shadcn/ui, drawn by hand. Every page here is built from the library it documents, so what you see is what you get.",
    "footer.madeBy": "Made by Kevin T. Ngo. Say hi on X:",
    "footer.xLabel": " on X (opens in a new tab)",
    "footer.github": "GitHub",
    "footer.githubLabel": " (opens in a new tab)",
    "route.gettingStarted": "Getting started",
    "route.foundations": "Foundations",
    "route.components": "Components",
    "route.blocks": "Blocks",
    "route.playground": "Playground",
    "route.changelog": "Changelog",
    "route.notFound": "Page not found",
    "route.componentNotFound": "Component not found",
    "route.blockNotFound": "Block not found",
    "route.tagline": "shadcn/ui, drawn by hand"
  },
  "zh-CN": {
    "nav.start": "开始",
    "nav.gettingStarted": "快速开始",
    "nav.foundations": "基础",
    "nav.components": "组件",
    "nav.blocks": "区块",
    "nav.more": "更多",
    "nav.playground": "演练场",
    "nav.changelog": "更新日志",
    "nav.noComponents": "暂无组件",
    "nav.noBlocks": "暂无区块",
    "top.menu": "菜单",
    "top.hideNavigation": "隐藏导航",
    "top.showNavigation": "显示导航",
    "top.search": "搜索",
    "top.displaySettings": "显示设置",
    "top.github": "在 GitHub 上打开 Looseleaf（新标签页）",
    "top.documentationPages": "文档页面导航。",
    "settings.density": "密度",
    "settings.motion": "动效",
    "settings.language": "语言",
    "settings.comfortable": "舒适",
    "settings.comfortableHint": "宽松的点击区域，保留完整手绘感。",
    "settings.compact": "紧凑",
    "settings.compactHint": "更紧凑的行距，适合密集界面。",
    "settings.calm": "平静",
    "settings.calmHint": "细线条、无抖动，适合数据和长表单。",
    "settings.system": "跟随系统",
    "settings.systemHint": "默认保留动效，除非设备要求减少动效。",
    "settings.reduced": "减少动效",
    "settings.reducedHint": "关闭动画和逐字抖动。",
    "settings.thingsOnDesk": "桌面上的物件",
    "search.dialogTitle": "搜索文档",
    "search.dialogDescription": "搜索组件、部件和主题。使用方向键选择，再按 Enter。",
    "search.placeholder": "搜索组件、部件或主题……",
    "search.results": "结果",
    "search.suggestions": "建议",
    "search.empty": "没有找到匹配内容",
    "search.tryAgain": "可以尝试组件名、CardHeader 这样的部件名，或 focus 这样的主题。",
    "search.move": "移动",
    "search.open": "打开",
    "search.close": "关闭",
    "pager.previous": "上一页",
    "pager.next": "下一页",
    "pager.label": "上一页和下一页",
    "footer.description": "Looseleaf 是手绘风格的 shadcn/ui。这里的每一页都由它所展示的组件库构建，因此你看到的就是最终效果。",
    "footer.madeBy": "由 Kevin T. Ngo 制作，欢迎在 X 上联系：",
    "footer.xLabel": "（在 X 上打开，新标签页）",
    "footer.github": "GitHub",
    "footer.githubLabel": "（新标签页）",
    "route.gettingStarted": "快速开始",
    "route.foundations": "基础",
    "route.components": "组件",
    "route.blocks": "区块",
    "route.playground": "演练场",
    "route.changelog": "更新日志",
    "route.notFound": "页面不存在",
    "route.componentNotFound": "组件不存在",
    "route.blockNotFound": "区块不存在",
    "route.tagline": "手绘风格的 shadcn/ui"
  }
} as const;

export type I18nKey = keyof typeof DICTIONARY.en;
export type I18nText = (key: I18nKey) => string;

export function translate(locale: Locale, key: I18nKey): string {
  return DICTIONARY[locale][key];
}

const CATEGORY_KEYS = {
  Actions: "nav.components",
  Forms: "nav.components",
  Feedback: "nav.components",
  Overlays: "nav.components",
  Navigation: "nav.components",
  Layout: "nav.components",
  "Data display": "nav.components",
  Charts: "nav.components",
  Paper: "nav.components",
  Marks: "nav.components",
  "Stickers & doodles": "nav.components",
  Chat: "nav.components",
  Interactive: "nav.components",
  Typography: "nav.components",
  Icons: "nav.components"
} as const satisfies Record<string, I18nKey>;

// 组件分类本身是产品名词，中文只翻译分类展示文本，组件 slug 和链接保持稳定。
const CATEGORY_LABELS: Record<Locale, Record<keyof typeof CATEGORY_KEYS, string>> = {
  en: {
    Actions: "Actions", Forms: "Forms", Feedback: "Feedback", Overlays: "Overlays", Navigation: "Navigation", Layout: "Layout", "Data display": "Data display", Charts: "Charts", Paper: "Paper", Marks: "Marks", "Stickers & doodles": "Stickers & doodles", Chat: "Chat", Interactive: "Interactive", Typography: "Typography", Icons: "Icons"
  },
  "zh-CN": {
    Actions: "操作", Forms: "表单", Feedback: "反馈", Overlays: "覆盖层", Navigation: "导航", Layout: "布局", "Data display": "数据展示", Charts: "图表", Paper: "纸张", Marks: "笔触", "Stickers & doodles": "贴纸与涂鸦", Chat: "聊天", Interactive: "交互", Typography: "排版", Icons: "图标"
  }
};

export function categoryLabel(locale: Locale, category: Category): string {
  return CATEGORY_LABELS[locale][category];
}
