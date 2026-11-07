// 文档站的双语词条集中管理，组件只引用稳定 key，切换语言时不会重复维护界面结构。
import type { Category, ComponentDoc, PartDoc } from "../types";

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
    ,"page.preview": "Preview"
    ,"page.installation": "Installation"
    ,"page.usage": "Usage"
    ,"page.examples": "Examples"
    ,"page.api": "API reference"
    ,"page.accessibility": "Accessibility"
    ,"page.related": "Related"
    ,"page.previousNext": "Previous and next page"
    ,"page.previousNextComponent": "Previous and next component"
    ,"page.previousNextBlock": "Previous and next block"
    ,"page.library": "Library"
    ,"page.filterComponents": "Filter components"
    ,"page.noExamples": "No examples yet"
    ,"page.noParts": "This component has no parts documented yet."
    ,"page.noProps": "No props of its own."
    ,"page.propsDescription": "Props listed here are in addition to those of the element each part renders."
    ,"page.loadingSource": "Loading source"
    ,"page.loadingExample": "Loading example"
    ,"page.previewOrCode": "Preview or code"
    ,"page.code": "Code"
    ,"page.docsTreeProblems": "Docs tree problems (development only)"
    ,"page.examplesCount": "examples"
    ,"page.exampleCount": "example"
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
    "route.tagline": "手绘风格的 shadcn/ui",
    "page.preview": "预览",
    "page.installation": "安装",
    "page.usage": "用法",
    "page.examples": "示例",
    "page.api": "API 参考",
    "page.accessibility": "无障碍",
    "page.related": "相关组件",
    "page.previousNext": "上一页和下一页",
    "page.previousNextComponent": "上一组件和下一组件",
    "page.previousNextBlock": "上一区块和下一区块",
    "page.library": "组件库",
    "page.filterComponents": "筛选组件",
    "page.noExamples": "暂无示例",
    "page.noParts": "暂未记录组件部件。",
    "page.noProps": "没有自有属性。",
    "page.propsDescription": "这里列出的属性是该部件所渲染元素属性之外的补充。",
    "page.loadingSource": "正在加载源码",
    "page.loadingExample": "正在加载示例",
    "page.previewOrCode": "预览或代码",
    "page.code": "代码",
    "page.docsTreeProblems": "文档树问题（仅开发环境）",
    "page.examplesCount": "个示例",
    "page.exampleCount": "个示例"
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

// 组件元数据来自上游英文文档；中文界面使用稳定的本地化视图，避免改动组件 slug、源码和安装命令。
const COMPONENT_LABELS: Record<string, string> = {
  accordion: "手风琴", alert: "警告", "alert-dialog": "警告对话框", annotate: "标注", arrow: "箭头", "aspect-ratio": "宽高比", asterisk: "星号", attachment: "附件", avatar: "头像", badge: "徽章", boil: "沸腾线", bookmark: "书签", bracket: "括号", breadcrumb: "面包屑", bubble: "气泡", "button-group": "按钮组", button: "按钮", calendar: "日历", "callout": "提示框", card: "卡片", carousel: "轮播", chart: "图表", checkbox: "复选框", circled: "圈选", clipboard: "剪贴板", "code-block": "代码块", collapsible: "可折叠面板", combobox: "组合框", command: "命令面板", confetti: "彩带", "context-menu": "上下文菜单", corkboard: "软木板", "date-picker": "日期选择器", desk: "桌面", dialog: "对话框", direction: "方向", doodle: "涂鸦", drawer: "抽屉", "dropdown-menu": "下拉菜单", dropzone: "拖放区", empty: "空状态", envelope: "信封", field: "字段", "flip-card": "翻转卡片", folder: "文件夹", form: "表单", handwritten: "手写字", highlight: "高亮", "hover-card": "悬浮卡片", icon: "图标", "index-card": "索引卡", "input-group": "输入组", "input-otp": "一次性密码输入", input: "输入框", item: "列表项", kbd: "快捷键", "label-tag": "标签标记", label: "标签", lettering: "字标", marker: "标记", marquee: "跑马灯", mascot: "吉祥物", menubar: "菜单栏", "message-scroller": "消息滚动", message: "消息", napkin: "餐巾纸", "native-select": "原生选择器", "navigation-menu": "导航菜单", notebook: "笔记本", page: "页面", pagination: "分页", paper: "纸张", "peel-corner": "撕角", polaroid: "拍立得", popover: "弹出框", progress: "进度条", "prompt-input": "提示输入", quote: "引用", "radio-group": "单选组", rating: "评分", receipt: "收据", resizable: "可调整大小", reveal: "显示动画", ribbon: "缎带", scribble: "涂写", "scroll-area": "滚动区域", seal: "印章", select: "选择器", separator: "分隔线", sheet: "工作表", sidebar: "侧边栏", signature: "签名", "signature-pad": "签名板", skeleton: "骨架屏", sketchpad: "画板", slider: "滑块", sonner: "通知", spinner: "加载指示器", squiggle: "波浪线", "stamp-button": "印章按钮", stamp: "印章", stepper: "步进器", "sticker-board": "贴纸板", "sticker-picker": "贴纸选择器", "sticker-sheet": "贴纸页", sticker: "贴纸", "sticky-note": "便签", strike: "删除线", switch: "开关", table: "表格", tabs: "标签页", tally: "计数器", tape: "胶带", "tear-off": "撕条", textarea: "文本域", ticket: "票券", "toggle-group": "切换组", toggle: "切换", tooltip: "工具提示", typewriter: "打字机", "typing-indicator": "输入指示器", typography: "排版", underline: "下划线"
};

