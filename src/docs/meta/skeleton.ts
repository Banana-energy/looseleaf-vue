// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "skeleton" as const,
  title: "Skeleton" as const,
  category: "Feedback" as const,
  description: "A placeholder someone sketched in pencil: a pale hatch inside a rough ruled outline that boils gently between three redrawn frames. It costs no ink per instance, so a page of hundreds is as cheap as one." as const,
  status: "stable" as const,
  upstream: "skeleton" as const,
  parts: [{
    name: "Skeleton" as const,
    description: "An empty div. Shape it with classes exactly as with shadcn's (h-4 w-[250px], size-12 rounded-full). The pencil is CSS: the hatch and the outline are masks made from a few tiny drawn tiles, defined once per page in one hoisted stylesheet; three redrawn frames of each are stepped through slowly. A rounded-full box gets a drawn circle." as const,
    props: [{
      name: "className" as const,
      type: "string" as const,
      description: "Its size and shape: any width and height, rounded-full for a circle. Colors are the theme's pencil and paper tokens." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Picks the phase of the boil this skeleton starts on, so a page of them does not flicker in unison. Default: derived from useId()." as const
    }]
  }],
  a11y: ['A skeleton is an empty element, invisible to assistive tech, as shadcn\'s. Mark the region that is loading with aria-busy="true" (and a status or a visually hidden "Loading" for screen readers), and remove the skeletons when the content arrives.', "Nothing in it is interactive or focusable; the boil is decoration, and a page of skeletons never announces anything.", "Reduced motion (the OS setting or the in-app calm-ink setting) and calm density hold the first frame still.", "In Windows high contrast the drawing is replaced by a dashed system-color outline.", "The masks need CSS mask-image (every current browser); the stylesheet is injected with <style href precedence>, so Vue 3 hoists it, dedupes it and includes it in server HTML."],
  usage: `import { Skeleton } from "@/components/ui/skeleton"

export function Example() {
  return (
    <div className="flex items-center gap-4" aria-busy="true">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}`,
  related: ["spinner", "card", "progress", "item"]
} satisfies ComponentDoc;
