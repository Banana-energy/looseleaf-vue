// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "direction" as const,
  title: "Direction" as const,
  category: "Layout" as const,
  description: "Tells every Reka UI part, every drawing and every logical property which way the page reads. One provider at the root of a right-to-left page (or on an island inside a left-to-right one) turns arrow keys, sub-menus, slider edges, tab shoulders and hand-drawn strokes round together." as const,
  status: "stable" as const,
  upstream: "direction" as const,
  parts: [{
    name: "DirectionProvider" as const,
    description: "Sets the direction for Reka UI, the ink engine and the DOM. It renders a layout-neutral wrapper (`display: contents`) that carries `dir`; portalled content (popovers, dialogs, sheets, tooltips, menus) leaves the wrapper, so it is handed the direction through the ink scope and carries `dir` itself." as const,
    props: [{
      name: "direction" as const,
      type: '"ltr" | "rtl"' as const,
      description: "The reading direction. Leave it out to follow the page: the nearest `dir` above the provider, else `<html dir>`, read after mount and whenever it changes (the first render is `ltr` on the server and in hydration)." as const
    }, {
      name: "dir" as const,
      type: '"ltr" | "rtl"' as const,
      description: "Upstream shadcn's prop name for `direction`. `direction` wins when both are given." as const
    }, {
      name: "asChild" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Put `dir` on your own single child (a `main`, a `section`) instead of the wrapper element." as const
    }, {
      name: "className" as const,
      type: "string" as const,
      default: '"contents"' as const,
      description: "The wrapper is `contents`; give it a display utility (`grid`, `flex`) to make it a real box." as const
    }]
  }, {
    name: "useDirection" as const,
    description: "`useDirection(localDir?)` returns the direction of the nearest provider, `\"ltr\"` without one. It is Reka UI's own hook, so it stays in step with the keys and thumbs of every Reka UI part. A `localDir` wins, the way a `dir` prop does on a Reka UI root." as const,
    props: [{
      name: "localDir" as const,
      type: '"ltr" | "rtl"' as const,
      description: "A direction that overrides the context, typically a prop of your own component." as const
    }]
  }],
  a11y: ["Reka UI reads its direction from this provider only, never from the `dir` attribute. Without it, Tabs, Menubar, Radio Group, Toggle Group, Navigation Menu and the menus keep their left-to-right arrow keys on a right-to-left page, a Scroll Area keeps its scrollbar on the wrong side and a Slider starts at the wrong edge. With it, ArrowLeft moves to the next tab, opens a sub-menu towards the left, and so on.", "The wrapper carries `dir`, so the browser lays out bidirectional text, punctuation and inline order correctly; `lang` is yours to set on the wrapper or the page (`<DirectionProvider direction=\"rtl\" lang=\"ar\">`) so screen readers pick the right voice.", "Direction glyphs (chevrons, arrows, panel, log-in and log-out, undo and redo, send, list and menu icons) flip themselves in a right-to-left context; icons that do not depend on reading order (check, plus, clock, media controls) stay as drawn.", "The drawn layer is aria-hidden and decorative; mirroring it never changes what a screen reader announces.", "Two engines behind Looseleaf parts take the direction as an option of their own and do not read the provider yet: give a Carousel `opts={{ direction: \"rtl\" }}` (Embla) and a Calendar `dir=\"rtl\"` (Reka Calendar); a Sonner Toaster follows `<html dir>` or takes its own `dir`. The Direction examples do it.", "Kevin Sans covers Latin only. Arabic and Hebrew text falls back to the system font for each missing glyph, which is correct and readable but not hand-lettered; ship an Arabic or Hebrew face in `--font-hand` for a matching look."],
  usage: `import { DirectionProvider, useDirection } from "@/components/ui/direction"

export function Root({ children }: { children: Vue.VueNode }) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>
}

function useForwardKey() {
  const dir = useDirection()
  return dir === "rtl" ? "ArrowLeft" : "ArrowRight"
}`,
  related: ["tabs", "dropdown-menu", "slider", "carousel", "sidebar", "table", "icon"]
} satisfies ComponentDoc;
