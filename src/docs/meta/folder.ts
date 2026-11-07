// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "folder" as const,
  title: "Folder" as const,
  category: "Paper" as const,
  description: "A manila file folder that is also a set of tabs: a row of paper tabs standing on a sheet of the same paper. The active tab is the folder's own color and runs down into the body, so tab and folder are one piece; the others stand a little lower and darker. It is Reka UI Tabs underneath." as const,
  status: "new" as const,
  upstream: "tabs" as const,
  parts: [{
    name: "Folder" as const,
    description: "The Reka UI Tabs root, a flex column at most 42 rem wide. It takes the Tabs props (`value`, `defaultValue`, `onValueChange`, `dir`, `activationMode`) except `orientation`: a folder's tabs stand along its top edge, so it is always horizontal (Left / Right move between tabs; Up / Down do not)." as const,
    props: [{
      name: "stock" as const,
      type: "StockName" as const,
      default: '"kraft"' as const,
      description: "What tabs and body are made of: kraft (manila), sticky-yellow, paper, index-card ..." as const
    }]
  }, {
    name: "FolderTabs" as const,
    description: "The tab strip (`role=\"tablist\"`), standing on the body, above it in stacking. Give it an `aria-label`." as const
  }, {
    name: "FolderTab" as const,
    description: "One tab (`role=\"tab\"`), 2.25 rem high (2 rem compact, 1.75 rem calm), its paper drawn behind the label. The active tab is the front one; a disabled tab is only a dashed pencil outline. Arrow keys, Home and End move between tabs; the label is real text." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "Which panel it opens." as const
    }, {
      name: "disabled" as const,
      type: "boolean" as const,
      description: "Skipped by the arrow keys; drawn as a dashed ghost." as const
    }]
  }, {
    name: "FolderContent" as const,
    description: "The panel a tab opens onto (`role=\"tabpanel\"`), a Paper in the folder's stock, square to the desk. Only the active panel is in the page." as const,
    props: [{
      name: "value" as const,
      type: "string" as const,
      required: true,
      description: "The tab it belongs to." as const
    }, {
      name: "crease" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "The fold across the top of the sheet." as const
    }, {
      name: "tape / fastener / edge / shadow / seed / tilt" as const,
      type: "Paper props" as const,
      description: "As on any sheet (tilt defaults to none, so the tabs stay square to the body)." as const
    }]
  }],
  a11y: ["Reka UI Tabs gives the whole pattern: `tablist` / `tab` / `tabpanel` roles, `aria-selected`, `aria-controls`, roving focus with arrow keys, Home and End (Left and Right swap in RTL), and a disabled tab skipped by the keyboard.", "The drawn tab paper, the crease and the shadows are aria-hidden. The active tab is also `aria-selected` and bold, so it never depends on color alone. Tab text is ink: 9:1 on the manila, 7.5:1 on a tab standing behind it.", "Windows high contrast replaces the drawn tabs with bordered buttons (the tabs carry a real border until their drawing exists and in forced colors), and the active tab fills with the system highlight color. The open panel is a tab stop and shows the standard focus ring."],
  usage: `import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder"

<Folder defaultValue="inbox">
  <FolderTabs aria-label="Mail">
    <FolderTab value="inbox">Inbox</FolderTab>
    <FolderTab value="drafts">Drafts</FolderTab>
  </FolderTabs>
  <FolderContent value="inbox">Three letters are waiting.</FolderContent>
  <FolderContent value="drafts">Two drafts.</FolderContent>
</Folder>`,
  related: ["tabs", "notebook", "index-card", "paper"]
} satisfies ComponentDoc;