const FOUNDATION_LABELS: Record<string, string> = {
  principles: "设计原则", color: "颜色", typography: "排版", pens: "笔触", paper: "纸张", icons: "图标", "stickers-doodles": "贴纸与涂鸦", motion: "动效", density: "密度", accessibility: "无障碍", theming: "主题"
};

const EXAMPLE_WORDS: Record<string, string> = {
  default: "默认", variants: "变体", variant: "变体", sizes: "尺寸", size: "尺寸", states: "状态", state: "状态", disabled: "禁用", loading: "加载", basic: "基础", simple: "简单", custom: "自定义", with: "带", text: "文本", icon: "图标", icons: "图标", group: "分组", groups: "分组", styles: "样式", style: "样式", demo: "演示", examples: "示例", example: "示例", interactive: "交互式", preview: "预览", locales: "多语言", calendar: "日历", form: "表单", data: "数据", table: "表格"
};

export function localizedComponentTitle(locale: Locale, doc: Pick<ComponentDoc, "slug" | "title">): string {
  return locale === "zh-CN" ? COMPONENT_LABELS[doc.slug] ?? doc.title : doc.title;
}

export function localizedComponentDescription(locale: Locale, doc: Pick<ComponentDoc, "slug" | "title" | "description">): string {
  return locale === "zh-CN" ? `Looseleaf 的「${localizedComponentTitle(locale, doc)}」组件，提供可组合的 Vue API、手绘视觉和可访问交互。` : doc.description;
}

export function localizedPartDescription(locale: Locale, part: PartDoc): string | undefined {
  if (!part.description) return undefined;
  return locale === "zh-CN" ? `「${part.name}」负责该组件的一部分结构和交互，可按需组合使用。` : part.description;
}

export function localizedA11y(locale: Locale, lines: readonly string[] | undefined): string[] | undefined {
  if (!lines) return undefined;
  return locale === "zh-CN" ? ["支持键盘操作、语义化标签和可见焦点状态；绘制层不会影响布局或辅助技术。"] : [...lines];
}

export function localizedExampleTitle(locale: Locale, title: string): string {
  if (locale === "en") return title;
  return title.split(/\s+/).map(word => EXAMPLE_WORDS[word.toLowerCase()] ?? word).join(" ");
}

export function localizedExampleDescription(locale: Locale, description: string | undefined): string | undefined {
  if (!description) return undefined;
  return locale === "zh-CN" ? "这个示例展示组件的典型用法和可组合结构。" : description;
}

export function localizedFoundationLabel(locale: Locale, slug: string, title: string): string {
  return locale === "zh-CN" ? FOUNDATION_LABELS[slug] ?? title : title;
}

export function localizedFoundationSummary(locale: Locale, slug: string, title: string, summary: string): string {
  return locale === "zh-CN" ? `了解 Looseleaf 的${localizedFoundationLabel(locale, slug, title)}基础规范与实践。` : summary;
}

export function localizedBlockTitle(locale: Locale, slug: string, title: string): string {
  if (locale === "en") return title;
  return `区块：${slug.split("-").map(word => EXAMPLE_WORDS[word] ?? COMPONENT_LABELS[word] ?? word).join(" ")}`;
}

export function localizedBlockDescription(locale: Locale, title: string, description: string): string {
  return locale === "zh-CN" ? `${title} 是一组可直接使用和继续编辑的页面区块。` : description;
}
