// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "typography" as const,
  title: "Typography" as const,
  category: "Typography" as const,
  description: "The type scale and a Prose wrapper for the notebook: script headings with a hand-drawn rule, body text in the hand at 17 px on a 1.7 line, blue felt links, marker bullets, mono code chips. Prose styles markup you did not write (markdown, CMS html, MDX)." as const,
  status: "new" as const,
  parts: [{
    name: "H1" as const,
    description: "Page title: script 48 px bold, with a double hand-drawn rule." as const,
    props: [{
      name: "rule" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Draw the rule under the heading." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Picks which of the three hands draws the rule. Default: from useId()." as const
    }]
  }, {
    name: "H2" as const,
    description: "Section title: script 36 px bold, with a single pencil rule." as const,
    props: [{
      name: "rule" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Draw the rule under the heading." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Picks which of the three hands draws the rule." as const
    }]
  }, {
    name: "H3" as const,
    description: "Script 28 px bold." as const
  }, {
    name: "H4" as const,
    description: "Hand 20 px bold." as const
  }, {
    name: "P" as const,
    description: "Body paragraph: 17 px on a 1.7 line; a paragraph after a paragraph gets room." as const
  }, {
    name: "Lead" as const,
    description: "The line under a title: 20 px in the muted ink." as const
  }, {
    name: "Large" as const,
    description: "18 px bold." as const
  }, {
    name: "Small" as const,
    description: "14 px bold, tight." as const
  }, {
    name: "Muted" as const,
    description: "14 px in the muted ink, for dates, captions and second lines." as const
  }, {
    name: "List" as const,
    description: "A bulleted list with marker-colored bullets; `ordered` makes it a numbered <ol> with script numerals. Children are <li>s." as const,
    props: [{
      name: "ordered" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render an <ol>." as const
    }]
  }, {
    name: "InlineCode" as const,
    description: "Code in a sentence: a mono chip on a paper-shade wash whose corners are not quite square." as const
  }, {
    name: "Blockquote" as const,
    description: "A quotation set into the text: a marker rule down the start edge and the words in the script role. For a pull quote with drawn quotation marks use Quote." as const
  }, {
    name: "Prose" as const,
    description: "Wraps raw markup and styles it, with one hoisted stylesheet scoped to `[data-slot=\"typography-prose\"]` (in the components layer and written with :where(), so any utility class on a child still wins). At most 64 characters wide. Put `ll-not-prose` on a child to opt out. It styles, it does not sanitize: pass trusted or sanitized HTML." as const
  }],
  a11y: ["Real elements with their real semantics: h1 to h4, p, ul/ol, blockquote, code. Nothing here changes the outline or the reading order.", "Body text is the hand at 17 px in ink on paper (14:1); muted text is the muted-foreground token (4.5:1 or better on paper and on the desk); links are blue felt (7:1) and bold with a thick underline, never color alone.", "The hand-drawn heading rule is a baked alpha mask painted by ::after; browsers without mask support keep a plain pencil border. Windows high contrast paints the rule with system text color.", "Line length is capped at 64 characters in Prose; long words wrap and code blocks scroll sideways (a table wider than the column needs a scrolling wrapper of its own)."],
  usage: `import { H1, Lead, P, InlineCode, Prose } from "@/components/ui/typography"

export function Article() {
  return (
    <article>
      <H1>Notes on keeping a notebook</H1>
      <Lead>A small argument you have with yourself.</Lead>
      <P>Run <InlineCode>npm run notes</InlineCode> to see them.</P>
    </article>
  )
}

export function Markdown({ html }: { html: string }) {
  return <Prose dangerouslySetInnerHTML={{ __html: html }} />
}`,
  related: ["lettering", "quote", "handwritten", "label"]
} satisfies ComponentDoc;
