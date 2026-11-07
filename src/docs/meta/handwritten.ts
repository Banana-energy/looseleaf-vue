// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "handwritten" as const,
  title: "Handwritten" as const,
  category: "Typography" as const,
  description: "Text that looks written, not typeset: every word sits a hair off the baseline and a touch lighter, by a seeded amount. The words stay real inline text; code, links and forms inside are left exactly as typed." as const,
  status: "new" as const,
  parts: [{
    name: "Handwritten" as const,
    description: "Any element (`as`, a span by default) whose text nodes are split into word spans carrying `--jy` / `--jr` / `--jo`. The component turns them into a relative offset from the baseline and a lighter ink (the words stay plain inline text: a word of its own layer, rotated or faded, was clipped at its advance by WebKit, so a final d, l or ! lost its top); `--jr` is kept for stylesheets of your own. The same seed always writes the same line, on the server and in the browser." as const,
    props: [{
      name: "as" as const,
      type: "Vue.ElementType" as const,
      default: '"span"' as const,
      description: "The element to render." as const
    }, {
      name: "strength" as const,
      type: "number" as const,
      default: "1" as const,
      description: "0 renders plain text (no spans, no utility class), 1 is the default hand, 2 a hurried one. Compact density writes it lighter." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand. Default: derived from useId()." as const
    }]
  }],
  a11y: ["The text is unchanged: words are inline spans with real spaces between them, so it wraps, selects, copies and is read as ordinary text.", "Elements that must stay exact are skipped: code, pre, kbd, samp, var, links, buttons, inputs, media. Add data-handwritten=\"off\" to any element to opt it (and everything in it) out.", "A text-decoration on the element (underline, line-through) is passed on to every word. For a drawn line use Underline or Strike around the text instead: they follow the words when they wrap.", "Calm density and reduced motion switch the effect off in CSS (--ll-jitter-k = 0); compact writes it lighter. Never apply it to long reading text: it is for notes, captions, labels and titles."],
  usage: `import { Handwritten } from "@/components/ui/handwritten"

export function Example() {
  return (
    <Handwritten as="p" className="font-script text-2xl">
      ask sam about the pond, and bring the big umbrella!
    </Handwritten>
  )
}`,
  related: ["lettering", "callout", "signature", "typography"]
} satisfies ComponentDoc;
