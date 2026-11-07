// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "code-block" as const,
  title: "Code block" as const,
  category: "Chat" as const,
  description: "A typed slip taped to the page: the file name in a typewriter face, the code on a two-color ribbon (red keywords and numbers, black for the rest), line numbers in the margin and a diff mode where removed lines are struck through in red pencil and added ones ticked in green. Ships its own small lexer for tsx, ts, jsx, js, css, json and bash." as const,
  status: "new" as const,
  parts: [{
    name: "CodeBlock" as const,
    description: "A `figure` on a slip of paper, taped at the top. With `code` and no children it assembles a header (file name, `+/-` counts, copy button) and the content itself; with children you compose the parts." as const,
    props: [{
      name: "code" as const,
      type: "string" as const,
      description: "The source. For a diff: unified diff lines (`+added`, `-removed`, ` context`)." as const
    }, {
      name: "language" as const,
      type: '"tsx" | "ts" | "jsx" | "js" | "css" | "json" | "bash" | "diff" | "text"' as const,
      description: "Default: from the file name, else plain text. Aliases (`typescript`, `sh`, `javascript`...) work." as const
    }, {
      name: "filename" as const,
      type: "string" as const,
      description: "Typed at the top of the slip." as const
    }, {
      name: "lineNumbers" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Number the lines in the margin (generated content: never selected, never copied)." as const
    }, {
      name: "diff" as const,
      type: "boolean" as const,
      description: "Read the code as a diff. `language=\"diff\"` turns it on too; give the code's own language with `filename`." as const
    }, {
      name: "wrap" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Wrap long lines instead of scrolling sideways." as const
    }, {
      name: "startLine" as const,
      type: "number" as const,
      default: "1" as const,
      description: "The number of the first line." as const
    }, {
      name: "copyable" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Show the copy button of the default header." as const
    }, {
      name: "stock / tape / edge / tilt / fastener / seed" as const,
      type: "PaperProps" as const,
      description: "It is a Paper: default `slip` stock with `tape=\"top\"`. Any Paper prop works (a torn `receipt`, a kraft `stock`)." as const
    }]
  }, {
    name: "CodeBlockHeader" as const,
    description: "The typed line at the top, ruled off with a dashed pencil line (a drawn rule)." as const
  }, {
    name: "CodeBlockTitle" as const,
    description: "The file name, or the language when there is none. Truncates." as const
  }, {
    name: "CodeBlockStats" as const,
    description: "`+14 -3` for a diff (green and red, with visually hidden 'Added' and 'Removed'); nothing for plain code." as const
  }, {
    name: "CodeBlockActions" as const,
    description: "A row for the header's buttons." as const
  }, {
    name: "CodeBlockCopy" as const,
    description: "Copies the code (a diff copies the result: context and added lines) with the Clipboard API, or a hidden textarea where it is missing. The icon turns into a tick and a polite status says 'Copied'. When nothing can copy it selects the code and asks for Ctrl+C." as const
  }, {
    name: "CodeBlockContent" as const,
    description: "The lines, in a scrolling `pre` (focusable, so the keyboard can scroll it) inside a host that draws the focus ring. Takes its own `code` and `language` to override the block's." as const,
    props: [{
      name: "code" as const,
      type: "string" as const,
      description: "Show this instead of the block's code." as const
    }, {
      name: "language" as const,
      type: "string" as const,
      description: "Language of `code`." as const
    }]
  }],
  a11y: ["The code is real text in a `pre` > `code`, one `span` per line, each ending in a real newline (the last one does not): select, copy, find-in-page and screen readers see the source, blank lines included. Line numbers are CSS generated content and are never selected. The visually hidden 'Added:' / 'Removed:' are `user-select: none`, so they stay out of a copied selection. The figure is named by the file name, or by the language.", "The scrolling body is a tab stop (`tabindex=0`) so a keyboard user can scroll long lines; on :focus-visible a blue ring is drawn round it.", "Diff lines are `ins` and `del` elements with a visually hidden 'Added:' / 'Removed:'; the tick and the strike are aria-hidden and never the only signal. Git's `\\ No newline at end of file` is read as a note, not as code.", "Contrast: ink on the slip 14:1, red ribbon 4.8:1, graphite comments and line numbers 5.9:1. Reduced motion changes nothing (there is no animation but the copied tick).", "Forced colors: the drawn rule and the ring step aside for real outlines; the strike and tick keep the text color."],
  usage: `import { CodeBlock } from "@/components/ui/code-block"

export function Example() {
  return (
    <CodeBlock
      filename="src/notes/filter.ts"
      language="ts"
      lineNumbers
      code={\`export const shown = picked.size
  ? notes.filter((n) => n.tags.some((t) => picked.has(t)))
  : notes\`}
    />
  )
}

<CodeBlock diff filename="filter.ts" language="ts" code={patch} />`,
  related: ["bubble", "message", "attachment", "card", "paper"]
} satisfies ComponentDoc;
